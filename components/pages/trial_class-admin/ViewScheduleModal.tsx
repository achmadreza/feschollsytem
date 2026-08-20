"use client";

import { useState, useEffect } from "react";
import { IconX, IconCalendarEvent, IconUser, IconUsers, IconPhone, IconLoader2 } from "@tabler/icons-react";
import { TrialData } from "./TrialTableList";
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import { callApi } from "@/lib/api";
export interface StudentDetail {
  _id: string;
  schoolCode: string;
  name: string;
  class: string;
  gender: string;
  religion: string;
  status: string;
  address: string;
  birthPlace: string;
  birthdate: string;
  parentId: string;
  parentEmail: string;
  parentName: string;
  phoneNumber: string;
  emergencyContact: string;
  schoolYear: string;
  kk: string;
  birthCertificate: string;
  photo: string;
  createdAt: string;
  id: string;
  updatedAt: string;
  __v: number;
}

export interface TeacherDetail {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phone: string;
  schoolCode: string;
  role: string;
}

export interface TrialClassDetail {
  _id: string;
  parentId: string;
  studentId: string;
  teacherId: string;
  registeredAt: string;
  status: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  student?: StudentDetail;
  teacher?: TeacherDetail;
}

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TrialData | null;
}

export function ViewScheduleModal({ isOpen, onClose, data }: ViewScheduleModalProps) {
    const [imgError, setImgError] = useState(false);
    const [detail, setDetail] = useState<TrialClassDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        }).format(date);
    };

    useEffect(() => {
        if (!isOpen || !data?.id) return;

        setImgError(false);
        setIsLoading(true);
        setError(null);

        const fetchDetail = async () => {
        try {
            const response = await callApi<TrialClassDetail | { data: TrialClassDetail } | TrialClassDetail[]>(
            `trial-classes/${data.id}`,
            { method: "GET" }
            );
            let resultData: TrialClassDetail | null = null;
            if (Array.isArray(response)) {
            resultData = response[0] || null;
            } else if (response && "data" in response && response.data) {
            resultData = Array.isArray(response.data) ? response.data[0] : response.data;
            } else if (response && "_id" in response) {
            resultData = response as TrialClassDetail;
            }

            setDetail(resultData);
        } catch (err: any) {
            console.error("Failed to fetch trial class detail:", err);
            setError(err.message || "Gagal mengambil detail trial class");
        } finally {
            setIsLoading(false);
        }
        };

        fetchDetail();
    }, [isOpen, data?.id]);

    if (!isOpen || !data) return null;

    const student = detail?.student;
    const teacher = detail?.teacher;

    const studentName = student?.name || data.studentName || "Siswa";
    const initials = data.initials || studentName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    const avatarUrl = student?.photo && student.photo !== "test.jpg" ? student.photo : data.avatarUrl;

    const birthInfo = student?.birthPlace || student?.birthdate
        ? `${student.birthPlace || ""}${student.birthPlace && student.birthdate ? ", " : ""}${formatDate(student.birthdate)}`
        : "-";

    return (
        <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ backgroundColor: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(4px)", zIndex: 1050 }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div
                className="modal-content border-0 overflow-hidden position-relative shadow-lg"
                style={{ borderRadius: "24px", backgroundColor: "#F8FAFC" }}
                >
                    <div
                        className="position-absolute w-100"
                        style={{
                        height: "140px",
                        background: "linear-gradient(135deg, #E0E7FF 0%, #EEF2FF 100%)",
                        top: 0,
                        left: 0,
                        zIndex: 0,
                        }}
                    >
                        <div
                        className="position-absolute rounded-circle"
                        style={{
                            width: "200px",
                            height: "200px",
                            backgroundColor: "rgba(79, 70, 229, 0.05)",
                            right: "-50px",
                            top: "-50px",
                        }}
                        />
                    </div>

                    <button
                        type="button"
                        className="btn-close position-absolute bg-white rounded-circle p-2 shadow-sm border-0 d-flex align-items-center justify-content-center"
                        onClick={onClose}
                        style={{ right: "20px", top: "20px", zIndex: 10, width: "36px", height: "36px" }}
                        aria-label="Close"
                    >
                        <IconX size={18} className="text-dark" />
                    </button>

                    <div className="modal-body px-4 pt-5 pb-4 position-relative" style={{ zIndex: 1, marginTop: "40px" }}>
                        {isLoading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center py-5 my-4">
                            <IconLoader2 size={40} className="text-primary spin mb-2" />
                            <span className="text-muted fw-medium">Memuat detail data...</span>
                        </div>
                        ) : error ? (
                        <div className="alert alert-danger my-4 text-center" role="alert">
                            {error}
                        </div>
                        ) : (
                        <>
                            <div className="text-center mb-4">
                            <div className="d-inline-block position-relative mb-3">
                                {avatarUrl && !imgError ? (
                                <img
                                    src={avatarUrl}
                                    alt={studentName}
                                    className="rounded-circle border border-4 border-white shadow"
                                    style={{ width: "110px", height: "110px", objectFit: "cover" }}
                                    onError={() => setImgError(true)}
                                />
                                ) : (
                                <div
                                    className="rounded-circle border border-4 border-white shadow d-flex align-items-center justify-content-center fw-bold text-primary bg-white"
                                    style={{ width: "110px", height: "110px", fontSize: "32px" }}
                                >
                                    {initials}
                                </div>
                                )}
                            </div>
                            <h3 className="fw-bold text-dark mb-1" style={{ fontSize: "24px" }}>
                                {studentName}
                            </h3>
                            <span
                                className="badge px-3 py-2 rounded-pill fw-semibold"
                                style={{ backgroundColor: "#EEF2FF", color: "#4F46E5", fontSize: "13px" }}
                            >
                                🎓 Grade / Kelas: {student?.class || data.programClass || "-"}
                            </span>
                            </div>

                            <div
                            className="card border-0 p-4 mb-4 shadow-sm"
                            style={{ borderRadius: "16px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
                            >
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div className="d-flex align-items-center gap-2">
                                <div className="p-2 rounded-3 bg-light text-primary">
                                    <IconCalendarEvent size={20} />
                                </div>
                                <h5 className="fw-bold text-dark m-0" style={{ fontSize: "16px", letterSpacing: "0.5px" }}>
                                    DETAIL JADWAL TRIAL
                                </h5>
                                </div>
                                <BadgeStatus status={detail?.status || data.status} />
                            </div>

                            <div className="row g-3">
                                <div className="col-6 col-md-3">
                                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Tanggal Pendaftaran
                                </div>
                                <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                    {formatDate(detail?.registeredAt || data.registrationDate)}
                                </div>
                                </div>
                                <div className="col-6 col-md-3">
                                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Tahun Ajaran
                                </div>
                                <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                    {student?.schoolYear || "-"}
                                </div>
                                </div>
                                <div className="col-6 col-md-3">
                                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Kode Sekolah
                                </div>
                                <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                    {student?.schoolCode || teacher?.schoolCode || "-"}
                                </div>
                                </div>
                                <div className="col-6 col-md-3">
                                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Pengajar / Teacher
                                </div>
                                <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                    {teacher?.fullName || "-"}
                                </div>
                                </div>
                            </div>
                            </div>

                            <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <div
                                className="card border-0 p-4 h-100 shadow-sm"
                                style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}
                                >
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <div className="p-2 rounded-3 bg-light text-secondary">
                                    <IconUser size={18} />
                                    </div>
                                    <h5 className="fw-bold text-dark m-0" style={{ fontSize: "16px" }}>
                                    Data Pribadi Siswa
                                    </h5>
                                </div>
                                <div className="mb-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Nama Lengkap
                                    </div>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                    {studentName}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Jenis Kelamin
                                    </div>
                                    <div className="fw-semibold text-dark text-capitalize" style={{ fontSize: "15px" }}>
                                    {student?.gender || "-"}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Tempat, Tanggal Lahir
                                    </div>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                    {birthInfo}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Alamat
                                    </div>
                                    <div className="fw-semibold text-dark text-capitalize" style={{ fontSize: "15px" }}>
                                    {student?.address || "-"}
                                    </div>
                                </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div
                                className="card border-0 p-4 h-100 shadow-sm"
                                style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}
                                >
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <div className="p-2 rounded-3 bg-light text-secondary">
                                    <IconUsers size={18} />
                                    </div>
                                    <h5 className="fw-bold text-dark m-0" style={{ fontSize: "16px" }}>
                                    Data Orang Tua
                                    </h5>
                                </div>
                                <div className="mb-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Nama Orang Tua
                                    </div>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                    {student?.parentName || data.parentName || "-"}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Email Orang Tua
                                    </div>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                    {student?.parentEmail || "-"}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    No. HP Orang Tua
                                    </div>
                                    <div
                                    className="d-flex align-items-center justify-content-between fw-semibold text-dark"
                                    style={{ fontSize: "15px" }}
                                    >
                                    <span>{student?.phoneNumber || data.phoneNumber || "-"}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>
                                    Kontak Darurat
                                    </div>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                    {student?.emergencyContact || "-"}
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </>
                        )}
                    </div>

                    <div className="modal-footer border-top-0 px-4 pb-4 pt-2 bg-light d-flex justify-content-end">
                        <button
                        type="button"
                        className="btn text-white fw-bold px-4 py-2"
                        style={{ backgroundColor: "#0F2C59", borderRadius: "10px", fontSize: "14px" }}
                        onClick={onClose}
                        >
                        Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}