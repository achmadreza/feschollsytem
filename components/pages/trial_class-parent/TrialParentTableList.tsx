"use client";

import { useEffect, useState } from "react";
import { 
    IconCalendarEvent,
    IconMapPin,
    IconArrowRight,
    IconCircleX,
    IconSchool
} from "@tabler/icons-react";
import { TrialParentDetail } from "./TrialParentDetail"; 
import { TrialParentReschedule } from "./TrialParentReschedule"; 
import { callApi } from "@/lib/api";
import { Toaster, toast } from "react-hot-toast";
import Swal from "sweetalert2";

interface Student {
    id: string;
    name: string;
    class: string;
}

interface Teacher {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

interface TrialClass {
    id: string;
    studentId: string;
    status: string;
    scheduledAt: string;
    location: string;
    student?: Student;
    teacher?: Teacher;
}

export function TrialParentTableList({ studentId }: { studentId?: string }) {
    const [activeTab, setActiveTab] = useState<"aktif" | "selesai">("aktif");
    const [viewMode, setViewMode] = useState<"list" | "detail" | "reschedule">("list");
    const [trialData, setTrialData] = useState<TrialClass[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const queryParam = studentId ? `?q=${studentId}` : "";
            const response = await callApi(`/trial-classes${queryParam}`, {
                method: "GET",
            });

            if (Array.isArray(response)) {
                setTrialData(response);
            } else if (response && response.data && Array.isArray(response.data)) {
                setTrialData(response.data);
            } else {
                setTrialData([]);
            }
        } catch (err: any) {
            console.error("Gagal mengambil data trial classes:", err);
            setError(err.message || "Terjadi kesalahan saat memuat data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [studentId]);

    const handleCancelSession = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Apakah Anda yakin ingin membatalkan sesi trial class ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Ya, Batalkan!",
            cancelButtonText: "Batal",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: "Memproses...",
                    text: "Mohon tunggu sebentar",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                await callApi(`trial-classes/${id}/status`, {
                    method: "PATCH",
                    body: {
                        status: "REJECTED"
                    }
                });

                await Swal.fire({
                    title: "Berhasil!",
                    text: "Sesi trial class telah dibatalkan.",
                    icon: "success",
                    confirmButtonColor: "#4F46E5"
                });

                setTrialData(prev => 
                    prev.map(item => item.id === id ? { ...item, status: "REJECTED" } : item)
                );

            } catch (err: any) {
                console.error("Gagal membatalkan sesi:", err);
                Swal.fire({
                    title: "Gagal!",
                    text: err.message || "Terjadi kesalahan saat membatalkan sesi.",
                    icon: "error",
                    confirmButtonColor: "#4F46E5"
                });
            }
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return `${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;
    };

    const activeClasses = trialData.filter(item => item.status === "WAITING_APPROVAL" || item.status === "SCHEDULED");
    const completedClasses = trialData.filter(item => item.status === "COMPLETED" || item.status === "APPROVED" || item.status === "CANCELLED" || item.status === "REJECTED");
    const nearestSession = activeClasses[0] || trialData[0];

    if (viewMode === "reschedule") {
        return (
            <TrialParentReschedule 
                onBack={() => setViewMode("detail")} 
                onNext={() => setViewMode("list")} 
            />
        );
    }

    if (viewMode === "detail") {
        return (
            <TrialParentDetail 
                onBack={() => setViewMode("list")} 
                onReschedule={() => setViewMode("reschedule")}
            />
        );
    }

    return (
        <div className="container-xl" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", paddingBottom: "2rem", fontFamily: "sans-serif" }}>
            <Toaster position="top-right" />
            
            <div className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3 mb-4">
                <div>
                    <h1 className="fw-bold text-dark mb-2" style={{ fontSize: "2.0rem", maxWidth: "600px", lineHeight: "1.2" }}>
                        Mulai Perjalanan Belajar Si Kecil
                    </h1>
                    <p className="text-muted mb-0" style={{ maxWidth: "650px", fontSize: "0.95rem" }}>
                        Kelola jadwal Trial Class anak Anda dengan mudah. Program ini dirancang untuk memberikan gambaran nyata tentang metode pembelajaran interaktif kami sebelum bergabung sepenuhnya.
                    </p>
                </div>
                
                <div className="p-1 rounded-3 d-inline-flex" style={{ backgroundColor: "#EBEFF5" }}>
                    <button 
                        className={`btn btn-sm px-3 py-2 border-0 rounded-2 font-medium ${activeTab === "aktif" ? "bg-white shadow-sm" : "text-muted"}`}
                        onClick={() => setActiveTab("aktif")}
                        style={{ fontSize: "0.875rem" }}
                    >
                        {activeClasses.length} Aktif
                    </button>
                    <button 
                        className={`btn btn-sm px-3 py-2 border-0 rounded-2 font-medium ${activeTab === "selesai" ? "bg-white shadow-sm" : "text-muted"}`}
                        onClick={() => setActiveTab("selesai")}
                        style={{ fontSize: "0.875rem" }}
                    >
                        {completedClasses.length} Selesai
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-2">Memuat data jadwal trial class...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger rounded-4 p-4 mb-5" role="alert">
                    {error}
                </div>
            ) : nearestSession ? (
                <div className="row g-0 rounded-4 overflow-hidden shadow-sm mb-5" style={{ minHeight: "340px" }}>
                    <div className="col-lg-4 p-4 text-white d-flex flex-column justify-content-between" style={{ backgroundColor: "#6366F1", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" }}>
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="p-2 rounded-3 bg-opacity-20 d-inline-flex align-items-center justify-content-center">
                                    <IconCalendarEvent size={24} />
                                </div>
                                <span className="badge rounded-pill bg-opacity-20 px-3 py-2" style={{ fontSize: "0.75rem", fontWeight: "500" }}>
                                    Sesi Terdekat
                                </span>
                            </div>

                            <h3 className="h4 fw-bold mb-1">{nearestSession.student?.name || "Nama Siswa"}</h3>
                            <p className="d-flex align-items-center gap-1 opacity-90 mb-4" style={{ fontSize: "0.875rem" }}>
                                <IconSchool size={16} /> Kelas {nearestSession.student?.class || "-"}
                            </p>

                            <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                                <span className="d-block text-uppercase opacity-70 fw-semibold mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                    STATUS
                                </span>
                                <div className="d-flex align-items-center gap-2 text-warning fw-bold" style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                                    <span className="rounded-circle bg-warning" style={{ width: "8px", height: "8px" }}></span>
                                    {nearestSession.status}
                                </div>
                            </div>
                        </div>

                        {(() => {
                            const isApproved = nearestSession.status?.toUpperCase() === "APPROVED";
                            
                            return (
                                <button 
                                    onClick={() => setViewMode("detail")}
                                    disabled={isApproved}
                                    className="btn btn-white w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold" 
                                    style={{ 
                                        backgroundColor: isApproved ? "#E2E8F0" : "#FFFFFF", 
                                        color: isApproved ? "#94A3B8" : "#4F46E5", 
                                        border: "none",
                                        cursor: isApproved ? "not-allowed" : "pointer",
                                        opacity: isApproved ? 0.7 : 1
                                    }}
                                >
                                    Lanjutkan ke Detail Jadwal <IconArrowRight size={18} />
                                </button>
                            );
                        })()}
                    </div>

                    <div className="col-lg-8 p-4 p-md-5 bg-white">
                        <div className="row g-4">
                            <div className="col-md-6 d-flex flex-column gap-4">
                                <div>
                                    <span className="text-uppercase text-muted fw-bold d-block mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                        WAKTU PELAKSANAAN
                                    </span>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2.5 rounded-3 text-primary d-inline-flex align-items-center justify-content-center" style={{ backgroundColor: "#EEF2FF" }}>
                                            <IconCalendarEvent size={22} />
                                        </div>
                                        <div>
                                            <h4 className="mb-0 fw-semibold text-dark">{formatDate(nearestSession.scheduledAt)}</h4>
                                            <small className="text-muted">{formatTime(nearestSession.scheduledAt)}</small>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-uppercase text-muted fw-bold d-block mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                        LOKASI & FASILITAS
                                    </span>
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="p-2.5 rounded-3 text-success d-inline-flex align-items-center justify-content-center" style={{ backgroundColor: "#D1FAE5" }}>
                                            <IconMapPin size={22} />
                                        </div>
                                        <div>
                                            <h4 className="mb-0 fw-semibold text-dark">{nearestSession.location || "-"}</h4>
                                            <small className="text-muted">Lantai 1, Gedung Utama</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 d-flex flex-column justify-content-between gap-4">
                                <div>
                                    <span className="text-uppercase text-muted fw-bold d-block mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                        GURU PEMBIMBING
                                    </span>
                                    <div className="d-flex align-items-center gap-3">
                                        <div 
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                                            style={{ width: "42px", height: "42px", minWidth: "42px", fontSize: "0.85rem" }}
                                        >
                                            {nearestSession.teacher?.fullName ? nearestSession.teacher.fullName.substring(0, 2).toUpperCase() : "TR"}
                                        </div>
                                        <div>
                                            <h4 className="mb-0 fw-semibold text-dark">{nearestSession.teacher?.fullName || "-"}</h4>
                                            <small className="text-muted">{nearestSession.teacher?.role || ""}</small>
                                        </div>
                                    </div>
                                </div>

                                {/* <div>
                                    <button 
                                        onClick={() => handleCancelSession(nearestSession.id)}
                                        className="btn btn-link text-danger p-0 text-decoration-none d-flex align-items-center gap-1.5 fw-semibold mb-1" 
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        <IconCircleX size={18} /> Batalkan Sesi
                                    </button>
                                    <p className="text-muted mb-0" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                                        *Pembatalan dapat dilakukan maksimal 24 jam sebelum sesi dimulai.
                                    </p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-5 text-center bg-white rounded-4 shadow-sm mb-5">
                    <p className="text-muted mb-0">Belum ada data trial class untuk siswa ini.</p>
                </div>
            )}

            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.1rem" }}>Riwayat Trial Class</h5>
                </div>

                <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                        <thead>
                            <tr className="text-muted" style={{ fontSize: "0.85rem", borderBottom: "1px solid #F1F5F9" }}>
                                <th className="pb-3 fw-semibold" style={{ width: "30%" }}>Siswa</th>
                                <th className="pb-3 fw-semibold" style={{ width: "25%" }}>Tanggal</th>
                                <th className="pb-3 fw-semibold" style={{ width: "25%" }}>Lokasi / Program</th>
                                <th className="pb-3 fw-semibold text-end" style={{ width: "20%" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trialData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-muted">
                                        Tidak ada data riwayat.
                                    </td>
                                </tr>
                            ) : (
                                trialData.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: "32px", height: "32px", backgroundColor: "#EEF2FF", fontSize: "0.75rem" }}>
                                                    {item.student?.name ? item.student.name.substring(0, 2).toUpperCase() : "ST"}
                                                </div>
                                                <span className="fw-medium text-dark">{item.student?.name || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-secondary" style={{ fontSize: "0.9rem" }}>
                                            {formatDate(item.scheduledAt)}
                                        </td>
                                        <td className="py-3">
                                            <span className="badge rounded-2 px-3 py-2 text-dark font-medium" style={{ backgroundColor: "#F1F5F9", fontSize: "0.8rem", fontWeight: "400" }}>
                                                {item.location || "Trial Class"}
                                            </span>
                                        </td>
                                        <td className="py-3 text-end">
                                            <span 
                                                className={`badge rounded-pill px-3 py-2 fw-medium ${
                                                    item.status === "WAITING_APPROVAL" 
                                                        ? "text-warning" 
                                                        : item.status === "APPROVED" 
                                                        ? "text-success" 
                                                        : item.status === "REJECTED" || item.status === "CANCELLED"
                                                        ? "text-danger"
                                                        : "text-secondary"
                                                }`} 
                                                style={{ 
                                                    backgroundColor: 
                                                        item.status === "WAITING_APPROVAL" 
                                                            ? "#FEF3C7" 
                                                            : item.status === "APPROVED" 
                                                            ? "#D1FAE5" 
                                                            : item.status === "REJECTED" || item.status === "CANCELLED"
                                                            ? "#FEE2E2"
                                                            : "#E2E8F0", 
                                                    fontSize: "0.8rem" 
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}