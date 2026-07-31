"use client";

import { 
    IconCopy, 
    IconUpload, 
    IconArrowLeft, 
    IconSchool, 
    IconBallFootball, 
    IconUsers,
    IconChartBar,
    IconReceipt,
    IconInfoCircle,
    IconArrowRight
} from "@tabler/icons-react";

interface PaymentCheckoutProps {
    onBack: () => void;
}

export function PaymentCheckout({ onBack }: PaymentCheckoutProps) {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Nomor rekening berhasil disalin!");
    };

    return (
        <div className="container">
            <button 
                onClick={onBack}
                className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 text-secondary fw-semibold"
            >
                <IconArrowLeft size={20} /> Kembali ke Ringkasan
            </button>

            <div 
                className="card border-0 shadow-sm rounded-4 p-4 mb-4" 
                style={{ backgroundColor: "#EBF0FA" }}
            >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div>
                        <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-2 fw-bold text-uppercase mb-2">
                            UNPAID
                        </span>
                        <h4 className="fw-bold mb-1 text-dark">October 2023 Invoice</h4>
                        <p className="text-muted mb-0 small">Due Date: Oct 10, 2023</p>
                    </div>
                    <div className="text-md-end">
                        <span className="text-uppercase small tracking-wide text-secondary fw-bold d-block mb-1">
                            TOTAL AMOUNT DUE
                        </span>
                        <h2 className="fw-extrabold mb-0" style={{ color: "#002060", fontSize: "2.25rem" }}>
                            Rp 2.200.000
                        </h2>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="row g-4">
                {/* Left Column: Bill Breakdown */}
                <div className="col-12 col-lg-6">
                    <div className="d-flex align-items-center gap-2 mb-3 text-secondary">
                        <IconChartBar size={20} />
                        <h6 className="fw-bold mb-0 text-dark">Bill Breakdown</h6>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 rounded-3 bg-light text-primary">
                                    <IconSchool size={22} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark">SPP Bulanan</h6>
                                    <span className="small text-muted">Monthly Tuition</span>
                                </div>
                            </div>
                            <span className="fw-bold text-dark">Rp 1.500.000</span>
                        </div>

                        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 rounded-3 bg-success-subtle text-success">
                                    <IconBallFootball size={22} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark">Kegiatan Ekstrakurikuler</h6>
                                    <span className="small text-muted">Extracurricular</span>
                                </div>
                            </div>
                            <span className="fw-bold text-dark">Rp 250.000</span>
                        </div>

                        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 rounded-3 bg-danger-subtle text-danger">
                                    <IconUsers size={22} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark">Uang Makan (Catering)</h6>
                                    <span className="small text-muted">Meal Plan</span>
                                </div>
                            </div>
                            <span className="fw-bold text-dark">Rp 450.000</span>
                        </div>

                        <div className="p-3 bg-light d-flex align-items-center justify-content-between">
                            <span className="text-secondary fw-semibold">Total</span>
                            <span className="fw-bold fs-5" style={{ color: "#002060" }}>
                                Rp 2.200.000
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="d-flex align-items-center gap-2 mb-3 text-secondary">
                        <IconReceipt size={20} />
                        <h6 className="fw-bold mb-0 text-dark">Payment Instructions</h6>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: "#F3F5FA" }}>
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span 
                                    className="badge px-3 py-2 rounded-2 fw-bold fs-6 text-white" 
                                    style={{ backgroundColor: "#005E9E" }}
                                >
                                    BCA
                                </span>
                                <button 
                                    onClick={() => handleCopy("12345678910")}
                                    className="btn btn-light btn-sm rounded-circle p-2 text-secondary" 
                                    title="Salin No Rekening"
                                >
                                    <IconCopy size={18} />
                                </button>
                            </div>

                            <span className="text-uppercase small text-muted fw-semibold d-block mb-1">
                                BANK ACCOUNT NUMBER
                            </span>
                            <h3 className="fw-extrabold tracking-wider text-dark mb-3">
                                1234 5678 910
                            </h3>

                            <span className="text-uppercase small text-muted fw-semibold d-block mb-1">
                                ACCOUNT NAME
                            </span>
                            <h6 className="fw-bold text-dark mb-0">
                                Yayasan Lumina Learn
                            </h6>
                        </div>

                        <div className="p-3 rounded-3 mb-3 d-flex gap-2" style={{ backgroundColor: "#E2E8F0" }}>
                            <IconInfoCircle size={20} className="text-dark flex-shrink-0 mt-1" />
                            <p className="small text-secondary mb-0">
                                Setelah melakukan transfer, mohon <strong>upload bukti pembayaran</strong> melalui tombol di bawah ini agar dapat segera diverifikasi oleh admin sekolah.
                            </p>
                        </div>

                        <button 
                            className="btn w-100 py-3 rounded-3 text-white fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                            style={{ backgroundColor: "#001B48" }}
                        >
                            <IconUpload size={20} />
                            Upload Bukti Pembayaran
                            <IconArrowRight size={18} className="ms-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}