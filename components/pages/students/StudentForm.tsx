"use client";

import { useState, useEffect } from "react";
import { StudentData } from "./StudentTableList";
import { 
    IconUser, 
    IconSchool, 
    IconUsers, 
    IconShieldCheck,
    IconFileText,
    IconUpload,
    IconReceipt,
    IconPlus,
    IconPencil
} from "@tabler/icons-react";
import { Button } from "../../ui/Button"; 
import { Modal } from "../../ui/Modal";
import { BadgeStatus } from "../../ui/BadgeStatus";

interface StudentFormProps {
    isOpen: boolean;
    onClose: () => void;
    student?: StudentData | null;
    onSave?: (formData: any) => void;
}

export function StudentForm({ isOpen, onClose, student, onSave }: StudentFormProps) {
    const isEditMode = Boolean(student);

    const initialFormState = {
        studentName: "",
        pob: "",
        dob: "",
        gender: "Laki-laki",
        address: "",
        email: "",
        nik: "",
        religion: "",
        fatherName: "",
        fatherJob: "",
        fatherPhone: "",
        motherName: "",
        motherJob: "",
        motherPhone: "",
        emergencyContact: "",
        grade: "",
        prevSchool: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && student) {
                setFormData({
                    studentName: student.studentName || "",
                    pob: "Jakarta",
                    dob: "2008-05-12",
                    gender: "Laki-laki",
                    address: "Jl. Kemang Raya No. 45, Bangka, Jakarta Selatan",
                    email: "budi.kusuma@student.sch.id",
                    nik: "3174001205080003",
                    religion: "Islam",
                    fatherName: "Bambang Kusuma",
                    fatherJob: "Wiraswasta",
                    fatherPhone: "0812-xxxx-xxxx",
                    motherName: "Siti Aminah",
                    motherJob: "Ibu Rumah Tangga",
                    motherPhone: "0813-xxxx-xxxx",
                    emergencyContact: "0812-9988-7766",
                    grade: student.grade || "",
                    prevSchool: "SMP Nusantara Jaya / Kelas 9-B"
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, student, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = isEditMode ? { ...student, ...formData } : {
            _id: Date.now().toString(),
            id: `REG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            regId: `REG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            regDate: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
            status: "Proses",
            ...formData
        };

        if (onSave) onSave(payload);
        onClose();
    };

    const initials = formData.studentName 
        ? formData.studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() 
        : "NEW";

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="" 
            size="xl"
        >
            <form onSubmit={handleSubmit} className="p-2">
                <div className="p-3 mb-4 rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" style={{ backgroundColor: "#EEF2FF" }}>
                    <div className="d-flex align-items-center gap-3">
                        {isEditMode && student?.avatarUrl ? (
                            <img src={student.avatarUrl} alt={formData.studentName} className="rounded-3" style={{ width: "52px", height: "52px", objectFit: "cover" }} />
                        ) : (
                            <div className="rounded-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: "52px", height: "52px", backgroundColor: "#C7D2FE", color: "#3730A3", fontSize: "18px" }}>
                                {initials}
                            </div>
                        )}
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <input 
                                    type="text" 
                                    name="studentName"
                                    placeholder="Masukkan Nama Lengkap Siswa..."
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    className="form-control form-control-sm fw-bold border-0 bg-white"
                                    style={{ fontSize: "16px", color: "#0F172A" }}
                                    required
                                />
                            </div>
                            <p className="text-secondary m-0 ps-1" style={{ fontSize: "12px" }}>
                                ID: {isEditMode ? (student?.regId || student?.id) : "Auto Generated • Registrasi Baru"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <IconUser size={18} className="text-primary" />
                                <h6 className="fw-bold m-0" style={{ color: "#0F172A", fontSize: "14px" }}>Data Pribadi</h6>
                            </div>
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Tempat Lahir</label>
                                        <input type="text" name="pob" placeholder="cth. Jakarta" value={formData.pob} onChange={handleChange} className="form-control form-control-sm bg-white" style={{ fontSize: "12px" }} />
                                    </div>
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Tanggal Lahir</label>
                                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control form-control-sm bg-white" style={{ fontSize: "12px" }} />
                                    </div>
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Jenis Kelamin</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="form-select form-select-sm bg-white" style={{ fontSize: "12px" }}>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Agama</label>
                                        <select name="religion" value={formData.religion} onChange={handleChange} className="form-select form-select-sm bg-white" style={{ fontSize: "12px" }}>
                                            <option value="Islam">Islam</option>
                                            <option value="Kristen">Kristen</option>
                                            <option value="Katholik">Katholik</option>
                                            <option value="Buddha">Buddha</option>
                                            <option value="Hindu">Hindu</option>
                                            <option value="Konghucu">Konghucu</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Alamat Rumah</label>
                                        <textarea name="address" rows={2} placeholder="Masukkan alamat lengkap..." value={formData.address} onChange={handleChange} className="form-control form-control-sm bg-white" style={{ fontSize: "12px" }} />
                                    </div>
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Email Kontak</label>
                                        <input type="email" name="email" placeholder="email@domain.com" value={formData.email} onChange={handleChange} className="form-control form-control-sm bg-white mb-2" style={{ fontSize: "12px" }} />
                                    </div>
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>NIK / No. Identitas</label>
                                        <input type="text" name="nik" placeholder="317..." value={formData.nik} onChange={handleChange} className="form-control form-control-sm bg-white" style={{ fontSize: "12px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <IconUsers size={18} className="text-primary" />
                                <h6 className="fw-bold m-0" style={{ color: "#0F172A", fontSize: "14px" }}>Data Orang Tua / Wali</h6>
                            </div>
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Nama Ayah</label>
                                        <input type="text" name="fatherName" placeholder="Nama Ayah Kandung" value={formData.fatherName} onChange={handleChange} className="form-control form-control-sm bg-white mb-2" style={{ fontSize: "12px" }} />
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <input type="text" name="fatherJob" placeholder="Pekerjaan" value={formData.fatherJob} onChange={handleChange} className="form-control form-control-sm bg-white" style={{ fontSize: "11px" }} />
                                            </div>
                                            <div className="col-6">
                                                <input type="text" name="fatherPhone" placeholder="No. Telp" value={formData.fatherPhone} onChange={handleChange} className="form-control form-control-sm bg-white" style={{ fontSize: "11px" }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Nama Ibu</label>
                                        <input type="text" name="motherName" placeholder="Nama Ibu Kandung" value={formData.motherName} onChange={handleChange} className="form-control form-control-sm bg-white mb-2" style={{ fontSize: "12px" }} />
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <input type="text" name="motherJob" placeholder="Pekerjaan" value={formData.motherJob} onChange={handleChange} className="form-control form-control-sm bg-white" style={{ fontSize: "11px" }} />
                                            </div>
                                            <div className="col-6">
                                                <input type="text" name="motherPhone" placeholder="No. Telp" value={formData.motherPhone} onChange={handleChange} className="form-control form-control-sm bg-white" style={{ fontSize: "11px" }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Pekerjaan Wali</label>
                                        <input type="text" placeholder="Sesuai Orang Tua Kandung" className="form-control form-control-sm bg-white" style={{ fontSize: "12px" }} />
                                    </div>
                                    <div className="col-6">
                                        <label className="text-uppercase text-secondary fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Kontak Darurat</label>
                                        <input type="text" name="emergencyContact" placeholder="0812-xxxx-xxxx" value={formData.emergencyContact} onChange={handleChange} className="form-control form-control-sm bg-white" style={{ fontSize: "12px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: "#F1F5F9" }}>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <IconFileText size={18} className="text-primary" />
                                <h6 className="fw-bold m-0" style={{ color: "#0F172A", fontSize: "14px" }}>Checklist Dokumen</h6>
                            </div>

                            <div className="d-flex flex-column gap-2 mb-3">
                                {[
                                    { label: "Ijazah Terakhir", status: isEditMode ? "ok" : "upload" },
                                    { label: "Kartu Keluarga", status: isEditMode ? "ok" : "upload" },
                                    { label: "Akta Kelahiran", status: isEditMode ? "ok" : "upload" },
                                    { label: "Laporan Kesehatan", status: "upload" },
                                    { label: "Pas Foto 3x4", status: isEditMode ? "ok" : "upload" },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-2 bg-white rounded-2 d-flex align-items-center justify-content-between shadow-sm" style={{ fontSize: "12px" }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`badge rounded-circle p-1 ${item.status === 'ok' ? 'bg-success' : 'bg-secondary'}`}>✓</span>
                                            <span className={item.status === 'upload' ? 'text-danger fw-semibold' : 'fw-medium text-dark'}>{item.label}</span>
                                        </div>
                                        <span className="badge bg-light text-danger border border-danger-subtle d-flex align-items-center gap-1" style={{ fontSize: "9px" }}>
                                            <IconUpload size={10} /> UPLOAD
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 pt-3 mt-4 border-top">
                    <Button type="button" onClick={onClose} className="btn-light border px-4 py-2 rounded-2 fw-medium" style={{ fontSize: "13px" }}>
                        Batal
                    </Button>
                    <Button type="submit" className="btn-primary px-4 py-2 rounded-2 fw-medium" style={{ backgroundColor: isEditMode ? "#0F172A" : "#0F2C59", borderColor: isEditMode ? "#0F172A" : "#0F2C59", fontSize: "13px" }}>
                        {isEditMode ? "Simpan Perubahan" : "Simpan Registrasi Baru"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}