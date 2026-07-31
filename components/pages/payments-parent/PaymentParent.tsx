"use client";

import { useState } from "react";
import { 
    IconDownload, 
    IconWallet, 
    IconInfoCircle, 
    IconHeadset,
    IconChevronRight,
    IconUser
} from "@tabler/icons-react";
import { Button } from "../../../components/ui/Button"; 
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import { PaymentCheckout } from "./PaymentCheckout";

export function PaymentParent() {
    const [isCheckoutView, setIsCheckoutView] = useState(false);

    const paymentHistory = [
        {
            tanggal: "05 Sep 2023",
            bulan: "September 2023",
            jumlah: "Rp 2.200.000",
            metode: "Virtual Account BCA",
            status: "LUNAS",
        },
        {
            tanggal: "08 Agu 2023",
            bulan: "Agustus 2023",
            jumlah: "Rp 1.950.000",
            metode: "Transfer Manual",
            status: "LUNAS",
        },
        {
            tanggal: "12 Jul 2023",
            bulan: "Juli 2023",
            jumlah: "Rp 2.500.000",
            metode: "Credit Card",
            status: "LUNAS",
        },
    ];

    if (isCheckoutView) {
        return <PaymentCheckout onBack={() => setIsCheckoutView(false)} />;
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
                            <h5 className="fw-bold mb-1 text-white">Rian Adi Putra</h5>
                            <p className="small text-white-50 mb-1">Kelas 5-B • NIS: 20210542</p>
                            <div className="d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                                <span className="badge bg-success rounded-circle p-1"></span>
                                <span className="text-uppercase fw-semibold tracking-wide text-success-light">
                                AKTIF / SISWA TETAP
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row g-2">
                        <div className="col-6">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
                                <span className="d-block text-white-50 small mb-1">TAHUN AJARAN</span>
                                <span className="fw-bold text-white">2023/2024</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
                                <span className="d-block text-white-50 small mb-1">PROGRAM</span>
                                <span className="fw-bold text-white">Bilingual Core</span>
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
                            <span
                                className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "28px", height: "28px" }}
                            >
                                1
                            </span>
                            <span className="small text-secondary">
                                Klik tombol "Bayar Sekarang" pada kartu tagihan bulan berjalan.
                            </span>
                        </div>
                        <div className="d-flex gap-3">
                            <span
                                className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "28px", height: "28px" }}
                            >
                                2
                            </span>
                            <span className="small text-secondary">
                                Pilih metode pembayaran yang tersedia (VA, Transfer, atau Kartu Kredit).
                            </span>
                        </div>
                        <div className="d-flex gap-3">
                            <span
                                className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "28px", height: "28px" }}
                            >
                                3
                            </span>
                            <span className="small text-secondary">
                                Ikuti instruksi sesuai metode pilihan. Pastikan jumlah transfer tepat hingga digit terakhir.
                            </span>
                        </div>
                        <div className="d-flex gap-3">
                            <span
                                className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "28px", height: "28px" }}
                            >
                                4
                            </span>
                            <span className="small text-secondary">
                                Sistem akan melakukan verifikasi otomatis dalam maksimal 15 menit.
                            </span>
                        </div>
                    </div>

                    <div className="p-3 rounded-4" style={{ backgroundColor: "#EEF2FF" }}>
                        <span className="d-block text-secondary small mb-2">Butuh bantuan teknis?</span>
                        <button
                        className="btn btn-link p-0 text-decoration-none fw-bold d-flex align-items-center gap-2"
                        style={{ color: "#002B82" }}
                        >
                        <IconHeadset size={20} />
                        Hubungi Admin Keuangan
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-8 order-2 order-lg-1">
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <span 
                        className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-semibold text-uppercase"
                        style={{ fontSize: "0.75rem" }}
                        >
                            Belum Dibayar
                        </span>
                        <div className="text-end">
                            <span className="text-muted d-block small fw-semibold">ID TAGIHAN</span>
                            <span className="fw-bold text-dark">#SPP-202310-042</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h2 className="fw-bold mb-1 text-dark">Tagihan Bulan Oktober 2023</h2>
                        <p className="text-muted mb-0">Jatuh tempo: 10 Oktober 2023</p>
                    </div>

                    <hr className="my-3 opacity-10" />

                    <div className="d-flex flex-column gap-3 my-2">
                        <div className="d-flex justify-content-between text-secondary">
                            <span>SPP Bulanan</span>
                            <span className="fw-semibold text-dark">Rp 1.500.000</span>
                        </div>
                        <div className="d-flex justify-content-between text-secondary">
                            <span>Kegiatan Ekstrakurikuler</span>
                            <span className="fw-semibold text-dark">Rp 250.000</span>
                        </div>
                        <div className="d-flex justify-content-between text-secondary">
                            <span>Uang Makan (Catering)</span>
                            <span className="fw-semibold text-dark">Rp 450.000</span>
                        </div>
                    </div>

                    <hr className="my-4 opacity-10" />

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="fs-5 fw-bold text-dark">Total Pembayaran</span>
                        <span className="fs-2 fw-bolder" style={{ color: "#002060" }}>
                        Rp 2.200.000
                        </span>
                    </div>

                    <div className="d-flex gap-3">
                        <Button
                            onClick={() => setIsCheckoutView(true)}
                            className="btn btn-primary flex-grow-1 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                            style={{ backgroundColor: "#002B82", borderColor: "#002B82" }}
                        >
                            <IconWallet size={20} />
                            Bayar Sekarang
                        </Button>
                        <button className="btn btn-outline-secondary rounded-3 px-3 d-flex align-items-center justify-content-center">
                            <IconDownload size={20} />
                        </button>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0 text-dark">Riwayat Pembayaran</h5>
                        <a href="#" className="text-primary text-decoration-none fw-semibold small d-flex align-items-center">
                        Lihat Semua <IconChevronRight size={16} />
                        </a>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-borderless align-middle mb-0">
                            <thead>
                                <tr className="text-muted border-bottom small text-uppercase">
                                <th className="fw-semibold pb-3">Tanggal</th>
                                <th className="fw-semibold pb-3">Bulan</th>
                                <th className="fw-semibold pb-3">Jumlah</th>
                                <th className="fw-semibold pb-3">Metode</th>
                                <th className="fw-semibold pb-3 text-end">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((item, index) => (
                                <tr key={index} className="border-bottom-subtle">
                                    <td className="py-3 text-muted small">{item.tanggal}</td>
                                    <td className="py-3 fw-bold text-dark">{item.bulan}</td>
                                    <td className="py-3 text-dark">{item.jumlah}</td>
                                    <td className="py-3 text-secondary">{item.metode}</td>
                                    <td className="py-3 text-end">
                                    <BadgeStatus status={item.status} />
                                    </td>
                                </tr>
                                ))}
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
                            <span
                                className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "28px", height: "28px" }}
                            >
                                1
                            </span>
                            <span className="small text-secondary">
                                Klik tombol "Bayar Sekarang" pada kartu tagihan bulan berjalan.
                            </span>
                        </div>
                        <div className="d-flex gap-3">
                            <span
                                className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "28px", height: "28px" }}
                            >
                                2
                            </span>
                            <span className="small text-secondary">
                                Pilih metode pembayaran yang tersedia (VA, Transfer, atau Kartu Kredit).
                            </span>
                        </div>
                        <div className="d-flex gap-3">
                            <span
                                className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "28px", height: "28px" }}
                            >
                                3
                            </span>
                            <span className="small text-secondary">
                                Ikuti instruksi sesuai metode pilihan. Pastikan jumlah transfer tepat hingga digit terakhir.
                            </span>
                        </div>
                        <div className="d-flex gap-3">
                            <span
                                className="badge rounded-circle bg-light text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "28px", height: "28px" }}
                            >
                                4
                            </span>
                            <span className="small text-secondary">
                                Sistem akan melakukan verifikasi otomatis dalam maksimal 15 menit.
                            </span>
                        </div>
                    </div>

                    <div className="p-3 rounded-4" style={{ backgroundColor: "#EEF2FF" }}>
                        <span className="d-block text-secondary small mb-2">Butuh bantuan teknis?</span>
                        <button
                        className="btn btn-link p-0 text-decoration-none fw-bold d-flex align-items-center gap-2"
                        style={{ color: "#002B82" }}
                        >
                        <IconHeadset size={20} />
                        Hubungi Admin Keuangan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}