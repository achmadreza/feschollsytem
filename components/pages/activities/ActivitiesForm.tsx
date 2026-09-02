"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { 
    IconUpload, 
    IconInfoCircle, 
    IconCircleCheck,
    IconTrash
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { Button } from "../../../components/ui/Button"; 
import { callApi } from "@/lib/api";

interface ActivitiesFormProps {
    onBack?: () => void;
    onNext?: () => void;
}

export function ActivitiesForm({ onBack, onNext }: ActivitiesFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fileBase64, setFileBase64] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Fungsi helper untuk mereset seluruh isi form
    const resetForm = () => {
        setTitle("");
        setDescription("");
        removeFile();
    };

    const handleFileChange = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("File harus berupa gambar!");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const rawBase64 = reader.result as string;
            setPreviewUrl(rawBase64);
            const truncatedBase64 = rawBase64.substring(0, 50);
            setFileBase64(truncatedBase64);
            
            setFileName(file.name);
            toast.success("Gambar berhasil diproses");
        };
        reader.onerror = () => {
            toast.error("Gagal membaca file");
        };
    };

    const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const removeFile = () => {
        setFileBase64("");
        setPreviewUrl("");
        setFileName("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Judul kegiatan wajib diisi!");
            return;
        }

        setIsLoading(true);

        const payload = {
            title: title,
            file: fileBase64,
            description: description
        };

        try {
            await callApi("/media", {
                method: "POST",
                body: payload
            });

            toast.success("Data berhasil dikirim!");
            resetForm();

            if (onNext) onNext();
        } catch (error: any) {
            toast.error(error?.message || "Gagal mengirim data ke API");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-xl py-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
            <div className="row g-4">
                <div className="col-12 col-lg-8 d-flex flex-column gap-4">
                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
                        <label className="form-label fw-semibold text-dark mb-2" style={{ fontSize: "14px" }}>
                            Judul Kegiatan
                        </label>
                        <input 
                            type="text" 
                            className="form-control px-3 py-2.5" 
                            style={{ 
                                borderRadius: "10px", 
                                borderColor: "#CBD5E1",
                                fontSize: "14px",
                                color: "#1E293B"
                            }} 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Masukkan judul kegiatan..."
                        />
                    </div>

                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
                        <label className="form-label fw-semibold text-dark mb-2" style={{ fontSize: "14px" }}>
                            Deskripsi Kegiatan
                        </label>
                        <textarea 
                            className="form-control px-3 py-2.5" 
                            rows={4}
                            style={{ 
                                borderRadius: "10px", 
                                borderColor: "#CBD5E1",
                                fontSize: "14px",
                                color: "#334155",
                                lineHeight: "1.6"
                            }} 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Masukkan deskripsi kegiatan..."
                        />
                    </div>

                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
                        <label className="form-label fw-semibold text-dark mb-3" style={{ fontSize: "14px" }}>
                            Media & Dokumentasi
                        </label>
                        
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={onFileInputChange} 
                            accept="image/*" 
                            className="d-none" 
                        />

                        {!previewUrl ? (
                            <div 
                                className="d-flex flex-column align-items-center justify-content-center p-4 text-center"
                                style={{ 
                                    backgroundColor: "#F5F3FF", 
                                    border: "1.5px dashed #A5B4FC", 
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    minHeight: "160px"
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                                    style={{ width: "44px", height: "44px", backgroundColor: "#E0E7FF" }}
                                >
                                    <IconUpload size={22} className="text-primary" />
                                </div>
                                <p className="mb-0 text-dark fw-medium" style={{ fontSize: "14px" }}>
                                    Tarik dan lepas foto di sini
                                </p>
                                <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>
                                    atau <span className="fw-semibold" style={{ color: "#6366F1" }}>pilih file</span> dari komputer Anda
                                </p>
                            </div>
                        ) : (
                            <div 
                                className="d-flex align-items-center justify-content-between p-3"
                                style={{ 
                                    backgroundColor: "#F1F5F9", 
                                    borderRadius: "12px",
                                    border: "1px solid #E2E8F0"
                                }}
                            >
                                <div className="d-flex align-items-center gap-3 overflow-hidden">
                                    <img 
                                        src={previewUrl} 
                                        alt={fileName} 
                                        style={{ 
                                            width: "56px", 
                                            height: "56px", 
                                            objectFit: "cover", 
                                            borderRadius: "8px" 
                                        }} 
                                    />
                                    <div className="text-truncate">
                                        <p className="mb-0 fw-medium text-dark text-truncate" style={{ fontSize: "14px" }}>
                                            {fileName}
                                        </p>
                                        <span className="text-muted" style={{ fontSize: "11px" }}>
                                            Base64 (Maks 50 char): <code className="text-break">{fileBase64}</code>
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-sm text-danger border-0 ms-2"
                                    onClick={removeFile}
                                >
                                    <IconTrash size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                    <div 
                        className="card border-0 p-4 text-white shadow-sm"
                        style={{ 
                            backgroundColor: "#061A40", 
                            borderRadius: "16px" 
                        }}
                    >
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <IconInfoCircle size={20} className="text-white opacity-75" />
                            <h6 className="mb-0 fw-semibold" style={{ fontSize: "15px" }}>
                                Panduan Dokumentasi
                            </h6>
                        </div>

                        <ul className="list-unstyled d-flex flex-column gap-3 mb-0" style={{ fontSize: "13px", color: "#CBD5E1" }}>
                            <li className="d-flex align-items-start gap-2.5">
                                <IconCircleCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
                                <span>Minimal upload 3 foto kegiatan per hari untuk transparansi ke orang tua.</span>
                            </li>
                            <li className="d-flex align-items-start gap-2.5">
                                <IconCircleCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
                                <span>Maksimal ukuran file adalah 5MB per gambar atau video.</span>
                            </li>
                            <li className="d-flex align-items-start gap-2.5">
                                <IconCircleCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
                                <span>Gunakan pencahayaan yang cukup agar wajah anak terlihat ceria dan jelas.</span>
                            </li>
                        </ul>
                    </div>

                    <div 
                        className="card border-0 p-4 shadow-sm"
                        style={{ 
                            backgroundColor: "#F3E8FF", 
                            borderRadius: "16px",
                            border: "1px solid #E9D5FF" 
                        }}
                    >
                        <h6 className="fw-semibold mb-2" style={{ color: "#7E22CE", fontSize: "14px" }}>
                            Tips Fotografi
                        </h6>
                        <p className="mb-0" style={{ color: "#581C87", fontSize: "13px", lineHeight: "1.6" }}>
                            Ambil foto &quot;candid&quot; saat anak sedang serius belajar atau tertawa bersama teman untuk memberikan kesan yang lebih autentik kepada orang tua.
                        </p>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mt-4 p-3" style={{ borderRadius: "16px" }}>
                <div className="d-flex align-items-center justify-content-between">
                    {onBack && (
                        <Button 
                            type="button"
                            onClick={onBack}
                            style={{ borderRadius: "10px", padding: "10px 24px", fontSize: "14px" }}
                            className="btn btn-outline-secondary"
                        >
                            Kembali
                        </Button>
                    )}
                    <Button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{ 
                            backgroundColor: "#061A40", 
                            borderColor: "#061A40", 
                            borderRadius: "10px",
                            padding: "10px 24px",
                            fontSize: "14px",
                            fontWeight: 500
                        }}
                        className="d-flex align-items-center gap-2 text-white ms-auto"
                    >
                        <span>{isLoading ? "Mengirim..." : "Submit"}</span>
                    </Button>
                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
}