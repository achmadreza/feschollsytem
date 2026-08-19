"use client";

import { useState } from "react";
import { 
    IconCopy, 
    IconCheck,
    IconUpload, 
    IconArrowLeft, 
    IconSchool, 
    IconBallFootball, 
    IconUsers,
    IconChartBar,
    IconReceipt,
    IconInfoCircle
} from "@tabler/icons-react";
import { UploadProof } from "./UploadProof";

interface PaymentItem {
    _id: string;
    paymentType: string;
    amount: number;
}

interface BillingData {
    id: string;
    invoiceNumber: string;
    studentId: string;
    studentName: string;
    studentClass: string;
    schoolCode: string;
    parentId: string;
    parentEmail: string;
    description: string;
    paymentList: PaymentItem[];
    dueDate: string;
    status: string;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface PaymentCheckoutProps {
    billingData: BillingData;
    onBack: () => void;
}

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
};

const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
    }).format(date);
};

const getPaymentIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("spp") || lowerType.includes("schoo") || lowerType.includes("kuliah")) {
        return <IconSchool size={22} />;
    }
    if (lowerType.includes("ekstra") || lowerType.includes("kegiatan") || lowerType.includes("olahraga")) {
        return <IconBallFootball size={22} className="text-success" />;
    }
    return <IconUsers size={22} className="text-danger" />;
};

const getIconBgClass = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("spp") || lowerType.includes("schoo") || lowerType.includes("kuliah")) {
        return "bg-light text-primary";
    }
    if (lowerType.includes("ekstra") || lowerType.includes("kegiatan") || lowerType.includes("olahraga")) {
        return "bg-success-subtle";
    }
    return "bg-danger-subtle";
};

export function PaymentCheckout({ billingData, onBack }: PaymentCheckoutProps) {
    const [view, setView] = useState<"checkout" | "upload">("checkout");
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const totalAmount = billingData.paymentList
        ? billingData.paymentList.reduce((acc, curr) => acc + curr.amount, 0)
        : 0;

    if (view === "upload") {
        return (
            <UploadProof 
                billingId={billingData.id}
                totalAmount={totalAmount}
                onBack={() => setView("checkout")} 
                onSubmitSuccess={() => setView("checkout")}
            />
        );
    }

    return (
        <div className="container">
            <button 
                onClick={onBack}
                className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 text-secondary fw-semibold"
            >
                <IconArrowLeft size={20} /> Kembali
            </button>

            <div 
                className="card border-0 shadow-sm rounded-4 p-4 mb-4" 
                style={{ backgroundColor: "#EBF0FA" }}
            >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div>
                        <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-2 fw-bold text-uppercase mb-2">
                            {billingData.status === "WAITING" ? "UNPAID" : billingData.status}
                        </span>
                        <h4 className="fw-bold mb-1 text-dark">{billingData.description}</h4>
                        <p className="text-muted mb-0 small">Due Date: {formatDate(billingData.dueDate)}</p>
                    </div>
                    <div className="text-md-end">
                        <span className="text-uppercase small tracking-wide text-secondary fw-bold d-block mb-1">
                            TOTAL AMOUNT
                        </span>
                        <h2 className="fw-extrabold mb-0" style={{ color: "#002060", fontSize: "2.25rem" }}>
                            {formatRupiah(totalAmount)}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-6">
                    <div className="d-flex align-items-center gap-2 mb-3 text-secondary">
                        <IconChartBar size={20} />
                        <h4 className="fw-bold mb-0 text-dark">Bill Breakdown</h4>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        {billingData.paymentList?.map((item) => (
                            <div key={item._id} className="p-3 border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`p-2 rounded-3 ${getIconBgClass(item.paymentType)}`}>
                                        {getPaymentIcon(item.paymentType)}
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0 text-dark">{item.paymentType}</h6>
                                        <span className="small text-muted">Invoice #{billingData.invoiceNumber}</span>
                                    </div>
                                </div>
                                <span className="fw-bold text-dark">{formatRupiah(item.amount)}</span>
                            </div>
                        ))}

                        <div className="p-3 bg-light d-flex align-items-center justify-content-between">
                            <span className="text-secondary fw-semibold">Total</span>
                            <span className="fw-bold" style={{ color: "#002060" }}>
                                {formatRupiah(totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="d-flex align-items-center gap-2 mb-3 text-secondary">
                        <IconReceipt size={20} />
                        <h4 className="fw-bold mb-0 text-dark">Payment Instructions</h4>
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
                                    className={`btn btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1 transition-all ${
                                        copied ? "btn-success text-white" : "btn-light text-secondary"
                                    }`}
                                    title="Salin No Rekening"
                                >
                                    {copied ? (
                                        <>
                                            <IconCheck size={16} />
                                            <span className="small fw-semibold">Tersalin</span>
                                        </>
                                    ) : (
                                        <>
                                            <IconCopy size={16} />
                                            <span className="small fw-semibold">Salin</span>
                                        </>
                                    )}
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
                            onClick={() => setView("upload")}
                            className="btn w-100 py-3 rounded-3 text-white fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                            style={{ backgroundColor: "#001B48" }}
                        >
                            <IconUpload size={20} />
                            Upload Bukti Pembayaran
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}