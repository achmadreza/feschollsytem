"use client";

import { useState } from "react";
import { 
    IconPlus,
    IconTrendingUp,
    IconClipboardList,
    IconCircleCheck,
    IconAlertTriangle,
    IconWallet,
    IconSearch,
    IconChevronDown,
    IconDotsVertical,
    IconEye
} from "@tabler/icons-react";
import { Button } from "../../../components/ui/Button"; 
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { DetailTransactionModal, Transaction } from "./DetailTransactionModal";

const INITIAL_TRANSACTIONS: Transaction[] = [
    {
        id: "S2024001",
        name: "Rian Adi Putra",
        class: "Kelas 5-B",
        title: "SPP Oktober 2026",
        subtitle: "SPP Bulanan",
        amount: "Rp 500.000",
        date: "12 Okt 2026, 09:42",
        status: "MENUNGGU",
        avatarBg: "#C7D2FE",
        avatarColor: "#3730A3"
    },
    {
        id: "S2024005",
        name: "Maya Indah Sari",
        class: "Kelas 5-A",
        title: "SPP Oktober 2026",
        subtitle: "SPP Bulanan",
        amount: "Rp 500.000",
        date: "11 Okt 2026, 14:20",
        status: "LUNAS",
        avatarBg: "#DDD6FE",
        avatarColor: "#5B21B6"
    },
    {
        id: "S2024012",
        name: "Budi Cahyono",
        class: "Kelas 5-B",
        title: "Ekskul Basket",
        subtitle: "EKSKUL",
        amount: "Rp 150.000",
        date: "10 Okt 2026, 10:15",
        status: "DITOLAK",
        avatarBg: "#FEE2E2",
        avatarColor: "#991B1B"
    }
];

