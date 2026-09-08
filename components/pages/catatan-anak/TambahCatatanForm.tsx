"use client";

import { useState } from "react";
import { 
    IconThumbUp, 
    IconHeart, 
    IconUsers, 
    IconHeartbeat, 
    IconInfoCircle, 
    IconUpload, 
    IconX, 
    IconSend,
    IconStar,
    IconStarFilled,
    IconEye,
    IconEdit
} from "@tabler/icons-react";
import { Label } from "../../ui/Label";
import { Input } from "../../ui/Input";
import { Form } from "../../ui/Form";

interface TambahCatatanFormProps {
    onClose: () => void;
    onSuccess?: (newNote: any) => void;
}

export function TambahCatatanForm({ onClose, onSuccess }: TambahCatatanFormProps) {
    // State Form Input
    const [selectedChild, setSelectedChild] = useState("Daffa Alfareza (TK B)");
    const [selectedCategory, setSelectedCategory] = useState("Perkembangan");
    const [rating, setRating] = useState<number>(4); // Default 4 bintang (BSB)
    const [title, setTitle] = useState("Daffa mampu mengenal huruf A–D");
    const [noteDate, setNoteDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [description, setDescription] = useState(
        "Daffa menunjukkan perkembangan yang baik dalam mengenal huruf.\nHari ini Daffa dapat menyebutkan dan menulis huruf A, B, C, dan D dengan bantuan minimal."
    );
    const [files, setFiles] = useState<string[]>([
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=200"
    ]);

    // Additional Info States
    const [atHome, setAtHome] = useState("");
    const [attention, setAttention] = useState("");
    const [followUp, setFollowUp] = useState("");

    // State Modal Preview
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const categories = [
        { id: "Perkembangan", label: "Perkembangan", sub: "Perkembangan belajar & motorik", icon: IconThumbUp },
        { id: "Sikap & Karakter", label: "Sikap & Karakter", sub: "Sikap, karakter, dan kebiasaan", icon: IconHeart },
        { id: "Sosial & Emosional", label: "Sosial & Emosional", sub: "Interaksi dengan teman & guru", icon: IconUsers },
        { id: "Kesehatan", label: "Kesehatan", sub: "Kondisi kesehatan dan kebersihan", icon: IconHeartbeat },
        { id: "Informasi", label: "Informasi", sub: "Informasi penting untuk orang tua", icon: IconInfoCircle },
    ];

    // Pemetaan Indikator Capaian (1-5)
    const indicators = [
        { value: 1, label: "BB (Belum Berkembang)" },
        { value: 2, label: "MB (Mulai Berkembang)" },
        { value: 3, label: "BSH (Berkembang Sesuai Harapan)" },
        { value: 4, label: "BSB (Berkembang Sangat Baik)" },
        { value: 5, label: "IST (Istimewa)" },
    ];

    const currentIndicator = indicators.find((item) => item.value === rating) || indicators[3];

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // Format Tanggal untuk Tampilan Preview (Contoh: 20 Mei 2025)
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const handleFinalSubmit = () => {
        const payload = {
            selectedChild,
            selectedCategory,
            rating,
            indicator: currentIndicator.label,
            noteDate,
            title,
            description,
            files,
            atHome,
            attention,
            followUp
        };

        if (onSuccess) {
            onSuccess(payload);
        }
        setShowPreviewModal(false);
        onClose();
    };

    return (
        <div className="bg-light p-4 p-md-5 rounded-4 border shadow-sm max-w-4xl mx-auto position-relative">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h3 className="fw-bold text-dark mb-1">Tambah Catatan Anak</h3>
                    <p className="text-muted small m-0">
                        Catatan ini akan tersimpan di profil anak dan dapat dilihat oleh orang tua.
                    </p>
                </div>
            </div>

            <Form onSubmit={(e) => e.preventDefault()}>
                {/* Step 1: Pilih Anak */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 24, height: 24 }}>1</span>
                        <h4 className="fw-bold mb-0">Pilih Anak</h4>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <Label className="form-label text-muted small fw-medium">Pilih Anak</Label>
                            <select 
                                className="form-select border-0 py-2"
                                value={selectedChild}
                                onChange={(e) => setSelectedChild(e.target.value)}
                            >
                                <option value="Daffa Alfareza (TK B)">Daffa Alfareza (TK B)</option>
                                <option value="Aurelia Putri (TK B)">Aurelia Putri (TK B)</option>
                            </select>
                        </div>
                        
                        <div className="col-md-6">
                            <Label className="form-label text-muted small fw-medium">Tanggal Catatan</Label>
                            <div className="input-group">
                                <Input 
                                    type="date" 
                                    className="form-control border-0 py-2 text-secondary" 
                                    value={noteDate}
                                    onChange={(e) => setNoteDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Kategori Catatan */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-primary rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: 24, height: 24 }}>2</span>
                        <h4 className="fw-bold mb-0">Kategori Catatan</h4>
                    </div>
                    <p className="text-muted small mb-3">Pilih kategori yang paling sesuai dengan isi catatan.</p>
                    <div className="row g-2">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory === cat.id;
                            return (
                                <div className="col" key={cat.id}>
                                    <div 
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`p-3 rounded-3 text-center cursor-pointer border h-100 transition-all ${
                                            isSelected ? "border-primary bg-primary-subtle shadow-sm" : "border-light-subtle bg-white"
                                        }`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Icon size={24} className={isSelected ? "text-primary mb-2" : "text-muted mb-2"} />
                                        <div className="fw-bold small text-dark">{cat.label}</div>
                                        <div className="text-muted" style={{ fontSize: "10px" }}>{cat.sub}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step 3: Detail Catatan */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24 }}>3</span>
                        <h4 className="fw-bold mb-0">Detail Catatan</h4>
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-medium">Judul Catatan</label>
                        <input 
                            type="text" 
                            className="form-control border-0 py-2" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    
                    {/* Pembaruan Tampilan Indikator Capaian */}
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-medium d-block">Indikator Capaian</label>
                        
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div className="d-flex align-items-center gap-1">
                                {[1, 2, 3, 4, 5].map((starIndex) => (
                                    <button
                                        key={starIndex}
                                        type="button"
                                        onClick={() => setRating(starIndex)}
                                        className="btn p-0 border-0 bg-transparent"
                                        style={{ outline: "none" }}
                                    >
                                        {starIndex <= rating ? (
                                            <IconStarFilled size={16} className="text-warning" />
                                        ) : (
                                            <IconStar size={16} className="text-secondary opacity-50" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <span className="fw-semibold text-dark fs-6">
                                {currentIndicator.label}
                            </span>
                        </div>

                        <div className="position-relative">
                            <select 
                                className="form-select border rounded-3 py-2 text-dark pe-5"
                                style={{ backgroundColor: "#ffffff" }}
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            >
                                {indicators.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.value}★ {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-muted small fw-medium">Deskripsi Catatan</label>
                        <textarea 
                            className="form-control border-0" 
                            rows={4}
                            maxLength={500}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="text-end text-muted small mt-1">{description.length} / 500</div>
                    </div>
                </div>

                {/* Step 4: Bukti / Dokumentasi */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24 }}>4</span>
                        <h4 className="fw-bold mb-0">Bukti / Dokumentasi <span className="text-muted fw-normal">(Opsional)</span></h4>
                    </div>
                    <div className="d-flex gap-3 flex-wrap align-items-center">
                        <div className="border border-dashed rounded-3 p-4 text-center cursor-pointer" style={{ width: 200, height: 120 }}>
                            <IconUpload className="text-primary mb-1" size={24} />
                            <div className="fw-semibold text-primary small">Klik untuk unggah</div>
                            <div className="text-muted" style={{ fontSize: "10px" }}>Maks. 5 file (20MB)</div>
                        </div>
                        {files.map((src, index) => (
                            <div key={index} className="position-relative rounded-3 overflow-hidden" style={{ width: 120, height: 120 }}>
                                <img src={src} alt="Upload" className="w-100 h-100 object-fit-cover" />
                                <button 
                                    type="button" 
                                    onClick={() => removeFile(index)} 
                                    className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 p-0 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: 20, height: 20 }}
                                >
                                    <IconX size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 5: Informasi Tambahan */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24 }}>5</span>
                        <h4 className="fw-bold mb-0">Informasi Tambahan untuk Orang Tua</h4>
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-medium">Hal yang bisa dilakukan di rumah</label>
                        <input 
                            type="text" 
                            className="form-control border-0 py-2" 
                            placeholder="Contoh: Ajak anak bermain tebak huruf..." 
                            value={atHome}
                            onChange={(e) => setAtHome(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-medium">Perlu perhatian</label>
                        <input 
                            type="text" 
                            className="form-control border-0 py-2" 
                            placeholder="Contoh: Berikan motivasi tambahan..." 
                            value={attention}
                            onChange={(e) => setAttention(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-medium">Tindak lanjut di sekolah</label>
                        <input 
                            type="text" 
                            className="form-control border-0 py-2" 
                            placeholder="Contoh: Guru akan melanjutkan pengenalan huruf..." 
                            value={followUp}
                            onChange={(e) => setFollowUp(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <hr className="my-4" />
                <div className="d-flex justify-content-end gap-2">
                    <button type="button" onClick={onClose} className="btn btn-light px-4 rounded-3 fw-medium">
                        Batal
                    </button>
                    {/* Tombol memicu modal Preview */}
                    <button 
                        type="button" 
                        onClick={() => setShowPreviewModal(true)} 
                        className="btn btn-primary px-4 rounded-3 fw-medium d-flex align-items-center gap-2"
                    >
                        <IconEye size={18} />
                        Preview & Simpan
                    </button>
                </div>
            </Form>

            {/* MODAL PREVIEW (Meniru Tampilan Gambar Referensi) */}
            {showPreviewModal && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center p-3"
                    style={{ zIndex: 1050, backdropFilter: "blur(2px)" }}
                >
                    <div className="bg-white rounded-4 shadow-lg overflow-hidden w-100 max-w-2xl" style={{ maxWidth: "600px" }}>
                        {/* Modal Header */}
                        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center gap-2">
                                <IconEye size={20} className="text-primary" />
                                <h5 className="fw-bold mb-0">Pratinjau Catatan Orang Tua</h5>
                            </div>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setShowPreviewModal(false)}
                            ></button>
                        </div>

                        {/* Modal Body - Desain Meniru Gambar Referensi */}
                        <div className="p-4 overflow-y-auto" style={{ maxHeight: "75vh" }}>
                            
                            {/* Header Card (Kategori & Tanggal) */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-3 py-2 fw-medium border border-warning-subtle d-flex align-items-center gap-1">
                                    <IconStar size={14} className="text-warning fill-warning" />
                                    {selectedCategory}
                                </span>
                                <span className="text-secondary small fw-medium">
                                    {formatDate(noteDate)}
                                </span>
                            </div>

                            {/* Card Indicator / Rating Bintang */}
                            <div className="p-3 rounded-4 border border-purple-subtle bg-purple-light mb-4" style={{ backgroundColor: "#F9F5FF", borderColor: "#E9D7FE" }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <IconStar 
                                                key={s} 
                                                size={18} 
                                                style={{ color: s <= rating ? "#7F56D9" : "#D0D5DD" }}
                                                className={s <= rating ? "fill-current" : ""}
                                            />
                                        ))}
                                    </div>
                                    <div className="fw-semibold small" style={{ color: "#6941C6" }}>
                                        • {rating} Stars - {currentIndicator.label.split(" ")[0]}
                                    </div>
                                </div>
                            </div>

                            {/* Judul Catatan */}
                            <h5 className="fw-bold text-dark mb-3">
                                {title || "Tanpa Judul"}
                            </h5>

                            {/* Informasi Pembuat (Guru) */}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <img 
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" 
                                    alt="Guru" 
                                    className="rounded-circle object-fit-cover"
                                    style={{ width: 44, height: 44 }}
                                />
                                <div>
                                    <div className="fw-semibold text-dark">Oleh Siti Aisyah</div>
                                    <div className="text-muted small">Guru TK B</div>
                                </div>
                            </div>

                            {/* Deskripsi Catatan */}
                            <div className="text-secondary mb-4 style-description" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                                {description}
                            </div>

                            {/* Foto / Bukti Dokumentasi */}
                            {files.length > 0 && (
                                <div className="row g-2 mb-4">
                                    {files.map((img, idx) => (
                                        <div key={idx} className="col-6">
                                            <img 
                                                src={img} 
                                                alt={`Bukti ${idx + 1}`} 
                                                className="w-100 rounded-3 object-fit-cover"
                                                style={{ height: "160px" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Informasi Tambahan (Jika Ada) */}
                            {(atHome || attention || followUp) && (
                                <div className="p-3 bg-light rounded-3 border mb-2 small">
                                    <h6 className="fw-bold mb-2 text-dark">Catatan Tambahan:</h6>
                                    {atHome && <div className="mb-1"><strong>Di Rumah:</strong> {atHome}</div>}
                                    {attention && <div className="mb-1"><strong>Perhatian:</strong> {attention}</div>}
                                    {followUp && <div><strong>Tindak Lanjut:</strong> {followUp}</div>}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer / Action Buttons */}
                        <div className="p-3 border-top bg-light d-flex justify-content-between align-items-center">
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary px-3 rounded-3 d-flex align-items-center gap-2"
                                onClick={() => setShowPreviewModal(false)}
                            >
                                <IconEdit size={16} />
                                Edit Kembali
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary px-4 rounded-3 fw-medium d-flex align-items-center gap-2"
                                onClick={handleFinalSubmit}
                            >
                                <IconSend size={16} />
                                Konfirmasi & Kirim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}