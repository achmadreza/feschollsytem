"use client";

import { useState, useEffect } from "react";
import { 
  IconX, 
  IconCalendar, 
  IconClock, 
  IconSchool, 
  IconBuildingStore, 
  IconNote, 
  IconUser, 
  IconPhone 
} from "@tabler/icons-react";
import { TrialData } from "./TrialTableList";
import { Button } from "../../ui/Button"; 
import { callApi } from "@/lib/api";
import { toast } from "react-hot-toast";

interface TrialClassDetail {
  id: string;
  _id: string;
  parentId: string;
  studentId: string;
  teacherId: string;
  registeredAt: string;
  status: string;
  student?: {
    id: string;
    name: string;
    class: string;
    parentName: string;
    phoneNumber: string;
    parentEmail: string;
  };
  teacher?: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface TeacherUser {
  id?: string;
  _id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TrialData | null;
  onSave?: (formData: any) => void;
}

export function ScheduleModal({ isOpen, onClose, data, onSave }: ScheduleModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [loadingTeachers, setLoadingTeachers] = useState<boolean>(false);
    const [detailData, setDetailData] = useState<TrialClassDetail | null>(null);
    const [teachersList, setTeachersList] = useState<TeacherUser[]>([]);
    
    const [trialDate, setTrialDate] = useState<string>("");
    const [trialTime, setTrialTime] = useState<string>("");
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [sendEmail, setSendEmail] = useState<boolean>(false);

    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        if (isOpen && data?.id) {
        const fetchTeachers = async () => {
            setLoadingTeachers(true);
            try {
            const teacherRes = await callApi<TeacherUser[] | { data: TeacherUser[] }>(
                "users?role=teacher",
                { method: "GET" }
            );
            const list = Array.isArray(teacherRes) ? teacherRes : teacherRes.data || [];
            setTeachersList(list);
            } catch (error) {
                console.error("Gagal mengambil daftar guru:", error);
                toast.error("Gagal memuat data guru observer.");
            } finally {
                setLoadingTeachers(false);
            }
        };

        const fetchTrialDetail = async () => {
            setLoading(true);
            try {
            const response = await callApi<TrialClassDetail | { data: TrialClassDetail }>(
                `trial-classes/${data.id}`, 
                { method: "GET" }
            );

            const resultData = "data" in response && response.data ? response.data : (response as TrialClassDetail);
            setDetailData(resultData);

            if (resultData.registeredAt) {
                const formattedDate = new Date(resultData.registeredAt).toISOString().split("T")[0];
                setTrialDate(formattedDate);
            } else {
                setTrialDate(new Date().toISOString().split("T")[0]);
            }

            setTrialTime(getCurrentTime());
            const defaultTeacherId = resultData.teacher?.id || resultData.teacherId || "";
            setSelectedTeacherId(defaultTeacherId);
            setNote("");

            } catch (error: any) {
                console.error("Gagal mengambil data trial class:", error);
                toast.error("Gagal memuat detail data trial class.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
        fetchTrialDetail();
        }
    }, [isOpen, data?.id]);

    if (!isOpen || !data) return null;

    const studentName = detailData?.student?.name || data.studentName || "Siswa";
    const parentName = detailData?.student?.parentName || data.parentName || "-";
    const phoneNumber = detailData?.student?.phoneNumber || data.phoneNumber || "-";
    const programClass = detailData?.student?.class || data.programClass || "-";

    const initials = data.initials || studentName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data?.id) return;

        setSubmitting(true);

        try {
        const scheduledAt = trialDate && trialTime 
            ? new Date(`${trialDate}T${trialTime}`).toISOString() 
            : new Date().toISOString();

        const payload = {
            parentId: detailData?.parentId || "",
            studentId: detailData?.studentId || "",
            teacherId: selectedTeacherId || "",
            registeredAt: detailData?.registeredAt || new Date().toISOString(),
            scheduledAt,
            location: location || "",
            notes: note || "",
            status: "WAITING_APPROVAL"
        };

        const response = await callApi(`trial-classes/${data.id}`, {
            method: "PUT",
            body: payload,
        });

        toast.success("Jadwal trial class berhasil diperbarui!");

        if (onSave) onSave(response);
        onClose();
        } catch (error: any) {
            console.error("Gagal memperbarui jadwal trial class:", error);
            toast.error(error?.message || "Gagal menyimpan jadwal trial class.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div 
        className="modal fade show d-block" 
        tabIndex={-1} 
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", zIndex: 1050 }}
        >
            <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content border-0 bg-white shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
                    <div className="modal-header border-0 px-4 pt-4 pb-2 d-flex justify-content-between align-items-start">
                        <div>
                        <span className="text-uppercase fw-bold text-primary tracking-wider" style={{ fontSize: "11px", color: "#6366F1" }}>
                            Pendaftaran Baru
                        </span>
                        <h4 className="modal-title fw-extrabold text-dark mt-1" style={{ fontSize: "22px" }}>
                            Atur Jadwal Trial Class
                        </h4>
                        </div>
                        <button type="button" className="btn-close shadow-none border-0 bg-transparent p-1" onClick={onClose}>
                        <IconX size={20} className="text-secondary" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body px-4 py-3" style={{ backgroundColor: "#F8FAFC" }}>
                        <div className="p-3 mb-4 border-0 d-flex align-items-center gap-3" style={{ borderRadius: "16px", backgroundColor: "#EEF2FF" }}>
                            {data.avatarUrl ? (
                            <img src={data.avatarUrl} alt={studentName} className="rounded-circle object-cover" style={{ width: "56px", height: "56px" }} />
                            ) : (
                            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary flex-shrink-0" style={{ width: "56px", height: "56px", backgroundColor: "#E0E7FF", color: "#4F46E5", fontSize: "18px" }}>
                                {initials}
                            </div>
                            )}
                            <div>
                            <div className="d-flex align-items-center gap-2">
                                <h5 className="fw-bold text-dark mb-0" style={{ fontSize: "18px" }}>{studentName}</h5>
                                <span className="badge text-white px-2 py-1" style={{ backgroundColor: "#6366F1", borderRadius: "6px", fontSize: "10px" }}>
                                {programClass}
                                </span>
                            </div>
                            <p className="text-muted mb-0 mt-1" style={{ fontSize: "13px" }}>
                                <IconUser size={14} /> {parentName} <br />
                                <IconPhone size={14} /> {phoneNumber}
                            </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-4 text-muted">Memuat data detail...</div>
                        ) : (
                            <>
                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                <label className="form-label text-secondary fw-semibold mb-2" style={{ fontSize: "13px" }}>
                                    <IconCalendar size={14} className="me-1" />Tanggal Trial Class
                                </label>
                                <input 
                                    type="date" 
                                    className="form-control py-2 shadow-none border-light-subtle" 
                                    style={{ borderRadius: "10px" }} 
                                    value={trialDate}
                                    onChange={(e) => setTrialDate(e.target.value)}
                                    required 
                                />
                                </div>
                                <div className="col-6">
                                <label className="form-label text-secondary fw-semibold mb-2" style={{ fontSize: "13px" }}>
                                    <IconClock size={14} className="me-1" /> Jam Trial Class
                                </label>
                                <input 
                                    type="time" 
                                    className="form-control py-2 shadow-none border-light-subtle" 
                                    style={{ borderRadius: "10px" }} 
                                    value={trialTime}
                                    onChange={(e) => setTrialTime(e.target.value)}
                                    required
                                />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                <label className="form-label text-secondary fw-semibold mb-2" style={{ fontSize: "13px" }}>
                                    <IconSchool size={14} className="me-1" /> Guru Observer
                                </label>
                                <select 
                                    className="form-select py-2 shadow-none border-light-subtle" 
                                    style={{ borderRadius: "10px" }} 
                                    value={selectedTeacherId}
                                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                                    disabled={loadingTeachers}
                                    required
                                >
                                    <option value="" disabled>-- Pilih Guru --</option>
                                    {teachersList.map((teacher) => {
                                    const teacherId = teacher.id || teacher._id || "";
                                    const teacherName = teacher.fullName || teacher.name || "Guru";
                                    return (
                                        <option key={teacherId} value={teacherId}>
                                        {teacherName}
                                        </option>
                                    );
                                    })}
                                </select>
                                </div>
                                <div className="col-6">
                                <label className="form-label text-secondary fw-semibold mb-2" style={{ fontSize: "13px" }}>
                                    <IconBuildingStore size={14} className="me-1" /> Ruangan / Lokasi
                                </label>
                                <select 
                                    className="form-select py-2 shadow-none border-light-subtle" 
                                    style={{ borderRadius: "10px" }} 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option value="" disabled>-- Pilih Lokasi --</option>
                                    <option value="Ruang TK A">Ruang TK A</option>
                                    <option value="Ruang TK B">Ruang TK B</option>
                                    <option value="Ruang Playgroup">Ruang Playgroup</option>
                                    <option value="Aula Utama">Aula Utama</option>
                                </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                <label className="form-label text-secondary fw-semibold mb-0" style={{ fontSize: "13px" }}>
                                    <IconNote size={14} className="me-1" /> Catatan (Opsional)
                                </label>
                                <span className="text-muted" style={{ fontSize: "11px" }}>{note.length}/200</span>
                                </div>
                                <textarea 
                                className="form-control shadow-none border-light-subtle" 
                                rows={3} 
                                maxLength={200}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Masukkan catatan jika ada..."
                                style={{ borderRadius: "10px", fontSize: "14px" }}
                                />
                            </div>

                            <hr className="text-black-50 my-3" />
                            <div className="mb-2">
                                <p className="text-muted mb-2 fw-semibold" style={{ fontSize: "13px" }}>Kirim Konfirmasi Ke Orang Tua</p>
                                <div className="form-check">
                                <input 
                                    className="form-check-input shadow-none" 
                                    type="checkbox" 
                                    id="emailCheck" 
                                    checked={sendEmail}
                                    onChange={(e) => setSendEmail(e.target.checked)}
                                    style={{ borderColor: "#6366F1" }} 
                                />
                                <label className="form-check-label text-dark" htmlFor="emailCheck" style={{ fontSize: "13px" }}>
                                    Kirim email ke orang tua
                                </label>
                                </div>
                            </div>
                            </>
                        )}
                        </div>

                        <div className="modal-footer border-0 px-4 py-3 d-flex gap-2 justify-content-end" style={{ backgroundColor: "#F1F5F9" }}>
                        <Button 
                            type="button" 
                            onClick={onClose}
                            variant="outline" 
                            size="lg"
                            disabled={submitting}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit"
                            variant="default"
                            size="lg"
                            disabled={loading || loadingTeachers || submitting}
                        >
                            {submitting ? "Menyimpan..." : "Kirim Jadwal"}
                        </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}