export function PaymentAdmin() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

    const filteredTransactions = INITIAL_TRANSACTIONS.filter((tx) => {
        const matchesSearch = tx.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              tx.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "Semua Status" || tx.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenDetail = (tx: Transaction) => {
        setSelectedTransaction(tx);
        setIsDetailModalOpen(true);
    };

    const handleApprove = (id: string) => {
        console.log("Approve payment:", id);
        setIsDetailModalOpen(false);
    };

    const handleReject = (id: string) => {
        console.log("Reject payment:", id);
        setIsDetailModalOpen(false);
    };

    return (
        <div className="container-xl" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", paddingBottom: "2rem" }}>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <span 
                        className="text-uppercase fw-bold tracking-wider" 
                        style={{ fontSize: "11px", color: "#64748B", letterSpacing: "0.05em" }}
                    >
                        FINANCIAL OVERVIEW
                    </span>
                    <h2 className="fw-bold text-dark m-0 mt-1" style={{ fontSize: "28px", letterSpacing: "-0.02em" }}>
                        Payments
                    </h2>
                    <p className="text-secondary m-0 mt-1" style={{ fontSize: "14px" }}>
                        Kelola seluruh transaksi pembayaran siswa
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <Button variant="default" size="lg" onClick={() => setIsModalOpen(true)}>
                        <IconPlus size={18} className="me-2" />
                        <span>Buat Tagihan Baru</span>
                    </Button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
                <div className="col">
                    <div className="card border-0 shadow-sm position-relative overflow-hidden h-100" style={{ borderRadius: "16px", minHeight: "170px" }}>
                        <div className="position-absolute top-0 bottom-0 start-0" style={{ width: "6px", backgroundColor: "#F59E0B" }} />
                        <div className="card-body p-4 d-flex flex-column justify-content-between position-relative z-1">
                            <div>
                                <span className="fw-bold text-uppercase" style={{ fontSize: "11px", color: "#F59E0B", letterSpacing: "0.05em" }}>MENUNGGU VERIFIKASI</span>
                                <div className="d-flex align-items-baseline gap-2 mt-3">
                                    <span className="fw-bold text-dark" style={{ fontSize: "32px", lineHeight: "1" }}>8</span>
                                    <span className="text-secondary font-medium" style={{ fontSize: "14px" }}>Transaksi</span>
                                </div>
                            </div>
                        </div>
                        <div className="position-absolute text-secondary opacity-10 pointer-events-none" style={{ right: "-10px", bottom: "-15px", color: "#E2E8F0" }}>
                            <IconClipboardList size={110} stroke={1.2} />
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="card border-0 shadow-sm position-relative overflow-hidden h-100" style={{ borderRadius: "16px", minHeight: "170px" }}>
                        <div className="position-absolute top-0 bottom-0 start-0" style={{ width: "6px", backgroundColor: "#10B981" }} />
                        <div className="card-body p-4 d-flex flex-column justify-content-between position-relative z-1">
                            <div>
                                <span className="fw-bold text-uppercase" style={{ fontSize: "11px", color: "#10B981", letterSpacing: "0.05em" }}>LUNAS HARI INI</span>
                                <div className="d-flex align-items-baseline gap-2 mt-2">
                                    <span className="fw-bold text-dark" style={{ fontSize: "28px", lineHeight: "1" }}>25</span>
                                    <span className="text-secondary font-medium" style={{ fontSize: "14px" }}>Siswa</span>
                                </div>
                                <div className="fw-bold text-dark mt-1" style={{ fontSize: "20px" }}>Rp 42.500.000</div>
                            </div>
                        </div>
                        <div className="position-absolute text-secondary opacity-10 pointer-events-none" style={{ right: "-10px", bottom: "-15px", color: "#E2E8F0" }}>
                            <IconCircleCheck size={110} stroke={1.2} />
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="card border-0 shadow-sm position-relative overflow-hidden h-100" style={{ borderRadius: "16px", minHeight: "170px" }}>
                        <div className="position-absolute top-0 bottom-0 start-0" style={{ width: "6px", backgroundColor: "#DC2626" }} />
                        <div className="card-body p-4 d-flex flex-column justify-content-between position-relative z-1">
                            <div>
                                <span className="fw-bold text-uppercase" style={{ fontSize: "11px", color: "#DC2626", letterSpacing: "0.05em" }}>BELUM DIBAYAR</span>
                                <div className="d-flex align-items-baseline gap-2 mt-2">
                                    <span className="fw-bold text-dark" style={{ fontSize: "28px", lineHeight: "1" }}>18</span>
                                    <span className="text-secondary font-medium" style={{ fontSize: "14px" }}>Siswa</span>
                                </div>
                                <div className="fw-bold text-dark mt-1" style={{ fontSize: "20px" }}>Rp 36.750.000</div>
                            </div>
                        </div>
                        <div className="position-absolute text-secondary opacity-10 pointer-events-none" style={{ right: "-10px", bottom: "-15px", color: "#E2E8F0" }}>
                            <IconAlertTriangle size={110} stroke={1.2} />
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="card border-0 shadow-sm position-relative overflow-hidden h-100 text-white" style={{ backgroundColor: "#0A194F", borderRadius: "16px", minHeight: "170px" }}>
                        <div className="card-body p-4 d-flex flex-column justify-content-between position-relative z-1">
                            <div>
                                <span className="fw-bold text-uppercase" style={{ fontSize: "11px", color: "#94A3B8", letterSpacing: "0.05em" }}>TOTAL PEMASUKAN</span>
                                <div className="mt-2">
                                    <div className="fw-semibold" style={{ fontSize: "20px", lineHeight: "1.2" }}>Rp</div>
                                    <div className="fw-bold" style={{ fontSize: "26px", letterSpacing: "-0.02em" }}>128.250.000</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-1 mt-3" style={{ fontSize: "12px", color: "#CBD5E1" }}>
                                <IconTrendingUp size={16} className="text-emerald-400" style={{ color: "#34D399" }} />
                                <span><strong className="text-white">12%</strong> dari bulan lalu</span>
                            </div>
                        </div>
                        <div className="position-absolute pointer-events-none" style={{ right: "-10px", bottom: "-15px", color: "rgba(255, 255, 255, 0.08)" }}>
                            <IconWallet size={110} stroke={1.2} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
                <div className="card-body p-4">
                    <div className="d-flex flex-column gap-3 mb-4">
                        <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
                            <div className="position-relative flex-grow-1" style={{ maxWidth: "500px" }}>
                                <IconSearch size={20} className="position-absolute top-50 translate-middle-y" style={{ left: "16px", color: "#64748B" }} />
                                <input
                                    type="text"
                                    className="form-control border-0 py-2.5 pe-3"
                                    style={{ paddingLeft: "48px", backgroundColor: "#F1F5F9", borderRadius: "14px", fontSize: "14px" }}
                                    placeholder="Cari nama siswa atau ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="dropdown">
                                <button
                                    className="btn border-secondary-subtle d-flex align-items-center justify-content-between gap-2 px-3 py-2 w-100 w-sm-auto"
                                    style={{ borderRadius: "20px", fontSize: "14px", color: "#334155", borderColor: "#CBD5E1" }}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                >
                                    <span>{statusFilter}</span>
                                    <IconChevronDown size={16} />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" style={{ borderRadius: "12px" }}>
                                    <li><button className="dropdown-item" onClick={() => setStatusFilter("Semua Status")}>Semua Status</button></li>
                                    <li><button className="dropdown-item" onClick={() => setStatusFilter("MENUNGGU")}>MENUNGGU</button></li>
                                    <li><button className="dropdown-item" onClick={() => setStatusFilter("LUNAS")}>LUNAS</button></li>
                                    <li><button className="dropdown-item" onClick={() => setStatusFilter("DITOLAK")}>DITOLAK</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-borderless align-middle mb-0">
                            <thead>
                                <tr className="border-bottom" style={{ borderColor: "#F1F5F9" }}>
                                    <th className="text-uppercase fw-semibold py-3" style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>SISWA</th>
                                    <th className="text-uppercase fw-semibold py-3" style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>KELAS</th>
                                    <th className="text-uppercase fw-semibold py-3" style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>TAGIHAN</th>
                                    <th className="text-uppercase fw-semibold py-3" style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>NOMINAL</th>
                                    <th className="text-uppercase fw-semibold py-3" style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>TANGGAL UPLOAD</th>
                                    <th className="text-uppercase fw-semibold py-3" style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>STATUS</th>
                                    <th className="py-3 text-end" style={{ width: "80px" }}>AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="border-bottom" style={{ borderColor: "#F8FAFC" }}>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div 
                                                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                                    style={{ width: "42px", height: "42px", backgroundColor: tx.avatarBg, color: tx.avatarColor, fontSize: "16px" }}
                                                >
                                                    {tx.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold text-dark" style={{ fontSize: "14px" }}>{tx.name}</div>
                                                    <div className="text-secondary" style={{ fontSize: "12px" }}>{tx.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3"><span className="fw-medium text-dark" style={{ fontSize: "14px" }}>{tx.class}</span></td>
                                        <td className="py-3">
                                            <div>
                                                <div className="fw-medium text-dark" style={{ fontSize: "14px" }}>{tx.title}</div>
                                                {tx.subtitle && <div className="text-secondary fw-semibold" style={{ fontSize: "10px", letterSpacing: "0.02em" }}>{tx.subtitle}</div>}
                                            </div>
                                        </td>
                                        <td className="py-3"><span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>{tx.amount}</span></td>
                                        <td className="py-3"><span className="text-secondary" style={{ fontSize: "13px" }}>{tx.date}</span></td>
                                        <td className="py-3"><BadgeStatus status={tx.status} /></td>
                                        <td className="py-3 text-end">
                                            <div className="dropdown">
                                                <button className="btn btn-link text-secondary p-1 border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <IconDotsVertical size={18} />
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" style={{ borderRadius: "12px" }}>
                                                    <li>
                                                        <button 
                                                            className="dropdown-item d-flex align-items-center gap-2 py-2"
                                                            style={{ fontSize: "13px" }}
                                                            onClick={() => handleOpenDetail(tx)}
                                                        >
                                                            <IconEye size={16} />
                                                            <span>Lihat Detail</span>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <CreateInvoiceModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {isDetailModalOpen && selectedTransaction && (
                <DetailTransactionModal 
                    transaction={selectedTransaction}
                    onClose={() => setIsDetailModalOpen(false)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}