"use client";

import { useState } from "react";
import { StudentData } from "../../../components/pages/students/StudentTableList";
import { 
    IconPrinter, 
    IconPencil, 
    IconUser, 
    IconSchool, 
    IconUsers, 
    IconFileCheck 
} from "@tabler/icons-react";
import { Button } from "../../../components/ui/Button"; 
import { Modal } from "../../../components/ui/Modal";
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import { StudentForm } from "./StudentForm";

interface StudentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: StudentData | null;
    onEdit?: (student: StudentData) => void;
    onSaveSuccess?: (updatedData: any) => void;
}

export function StudentDetailModal({ isOpen, onClose, student, onEdit, onSaveSuccess }: StudentDetailModalProps) {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    if (!student) return null;

    const initials = student.initials || student.studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    const handleEditClick = () => {
        if (onEdit) {
            onEdit(student);
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
                <div className="p-4 mb-4 rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" style={{ backgroundColor: "#EEF2FF", border: "1px solid #E0E7FF" }}>
                    <div className="d-flex align-items-center gap-3">
                        {student.avatarUrl ? (
                            <img src={student.avatarUrl} alt={student.studentName} className="rounded-3" style={{ width: "64px", height: "64px", objectFit: "cover" }} />
                        ) : (
                            <div className="rounded-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: "64px", height: "64px", backgroundColor: "#C7D2FE", color: "#3730A3", fontSize: "20px" }}>
                                {initials}
                            </div>
                        )}
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h4 className="fw-bold m-0 text-dark" style={{ fontSize: "20px" }}>{student.studentName}</h4>
                                <BadgeStatus status={student.status} />
                            </div>
                            <p className="text-secondary m-0" style={{ fontSize: "13px" }}>
                                ID: {student.regId || student.id} • Terdaftar pada {student.regDate}
                            </p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="link" className="btn-light bg-white border text-dark fw-medium px-3 py-2 rounded-2 d-flex align-items-center gap-1.5 text-decoration-none shadow-sm" style={{ fontSize: "13px" }}>
                            <IconPrinter size={16} /> Print Summary
                        </Button>
                        <Button 
                            className="btn-primary fw-medium px-3 py-2 rounded-2 d-flex align-items-center gap-1.5 shadow-sm" 
                            style={{ backgroundColor: "#0F172A", borderColor: "#0F172A", fontSize: "13px" }}
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
                                <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>Jakarta</span>
                            </div>
                            <div className="col-6">
                                <span className="text-muted d-block small mb-1">Tanggal Lahir</span>
                                <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>15 Mei 2008</span>
                            </div>
                            <div className="col-6">
                                <span className="text-muted d-block small mb-1">Jenis Kelamin</span>
                                <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>Laki-laki</span>
                            </div>
                            <div className="col-6">
                                <span className="text-muted d-block small mb-1">Agama</span>
                                <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>Islam</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                            <IconUsers size={18} className="text-primary" />
                            <h6 className="fw-bold m-0" style={{ color: "#0F172A", fontSize: "14px" }}>Data Orang Tua / Wali</h6>
                        </div>
                        <div className="row g-3">
                            <div className="col-12">
                                <span className="text-muted d-block small mb-1">Nama Ayah</span>
                                <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>Bambang Maulana</span>
                            </div>
                            <div className="col-12">
                                <span className="text-muted d-block small mb-1">Nama Ibu</span>
                                <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>Siti Aminah</span>
                            </div>
                            <div className="col-12">
                                <span className="text-muted d-block small mb-1">Nomor Telepon Darurat</span>
                                <span className="fw-semibold text-primary" style={{ fontSize: "13px" }}>+62 812-3456-7890</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                            <IconFileCheck size={18} className="text-primary" />
                            <h6 className="fw-bold m-0" style={{ color: "#0F172A", fontSize: "14px" }}>Checklist Dokumen</h6>
                        </div>
                        <div className="d-flex flex-column gap-2">
                            <div className="p-2.5 rounded-2 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#F1F5F9" }}>
                                <span className="fw-medium text-dark" style={{ fontSize: "13px" }}>Kartu Keluarga (KK)</span>
                                <BadgeStatus status="VERIFIED" showDot={false} style={{ fontSize: "10px" }} />
                            </div>
                            <div className="p-2.5 rounded-2 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#F1F5F9" }}>
                                <span className="fw-medium text-dark" style={{ fontSize: "13px" }}>Akta Kelahiran</span>
                                <BadgeStatus status="VERIFIED" showDot={false} style={{ fontSize: "10px" }} />
                            </div>
                            <div className="p-2.5 rounded-2 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#F1F5F9" }}>
                                <span className="fw-medium text-dark" style={{ fontSize: "13px" }}>Ijazah Terakhir / SKL</span>
                                <BadgeStatus status="PENDING" showDot={false} style={{ fontSize: "10px" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <StudentForm
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                student={student}
                onSave={(updatedData) => {
                    if (onSaveSuccess) onSaveSuccess(updatedData);
                    setIsFormModalOpen(false);
                }}
            />
        </>
    );
}