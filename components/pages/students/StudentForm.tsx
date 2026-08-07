"use client";

import { useState, useEffect, useRef } from "react";
import { StudentData } from "./StudentTableList";
import { 
    IconUser, 
    IconSchool, 
    IconUsers, 
    IconFileText,
    IconEye,
    IconCheck,
    IconUpload,
    IconTrash,
    IconPhoneCall,
    IconBrandWhatsapp
} from "@tabler/icons-react";
import { Button } from "../../ui/Button"; 
import { Modal } from "../../ui/Modal";
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import { callApi } from "@/lib/api";
import { Toaster, toast } from "react-hot-toast";
import { Label } from "../../ui/Label";
import { Input } from "../../ui/Input";
import { Form } from "../../ui/Form";

interface StudentFormProps {
    isOpen: boolean;
    onClose: () => void;
    student?: StudentData | null;
    onSave?: (formData: any) => void;
}

interface DocumentItem {
    id: string;
    label: string;
    file: File | null;
    fileName?: string;
    fileData?: string;
    isUploaded: boolean;
}

interface ParentOption {
    id: string;
    parentName: string;
    email?: string;
    whatsapp?: string;
    schoolCode?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const rawBase64 = result.split(',')[1] || result;
            resolve(rawBase64);
        };
        reader.onerror = (error) => reject(error);
    });
};

