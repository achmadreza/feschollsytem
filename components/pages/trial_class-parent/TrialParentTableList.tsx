"use client";

import { useState } from "react";
import { 
    IconCalendarEvent,
    IconMapPin,
    IconArrowRight,
    IconDownload,
    IconCircleX,
    IconSchool
} from "@tabler/icons-react";
import { TrialParentDetail } from "./TrialParentDetail"; 
import { TrialParentReschedule } from "./TrialParentReschedule"; 

export function TrialParentTableList() {
    const [activeTab, setActiveTab] = useState("aktif");
    const [viewMode, setViewMode] = useState<"list" | "detail" | "reschedule">("list");
    if (viewMode === "reschedule") {
        return (
            <TrialParentReschedule 
                onBack={() => setViewMode("detail")} 
                onNext={() => {
                    alert("Permintaan reschedule berhasil dikirim!");
                    setViewMode("list");
                }} 
            />
        );
    }

    if (viewMode === "detail") {
        return (
            <TrialParentDetail 
                onBack={() => setViewMode("list")} 
                onReschedule={() => setViewMode("reschedule")}
            />
        );
    }

    return (
        <div className="container-xl" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", paddingBottom: "2rem", fontFamily: "sans-serif" }}>
            <div className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3 mb-4">
                <div>
                    <h1 className="fw-bold text-dark mb-2" style={{ fontSize: "2.0rem", maxWidth: "600px", lineHeight: "1.2" }}>
                        Mulai Perjalanan Belajar Si Kecil
                    </h1>
                    <p className="text-muted mb-0" style={{ maxWidth: "650px", fontSize: "0.95rem" }}>
                        Kelola jadwal Trial Class anak Anda dengan mudah. Program ini dirancang untuk memberikan gambaran nyata tentang metode pembelajaran interaktif kami sebelum bergabung sepenuhnya.
                    </p>
                </div>
                
                <div className="p-1 rounded-3 d-inline-flex" style={{ backgroundColor: "#EBEFF5" }}>
                    <button 
                        className={`btn btn-sm px-3 py-2 border-0 rounded-2 font-medium ${activeTab === "aktif" ? "bg-white shadow-sm" : "text-muted"}`}
                        onClick={() => setActiveTab("aktif")}
                        style={{ fontSize: "0.875rem" }}
                    >
                        1 Aktif
                    </button>
                    <button 
                        className={`btn btn-sm px-3 py-2 border-0 rounded-2 font-medium ${activeTab === "selesai" ? "bg-white shadow-sm" : "text-muted"}`}
                        onClick={() => setActiveTab("selesai")}
                        style={{ fontSize: "0.875rem" }}
                    >
                        4 Selesai
                    </button>
                </div>
            </div>

            <div className="row g-0 rounded-4 overflow-hidden shadow-sm mb-5" style={{ minHeight: "340px" }}>
                <div className="col-lg-4 p-4 text-white d-flex flex-column justify-content-between" style={{ backgroundColor: "#6366F1", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" }}>
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="p-2 rounded-3 bg-opacity-20 d-inline-flex align-items-center justify-content-center">
                                <IconCalendarEvent size={24} />
                            </div>
                            <span className="badge rounded-pill bg-opacity-20 px-3 py-2" style={{ fontSize: "0.75rem", fontWeight: "500" }}>
                                Sesi Terdekat
                            </span>
                        </div>

                        <h3 className="h4 fw-bold mb-1">Budi Santoso</h3>
                        <p className="d-flex align-items-center gap-1 opacity-90 mb-4" style={{ fontSize: "0.875rem" }}>
                            <IconSchool size={16} /> TK-A / Kelompok Bermain
                        </p>

                        <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                            <span className="d-block text-uppercase opacity-70 fw-semibold mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                STATUS
                            </span>
                            <div className="d-flex align-items-center gap-2 text-warning fw-bold" style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                                <span className="rounded-circle bg-warning" style={{ width: "8px", height: "8px" }}></span>
                                MENUNGGU PERSETUJUAN
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setViewMode("detail")}
                        className="btn btn-white w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold" 
                        style={{ backgroundColor: "#FFFFFF", color: "#4F46E5", border: "none" }}
                    >
                        Lanjutkan ke Detail Jadwal <IconArrowRight size={18} />
                    </button>
                </div>

                <div className="col-lg-8 p-4 p-md-5 bg-white d-flex flex-column flex-md-row justify-content-between gap-4">
                    <div className="d-flex flex-column gap-4 justify-content-center">
                        <div>
                            <span className="text-uppercase text-muted fw-bold d-block mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                WAKTU PELAKSANAAN
                            </span>
                            <div className="d-flex align-items-start gap-3">
                                <div className="p-2 rounded-3 text-primary d-inline-flex" style={{ backgroundColor: "#EEF2FF" }}>
                                    <IconCalendarEvent size={24} />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-semibold text-dark">Senin, 24 Juli 2024</h6>
                                    <small className="text-muted">08:00 - 10:00 WIB</small>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="text-uppercase text-muted fw-bold d-block mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                LOKASI & FASILITAS
                            </span>
                            <div className="d-flex align-items-start gap-3">
                                <div className="p-2 rounded-3 text-success d-inline-flex" style={{ backgroundColor: "#ECFDF5" }}>
                                    <IconMapPin size={24} />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-semibold text-dark">Ruang Bermain 2</h6>
                                    <small className="text-muted">Lantai 1, Gedung Utama</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column justify-content-between align-items-md-end text-md-end" style={{ maxWidth: "280px" }}>
                        <div className="d-flex align-items-center align-items-md-start gap-3 flex-md-row-reverse w-100">
                            <img 
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" 
                                alt="Ms. Rina Anggraeni" 
                                className="rounded-circle object-cover"
                                style={{ width: "48px", height: "48px" }}
                            />
                            <div>
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                    GURU PEMBIMBIMG
                                </span>
                                <h6 className="mb-0 fw-semibold text-dark">Ms. Rina Anggraeni</h6>
                                <small className="text-muted">Spesialis Early Childhood</small>
                            </div>
                        </div>

                        <div className="mt-4 mt-md-0 w-100">
                            <button className="btn btn-link text-danger p-0 text-decoration-none d-flex align-items-center gap-1 fw-semibold justify-content-md-end w-100 mb-2" style={{ fontSize: "0.9rem" }}>
                                <IconCircleX size={18} /> Batalkan Sesi
                            </button>
                            <p className="text-muted mb-0" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                                *Pembatalan dapat dilakukan maksimal 24 jam sebelum sesi dimulai.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.1rem" }}>Riwayat Trial Class</h5>
                    <button className="btn btn-link text-primary text-decoration-none fw-semibold p-0 d-flex align-items-center gap-1" style={{ fontSize: "0.9rem" }}>
                        Download Laporan Lengkap <IconDownload size={16} />
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                        <thead>
                            <tr className="text-muted" style={{ fontSize: "0.85rem", borderBottom: "1px solid #F1F5F9" }}>
                                <th className="pb-3 fw-semibold" style={{ width: "30%" }}>Siswa</th>
                                <th className="pb-3 fw-semibold" style={{ width: "25%" }}>Tanggal</th>
                                <th className="pb-3 fw-semibold" style={{ width: "25%" }}>Program</th>
                                <th className="pb-3 fw-semibold text-end" style={{ width: "20%" }}>Hasil</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: "1px solid #F8FAFC" }}>
                                <td className="py-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: "32px", height: "32px", backgroundColor: "#EEF2FF", fontSize: "0.75rem" }}>
                                            BS
                                        </div>
                                        <span className="fw-medium text-dark">Budi Santoso</span>
                                    </div>
                                </td>
                                <td className="py-3 text-secondary" style={{ fontSize: "0.9rem" }}>15 Juni 2024</td>
                                <td className="py-3">
                                    <span className="badge rounded-2 px-3 py-2 text-dark font-medium" style={{ backgroundColor: "#F1F5F9", fontSize: "0.8rem", fontWeight: "400" }}>
                                        Daycare Intro
                                    </span>
                                </td>
                                <td className="py-3 text-end">
                                    <span className="badge rounded-pill px-3 py-2 text-success fw-medium" style={{ backgroundColor: "#D1FAE5", fontSize: "0.8rem" }}>
                                        Diterima
                                    </span>
                                </td>
                            </tr>
                            
                            <tr>
                                <td className="py-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-purple" style={{ width: "32px", height: "32px", backgroundColor: "#F3E8FF", color: "#A855F7", fontSize: "0.75rem" }}>
                                            AS
                                        </div>
                                        <span className="fw-medium text-dark">Ani Sulastri</span>
                                    </div>
                                </td>
                                <td className="py-3 text-secondary" style={{ fontSize: "0.9rem" }}>10 Mei 2024</td>
                                <td className="py-3">
                                    <span className="badge rounded-2 px-3 py-2 text-dark font-medium" style={{ backgroundColor: "#F1F5F9", fontSize: "0.8rem", fontWeight: "400" }}>
                                        TK-A Trial
                                    </span>
                                </td>
                                <td className="py-3 text-end">
                                    <span className="badge rounded-pill px-3 py-2 text-secondary fw-medium" style={{ backgroundColor: "#E2E8F0", fontSize: "0.8rem" }}>
                                        Selesai
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}