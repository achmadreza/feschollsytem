"use client";

import { useEffect, useState } from "react";
import { 
    IconX, 
    IconReceipt, 
    IconInfoCircle, 
    IconPhoto, 
    IconCheck,
    IconClock,
    IconX as IconReject,
    IconLoader2
} from "@tabler/icons-react";
import { callApi } from "@/lib/api";

export interface Transaction {
    id: string; 
    name: string;
    class: string;
    title: string;
    subtitle: string;
    amount: string;
    date: string;
    status: string;
    avatarBg: string;
    avatarColor: string;
    paymentMethod?: string;
    bankTransactionId?: string;
    recipient?: string;
}

interface PaymentItem {
    paymentType: string;
    amount: number;
    _id: string;
}

interface BillingDetailResponse {
    _id: string;
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
    id: string; 
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface DetailTransactionModalProps {
    transaction: Transaction;
    onClose: () => void;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    billingId?: string; 
}

const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(value);
};

const formatDate = (dateString: string | null | undefined, fallback: string) => {
    if (!dateString) return fallback;
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short"
        }).format(date);
    } catch (e) {
        return fallback;
    }
};

export function DetailTransactionModal({
    transaction,
    onClose,
    onApprove,
    onReject,
    billingId
}: DetailTransactionModalProps) {
    const [billingData, setBillingData] = useState<BillingDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const currentStatus = transaction.status.toLowerCase();
    const isSuccess = currentStatus === "lunas" || currentStatus === "disetujui";
    const activeBillingId = billingId || transaction.id;

    useEffect(() => {
        async function fetchBillingDetail() {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await callApi<BillingDetailResponse | { data: BillingDetailResponse }>(`billings/${activeBillingId}`, { 
                    method: "GET" 
                });

                const data = (response as any)?.data ? (response as any).data : response;
                
                if (data && data.paymentList) {
                    setBillingData(data);
                } else {
                    setError("Detail rincian tagihan tidak ditemukan.");
                }
            } catch (err: any) {
                console.error("Error fetching billing detail:", err);
                setError("Gagal memuat detail tagihan resmi.");
            } finally {
                setIsLoading(false);
            }
        }

        if (activeBillingId) {
            fetchBillingDetail();
        }
    }, [activeBillingId]);

    const getStatusBadge = () => {
        if (isSuccess) {
            return {
                label: "LUNAS",
                bg: "#DCFCE7",
                color: "#15803D",
                border: "#86EFAC",
                icon: <IconCheck size={14} className="me-1" />
            };
        }
        if (currentStatus === "rejected" || currentStatus === "ditolak") {
            return {
                label: "DITOLAK",
                bg: "#FEE2E2",
                color: "#B91C1C",
                border: "#FCA5A5",
                icon: <IconReject size={14} className="me-1" />
            };
        }
        return {
            label: "MENUNGGU",
            bg: "#FEF3C7",
            color: "#B45309",
            border: "#FDE68A",
            icon: <IconClock size={14} className="me-1" />
        };
    };

    const statusStyle = getStatusBadge();
    const isWaiting = currentStatus === "menunggu" || currentStatus === "waiting" || billingData?.status.toLowerCase() === "waiting";
    const showActionButtons = billingData && isWaiting && billingData.paidAt !== null;

    return (
        <div 
            className="modal fade show d-block" 
            tabIndex={-1} 
            style={{ 
                backgroundColor: "rgba(15, 23, 42, 0.4)", 
                backdropFilter: "blur(4px)",
                zIndex: 1050 
            }}
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: "480px" }}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "24px", backgroundColor: "#FFFFFF" }}>
                    <div className="modal-header border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between">
                        <h5 className="modal-title fw-bold text-dark m-0" style={{ fontSize: "20px" }}>
                            Detail Pembayaran
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close shadow-none" 
                            onClick={onClose}
                        />
                    </div>

                    <div className="modal-body px-4 py-3">
                        <div 
                            className="p-3 mb-4 rounded-4 d-flex align-items-center gap-3"
                            style={{ backgroundColor: "#EBF2FA" }}
                        >
                            <div 
                                className="rounded-3 d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                                style={{ 
                                    width: "52px", 
                                    height: "52px", 
                                    backgroundColor: "#0B192C",
                                    fontSize: "22px"
                                }}
                            >
                                {(billingData?.studentName || transaction.name).charAt(0)}
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark m-0" style={{ fontSize: "17px" }}>
                                    {billingData?.studentName || transaction.name}
                                </h6>
                                <span className="text-secondary font-medium" style={{ fontSize: "12px" }}>
                                    ID Tagihan: <span className="fw-semibold text-dark">{billingData?.id || activeBillingId}</span> 
                                    <br />
                                    INVOICE NUMBER : <span className="fw-semibold text-dark">{billingData?.invoiceNumber}</span> 
                                </span>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                                <IconLoader2 className="animate-spin text-primary" size={32} style={{ animation: "spin 1s linear infinite" }} />
                                <span className="text-secondary" style={{ fontSize: "14px" }}>Memuat rincian item tagihan...</span>
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger rounded-4 py-3 text-center" style={{ fontSize: "14px" }}>
                                {error}
                            </div>
                        ) : (
                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-2 text-uppercase fw-bold" style={{ fontSize: "11px", color: "#1E3A8A", letterSpacing: "0.05em" }}>
                                    <IconReceipt size={16} />
                                    <span>Detail Rincian Item Tagihan</span>
                                </div>

                                <div className="p-3 rounded-4" style={{ backgroundColor: "#F8FAFC" }}>
                                    {billingData?.paymentList && billingData.paymentList.length > 0 ? (
                                        billingData.paymentList.map((item) => (
                                            <div key={item._id} className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom border-light">
                                                <span className="text-secondary" style={{ fontSize: "14px" }}>{item.paymentType}</span>
                                                <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
                                                    {formatRupiah(item.amount)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted py-2" style={{ fontSize: "13px" }}>
                                            Tidak ada rincian item pembayaran.
                                        </div>
                                    )}

                                    <div className="d-flex align-items-center justify-content-between pb-3">
                                        <span className="text-secondary" style={{ fontSize: "14px" }}>Keterangan</span>
                                        <span className="fw-semibold text-dark text-end" style={{ fontSize: "13px", maxWidth: "70%" }}>
                                            {billingData?.description}
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: "#E2E8F0" }}>
                                        <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>Total Tagihan</span>
                                        <span className="fw-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
                                            {transaction.amount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-2 text-uppercase fw-bold" style={{ fontSize: "11px", color: "#1E3A8A", letterSpacing: "0.05em" }}>
                                <IconInfoCircle size={16} />
                                <span>Informasi Pembayaran</span>
                            </div>

                            <div className="d-flex flex-column gap-2 px-1">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="text-secondary" style={{ fontSize: "14px" }}>Metode</span>
                                    <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
                                        {transaction.paymentMethod || "Transfer Bank (BCA)"}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="text-secondary" style={{ fontSize: "14px" }}>Tanggal Bayar</span>
                                    <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
                                        {billingData 
                                            ? formatDate(billingData.paidAt, "Belum Dibayar / Menunggu") 
                                            : transaction.date
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="d-flex align-items-center gap-2 mb-2 text-uppercase fw-bold" style={{ fontSize: "11px", color: "#1E3A8A", letterSpacing: "0.05em" }}>
                                <IconPhoto size={16} />
                                <span>Bukti Pembayaran</span>
                            </div>

                            <div 
                                className="p-3 position-relative" 
                                style={{ 
                                    backgroundColor: "#FFFFFF", 
                                    borderRadius: "16px",
                                    border: `1.5px solid ${statusStyle.border}`
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between pb-3 border-bottom border-dashed" style={{ borderColor: "#CBD5E1" }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div 
                                            className="rounded-2 d-flex align-items-center justify-content-center fw-bold text-white"
                                            style={{ width: "38px", height: "26px", backgroundColor: "#00529C", fontSize: "11px" }}
                                        >
                                            BCA
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: "13px", lineHeight: "1.2" }}>Bank Central Asia</div>
                                            <div className="text-secondary" style={{ fontSize: "11px" }}>Transfer Antar Bank</div>
                                        </div>
                                    </div>
                                    
                                    <span 
                                        className="badge rounded-pill fw-semibold px-2 py-1 d-flex align-items-center" 
                                        style={{ 
                                            backgroundColor: statusStyle.bg, 
                                            color: statusStyle.color, 
                                            fontSize: "11px" 
                                        }}
                                    >
                                        {statusStyle.icon}
                                        {statusStyle.label}
                                    </span>
                                </div>

                                <div className="py-3 d-flex flex-column gap-2" style={{ fontSize: "13px" }}>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary">Transaction ID</span>
                                        <span className="fw-medium text-dark">{transaction.bankTransactionId || ""}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary">Amount</span>
                                        <span className="fw-bold text-dark">{transaction.amount}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary">Recipient</span>
                                        <span className="fw-medium text-dark">{transaction.recipient || "Yayasan Pendidikan"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer border-0 p-4 pt-2">
                        {showActionButtons ? (
                            <div className="d-flex align-items-center gap-3 w-100">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger fw-semibold py-2.5 flex-fill"
                                    style={{ borderRadius: "14px" }}
                                    onClick={() => onReject ? onReject(billingData?.id || activeBillingId) : onClose()}
                                    disabled={isLoading}
                                >
                                    Tolak Pembayaran
                                </button>
                                <button
                                    type="button"
                                    className="btn fw-semibold py-2.5 flex-fill text-white"
                                    style={{ backgroundColor: "#10B981", borderRadius: "14px" }}
                                    onClick={() => onApprove ? onApprove(billingData?.id || activeBillingId) : onClose()}
                                    disabled={isLoading}
                                >
                                    Terima Pembayaran
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-secondary fw-semibold py-2.5 w-100"
                                style={{ borderRadius: "14px" }}
                                onClick={onClose}
                            >
                                Tutup
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}