"use client";

import { useState } from "react";
import { 
    IconX, 
    IconId, 
    IconFileText, 
    IconCheck, 
    IconHierarchy, 
    IconMoodSmile, 
    IconUser 
} from "@tabler/icons-react";
import { toast } from "react-hot-toast";
import { callApi } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        class: "",
        gender: "Laki-laki",
        birthdate: "",
        address: "",
    });

    const [documents, setDocuments] = useState<{
        kartuKeluarga: File | null;
        aktaKelahiran: File | null;
        pasFoto: File | null;
    }>({
        kartuKeluarga: null,
        aktaKelahiran: null,
        pasFoto: null,
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (key: keyof typeof documents, file: File | null) => {
        setDocuments((prev) => ({ ...prev, [key]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => data.append(key, val));
            if (documents.kartuKeluarga) data.append("kartuKeluarga", documents.kartuKeluarga);
            if (documents.aktaKelahiran) data.append("aktaKelahiran", documents.aktaKelahiran);
            if (documents.pasFoto) data.append("pasFoto", documents.pasFoto);

            await callApi("/students", {
                method: "POST",
                body: data,
            });

            toast.success("Data siswa berhasil ditambahkan!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Gagal menambah data siswa:", error);
            toast.error("Gagal menambahkan data siswa");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="modal fade show d-block" 
            tabIndex={-1} 
            style={{ backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)" }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden" style={{ backgroundColor: "#F8F9FD" }}>
                    <div className="modal-header border-0 px-4 pt-4 pb-2 d-flex justify-content-between align-items-center">
                        <h4 className="fw-bold text-dark mb-0" style={{ fontSize: "1.35rem", color: "#1E293B" }}>
                            Tambah Data Siswa
                        </h4>
                        <button 
                            type="button" 
                            className="btn btn-link text-dark p-1 border-0 shadow-none" 
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <IconX size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body px-4 py-2" style={{ maxHeight: "75vh", overflowY: "auto" }}>
                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3 text-primary" style={{ color: "#1D2A68" }}>
                                    <IconId size={22} className="text-primary" />
                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.05rem" }}>
                                        Informasi Peserta Didik
                                    </h6>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted mb-1 fw-medium">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            required 
                                            className="form-control rounded-3 py-2 border-1" 
                                            placeholder="Contoh: Lucas Wijaya"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{ borderColor: "#E2E8F0" }}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label small text-muted mb-1 fw-medium">Kelas</label>
                                        <input 
                                            type="text"
                                            name="class"
                                            required 
                                            className="form-control rounded-3 py-2 border-1" 
                                            placeholder="Contoh: 10-A"
                                            value={formData.class}
                                            onChange={handleChange}
                                            style={{ borderColor: "#E2E8F0" }}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label small text-muted mb-1 fw-medium d-block">Jenis Kelamin</label>
                                        <div className="d-flex gap-4 pt-2">
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="gender" 
                                                    id="genderMale"
                                                    value="Laki-laki"
                                                    checked={formData.gender === "Laki-laki"}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label small text-dark" htmlFor="genderMale">
                                                    Laki-laki
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="gender" 
                                                    id="genderFemale"
                                                    value="Perempuan"
                                                    checked={formData.gender === "Perempuan"}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label small text-dark" htmlFor="genderFemale">
                                                    Perempuan
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label small text-muted mb-1 fw-medium">Tanggal Lahir</label>
                                        <input 
                                            type="date" 
                                            name="birthdate"
                                            className="form-control rounded-3 py-2 border-1 text-secondary" 
                                            value={formData.birthdate}
                                            onChange={handleChange}
                                            style={{ borderColor: "#E2E8F0" }}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small text-muted mb-1 fw-medium">Alamat Lengkap</label>
                                        <textarea 
                                            name="address" 
                                            rows={3} 
                                            className="form-control rounded-3 border-1" 
                                            placeholder="Masukkan alamat rumah..."
                                            value={formData.address}
                                            onChange={handleChange}
                                            style={{ borderColor: "#E2E8F0" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 mb-2">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <IconFileText size={22} className="text-primary" />
                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.05rem" }}>
                                        Unggah Berkas
                                    </h6>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="w-100 cursor-pointer">
                                            <input 
                                                type="file" 
                                                className="d-none" 
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => handleFileChange("kartuKeluarga", e.target.files?.[0] || null)}
                                            />
                                            <div 
                                                className={`p-3 rounded-3 text-center border-2 border-dashed d-flex flex-column align-items-center justify-content-center gap-2 transition-all ${
                                                    documents.kartuKeluarga ? "bg-light border-primary" : "bg-white border-secondary border-opacity-25"
                                                }`}
                                                style={{ minHeight: "100px", cursor: "pointer", borderStyle: "dashed" }}
                                            >
                                                {documents.kartuKeluarga ? (
                                                    <>
                                                        <IconCheck size={26} className="text-success" />
                                                        <span className="small fw-semibold text-truncate w-100 text-success">
                                                            {documents.kartuKeluarga.name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconHierarchy size={26} className="text-muted" />
                                                        <span className="small fw-semibold text-secondary">Kartu Keluarga</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="w-100 cursor-pointer">
                                            <input 
                                                type="file" 
                                                className="d-none" 
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => handleFileChange("aktaKelahiran", e.target.files?.[0] || null)}
                                            />
                                            <div 
                                                className={`p-3 rounded-3 text-center border-2 border-dashed d-flex flex-column align-items-center justify-content-center gap-2 transition-all ${
                                                    documents.aktaKelahiran ? "bg-light border-primary" : "bg-white border-secondary border-opacity-25"
                                                }`}
                                                style={{ minHeight: "100px", cursor: "pointer", borderStyle: "dashed" }}
                                            >
                                                {documents.aktaKelahiran ? (
                                                    <>
                                                        <IconCheck size={26} className="text-success" />
                                                        <span className="small fw-semibold text-truncate w-100 text-success">
                                                            {documents.aktaKelahiran.name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconMoodSmile size={26} className="text-muted" />
                                                        <span className="small fw-semibold text-secondary">Akte Kelahiran</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="w-100 cursor-pointer">
                                            <input 
                                                type="file" 
                                                className="d-none" 
                                                accept="image/*"
                                                onChange={(e) => handleFileChange("pasFoto", e.target.files?.[0] || null)}
                                            />
                                            <div 
                                                className={`p-3 rounded-3 text-center border-2 border-dashed d-flex flex-column align-items-center justify-content-center gap-2 transition-all ${
                                                    documents.pasFoto ? "bg-light border-primary" : "bg-white border-secondary border-opacity-25"
                                                }`}
                                                style={{ minHeight: "100px", cursor: "pointer", borderStyle: "dashed" }}
                                            >
                                                {documents.pasFoto ? (
                                                    <>
                                                        <IconCheck size={26} className="text-success" />
                                                        <span className="small fw-semibold text-truncate w-100 text-success">
                                                            {documents.pasFoto.name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconUser size={26} className="text-muted" />
                                                        <span className="small fw-semibold text-secondary">Pas Foto</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer border-0 px-4 py-3 d-flex justify-content-end gap-2">
                            <button 
                                type="button" 
                                className="btn btn-link text-secondary text-decoration-none px-3" 
                                onClick={onClose}
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                className="btn px-4 py-2 rounded-3 text-white fw-medium shadow-sm" 
                                style={{ backgroundColor: "#0F172A", borderColor: "#0F172A" }}
                                disabled={loading}
                            >
                                {loading ? "Menyimpan..." : "Simpan Data"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}