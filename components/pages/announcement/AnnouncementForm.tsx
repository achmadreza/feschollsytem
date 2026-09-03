"use client";

import { useState, useRef } from "react";
import {  
    IconPlus, 
    IconPaperclip, 
    IconPhoto, 
    IconVolume, 
    IconUsers, 
    IconX,
    IconCheck,
    IconFileText,
    IconTrash
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { Button } from "../../../components/ui/Button";
import { callApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AnnouncementFormProps {
    onBack?: () => void;
    onSaveDraft?: () => void;
    onPublish?: () => void;
}

interface ImageFile {
    file: File;
    previewUrl: string;
}

export function AnnouncementForm({ onBack, onSaveDraft, onPublish }: AnnouncementFormProps) {
    const [sendAnnouncement, setSendAnnouncement] = useState(true);
    const [targets, setTargets] = useState<string[]>(["orangtua"]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const [isAddingTarget, setIsAddingTarget] = useState(false);
    const [newTargetInput, setNewTargetInput] = useState("");
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [attachedImages, setAttachedImages] = useState<ImageFile[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const maxLength = 500;
    const router = useRouter();

    const fileToBase64Truncated = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                const base64Pure = result.split(',')[1] || result;
                resolve(base64Pure.substring(0, 50));
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const clearForm = () => {
        setSendAnnouncement(true);
        setTargets(["orangtua"]);
        setTitle("");
        setContent("");
        setAttachedFiles([]);
        attachedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        setAttachedImages([]);
        setIsAddingTarget(false);
        setNewTargetInput("");
    };

    const toSnakeCase = (str: string) => {
        return str
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s_]/g, '')
            .replace(/\s+/g, '_');
    };

    const handleRemoveTarget = (indexToRemove: number) => {
        setTargets(targets.filter((_, index) => index !== indexToRemove));
    };

    const handleConfirmAddTarget = () => {
        if (!newTargetInput.trim()) {
            setIsAddingTarget(false);
            return;
        }

        const formattedTarget = toSnakeCase(newTargetInput);
        
        if (targets.includes(formattedTarget)) {
            toast.error("Target sudah ada dalam daftar!");
            return;
        }

        setTargets([...targets, formattedTarget]);
        setNewTargetInput("");
        setIsAddingTarget(false);
    };

    const handleKeyDownTarget = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleConfirmAddTarget();
        } else if (e.key === "Escape") {
            setIsAddingTarget(false);
            setNewTargetInput("");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            setAttachedFiles((prev) => [...prev, ...newFiles]);
            toast.success(`${newFiles.length} file berhasil ditambahkan`);
        }
        e.target.value = "";
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages: ImageFile[] = Array.from(files).map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
            }));
            setAttachedImages((prev) => [...prev, ...newImages]);
            toast.success(`${newImages.length} gambar berhasil ditambahkan`);
        }
        e.target.value = "";
    };

    const handleRemoveFile = (index: number) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveImage = (index: number) => {
        setAttachedImages((prev) => {
            URL.revokeObjectURL(prev[index].previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    };

    const submitData = async (status: "DRAFT" | "PUBLISHED") => {
        if (!title.trim()) {
            toast.error("Judul pengumuman harus diisi!");
            return;
        }

        setLoading(true);
        try {
            let fileBase64 = "";
            if (attachedFiles.length > 0) {
                fileBase64 = await fileToBase64Truncated(attachedFiles[0]);
            }

            let photoBase64 = "";
            if (attachedImages.length > 0) {
                photoBase64 = await fileToBase64Truncated(attachedImages[0].file);
            }

            const payload = {
                target: targets.join(", "),
                status: status,
                title: title,
                message: content,
                file: fileBase64,
                photo: photoBase64
            };

            await callApi("/journals", {
                method: "POST",
                body: payload,
            });

            toast.success(
                status === "DRAFT" 
                    ? "Draft pengumuman berhasil disimpan!" 
                    : "Pengumuman berhasil dipublikasikan!"
            );
            
            clearForm();

            if (status === "DRAFT" && onSaveDraft) onSaveDraft();
            if (status === "PUBLISHED" && onPublish) onPublish();
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error?.message || "Gagal mengirim data. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = () => {
        submitData("DRAFT");
    };

    const handlePublish = () => {
        submitData("PUBLISHED");
    };

    return (
        <div className="container-fluid" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
            <div className="row g-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm p-4">
                        <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
                            <div className="d-flex align-items-center gap-2" style={{ color: "#1E293B" }}>
                                <IconVolume size={24} className="text-primary" />
                                <h5 className="mb-0 fw-semibold" style={{ fontSize: "16px" }}>
                                    Buat Pengumuman Hari Ini
                                </h5>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <div className="form-check form-switch m-0 d-flex align-items-center gap-2">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        role="switch"
                                        id="sendAnnouncementSwitch"
                                        checked={sendAnnouncement}
                                        onChange={(e) => setSendAnnouncement(e.target.checked)}
                                        style={{ 
                                            width: "44px", 
                                            height: "24px", 
                                            cursor: "pointer",
                                            backgroundColor: sendAnnouncement ? "#7C3AED" : "#CBD5E1",
                                            borderColor: "transparent"
                                        }}
                                    />
                                    <label 
                                        className="form-check-label fw-medium text-secondary mb-0" 
                                        htmlFor="sendAnnouncementSwitch"
                                        style={{ fontSize: "14px", cursor: "pointer" }}
                                    >
                                        Kirim Pengumuman?
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium text-secondary mb-2" style={{ fontSize: "14px" }}>
                                Target Penerima
                            </label>
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                {targets.map((target, idx) => (
                                    <span 
                                        key={idx} 
                                        className="badge d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill fw-normal"
                                        style={{ 
                                            backgroundColor: "#F3E8FF", 
                                            color: "#7E22CE",
                                            border: "1px solid #E9D5FF",
                                            fontSize: "12px"
                                        }}
                                    >
                                        <IconUsers size={14} />
                                        <span>{target}</span>
                                        <button 
                                            type="button" 
                                            className="btn p-0 border-0 ms-1 d-inline-flex align-items-center justify-content-center"
                                            onClick={() => handleRemoveTarget(idx)}
                                            style={{ 
                                                color: "#7E22CE", 
                                                backgroundColor: "transparent",
                                                boxShadow: "none"
                                            }}
                                        >
                                            <IconX size={13} />
                                        </button>
                                    </span>
                                ))}

                                {isAddingTarget ? (
                                    <div className="d-inline-flex align-items-center gap-1">
                                        <input
                                            type="text"
                                            autoFocus
                                            value={newTargetInput}
                                            onChange={(e) => setNewTargetInput(e.target.value)}
                                            onKeyDown={handleKeyDownTarget}
                                            placeholder="nama_target..."
                                            className="form-control form-control-sm rounded-pill px-2.5 py-1"
                                            style={{ 
                                                fontSize: "12px", 
                                                borderColor: "#7C3AED",
                                                width: "140px",
                                                height: "28px"
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleConfirmAddTarget}
                                            className="btn btn-sm btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center"
                                            style={{ backgroundColor: "#7C3AED", borderColor: "#7C3AED", width: "24px", height: "24px" }}
                                        >
                                            <IconCheck size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingTarget(false);
                                                setNewTargetInput("");
                                            }}
                                            className="btn btn-sm btn-light rounded-circle p-0 d-flex align-items-center justify-content-center"
                                            style={{ width: "24px", height: "24px" }}
                                        >
                                            <IconX size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={() => setIsAddingTarget(true)}
                                        className="btn btn-sm px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1 text-secondary bg-white"
                                        style={{ 
                                            border: "1px solid #CBD5E1", 
                                            fontSize: "12px",
                                            fontWeight: 500,
                                            height: "28px"
                                        }}
                                    >
                                        <IconPlus size={14} />
                                        <span>Tambah Target</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium text-secondary mb-2" style={{ fontSize: "14px" }}>
                                Judul Pengumuman
                            </label>
                            <input 
                                type="text" 
                                className="form-control px-3 py-2.5" 
                                style={{ 
                                    borderRadius: "10px", 
                                    borderColor: "#CBD5E1",
                                    fontSize: "14px",
                                    color: "#1E293B",
                                    backgroundColor: "#FFFFFF"
                                }} 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Masukkan judul pengumuman..."
                            />
                        </div>

                        <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <label className="form-label fw-medium text-secondary mb-0" style={{ fontSize: "14px" }}>
                                    Isi Pesan
                                </label>
                                <span className="text-muted" style={{ fontSize: "13px" }}>
                                    {content.length} / {maxLength}
                                </span>
                            </div>
                            <textarea 
                                className="form-control px-3 py-2.5" 
                                rows={5}
                                maxLength={maxLength}
                                style={{ 
                                    borderRadius: "12px", 
                                    borderColor: "#CBD5E1",
                                    fontSize: "14px",
                                    color: "#334155",
                                    lineHeight: "1.6",
                                    backgroundColor: "#FFFFFF"
                                }} 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Tulis isi pengumuman di sini..."
                            />
                        </div>

                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            style={{ display: "none" }} 
                            multiple 
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        />
                        <input 
                            type="file" 
                            ref={imageInputRef} 
                            onChange={handleImageUpload} 
                            style={{ display: "none" }} 
                            multiple 
                            accept="image/*" 
                        />

                        <div className="d-flex align-items-center gap-4 pt-1 mb-3">
                            <button 
                                type="button" 
                                className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                                style={{ color: "#0F3B8C", fontSize: "14px", fontWeight: 500 }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <IconPaperclip size={18} />
                                <span>Lampirkan File</span>
                            </button>

                            <button 
                                type="button" 
                                className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                                style={{ color: "#0F3B8C", fontSize: "14px", fontWeight: 500 }}
                                onClick={() => imageInputRef.current?.click()}
                            >
                                <IconPhoto size={18} />
                                <span>Tambahkan Gambar</span>
                            </button>
                        </div>

                        {attachedImages.length > 0 && (
                            <div className="mb-3">
                                <span className="d-block text-secondary fw-medium mb-2" style={{ fontSize: "13px" }}>
                                    Gambar Terlampir ({attachedImages.length})
                                </span>
                                <div className="d-flex flex-wrap gap-2">
                                    {attachedImages.map((img, index) => (
                                        <div 
                                            key={index} 
                                            className="position-relative rounded overflow-hidden border"
                                            style={{ width: "90px", height: "90px" }}
                                        >
                                            <img 
                                                src={img.previewUrl} 
                                                alt={`upload-${index}`} 
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                            />
                                            <button 
                                                type="button" 
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center m-1 rounded-circle"
                                                style={{ width: "20px", height: "20px" }}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <IconX size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {attachedFiles.length > 0 && (
                            <div className="mb-2">
                                <span className="d-block text-secondary fw-medium mb-2" style={{ fontSize: "13px" }}>
                                    Dokumen Terlampir ({attachedFiles.length})
                                </span>
                                <div className="d-flex flex-column gap-2">
                                    {attachedFiles.map((file, index) => (
                                        <div 
                                            key={index} 
                                            className="d-flex align-items-center justify-content-between px-3 py-2 rounded"
                                            style={{ backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0" }}
                                        >
                                            <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                                                <IconFileText size={18} className="text-primary flex-shrink-0" />
                                                <span className="text-truncate text-secondary" style={{ fontSize: "13px" }}>
                                                    {file.name}
                                                </span>
                                                <span className="text-muted flex-shrink-0" style={{ fontSize: "11px" }}>
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                            <button 
                                                type="button" 
                                                className="btn p-0 border-0 text-danger"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <IconTrash size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="col-12 mt-4">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <Button 
                                    variant="link"
                                    onClick={handleSaveDraft}
                                    disabled={loading}
                                    style={{ 
                                        color: "#0F3B8C",
                                        border: "1px solid #0F3B8C",
                                        borderRadius: "10px",
                                        padding: "8px 20px",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        backgroundColor: "transparent"
                                    }}
                                >
                                    {loading ? "Menyimpan..." : "Simpan Draft"}
                                </Button>
                                <Button 
                                    onClick={handlePublish}
                                    disabled={loading}
                                    style={{ 
                                        backgroundColor: "#061A40", 
                                        borderColor: "#061A40", 
                                        borderRadius: "10px",
                                        padding: "8px 24px",
                                        fontSize: "14px",
                                        fontWeight: 500
                                    }}
                                    className="text-white"
                                >
                                    {loading ? "Mengirim..." : "Publikasikan"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
}