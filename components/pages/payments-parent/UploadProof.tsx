"use client";

import React, { useState } from "react";
import { 
  IconCloudUpload, 
  IconUser, 
  IconCalendar, 
  IconInfoCircle, 
  IconSend,
  IconArrowLeft,
} from "@tabler/icons-react";

interface UploadProofProps {
  onBack: () => void;
  onSubmitSuccess?: () => void;
}

export function UploadProof({ onBack, onSubmitSuccess }: UploadProofProps) {
  const [senderName, setSenderName] = useState("Budi Santoso");
  const [transferDate, setTransferDate] = useState("2023-10-28");
  const [amount, setAmount] = useState("2.200.000");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onSubmitSuccess) onSubmitSuccess();
  };

  return (
    <div className="w-100 min-vh-100 px-3 px-md-5 bg-light">
        <button 
            onClick={onBack}
            className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 text-secondary fw-semibold"
        >
            <IconArrowLeft size={20} /> Kembali ke Instruksi
        </button>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
            <div>
            <h2 className="fw-bold text-dark mb-1" style={{ color: "#001B48" }}>Upload Bukti</h2>
            <p className="text-secondary mb-0">Please ensure your transfer receipt is clearly visible for verification.</p>
            </div>
            
            <div className="text-md-end w-100 w-md-auto" style={{ minWidth: "200px" }}>
            <span className="small fw-semibold text-secondary d-block mb-1">Step 3 of 4</span>
            <div className="progress" style={{ height: "6px", backgroundColor: "#E2E8F0" }}>
                <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: "75%", backgroundColor: "#001B48" }}
                aria-valuenow={75} 
                aria-valuemin={0} 
                aria-valuemax={100}
                ></div>
            </div>
            </div>
        </div>

        <div className="card border-1 shadow-sm rounded-4 overflow-hidden w-100" style={{ borderColor: "#E2E8F0" }}>
            <form onSubmit={handleSubmit}>
                <div className="p-4 p-md-5">
                    <div 
                    className="position-relative p-5 rounded-4 text-center mb-4 d-flex flex-column align-items-center justify-content-center"
                    style={{ 
                        border: "2px dashed #C0CBDC", 
                        backgroundColor: "#F4F6FB",
                        cursor: "pointer"
                    }}
                    >
                    <input 
                        type="file" 
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={handleFileChange}
                        className="position-absolute w-100 h-100 top-0 start-0 opacity-0" 
                        style={{ cursor: "pointer" }}
                    />
                    
                    <div 
                        className="rounded-circle d-flex align-items-center justify-content-center mb-3 text-white"
                        style={{ width: "56px", height: "56px", backgroundColor: "#002060" }}
                    >
                        <IconCloudUpload size={28} />
                    </div>
                    
                    <h6 className="fw-bold text-dark mb-1">
                        {file ? file.name : "Click or drag file here"}
                    </h6>
                    <span className="small text-muted d-block">Support: JPG, PNG, PDF (Max 5MB)</span>
                    <span className="small text-muted d-block">Ensure all details are legible</span>
                    </div>

                    <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Nama Pengirim</label>
                        <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 text-muted rounded-start-3">
                            <IconUser size={18} />
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0 rounded-end-3 py-2" 
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            required
                        />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Tanggal Transfer</label>
                        <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 text-muted rounded-start-3">
                            <IconCalendar size={18} />
                        </span>
                        <input 
                            type="date" 
                            className="form-control border-start-0 ps-0 rounded-end-3 py-2" 
                            value={transferDate}
                            onChange={(e) => setTransferDate(e.target.value)}
                            required
                        />
                        </div>
                    </div>
                    </div>

                    <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">Jumlah Transfer</label>
                    <div className="input-group">
                        <span className="input-group-text border-end-0 text-secondary fw-semibold rounded-start-3" style={{ backgroundColor: "#F1F4F9" }}>
                        Rp
                        </span>
                        <input 
                        type="text" 
                        className="form-control border-start-0 ps-2 rounded-end-3 py-2 fw-semibold" 
                        style={{ backgroundColor: "#F1F4F9" }}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        />
                    </div>
                    </div>

                    <div className="mb-2">
                    <label className="form-label small fw-semibold text-secondary">Catatan (Opsional)</label>
                    <textarea 
                        className="form-control rounded-3 py-2" 
                        rows={3}
                        placeholder="Contoh: Pembayaran SPP Bulan Oktober"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    </div>
                </div>

                <div 
                    className="p-4 border-top d-flex flex-column flex-md-row align-items-center justify-content-between gap-3"
                    style={{ backgroundColor: "#EEF2F7", borderColor: "#E2E8F0" }}
                >
                    <div className="d-flex align-items-center gap-2 text-secondary">
                    <IconInfoCircle size={22} className="text-primary flex-shrink-0" />
                    <p className="small mb-0" style={{ fontSize: "0.85rem" }}>
                        Our team will verify your payment within 24 hours.<br className="d-none d-md-block"/>
                        Notification will follow.
                    </p>
                    </div>

                    <div className="d-flex align-items-center gap-3 w-100 w-md-auto justify-content-end">
                    <button 
                        type="button" 
                        onClick={onBack}
                        className="btn btn-link text-decoration-none text-dark fw-semibold px-3"
                    >
                        Save Draft
                    </button>
                    <button 
                        type="submit" 
                        className="btn px-4 py-2 text-white fw-semibold rounded-3 d-flex align-items-center gap-2 shadow-sm"
                        style={{ backgroundColor: "#001B48" }}
                    >
                        Submit Proof
                        <IconSend size={16} />
                    </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
}