export function StudentForm({ isOpen, onClose, student, onSave }: StudentFormProps) {
    const isEditMode = Boolean(student);
    const [parentsList, setParentsList] = useState<ParentOption[]>([]);
    const [isLoadingParents, setIsLoadingParents] = useState<boolean>(false);

    const initialFormState = {
        studentName: "",
        pob: "",
        dob: "",
        gender: "",
        address: "",
        parentId: "",
        isNewParent: false,
        parentName: "", 
        email: "",
        parentWhatsapp: "",
        phoneNumber: "",
        emergencyContact: "",
        schoolCode: "",
        grade: "",
        status: "PROCESS",
        schoolYear: "",
        kk: "",
        birthCertificate: "",
        photo: ""
    };

    const initialDocuments: DocumentItem[] = [
        { id: "kk", label: "Kartu Keluarga", file: null, isUploaded: false },
        { id: "birthCertificate", label: "Akta Kelahiran", file: null, isUploaded: false },
        { id: "photo", label: "Pas Foto 3x4", file: null, isUploaded: false },
    ];

    const [formData, setFormData] = useState(initialFormState);
    const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    useEffect(() => {
        const fetchParents = async () => {
            setIsLoadingParents(true);
            try {
                const response = await callApi("users?role=parent", { method: "GET" });
                if (Array.isArray(response)) {
                    const mappedParents: ParentOption[] = response.map((item: any) => ({
                        id: item.id || item._id,
                        parentName: item.fullName || item.name || "",
                        email: item.email || "",
                        whatsapp: item.phone || item.whatsapp || "",
                        schoolCode: item.schoolCode || ""
                    }));
                    setParentsList(mappedParents);
                }
            } catch (error) {
                console.error("Gagal mengambil daftar orang tua:", error);
                toast.error("Gagal memuat daftar orang tua.");
            } finally {
                setIsLoadingParents(false);
            }
        };

        if (isOpen) {
            fetchParents();

            if (isEditMode && student) {
                const formattedDob = student.birthdate ? student.birthdate.split("T")[0] : "";

                setFormData({
                    studentName: student.name || "",
                    pob: student.birthPlace || "",
                    dob: formattedDob,
                    gender: student.gender || "",
                    address: student.address || "",
                    parentId: (student as any).parentId || "",
                    isNewParent: false,
                    parentName: (student as any).parentName || "",
                    email: student.emailParent || (student as any).parentEmail || "",
                    parentWhatsapp: (student as any).parentWhatsapp || "",
                    phoneNumber: student.phoneNumber || "",
                    emergencyContact: (student as any).emergencyContact || student.phoneNumber || "",
                    schoolCode: (student as any).schoolCode || "",
                    grade: student.class || "",
                    status: student.status || "PROCESS",
                    schoolYear: (student as any).schoolYear || "",
                    kk: (student as any).kk || "",
                    birthCertificate: (student as any).birthCertificate || "",
                    photo: student.photo || ""
                });

                setDocuments([
                    {
                        id: "kk",
                        label: "Kartu Keluarga",
                        file: null,
                        fileName: (student as any).kk || undefined,
                        isUploaded: Boolean((student as any).kk)
                    },
                    {
                        id: "birthCertificate",
                        label: "Akta Kelahiran",
                        file: null,
                        fileName: (student as any).birthCertificate || undefined,
                        isUploaded: Boolean((student as any).birthCertificate)
                    },
                    {
                        id: "photo",
                        label: "Pas Foto 3x4",
                        file: null,
                        fileName: student.photo || undefined,
                        isUploaded: Boolean(student.photo)
                    }
                ]);
            } else {
                setFormData(initialFormState);
                setDocuments(initialDocuments);
            }
        }
    }, [isOpen, student, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "emergencyContact" || name === "parentWhatsapp" || name === "phoneNumber") {
            const numericValue = value.replace(/\D/g, "");
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        if (name === "parentId") {
            if (value === "new") {
                setFormData(prev => ({
                    ...prev,
                    parentId: "",
                    isNewParent: true,
                    parentName: "",
                    email: "",
                    parentWhatsapp: "",
                    schoolCode: ""
                }));
            } else {
                const selectedParent = parentsList.find(p => p.id === value);
                setFormData(prev => ({
                    ...prev,
                    parentId: value,
                    isNewParent: false,
                    parentName: selectedParent?.parentName || "",
                    email: selectedParent?.email || "",
                    parentWhatsapp: selectedParent?.whatsapp || "",
                    schoolCode: selectedParent?.schoolCode || prev.schoolCode
                }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBrowseClick = (docId: string) => {
        if (fileInputRefs.current[docId]) {
            fileInputRefs.current[docId]?.click();
        }
    };

    const handleFileChange = async (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64String = await fileToBase64(file);

                setDocuments(prev =>
                    prev.map(doc => {
                        if (doc.id === docId) {
                            return {
                                ...doc,
                                file: file,
                                fileName: file.name,
                                fileData: base64String,
                                isUploaded: true
                            };
                        }
                        return doc;
                    })
                );

                if (docId === "photo") setFormData(prev => ({ ...prev, photo: base64String }));
                if (docId === "birthCertificate") setFormData(prev => ({ ...prev, birthCertificate: base64String }));
                if (docId === "kk") setFormData(prev => ({ ...prev, kk: base64String }));
            } catch (err) {
                console.error("Gagal mengonversi file ke Base64:", err);
                toast.error("Gagal memproses file.");
            }
        }
    };

    const handleRemoveFile = (docId: string) => {
        setDocuments(prev =>
            prev.map(doc => {
                if (doc.id === docId) {
                    return {
                        ...doc,
                        file: null,
                        fileName: undefined,
                        isUploaded: false
                    };
                }
                return doc;
            })
        );
        if (fileInputRefs.current[docId]) {
            fileInputRefs.current[docId]!.value = "";
        }

        if (docId === "photo") setFormData(prev => ({ ...prev, photo: "" }));
        if (docId === "birthCertificate") setFormData(prev => ({ ...prev, birthCertificate: "" }));
        if (docId === "kk") setFormData(prev => ({ ...prev, kk: "" }));
    };

    const uploadedCount = documents.filter(doc => doc.isUploaded).length;
    const progressPercentage = Math.round((uploadedCount / documents.length) * 100);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            toast.error("Format email orang tua tidak valid!");
            return;
        }

        setIsSubmitting(true);

        try {
            const kkDoc = documents.find(d => d.id === "kk")?.fileData || formData.kk;
            const certDoc = documents.find(d => d.id === "birthCertificate")?.fileData || formData.birthCertificate;
            const photoDoc = documents.find(d => d.id === "photo")?.fileData || formData.photo;

            let response;
            const cleanPayload = {
                schoolCode: formData.schoolCode,
                name: formData.studentName,
                class: formData.grade,
                gender: formData.gender,
                status: formData.status,
                address: formData.address,
                birthPlace: formData.pob,
                birthdate: formData.dob ? new Date(formData.dob).toISOString() : "",
                parentId: formData.isNewParent ? "" : formData.parentId,
                parentEmail: formData.email,
                parentName: formData.parentName,
                phoneNumber: formData.parentWhatsapp || formData.phoneNumber,
                emergencyContact: formData.emergencyContact,
                schoolYear: formData.schoolYear,
                kk: kkDoc,
                birthCertificate: certDoc,
                photo: photoDoc
            };

            if (isEditMode && student) {
                const studentId = student.id || (student as any)._id;
                response = await callApi(`students/${studentId}`, {
                    method: "PUT",
                    body: cleanPayload
                });
            } else {
                response = await callApi("students", {
                    method: "POST",
                    body: cleanPayload
                });
            }

            if (onSave) onSave(response);
            onClose();
        } catch (error: any) {
            console.error("Gagal menyimpan data siswa:", error);

            const errMessage = Array.isArray(error?.message) 
                ? error.message.join(", ") 
                : (error?.message || "Terjadi kesalahan saat menyimpan data.");
            toast.error(errMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = {
        fontSize: "13px",
        color: "#0F172A",
        backgroundColor: "#FFFFFF",
        borderColor: "#E2E8F0"
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                title="" 
                size="xl"
            >
                <Form onSubmit={handleSubmit} className="p-1" style={{ backgroundColor: "#FAFBFD" }}>
                    <div className="mb-4 d-flex align-items-center gap-3">
                        <div 
                            className="rounded-4 p-1 bg-white shadow-sm d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ border: "2px solid #3B82F6", width: "64px", height: "64px" }}
                        >
                            <div className="rounded-3 w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                <IconUser size={20} className="text-muted" />
                            </div>
                        </div>

                        <div>
                            <h5 className="fw-bold mb-1" style={{ color: "#0F172A" }}>
                                {isEditMode ? (formData.studentName || "Edit Data Siswa") : "Pendaftaran Siswa Baru"}
                            </h5>

                            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-1 gap-sm-2">
                                <span 
                                    className="fw-bold text-break" 
                                    style={{ fontSize: "13px", color: "#1E3A8A", wordBreak: "break-word" }}
                                >
                                    {isEditMode ? (student?.id || "REGISTRASI") : "Registrasi Baru"}
                                </span>

                                <span className="text-muted d-none d-sm-inline">•</span>

                                <div>
                                    <BadgeStatus status={formData.status} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 px-2">
                        <div className="col-12 col-lg-8">
                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <IconUser size={18} style={{ color: "#1E3A8A" }} />
                                    <h6 className="fw-semibold m-0" style={{ color: "#1E293B", fontSize: "14px" }}>Data Pribadi</h6>
                                </div>
                                
                                <div className="bg-white p-4 rounded-4 border" style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>NAMA LENGKAP SISWA</Label>
                                            <Input 
                                                type="text" 
                                                name="studentName"
                                                value={formData.studentName}
                                                onChange={handleChange}
                                                placeholder="Masukkan nama lengkap siswa..."
                                                className="form-control form-control-sm rounded-3 shadow-none"
                                                style={inputStyle}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>TEMPAT LAHIR</Label>
                                            <Input 
                                                type="text" 
                                                name="pob" 
                                                placeholder="cth. Bandung"
                                                value={formData.pob} 
                                                onChange={handleChange} 
                                                className="form-control form-control-sm rounded-3 shadow-none" 
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>TANGGAL LAHIR</Label>
                                            <Input 
                                                type="date" 
                                                name="dob" 
                                                value={formData.dob} 
                                                onChange={handleChange} 
                                                className="form-control form-control-sm rounded-3 shadow-none" 
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>JENIS KELAMIN</Label>
                                            <select 
                                                name="gender" 
                                                value={formData.gender} 
                                                onChange={handleChange} 
                                                className="form-select form-select-sm rounded-3 shadow-none cursor-pointer" 
                                                style={inputStyle}
                                            >
                                                <option value="" disabled>Pilih Jenis Kelamin</option>
                                                <option value="male">Laki-laki</option>
                                                <option value="female">Perempuan</option>
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>ALAMAT RUMAH</Label>
                                            <textarea 
                                                name="address" 
                                                rows={2}
                                                placeholder="Masukkan alamat rumah lengkap..."
                                                value={formData.address} 
                                                onChange={handleChange} 
                                                className="form-control form-control-sm rounded-3 shadow-none" 
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <IconUsers size={18} style={{ color: "#1E3A8A" }} />
                                    <h6 className="fw-semibold m-0" style={{ color: "#1E293B", fontSize: "14px" }}>Data Orang Tua / Wali</h6>
                                </div>

                                <div className="bg-white p-4 rounded-4 border" style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>PILIH ORANG TUA / WALI</Label>
                                            <select 
                                                name="parentId" 
                                                value={formData.isNewParent ? "new" : formData.parentId} 
                                                onChange={handleChange} 
                                                className="form-select form-select-sm rounded-3 shadow-none cursor-pointer" 
                                                style={inputStyle}
                                                disabled={isLoadingParents}
                                            >
                                                <option value="" disabled>
                                                    {isLoadingParents ? "Memuat data orang tua..." : "-- Pilih Orang Tua / Wali --"}
                                                </option>
                                                {parentsList.map((parent) => (
                                                    <option key={parent.id} value={parent.id}>
                                                        {parent.parentName} {parent.whatsapp ? `(${parent.whatsapp})` : ''}
                                                    </option>
                                                ))}
                                                <option value="new" className="fw-bold text-primary">+ Tambah Orang Tua Baru Manual</option>
                                            </select>
                                        </div>

                                        {formData.isNewParent && (
                                            <>
                                                <div className="col-12">
                                                    <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>NAMA ORANG TUA / WALI</Label>
                                                    <Input 
                                                        type="text" 
                                                        name="parentName" 
                                                        placeholder="Masukkan Nama Orang Tua / Wali"
                                                        value={formData.parentName} 
                                                        onChange={handleChange} 
                                                        className="form-control form-control-sm rounded-3 shadow-none" 
                                                        style={inputStyle}
                                                        required={formData.isNewParent}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>EMAIL ORANG TUA</Label>
                                                    <Input 
                                                        type="email" 
                                                        name="email" 
                                                        placeholder="parent@example.com"
                                                        value={formData.email} 
                                                        onChange={handleChange} 
                                                        className="form-control form-control-sm rounded-3 shadow-none" 
                                                        style={inputStyle}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>NO. WHATSAPP ORANG TUA</Label>
                                                    <Input 
                                                        type="tel" 
                                                        name="parentWhatsapp" 
                                                        placeholder="081234567890"
                                                        value={formData.parentWhatsapp} 
                                                        onChange={handleChange} 
                                                        maxLength={14}
                                                        inputMode="numeric"
                                                        className="form-control form-control-sm rounded-3 shadow-none" 
                                                        style={inputStyle}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {!formData.isNewParent && formData.parentId && (
                                            <div className="col-12 mt-3">
                                                <div className="p-3 rounded-3 border" style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}>
                                                    <div className="row g-3">
                                                        <div className="col-12 col-md-4">
                                                            <div className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
                                                                Nama
                                                            </div>
                                                            <div className="fw-semibold text-dark" style={{ fontSize: "13px" }}>
                                                                {formData.parentName || "-"}
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-4">
                                                            <div className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
                                                                Email
                                                            </div>
                                                            <div className="d-flex align-items-center gap-1 text-dark" style={{ fontSize: "13px" }}>
                                                                <span className="text-truncate" title={formData.email}>
                                                                    {formData.email || "-"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-4">
                                                            <div className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
                                                                No. Whatsapp
                                                            </div>
                                                            <div className="d-flex align-items-center gap-1 text-dark" style={{ fontSize: "13px" }}>
                                                                <IconBrandWhatsapp size={14} className="text-success flex-shrink-0" />
                                                                <span>{formData.parentWhatsapp || "-"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <IconPhoneCall size={18} style={{ color: "#1E3A8A" }} />
                                    <h6 className="fw-semibold m-0" style={{ color: "#1E293B", fontSize: "14px" }}>Kontak Darurat</h6>
                                </div>

                                <div className="bg-white p-4 rounded-4 border" style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>KONTAK DARURAT</Label>
                                            <Input 
                                                type="tel" 
                                                name="emergencyContact" 
                                                placeholder="Masukkan Kontak Darurat"
                                                value={formData.emergencyContact} 
                                                onChange={handleChange} 
                                                maxLength={14}
                                                inputMode="numeric"
                                                className="form-control form-control-sm rounded-3 shadow-none" 
                                                style={inputStyle}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <IconSchool size={18} style={{ color: "#1E3A8A" }} />
                                    <h6 className="fw-semibold m-0" style={{ color: "#1E293B", fontSize: "14px" }}>Data Akademik</h6>
                                </div>

                                <div className="bg-white p-4 rounded-4 border" style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>KELAS (CLASS)</Label>
                                            <Input 
                                                type="text" 
                                                name="grade" 
                                                placeholder="Masukkan Kelas"
                                                value={formData.grade} 
                                                onChange={handleChange} 
                                                className="form-control form-control-sm rounded-3 shadow-none" 
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <Label className="text-uppercase text-muted fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>TAHUN AJARAN</Label>
                                            <Input 
                                                type="text" 
                                                name="schoolYear" 
                                                placeholder="Masukkan Tahun Ajaran"
                                                value={formData.schoolYear} 
                                                onChange={handleChange} 
                                                className="form-control form-control-sm rounded-3 shadow-none" 
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="p-4 rounded-4" style={{ backgroundColor: "#EEF2F6" }}>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <IconFileText size={18} style={{ color: "#1E3A8A" }} />
                                    <h6 className="fw-semibold m-0" style={{ color: "#1E293B", fontSize: "14px" }}>Checklist Dokumen</h6>
                                </div>

                                <div className="d-flex flex-column gap-3 mb-4">
                                    {documents.map((doc) => (
                                        <div key={doc.id} className="p-3 bg-white rounded-4 d-flex flex-column gap-1 shadow-sm">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div 
                                                        className="rounded-circle d-flex align-items-center justify-content-center" 
                                                        style={{ 
                                                            width: "20px", 
                                                            height: "20px", 
                                                            backgroundColor: doc.isUploaded ? "#22C55E" : "#94A3B8", 
                                                            color: "#FFF" 
                                                        }}
                                                    >
                                                        <IconCheck size={14} stroke={3} />
                                                    </div>
                                                    <span className="fw-medium" style={{ fontSize: "13px", color: "#1E293B" }}>{doc.label}</span>
                                                </div>

                                                <div className="d-flex align-items-center gap-1">
                                                    <input 
                                                        type="file"
                                                        ref={(el) => { fileInputRefs.current[doc.id] = el; }}
                                                        onChange={(e) => handleFileChange(doc.id, e)}
                                                        className="d-none"
                                                        accept=".pdf,.png,.jpg,.jpeg"
                                                    />

                                                    {doc.isUploaded ? (
                                                        <div className="d-flex align-items-center gap-1">
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-link p-0 text-muted" 
                                                                title="Lihat Dokumen"
                                                            >
                                                                <IconEye size={18} />
                                                            </button>
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-link p-0 text-danger ms-1" 
                                                                title="Hapus Dokumen"
                                                                onClick={() => handleRemoveFile(doc.id)}
                                                            >
                                                                <IconTrash size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleBrowseClick(doc.id)}
                                                            className="badge bg-light text-primary border d-flex align-items-center gap-1 cursor-pointer border-primary-subtle" 
                                                            style={{ fontSize: "10px", padding: "5px 8px", borderRadius: "6px" }}
                                                        >
                                                            <IconUpload size={12} /> Upload
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {doc.fileName && (
                                                <div className="text-truncate text-muted mt-1 ps-4" style={{ fontSize: "11px" }}>
                                                    📄 {doc.fileName}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-2">
                                    <span className="text-secondary fw-medium d-block mb-2" style={{ fontSize: "13px" }}>Progres Kelengkapan</span>
                                    <div className="progress rounded-pill mb-2" style={{ height: "8px", backgroundColor: "#CBD5E1" }}>
                                        <div 
                                            className="progress-bar rounded-pill" 
                                            role="progressbar" 
                                            style={{ 
                                                width: `${progressPercentage}%`, 
                                                backgroundColor: progressPercentage === 100 ? "#22C55E" : "#0F172A",
                                                transition: "width 0.3s ease" 
                                            }} 
                                        />
                                    </div>
                                    <div className="text-end fw-bold" style={{ fontSize: "13px", color: "#0F172A" }}>
                                        {progressPercentage}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-3 mt-4 border-top bg-white px-3 py-3 rounded-bottom-4">
                        <Button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isSubmitting}
                            variant="outline" 
                            size="lg"
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            variant="default"
                            size="lg"
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
}