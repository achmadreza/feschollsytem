"use client";

import { useState } from "react";
import { 
    IconArrowLeft, 
    IconArrowRight, 
    IconUpload, 
    IconInfoCircle, 
    IconCircleCheck 
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { Button } from "../../../components/ui/Button"; 

interface ActivitiesFormProps {
    onBack?: () => void;
    onNext?: () => void;
}

export function ActivitiesForm({ onBack, onNext }: ActivitiesFormProps) {
    const [title, setTitle] = useState("Belajar Mewarnai & Mengenal Angka");
    const [description, setDescription] = useState(
        "Hari ini anak-anak kelas B1 belajar mengenal angka 1-10 menggunakan media krayon dan kertas mewarnai. Mereka sangat antusias saat mencocokkan jumlah benda dengan angka yang tertera."
    );
    const [uploadedFiles, setUploadedFiles] = useState([
        { id: 1, name: "IMG_4821.jpg", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=300&auto=format&fit=crop" },
        { id: 2, name: "IMG_4822.jpg", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop" },
        { id: 3, name: "IMG_4823.jpg", url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop" }
    ]);

    const handleNextStep = () => {
        toast.success("Melanjutkan ke Pengumuman!");
        if (onNext) onNext();
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
                        <div 
                            className="d-flex flex-column align-items-center justify-content-center p-4 mb-4 text-center"
                            style={{ 
                                backgroundColor: "#F5F3FF", 
                                border: "1.5px dashed #A5B4FC", 
                                borderRadius: "12px",
                                cursor: "pointer",
                                minHeight: "160px"
                            }}
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

                        <div className="row row-cols-1 row-cols-sm-3 g-3">
                            {uploadedFiles.map((file) => (
                                <div className="col" key={file.id}>
                                    <div 
                                        className="position-relative overflow-hidden shadow-sm"
                                        style={{ 
                                            borderRadius: "12px", 
                                            height: "110px" 
                                        }}
                                    >
                                        <img 
                                            src={file.url} 
                                            alt={file.name} 
                                            className="w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                        />
                                        <div 
                                            className="position-absolute bottom-0 start-0 end-0 px-2 py-1 text-white text-truncate"
                                            style={{ 
                                                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                                                fontSize: "11px"
                                            }}
                                        >
                                            {file.name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                    <Button 
                        onClick={handleNextStep}
                        style={{ 
                            backgroundColor: "#061A40", 
                            borderColor: "#061A40", 
                            borderRadius: "10px",
                            padding: "10px 24px",
                            fontSize: "14px",
                            fontWeight: 500
                        }}
                        className="d-flex align-items-center gap-2 text-white"
                    >
                        <span>Submit</span>
                    </Button>
                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
}