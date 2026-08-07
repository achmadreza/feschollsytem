"use client";

import { useState, useEffect } from "react";
import { StudentData } from "./StudentTableList";
import { 
    IconPencil, 
    IconUser, 
    IconSchool, 
    IconUsers, 
    IconFileCheck,
    IconLoader2,
} from "@tabler/icons-react";
import { Button } from "../../../components/ui/Button"; 
import { Modal } from "../../../components/ui/Modal";
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import { StudentForm } from "./StudentForm";
import { callApi } from "@/lib/api";
import { toast } from "react-hot-toast";

interface StudentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: StudentData | null;
    onEdit?: (student: StudentData) => void;
    onSaveSuccess?: (updatedData: StudentData) => void;
}

export function StudentDetailModal({ 
    isOpen, 
    onClose, 
    student, 
    onEdit, 
    onSaveSuccess 
}: StudentDetailModalProps) {
    const [detailData, setDetailData] = useState<StudentData | null>(student);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchStudentDetail = async () => {
            if (!student || !isOpen) return;

            const studentId = student.id || student._id;
            if (!studentId) return;

            setIsLoading(true);
            try {
                const response = await callApi<StudentData | { data: StudentData }>(`students/${studentId}`, {
                    method: "GET"
                });
                
                const fetchedData = (response as { data: StudentData }).data || (response as StudentData);
                setDetailData(fetchedData);
            } catch (error) {
                console.error("Gagal mengambil detail siswa:", error);
                toast.error("Gagal memuat detail data siswa.");
                setDetailData(student);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentDetail();
    }, [student, isOpen]);

    if (!student) return null;

    const data = detailData || student;
    const displayName = data.name || data.studentName || "Tanpa Nama";
    const initials = data.initials || displayName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    
    const formattedBirthdate = data.birthdate ? new Date(data.birthdate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long", 
        year: "numeric"
    }) : "-";

    const formattedRegDate = data.createdAt ? new Date(data.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }) : data.regDate || "-";

    const handleEditClick = () => {
        if (onEdit) {
            onEdit(data);
        } else {
            setIsFormModalOpen(true);
        }
    };

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                title="Detail Registrasi Siswa" 
                size="lg"
            >
                {isLoading ? (
                    <div className="d-flex flex-column align-items-center justify-content-center py-5">
                        <IconLoader2 className="animate-spin text-primary mb-2" size={36} />
                        <span className="text-muted fw-medium">Memuat detail data siswa...</span>
                    </div>
                ) : (
                    <>
                        <div className="p-4 mb-4 rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" style={{ backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0" }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-3 bg-light d-flex align-items-center justify-content-center" style={{ width: "64px", height: "64px" }}>
                                    <IconUser size={32} className="text-muted" />
                                </div>
                                <div>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <h4 className="fw-bold m-0 text-dark" style={{ fontSize: "20px" }}>{displayName}</h4>
                                        <BadgeStatus status={data.status} />
                                    </div>
                                    <p className="text-secondary m-0" style={{ fontSize: "13px" }}>
                                        ID: <span className="fw-medium text-dark">{data.id || data._id}</span> • Terdaftar pada {formattedRegDate}
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <Button 
                                    variant="default"
                                    size="lg"
                                    onClick={handleEditClick}
                                >
                                    <IconPencil size={16} /> Edit Data
                                </Button>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                                    <IconUser size={18} className="text-primary" />
                                    <h6 className="fw-bold m-0" style={{ color: "#0F172A", fontSize: "14px" }}>Data Pribadi</h6>
                                </div>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <span className="text-muted d-block small mb-1">Tempat Lahir</span>
                                        <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{data.birthPlace || "-"}</span>
                                    </div>
                                    <div className="col-6">
                                        <span className="text-muted d-block small mb-1">Tanggal Lahir</span>
                                        <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{formattedBirthdate}</span>
                                    </div>
                                    <div className="col-6">
                                        <span className="text-muted d-block small mb-1">Jenis Kelamin</span>
                                        <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>
                                            {data.gender === "male" ? "Laki-laki" : data.gender === "female" ? "Perempuan" : data.gender || "-"}
                                        </span>
                                    </div>
                                    <div className="col-12">
                                        <span className="text-muted d-block small mb-1">Alamat</span>
                                        <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{data.address || "-"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                                    <IconSchool size={18} className="text-primary" />
                                    <h6 className="fw-bold m-0" style={{ color: "#0F172A", fontSize: "14px" }}>Data Akademik</h6>
                                </div>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <span className="text-muted d-block small mb-1">Target Jenjang / Kelas</span>
                                        <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>
                                            {data.class || data.grade ? `Kelas ${data.class || data.grade}` : "-"}
                                        </span>
                                    </div>
                                    <div className="col-12">
                                        <span className="text-muted d-block small mb-1">Tahun Ajaran</span>
                                        <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{data.schoolYear || "-"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                                    <IconUsers size={18} className="text-primary" />
                                    <h6 className="fw-bold m-0" style={{ color: "#0F172A", fontSize: "14px" }}>Data Orang Tua / Wali</h6>
                                </div>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <span className="text-muted d-block small mb-1">Nama Orang Tua</span>
                                        <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{data.parentName || "-"}</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="text-muted d-block small mb-1">Email Orang Tua</span>
                                        <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{data.emailParent || "-"}</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="text-muted d-block small mb-1">Nomor Telepon</span>
                                        <span className="fw-semibold text-primary" style={{ fontSize: "13px" }}>{data.phoneNumber || "-"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                                    <IconFileCheck size={18} className="text-primary" />
                                    <h6 className="fw-bold m-0" style={{ color: "#0F172A", fontSize: "14px" }}>Checklist Dokumen</h6>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    <div className="p-3 rounded-2 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                                        <div>
                                            <span className="fw-medium d-block text-dark" style={{ fontSize: "13px" }}>Kartu Keluarga (KK)</span>
                                            <small className="text-muted">{data.kk || "Belum diunggah"}</small>
                                        </div>
                                        <BadgeStatus status={data.kk ? "VERIFIED" : "PENDING"} showDot={false} style={{ fontSize: "10px" }} />
                                    </div>

                                    <div className="p-3 rounded-2 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                                        <div>
                                            <span className="fw-medium d-block text-dark" style={{ fontSize: "13px" }}>Akta Kelahiran</span>
                                            <small className="text-muted">{data.birthCertificate || "Belum diunggah"}</small>
                                        </div>
                                        <BadgeStatus status={data.birthCertificate ? "VERIFIED" : "PENDING"} showDot={false} style={{ fontSize: "10px" }} />
                                    </div>

                                    <div className="p-3 rounded-2 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                                        <div>
                                            <span className="fw-medium d-block text-dark" style={{ fontSize: "13px" }}>Pas Foto 3x4</span>
                                            <small className="text-muted">{data.photo || "Belum diunggah"}</small>
                                        </div>
                                        <BadgeStatus status={data.photo ? "VERIFIED" : "PENDING"} showDot={false} style={{ fontSize: "10px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Modal>

            <StudentForm
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                student={data}
                onSave={(updatedData) => {
                    setDetailData(updatedData);
                    if (onSaveSuccess) onSaveSuccess(updatedData);
                    setIsFormModalOpen(false);
                }}
            />
        </>
    );
}