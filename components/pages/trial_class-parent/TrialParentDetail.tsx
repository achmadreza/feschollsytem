"use client";

import { useState, useEffect } from "react";
import { 
    IconCalendarEvent, 
    IconSchool, 
    IconClock, 
    IconUser, 
    IconDoorEnter, 
    IconFileText,
    IconEye,
    IconCircleCheck,
    IconCalendarTime,
    IconArrowLeft,
    IconEdit
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import { callApi } from "@/lib/api";

interface Student {
    id: string;
    name: string;
    class: string;
    schoolCode: string;
    [key: string]: any;
}

interface Teacher {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
}

interface TrialClass {
    id: string;
    _id: string;
    status: string;
    scheduledAt: string;
    location: string;
    notes: string;
    student?: Student;
    teacher?: Teacher;
}

interface TrialParentDetailProps {
    studentId?: string;
    onBack: () => void;
    onReschedule: () => void;
}

export function TrialParentDetail({ studentId, onBack, onReschedule }: TrialParentDetailProps) {
    const [trialData, setTrialData] = useState<TrialClass | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const queryParam = studentId ? `?q=${studentId}` : "";
                const response = await callApi(`/trial-classes${queryParam}`, {
                    method: "GET",
                });

                let dataArray: TrialClass[] = [];

                if (Array.isArray(response)) {
                    dataArray = response;
                } else if (response && response.data && Array.isArray(response.data)) {
                    dataArray = response.data;
                }

                if (dataArray.length > 0) {
                    setTrialData(dataArray[0]);
                } else {
                    setTrialData(null);
                }
            } catch (err: any) {
                console.error("Gagal mengambil data trial classes:", err);
                setError(err.message || "Terjadi kesalahan saat memuat data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date);
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short"
        }).format(date);
    };

    const handleApprove = async () => {
        if (!trialData) return;

        const targetId = trialData.id;

        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda akan mengonfirmasi kehadiran untuk jadwal trial class ini.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#06245C",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Konfirmasi!",
            cancelButtonText: "Batal",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                setIsSubmitting(true);

                await callApi(`/trial-classes/${targetId}/status`, {
                    method: "PATCH",
                    body: {
                        status: "APPROVED"
                    }
                });

                setTrialData((prev) => prev ? { ...prev, status: "APPROVED" } : null);

                await Swal.fire({
                    title: "Berhasil!",
                    text: "Jadwal trial class berhasil dikonfirmasi.",
                    icon: "success",
                    confirmButtonColor: "#06245C"
                });

            } catch (err: any) {
                console.error("Gagal menyetujui jadwal:", err);
                Swal.fire({
                    title: "Gagal!",
                    text: err.message || "Terjadi kesalahan saat mengonfirmasi jadwal.",
                    icon: "error",
                    confirmButtonColor: "#06245C"
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="container-xl d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Memuat data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-xl py-5 text-center">
                <div className="alert alert-danger rounded-4 d-inline-block px-4 py-3" role="alert">
                    {error}
                </div>
                <div className="mt-3">
                    <button onClick={onBack} className="btn btn-secondary rounded-3">
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    if (!trialData) {
        return (
            <div className="container-xl py-5 text-center">
                <p className="text-muted fs-5">Data jadwal trial class tidak ditemukan.</p>
                <button onClick={onBack} className="btn btn-outline-primary rounded-3">
                    <IconArrowLeft size={18} className="me-2" /> Kembali ke Daftar
                </button>
            </div>
        );
    }

    return (
        <div className="container-xl" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", paddingBottom: "2rem", fontFamily: "sans-serif" }}>
            <button 
                onClick={onBack}
                className="btn btn-link text-decoration-none text-muted d-flex align-items-center gap-2 ps-0 mb-4 fw-semibold"
            >
                <IconArrowLeft size={18} /> Kembali ke Daftar Jadwal
            </button>

            <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
                <div className="d-flex align-items-center justify-content-between w-100 flex-wrap flex-md-nowrap gap-3">
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px" }}>1</div>
                        <div>
                            <small className="d-block text-muted" style={{ fontSize: "0.7rem", fontWeight: "600" }}>STEP 1</small>
                            <span className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>Pilih Jadwal</span>
                        </div>
                    </div>
                    
                    <div className="flex-grow-1 d-none d-md-block" style={{ borderTop: "2px solid #E2E8F0" }}></div>
                    
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px" }}>2</div>
                        <div>
                            <small className="d-block text-muted" style={{ fontSize: "0.7rem", fontWeight: "600" }}>STEP 2</small>
                            <span className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>Konfirmasi Detail</span>
                        </div>
                    </div>
                    
                    <div className="flex-grow-1 d-none d-md-block" style={{ borderTop: "2px solid #E2E8F0" }}></div>
                    
                    <div className="d-flex align-items-center gap-2 flex-shrink-0 opacity-50">
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px" }}>3</div>
                        <div>
                            <small className="d-block text-muted" style={{ fontSize: "0.7rem", fontWeight: "600" }}>STEP 3</small>
                            <span className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>Kirim Permintaan</span>
                        </div>
                    </div>
                    
                    <div className="flex-grow-1 d-none d-md-block" style={{ borderTop: "2px solid #E2E8F0" }}></div>
                    
                    <div className="d-flex align-items-center gap-2 flex-shrink-0 opacity-50">
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px" }}>4</div>
                        <div>
                            <small className="d-block text-muted" style={{ fontSize: "0.7rem", fontWeight: "600" }}>STEP 4</small>
                            <span className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>Selesai</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white position-relative overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)" }}>
                        <h3 className="fw-bold text-dark mb-2" style={{ fontSize: "1.75rem" }}>Konfirmasi Jadwal Observasi</h3>
                        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
                            Mohon periksa rincian jadwal di bawah ini sebelum memberikan konfirmasi kehadiran untuk ananda.
                        </p>

                        <span className="badge rounded-pill mb-4 px-3 py-2" style={{ backgroundColor: "#F3E8FF", color: "#A855F7", fontWeight: "600" }}>
                            {trialData.status === "WAITING_APPROVAL" ? "Menunggu Persetujuan" : trialData.status}
                        </span>

                        <div className="row g-4 mt-2">
                            <div className="col-sm-6 col-md-4">
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>NAMA SISWA</span>
                                <h5 className="fw-bold text-dark mb-0">{trialData.student?.name || "-"}</h5>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>TARGET KELAS</span>
                                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                    <IconSchool size={20} className="text-primary" /> {trialData.student?.class ? `Kelas ${trialData.student.class}` : "-"}
                                </h5>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>TANGGAL</span>
                                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                    <IconCalendarEvent size={20} className="text-primary" /> {formatDate(trialData.scheduledAt)}
                                </h5>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>WAKTU</span>
                                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                    <IconClock size={20} className="text-primary" /> {formatTime(trialData.scheduledAt)}
                                </h5>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>GURU PENDAMPING</span>
                                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                    <IconUser size={20} className="text-primary" /> {trialData.teacher?.fullName || "-"}
                                </h5>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>RUANGAN</span>
                                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                    <IconDoorEnter size={20} className="text-primary" /> {trialData.location || "-"}
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 border-start border-4 border-success rounded-4 shadow-sm p-4 bg-white" style={{ backgroundColor: "#F0FDF4" }}>
                        <div className="d-flex gap-3 align-items-start">
                            <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                                <IconFileText size={24} />
                            </div>
                            <div>
                                <h5 className="fw-bold text-success mb-2" style={{ fontSize: "1.1rem" }}>Catatan dari Guru</h5>
                                <p className="text-muted mb-0" style={{ fontStyle: trialData.notes ? "normal" : "italic", lineHeight: "1.5" }}>
                                    {trialData.notes ? `"${trialData.notes}"` : "Belum ada catatan khusus dari guru."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
                        <span className="text-uppercase text-muted fw-bold d-block mb-4" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>LANGKAH SELANJUTNYA</span>
                        
                        <div className="d-flex flex-column gap-4 position-relative">
                            <div className="position-absolute start-3 top-0 bottom-0 border-start border-2 border-dashed" style={{ left: "18px", zIndex: 0}}></div>
                            
                            <div className="d-flex gap-3 align-items-start position-relative" style={{ zIndex: 1 }}>
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: "36px", height: "36px", flexShrink: 0 }}>
                                    <IconEye size={18} />
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-0">Tinjau Jadwal</h6>
                                    <small className="text-muted">Sedang dilakukan</small>
                                </div>
                            </div>

                            <div className="d-flex gap-3 align-items-start position-relative" style={{ zIndex: 1 }}>
                                <div className="rounded-circle bg-light text-muted d-flex align-items-center justify-content-center border" style={{ width: "36px", height: "36px", flexShrink: 0 }}>
                                    <IconCircleCheck size={18} />
                                </div>
                                <div>
                                    <h6 className="fw-bold text-secondary mb-0">Konfirmasi Kehadiran</h6>
                                    <small className="text-muted">Klik tombol setuju di bawah</small>
                                </div>
                            </div>

                            <div className="d-flex gap-3 align-items-start position-relative" style={{ zIndex: 1 }}>
                                <div className="rounded-circle bg-light text-muted d-flex align-items-center justify-content-center border" style={{ width: "36px", height: "36px", flexShrink: 0 }}>
                                    <IconCalendarTime size={18} />
                                </div>
                                <div>
                                    <h6 className="fw-bold text-secondary mb-0">Persiapan Observasi</h6>
                                    <small className="text-muted">Panduan akan dikirim otomatis</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-2 mb-4">
                        <button 
                            onClick={handleApprove}
                            disabled={isSubmitting || trialData.status === "APPROVED"}
                            className="btn w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm" 
                            style={{ backgroundColor: "#06245C", color: "#FFFFFF", border: "none" }}
                        >
                            {isSubmitting ? (
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="visually-hidden">Proses...</span>
                                </div>
                            ) : (
                                <>
                                    <IconCircleCheck size={20} /> 
                                    {trialData.status === "APPROVED" ? "Jadwal Telah Disetujui" : "Setuju & Konfirmasi Jadwal"}
                                </>
                            )}
                        </button>
                        
                        <button 
                            onClick={onReschedule}
                            disabled={isSubmitting}
                            className="btn btn-outline-secondary w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-bold bg-white text-dark"
                        >
                            <IconEdit size={20} /> Ajukan Perubahan Jadwal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}