"use client";

import { useState, useEffect } from "react";
import { 
    IconWallet, 
    IconInfoCircle, 
    IconHeadset,
    IconUser
} from "@tabler/icons-react";
import { Button } from "../../../components/ui/Button"; 
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import { PaymentCheckout } from "./PaymentCheckout";
import { callApi } from "@/lib/api";

interface StudentData {
    id: string;
    name: string;
    class: string;
    schoolCode: string;
    status: string;
    schoolYear: string;
}

interface PaymentItem {
    _id: string;
    paymentType: string;
    amount: number;
}

interface BillingData {
    _id: string;
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
    __v?: number;
}

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
    }).format(date);
};

const formatMonthYear = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", { 
        month: "long", 
        year: "numeric" 
    }).format(date);
};

export function PaymentParent() {
    const [isCheckoutView, setIsCheckoutView] = useState(false);
    const [student, setStudent] = useState<StudentData | null>(null);
    const [activeBilling, setActiveBilling] = useState<BillingData | null>(null);
    const [paymentHistory, setPaymentHistory] = useState<BillingData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const studentRes = await callApi<StudentData[] | { data: StudentData[] }>("students", {
                    method: "GET"
                });
                
                const studentData = studentRes && "data" in studentRes ? studentRes.data : studentRes;
                
                if (!studentData || studentData.length === 0) {
                    throw new Error("Gagal mengambil data siswa atau data kosong");
                }
                
                const currentStudent = studentData[0];
                setStudent(currentStudent);
                if (currentStudent && currentStudent.id) {
                    const billingRes = await callApi<BillingData[] | { data: BillingData[] }>(
                        `billings?studentId=${currentStudent.id}`, 
                        { method: "GET" }
                    );
                    
                    const billings = billingRes && "data" in billingRes ? billingRes.data : billingRes;
                    
                    if (Array.isArray(billings)) {
                        const active = billings.find((b) => b.status === "WAITING");
                        setActiveBilling(active || null);
                        setPaymentHistory(billings);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center py-5 fw-semibold text-muted">Memuat data...</div>;
    }

    if (!student) {
        return <div className="text-center py-5 fw-semibold text-danger">Data siswa tidak ditemukan.</div>;
    }

    const totalAmount = activeBilling?.paymentList 
        ? activeBilling.paymentList.reduce((acc: number, curr: any) => acc + curr.amount, 0) 
        : 0;

    if (isCheckoutView && activeBilling) {
        return (
            <PaymentCheckout 
                billingData={activeBilling} 
                onBack={() => setIsCheckoutView(false)} 
                onGoToHistory={() => setIsCheckoutView(false)}
                onGoToHome={() => setIsCheckoutView(false)}
            />
        );
    }

    return (
        <div className="row g-4">
            <div className="col-12 col-lg-4 order-1 order-lg-2">
                <div className="card border-0 shadow-sm rounded-4 p-4 text-white mb-4" style={{ backgroundColor: "#031B4E" }}>
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: "42px", height: "42px" }}>
                            <IconUser size={20} className="text-muted" />
                        </div>
                        <div>
                            <h5 className="fw-bold mb-1 text-white">{student.name}</h5>
                            <p className="small text-white-50 mb-1">Kelas {student.class} • Kode Sekolah: {student.schoolCode}</p>
                            <div className="d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                                <span className={`badge rounded-circle p-1 ${student.status === "PROCESS" ? "bg-warning" : "bg-success"}`}></span>
                                <span className="text-uppercase fw-semibold tracking-wide text-white">
                                    {student.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row g-2">
                        <div className="col-12">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
                                <span className="d-block text-white-50 small mb-1">TAHUN AJARAN</span>
                                <span className="fw-bold text-white">{student.schoolYear}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white d-none d-lg-block">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <IconInfoCircle size={22} className="text-dark" />
                        <h5 className="fw-bold mb-0 text-dark">Panduan Pembayaran</h5>
                    </div>

                    <div className="d-flex flex-column gap-3 mb-4">
                        <div className="d-flex gap-3">
                            <span className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "28px", height: "28px" }}>1</span>
                            <span className="small text-secondary">Klik tombol "Bayar Sekarang" pada kartu tagihan bulan berjalan.</span>
                        </div>
                        <div className="d-flex gap-3">
                            <span className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "28px", height: "28px" }}>2</span>
                            <span className="small text-secondary">Pilih metode pembayaran yang tersedia (VA, Transfer, atau Kartu Kredit).</span>
                        </div>
                        <div className="d-flex gap-3">
                            <span className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "28px", height: "28px" }}>3</span>
                            <span className="small text-secondary">Ikuti instruksi sesuai metode pilihan. Pastikan jumlah transfer tepat hingga digit terakhir.</span>
                        </div>
                        <div className="d-flex gap-3">
                            <span className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "28px", height: "28px" }}>4</span>
                            <span className="small text-secondary">Sistem akan melakukan verifikasi otomatis dalam maksimal 15 menit.</span>
                        </div>
                    </div>

                    <div className="p-3 rounded-4" style={{ backgroundColor: "#EEF2FF" }}>
                        <span className="d-block text-secondary small mb-2">Butuh bantuan teknis?</span>
                        <button className="btn btn-link p-0 text-decoration-none fw-bold d-flex align-items-center gap-2" style={{ color: "#002B82" }}>
                            <IconHeadset size={20} /> Hubungi Admin Keuangan
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-8 order-2 order-lg-1">
                {activeBilling ? (
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            {activeBilling.paidAt !== null || activeBilling.status === "PAID" ? (
                                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-semibold text-uppercase" style={{ fontSize: "0.75rem" }}>
                                    Sudah Dibayar
                                </span>
                            ) : (
                                <span className="badge bg-warning-subtle text-warning px-3 py-2 rounded-pill fw-semibold text-uppercase" style={{ fontSize: "0.75rem" }}>
                                    {activeBilling.status === "WAITING" ? "Belum Dibayar" : activeBilling.status}
                                </span>
                            )}

                            <div className="text-end">
                                <span className="text-muted d-block small fw-semibold">ID TAGIHAN</span>
                                <span className="fw-bold text-dark">#{activeBilling.invoiceNumber}</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className="fw-bold mb-1 text-dark">{activeBilling.description}</h2>
                            <p className="text-muted mb-0">Jatuh tempo: {formatDate(activeBilling.dueDate)}</p>
                        </div>

                        <hr className="my-3 opacity-10" />

                        <div className="d-flex flex-column gap-3 my-2">
                            {activeBilling.paymentList?.map((item: any) => (
                                <div key={item._id} className="d-flex justify-content-between text-secondary">
                                    <span>{item.paymentType}</span>
                                    <span className="fw-semibold text-dark">{formatRupiah(item.amount)}</span>
                                </div>
                            ))}
                        </div>

                        <hr className="my-4 opacity-10" />

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="fs-5 fw-bold text-dark">Total Pembayaran</span>
                            <span className="fs-2 fw-bolder" style={{ color: "#002060" }}>
                                {formatRupiah(totalAmount)}
                            </span>
                        </div>

                        <div className="d-flex gap-3">
                            <Button
                                onClick={() => setIsCheckoutView(true)}
                                disabled={activeBilling.paidAt !== null}
                                className="btn btn-primary flex-grow-1 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                style={{ 
                                    backgroundColor: activeBilling.paidAt !== null ? "#6c757d" : "#002B82", 
                                    borderColor: activeBilling.paidAt !== null ? "#6c757d" : "#002B82",
                                    cursor: activeBilling.paidAt !== null ? "not-allowed" : "pointer"
                                }}
                            >
                                <IconWallet size={20} />
                                {activeBilling.paidAt !== null ? "Sudah Dibayar" : "Bayar Sekarang"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white text-center text-muted">
                        Semua tagihan untuk periode ini telah diselesaikan. Terima kasih!
                    </div>
                )}

                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark">Riwayat Pembayaran</h4>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-borderless align-middle mb-0">
                            <thead>
                                <tr className="text-muted border-bottom small text-uppercase">
                                    <th className="fw-semibold pb-3">Tanggal Bayar</th>
                                    <th className="fw-semibold pb-3">Periode</th>
                                    <th className="fw-semibold pb-3">Jumlah</th>
                                    <th className="fw-semibold pb-3">No. Invoice</th>
                                    <th className="fw-semibold pb-3 text-end">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.length > 0 ? (
                                    paymentHistory.map((item: any) => {
                                        const historyTotal = item.paymentList?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0;
                                        return (
                                            <tr key={item.id || item._id} className="border-bottom-subtle">
                                                <td className="py-3 text-muted small">
                                                    {formatDate(item.paidAt)}
                                                </td>
                                                <td className="py-3 fw-bold text-dark">{formatMonthYear(item.dueDate)}</td>
                                                <td className="py-3 text-dark">{formatRupiah(historyTotal)}</td>
                                                <td className="py-3 text-secondary">#{item.invoiceNumber}</td>
                                                <td className="py-3 text-end">
                                                    <BadgeStatus status={item.status === "PAID" ? "LUNAS" : item.status} />
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-muted small">Belum ada riwayat pembayaran.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mt-4 d-lg-none">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <IconInfoCircle size={22} className="text-dark" />
                        <h5 className="fw-bold mb-0 text-dark">Panduan Pembayaran</h5>
                    </div>
                    <div className="d-flex flex-column gap-3 mb-4">
                        <div className="d-flex gap-3">
                            <span className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "28px", height: "28px" }}>1</span>
                            <span className="small text-secondary">Klik tombol "Bayar Sekarang" pada kartu tagihan bulan berjalan.</span>
                        </div>
                        <div className="d-flex gap-3">
                            <span className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "28px", height: "28px" }}>2</span>
                            <span className="small text-secondary">Pilih metode pembayaran yang tersedia (VA, Transfer, atau Kartu Kredit).</span>
                        </div>
                        <div className="d-flex gap-3">
                            <span className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "28px", height: "28px" }}>3</span>
                            <span className="small text-secondary">Ikuti instruksi sesuai metode pilihan. Pastikan jumlah transfer tepat hingga digit terakhir.</span>
                        </div>
                        <div className="d-flex gap-3">
                            <span className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "28px", height: "28px" }}>4</span>
                            <span className="small text-secondary">Sistem akan melakukan verifikasi otomatis dalam maksimal 15 menit.</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-4" style={{ backgroundColor: "#EEF2FF" }}>
                        <span className="d-block text-secondary small mb-2">Butuh bantuan teknis?</span>
                        <button className="btn btn-link p-0 text-decoration-none fw-bold d-flex align-items-center gap-2" style={{ color: "#002B82" }}>
                            <IconHeadset size={20} /> Hubungi Admin Keuangan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}