"use client";

import { 
    IconX, 
    IconReceipt, 
    IconInfoCircle, 
    IconPhoto, 
    IconCheck,
    IconClock,
    IconX as IconReject
} from "@tabler/icons-react";

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

interface DetailTransactionModalProps {
    transaction: Transaction;
    onClose: () => void;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
}

export function DetailTransactionModal({
    transaction,
    onClose,
    onApprove,
    onReject
}: DetailTransactionModalProps) {
    const currentStatus = transaction.status.toLowerCase();
    const getStatusBadge = () => {
        if (currentStatus === "LUNAS" || currentStatus === "lunas" || currentStatus === "disetujui") {
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
    const isPending = currentStatus === "pending" || currentStatus === "menunggu";

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
                                {transaction.name.charAt(0)}
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark m-0" style={{ fontSize: "17px" }}>
                                    {transaction.name}
                                </h6>
                                <span className="text-secondary font-medium" style={{ fontSize: "13px" }}>
                                    {transaction.id} &bull; {transaction.class}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-2 text-uppercase fw-bold" style={{ fontSize: "11px", color: "#1E3A8A", letterSpacing: "0.05em" }}>
                                <IconReceipt size={16} />
                                <span>Detail Tagihan</span>
                            </div>

                            <div className="p-3 rounded-4" style={{ backgroundColor: "#F8FAFC" }}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-secondary" style={{ fontSize: "14px" }}>Jenis Tagihan</span>
                                    <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
                                        {transaction.subtitle || transaction.title}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between pb-3 border-bottom" style={{ borderColor: "#E2E8F0" }}>
                                    <span className="text-secondary" style={{ fontSize: "14px" }}>Periode</span>
                                    <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
                                        {transaction.title}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between pt-3">
                                    <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>Total Tagihan</span>
                                    <span className="fw-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
                                        {transaction.amount}
                                    </span>
                                </div>
                            </div>
                        </div>

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
                                        {transaction.date}
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
                                        <span className="fw-medium text-dark">{transaction.bankTransactionId || "TRX-992834102"}</span>
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
                        {isPending ? (
                            <div className="d-flex align-items-center gap-3 w-100">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger fw-semibold py-2.5 flex-fill"
                                    onClick={() => onReject ? onReject(transaction.id) : onClose()}
                                >
                                    Tolak Pembayaran
                                </button>
                                <button
                                    type="button"
                                    className="btn fw-semibold py-2.5 flex-fill text-white"
                                    style={{backgroundColor: "#10B981" }}
                                    onClick={() => onApprove ? onApprove(transaction.id) : onClose()}
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