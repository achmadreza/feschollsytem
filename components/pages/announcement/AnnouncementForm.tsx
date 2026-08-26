"use client";

import { useState } from "react";
import { 
    IconArrowLeft, 
    IconPlus, 
    IconPaperclip, 
    IconPhoto, 
    IconVolume, 
    IconUsers, 
    IconX 
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { Button } from "../../../components/ui/Button";

interface AnnouncementFormProps {
    onBack?: () => void;
    onSaveDraft?: () => void;
    onPublish?: () => void;
}

export function AnnouncementForm({ onBack, onSaveDraft, onPublish }: AnnouncementFormProps) {
    const [sendAnnouncement, setSendAnnouncement] = useState(true);
    const [targets, setTargets] = useState<string[]>([
        "Semua Orang Tua Kelas B - Matahari"
    ]);
    const [title, setTitle] = useState("Kegiatan Besok: Membawa Bibit Pohon");
    const [content, setContent] = useState(
        "Kepada Bapak/Ibu Orang Tua Siswa Kelas B - Matahari, diingatkan kembali untuk besok anak-anak dimohon membawa satu buah bibit tanaman kecil (bebas jenisnya) untuk kegiatan berkebun di sekolah. Terima kasih!"
    );

    const maxLength = 500;

    const handleRemoveTarget = (indexToRemove: number) => {
        setTargets(targets.filter((_, index) => index !== indexToRemove));
    };

    const handleAddTarget = () => {
        const newTarget = prompt("Masukkan target penerima baru:");
        if (newTarget) {
            setTargets([...targets, newTarget]);
        }
    };

    const handleSaveDraft = () => {
        toast.success("Draft pengumuman berhasil disimpan!");
        if (onSaveDraft) onSaveDraft();
    };

    const handlePublish = () => {
        toast.success("Pengumuman berhasil dipublikasikan!");
        if (onPublish) onPublish();
    };

    return (
        <div className="container-fluid" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
            <div className="row g-4">
                <div className="col-12">
                    <div 
                        className="card border-0 shadow-sm p-4"
                    >
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
                                        className="badge d-inline-flex align-items-center gap-1.5 px-3 py-2 rounded-pill fw-normal"
                                        style={{ 
                                            backgroundColor: "#F3E8FF", 
                                            color: "#7E22CE",
                                            border: "1px solid #E9D5FF",
                                            fontSize: "13px"
                                        }}
                                    >
                                        <IconUsers size={15} />
                                        <span>{target}</span>
                                        <button 
                                            type="button" 
                                            className="btn p-0 border-0 ms-1 d-flex align-items-center justify-content-center"
                                            onClick={() => handleRemoveTarget(idx)}
                                            style={{ color: "#7E22CE", lineHeight: 1 }}
                                        >
                                            <IconX size={14} />
                                        </button>
                                    </span>
                                ))}

                                <button 
                                    type="button"
                                    onClick={handleAddTarget}
                                    className="btn btn-sm px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1 text-secondary bg-white"
                                    style={{ 
                                        border: "1px solid #CBD5E1", 
                                        fontSize: "13px",
                                        fontWeight: 500
                                    }}
                                >
                                    <IconPlus size={15} />
                                    <span>Tambah Target</span>
                                </button>
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

                        <div className="d-flex align-items-center gap-4 pt-1">
                            <button 
                                type="button" 
                                className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                                style={{ color: "#0F3B8C", fontSize: "14px", fontWeight: 500 }}
                                onClick={() => toast.success("Fitur lampirkan file dibuka")}
                            >
                                <IconPaperclip size={18} />
                                <span>Lampirkan File</span>
                            </button>

                            <button 
                                type="button" 
                                className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                                style={{ color: "#0F3B8C", fontSize: "14px", fontWeight: 500 }}
                                onClick={() => toast.success("Fitur tambahkan gambar dibuka")}
                            >
                                <IconPhoto size={18} />
                                <span>Tambahkan Gambar</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 mt-4">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <Button 
                                    variant="link"
                                    onClick={handleSaveDraft}
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
                                    Simpan Draft
                                </Button>

                                <Button 
                                    onClick={handlePublish}
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
                                    Publikasikan
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