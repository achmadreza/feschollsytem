"use client";

import { useState, useEffect } from "react";
import { TrialData } from "./TrialTableList";
import { IconCalendar, IconUser, IconPhone, IconMessage, IconCheck } from "@tabler/icons-react";
import { Button } from "../../ui/Button"; 
import { callApi } from "@/lib/api";
import { Toaster, toast } from "react-hot-toast";

interface ReviewRescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: TrialData | null;
    onApprove: (data: any) => void;
    onReject: (data: any) => void;
}

const parseUtcDate = (isoString?: string) => {
    if (!isoString) return { formattedDate: "-", formattedTime: "-" };

    const [datePart, timePart] = isoString.split("T");
    if (!datePart || !timePart) return { formattedDate: "-", formattedTime: "-" };

    const [year, month, day] = datePart.split("-");
    const timeFormatted = timePart.substring(0, 5);

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const formattedDate = `${parseInt(day, 10)} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
    const formattedTime = `${timeFormatted.replace(":", ".")} WIB`;

    return { formattedDate, formattedTime };
};

export function ReviewRescheduleModal({ isOpen, onClose, data, onApprove, onReject }: ReviewRescheduleModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [newDate, setNewDate] = useState<string>("");
    const [newTime, setNewTime] = useState<string>("");
    const [observer, setObserver] = useState<string>("");

    useEffect(() => {
        if (isOpen && data?.id) {
            fetchTrialDetail(data.id);
        }
    }, [isOpen, data]);

    const fetchTrialDetail = async (id: string) => {
        setLoading(true);
        try {
            const response = await callApi(`/trial-classes/${id}`, { method: "GET" });
            const resData = response.data || response;
            setDetailData(resData);
            if (resData.scheduledAt) {
                const [datePart, timePart] = resData.scheduledAt.split("T");
                if (datePart) setNewDate(datePart);
                if (timePart) setNewTime(timePart.substring(0, 5));
            }

            if (resData.teacher?.fullName) {
                setObserver(resData.teacher.fullName);
            }
        } catch (error: any) {
            toast.error(error.message || "Gagal mengambil detail data trial class");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (status: "APPROVED" | "REJECTED") => {
        if (!data?.id) return;
        
        setIsSubmitting(true);
        try {
            const response = await callApi(`/trial-classes/${data.id}/status`, {
                method: "PATCH", 
                body: { status }
            });

            const actionMessage = status === "APPROVED" ? "disetujui" : "ditolak";
            toast.success(`Reschedule berhasil ${actionMessage}`);

            if (status === "APPROVED") {
                onApprove({ ...detailData, response });
            } else {
                onReject({ ...detailData, response });
            }

            onClose();
        } catch (error: any) {
            toast.error(error.message || `Gagal memproses status ${status}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !data) return null;

    const student = detailData?.student;
    const teacher = detailData?.teacher;
    const studentName = student?.name || "-";
    const parentName = student?.parentName || data.parentName || "-";
    const phoneNumber = student?.phoneNumber || data.phoneNumber || "-";
    const programClass = student?.class || data.programClass || "-";
    const notes = detailData?.notes;
    const location = detailData?.location || `Ruang ${programClass}`;
    const { 
        formattedDate: currentRegisteredDate, 
        formattedTime: currentRegisteredTime 
    } = parseUtcDate(detailData?.registeredAt);

    const initials = studentName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

    return (
        <>
            <Toaster position="top-right" />
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px" }}>
                        <div className="modal-header border-bottom-0 pt-4 px-4 align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 bg-purple-lt text-purple rounded-3 d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px", backgroundColor: "#F3E8FF", color: "#7C3AED" }}>
                                    <IconCalendar size={22} />
                                </div>
                                <div>
                                    <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: "18px" }}>Review Reschedule</h5>
                                    <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>PERMINTAAN #TR-{data.id}</span>
                                </div>
                            </div>
                            <button type="button" className="btn-close" onClick={onClose} disabled={isSubmitting} aria-label="Close"></button>
                        </div>

                        <div className="modal-body px-4 py-3" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 text-muted" style={{ fontSize: "14px" }}>Memuat detail data...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex align-items-center mb-4 p-2">
                                        {student?.photo && student.photo !== "test.jpg" ? (
                                            <img src={student.photo} alt={studentName} className="rounded-3 me-3 border border-2 border-primary" style={{ width: "68px", height: "68px", objectFit: "cover" }} />
                                        ) : data.avatarUrl ? (
                                            <img src={data.avatarUrl} alt={studentName} className="rounded-3 me-3 border border-2 border-primary" style={{ width: "68px", height: "68px", objectFit: "cover" }} />
                                        ) : (
                                            <div className="rounded-3 d-flex align-items-center justify-content-center me-3 fw-bold flex-shrink-0" style={{ width: "68px", height: "68px", backgroundColor: "#EEF2FF", color: "#4F46E5", fontSize: "20px" }}>
                                                {initials}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "20px" }}>
                                                {studentName} <span className="badge bg-dark text-white rounded-2 ms-1" style={{ fontSize: "10px", padding: "3px 6px" }}>{programClass}</span>
                                            </h4>
                                            <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "13px" }}><IconUser size={14}/> {parentName} (Parent)</div>
                                            <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "13px", marginTop: "2px" }}><IconPhone size={14}/> {phoneNumber}</div>
                                        </div>
                                    </div>

                                    <div className="p-3 mb-4 rounded-4 border-start border-4" style={{ backgroundColor: "#F3E8FF", borderColor: "#7C3AED" }}>
                                        <div className="d-flex align-items-center gap-2 mb-2 text-purple fw-bold" style={{ fontSize: "11px", color: "#7C3AED", letterSpacing: "0.5px" }}>
                                            <IconMessage size={14} /> PESAN ORANG TUA
                                        </div>
                                        <p className="text-dark mb-0 italic" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                                            "{notes && notes.trim() !== "" ? notes : "Tidak Ada Notes"}"
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <span className="text-muted fw-bold d-block mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>JADWAL SAAT INI</span>
                                        <div className="card border-0 p-3" style={{ backgroundColor: "#F8FAFC", borderRadius: "14px" }}>
                                            <div className="row text-center text-sm-start">
                                                <div className="col-sm-4 mb-2 mb-sm-0">
                                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Tanggal</div>
                                                    <div className="fw-bold text-dark">{currentRegisteredDate}</div>
                                                </div>
                                                <div className="col-sm-4 mb-2 mb-sm-0">
                                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Waktu</div>
                                                    <div className="fw-bold text-dark">{currentRegisteredTime}</div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Lokasi</div>
                                                    <div className="fw-bold text-dark">{location}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <span className="fw-bold d-block mb-2" style={{ fontSize: "11px", color: "#0F2C59", letterSpacing: "0.5px" }}>USULAN JADWAL BARU</span>
                                        <div className="card border-0 p-4" style={{ backgroundColor: "#EEF2FF", borderRadius: "16px" }}>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-dark mb-2" style={{ fontSize: "13px" }}>Pilih Tanggal Baru</label>
                                                    <input 
                                                        type="date" 
                                                        className="form-control bg-white border-0 py-2.5 shadow-sm px-3" 
                                                        value={newDate} 
                                                        onChange={(e) => setNewDate(e.target.value)} 
                                                        style={{ borderRadius: "10px" }} disabled
                                                    />
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-dark mb-2" style={{ fontSize: "13px" }}>Slot Waktu</label>
                                                    <input 
                                                        type="time" 
                                                        className="form-control bg-white border-0 py-2.5 shadow-sm px-3" 
                                                        value={newTime} 
                                                        onChange={(e) => setNewTime(e.target.value)} 
                                                        style={{ borderRadius: "10px" }} disabled
                                                    />
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-dark mb-2" style={{ fontSize: "13px" }}>Observer / Guru</label>
                                                    <select 
                                                        className="form-select bg-white border-0 py-2.5 shadow-sm px-3" 
                                                        value={observer} 
                                                        onChange={(e) => setObserver(e.target.value)} 
                                                        style={{ borderRadius: "10px" }} disabled
                                                    >
                                                        {teacher ? (
                                                            <option value={teacher.fullName}>{teacher.fullName}</option>
                                                        ) : (
                                                            <>
                                                                <option value="Ms. Indah Sari">Ms. Indah Sari</option>
                                                                <option value="Mr. Rian">Mr. Rian</option>
                                                            </>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-3 p-2.5 bg-white rounded-3 d-flex align-items-center gap-2 border border-success-subtle shadow-none" style={{ backgroundColor: "#F0FDF4" }}>
                                                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "18px", height: "18px" }}>
                                                    <IconCheck size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-success fw-medium" style={{ fontSize: "12px" }}>Slot tersedia untuk tanggal dan waktu yang dipilih.</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer border-top-0 d-flex justify-content-end gap-2 px-4 pb-4 pt-2">
                            <button 
                                type="button" 
                                className="btn btn-outline-danger px-4 py-2.5 fw-bold" 
                                style={{ borderRadius: "12px", fontSize: "14px" }} 
                                onClick={() => handleAction("REJECTED")}
                                disabled={loading || isSubmitting}
                            >
                                {isSubmitting ? "Memproses..." : "Tolak Reschedule"}
                            </button>
                            <Button 
                                type="button"
                                variant="default"
                                size="lg"
                                onClick={() => handleAction("APPROVED")}
                                disabled={loading || isSubmitting}
                            >
                                <IconCheck size={16} /> {isSubmitting ? "Memproses..." : "Setujui & Update Jadwal"}
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}