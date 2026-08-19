"use client";

import React, { useState, useEffect } from "react";
import { 
  IconCloudUpload, 
  IconUser, 
  IconCalendar, 
  IconInfoCircle, 
  IconSend,
  IconArrowLeft,
  IconLoader2,
  IconCheck,
  IconReceipt
} from "@tabler/icons-react";
import { getUser } from "@/lib/auth";
import { callApi } from "@/lib/api";
import { Toaster, toast } from "react-hot-toast";

interface UploadProofProps {
  billingId: string | number;
  totalAmount: number;
  onBack?: () => void;
  onSubmitSuccess?: () => void;
  onGoToHistory?: () => void;
  onGoToHome?: () => void;
}

export function UploadProof({ 
  billingId, 
  totalAmount, 
  onBack, 
  onSubmitSuccess,
  onGoToHistory,
  onGoToHome 
}: UploadProofProps) {
    const todayStr = new Date().toISOString().split("T")[0];

    const [senderName, setSenderName] = useState("");
    const [transferDate, setTransferDate] = useState(todayStr);
    const [amount, setAmount] = useState(totalAmount.toString());
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedAt, setSubmittedAt] = useState<string>("");

    useEffect(() => {
        const user = getUser();
        if (user && user.fullName) {
            setSenderName(user.fullName);
        } else {
            setSenderName("Guest User");
        }
    }, []);

    const compressAndToBase64 = (file: File, maxWidth = 800, quality = 0.6): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (file.type === "application/pdf") {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (err) => reject(err);
                return;
            }

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
                    resolve(compressedBase64);
                } else {
                    reject(new Error("Gagal memproses gambar"));
                }
            };
            img.onerror = (err) => reject(err);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("Ukuran file maksimal 5MB");
                return;
            }
            
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error("Harap pilih file bukti transfer terlebih dahulu");
            return;
        }

        try {
            setIsLoading(true);
            const base64File = await compressAndToBase64(file);
            await callApi(`billings/${billingId}/upload`, {
                method: "POST",
                body: {
                    file: base64File,
                },
            });

            toast.success("Bukti pembayaran berhasil diunggah!");
            const now = new Date();
            const formattedDate = now.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const formattedTime = now.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            }) + " WIB";

            setSubmittedAt(`${formattedDate}\n${formattedTime}`);
            setIsSubmitted(true);

        } catch (error: any) {
            const apiErrorMessage = 
                error?.response?.data?.message || 
                error?.data?.message || 
                error?.message;

            if (typeof apiErrorMessage === "string") {
                toast.error(apiErrorMessage);
            } else if (Array.isArray(apiErrorMessage)) {
                toast.error(apiErrorMessage[0]);
            } else {
                toast.error("Gagal mengunggah bukti pembayaran");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <>
                <Toaster position="top-right" reverseOrder={false} />
                <div className="min-vh-100 bg-light d-flex flex-column align-items-center justify-content-center py-5 px-3">
                    <div className="d-flex align-items-center justify-content-center mb-5 gap-2">
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                            <IconCheck size={18} />
                        </div>
                        <div style={{ width: 40, height: 3, backgroundColor: "#22c55e" }} />
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                            <IconCheck size={18} />
                        </div>
                        <div style={{ width: 40, height: 3, backgroundColor: "#22c55e" }} />
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                            <IconCheck size={18} />
                        </div>
                        <div style={{ width: 40, height: 3, backgroundColor: "#22c55e" }} />
                        <div 
                            className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm" 
                            style={{ width: 36, height: 36, backgroundColor: "#4F46E5" }}
                        >
                            <IconCheck size={20} />
                        </div>
                    </div>

                    <div 
                        className="rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-sm"
                        style={{ width: 120, height: 120, backgroundColor: "#5bb286" }}
                    >
                        <IconCheck size={64} className="text-white" strokeWidth={3} />
                    </div>

                    <h2 className="fw-bold text-dark text-center mb-3 fs-2">
                        Bukti Pembayaran Berhasil Dikirim
                    </h2>
                    <p className="text-muted text-center max-w-md mb-4 fs-6" style={{ maxWidth: 500, lineHeight: "1.6" }}>
                        Terima kasih, pembayaran Anda sedang menunggu verifikasi dari admin sekolah. Kami akan memberi notifikasi jika status sudah berubah.
                    </p>

                    <div className="card border-0 shadow-sm rounded-4 w-100 p-4 mb-4" style={{ maxWidth: 580, backgroundColor: "#ffffff" }}>
                        <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                            <span className="text-muted fw-semibold small text-uppercase tracking-wider">STATUS</span>
                            <span 
                                className="badge fw-semibold px-3 py-2 rounded-pill"
                                style={{ backgroundColor: "#FEF08A", color: "#854D0E", fontSize: "0.75rem" }}
                            >
                                MENUNGGU VERIFIKASI
                            </span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                            <span className="text-muted fw-semibold small text-uppercase tracking-wider">TANGGAL UPLOAD</span>
                            <div className="text-end fw-semibold text-dark">
                                {submittedAt ? (
                                    submittedAt.split("\n").map((line, idx) => (
                                        <div key={idx} className={idx === 1 ? "text-muted small" : ""}>{line}</div>
                                    ))
                                ) : (
                                    "-"
                                )}
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-3">
                            <span className="text-muted fw-semibold small text-uppercase tracking-wider">ID TRANSAKSI</span>
                            <span className="fw-bold text-dark fs-6">
                                #{typeof billingId === "string" && billingId.startsWith("PAY-") ? billingId : `PAY-${billingId}`}
                            </span>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-3 w-100 justify-content-center" style={{ maxWidth: 580 }}>
                        <button
                            type="button"
                            onClick={() => {
                                if (onGoToHistory) onGoToHistory();
                                else if (onSubmitSuccess) onSubmitSuccess();
                            }}
                            className="btn py-2 px-4 text-white fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                            style={{ backgroundColor: "#0B192C" }}
                        >
                            Lihat Riwayat Pembayaran
                            <IconReceipt size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (onGoToHome) onGoToHome();
                                else if (onBack) onBack();
                            }}
                            className="btn btn-outline-secondary py-2 px-4 fw-semibold rounded-3 flex-grow-1 bg-white"
                            style={{ color: "#1E293B", borderColor: "#CBD5E1" }}
                        >
                            Kembali ke Beranda
                        </button>
                    </div>

                </div>
            </>
        );
    }

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="w-100 min-vh-100 px-3 px-md-5 bg-light py-4">
                {onBack && (
                    <button 
                        type="button"
                        onClick={onBack}
                        disabled={isLoading}
                        className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 text-secondary fw-semibold"
                    >
                        <IconArrowLeft size={20} /> Kembali
                    </button>
                )}

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
                                    disabled={isLoading}
                                    className="position-absolute w-100 h-100 top-0 start-0 opacity-0" 
                                    style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
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
                                        <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3">
                                            <IconUser size={18} />
                                        </span>
                                        <input 
                                            type="text" 
                                            className="form-control border-start-0 ps-0 rounded-end-3 py-2 bg-light" 
                                            value={senderName}
                                            disabled
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label small fw-semibold text-secondary">Tanggal Transfer</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3">
                                            <IconCalendar size={18} />
                                        </span>
                                        <input 
                                            type="date" 
                                            className="form-control border-start-0 ps-0 rounded-end-3 py-2 bg-light" 
                                            value={transferDate}
                                            disabled
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
                                        value={new Intl.NumberFormat("id-ID").format(Number(amount))}
                                        disabled
                                        required
                                    />
                                </div>
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
                                    type="submit" 
                                    disabled={isLoading}
                                    className="btn px-4 py-2 text-white fw-semibold rounded-3 d-flex align-items-center gap-2 shadow-sm"
                                    style={{ backgroundColor: "#001B48" }}
                                >
                                    {isLoading ? (
                                        <>
                                            <IconLoader2 size={16} className="animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Proof
                                            <IconSend size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}