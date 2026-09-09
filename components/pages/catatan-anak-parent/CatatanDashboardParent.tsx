"use client";

import { useState } from "react";
import { 
    IconNotes,
    IconTrendingUp,
    IconAlertCircle,
    IconStar,
    IconHome,
    IconExclamationCircle,
    IconUserCheck,
    IconHeartHandshake
} from "@tabler/icons-react";
import { Toaster } from 'react-hot-toast';

export function CatatanDashboard() {
    return (
        <>
            <div className="container-xl" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "sans-serif" }}>
                
                {/* Header Greeting */}
                <div className="mb-4">
                    <h2 className="fw-bold text-dark m-0 d-flex align-items-center gap-2" style={{ fontSize: "1.75rem" }}>
                        Halo, Bapak Reza 👋
                    </h2>
                    <p className="text-muted m-0 mt-1" style={{ fontSize: "0.9rem" }}>
                        Berikut perkembangan dan aktivitas Daffa hari ini.
                    </p>
                </div>

                {/* Top Summary Cards */}
                <div className="row g-3 mb-4">
                    {/* Card 1: Catatan Diterima */}
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card border-0 shadow-sm p-3 h-100 rounded-3 bg-white">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2.5 rounded-3" style={{ backgroundColor: "#EEF2FF", color: "#4F46E5" }}>
                                    <IconNotes size={22} />
                                </div>
                                <div>
                                    <span className="text-uppercase text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                                        CATATAN DITERIMA
                                    </span>
                                    <div className="d-flex align-items-baseline gap-2">
                                        <span className="fw-bold text-dark fs-3">7</span>
                                        <span className="text-muted" style={{ fontSize: "0.85rem" }}>catatan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Perkembangan Positif */}
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card border-0 shadow-sm p-3 h-100 rounded-3 bg-white">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2.5 rounded-3" style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}>
                                    <IconTrendingUp size={22} />
                                </div>
                                <div>
                                    <span className="text-uppercase text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                                        PERKEMBANGAN POSITIF
                                    </span>
                                    <div className="d-flex align-items-baseline gap-2">
                                        <span className="fw-bold text-dark fs-3">5</span>
                                        <span className="text-muted" style={{ fontSize: "0.85rem" }}>catatan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Perlu Perhatian */}
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card border-0 shadow-sm p-3 h-100 rounded-3 bg-white" style={{ borderLeft: "3px solid #0284C7" }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2.5 rounded-3" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>
                                    <IconAlertCircle size={22} />
                                </div>
                                <div>
                                    <span className="text-uppercase text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                                        PERLU PERHATIAN
                                    </span>
                                    <div className="d-flex align-items-baseline gap-2">
                                        <span className="fw-bold text-dark fs-3">1</span>
                                        <span className="text-muted" style={{ fontSize: "0.85rem" }}>catatan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Rata-Rata Perkembangan */}
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card border-0 shadow-sm p-3 h-100 rounded-3 bg-white">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2.5 rounded-3" style={{ backgroundColor: "#F3E8FF", color: "#9333EA" }}>
                                    <IconStar size={22} />
                                </div>
                                <div>
                                    <span className="text-uppercase text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                                        RATA-RATA PERKEMBANGAN
                                    </span>
                                    <div className="d-flex align-items-baseline gap-1">
                                        <span className="fw-bold text-dark fs-3">4.6</span>
                                        <span className="text-muted" style={{ fontSize: "0.85rem" }}>/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="row g-4">
                    {/* Left Column - Detail Catatan Utama */}
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                            {/* Card Top Meta */}
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#FFF7ED", color: "#EA580C", fontWeight: 500, fontSize: "0.8rem" }}>
                                    ⭐ Perkembangan
                                </span>
                                <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                                    20 Mei 2025 • 10:30 WIB
                                </span>
                            </div>

                            {/* Rating Stars & Status */}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="d-flex text-warning">
                                    <IconStar fill="#F59E0B" size={18} stroke={0} />
                                    <IconStar fill="#F59E0B" size={18} stroke={0} />
                                    <IconStar fill="#F59E0B" size={18} stroke={0} />
                                    <IconStar fill="#F59E0B" size={18} stroke={0} />
                                    <IconStar fill="#E2E8F0" size={18} stroke={0} />
                                </div>
                                <span className="fw-medium" style={{ color: "#7C3AED", fontSize: "0.85rem" }}>
                                    • 4 Stars - BSB
                                </span>
                            </div>

                            {/* Title & Description */}
                            <h4 className="fw-bold text-dark mb-2" style={{ fontSize: "1.2rem" }}>
                                Daffa mampu mengenal huruf A–D
                            </h4>
                            <p className="text-secondary lh-base mb-4" style={{ fontSize: "0.9rem" }}>
                                Hari ini Daffa menunjukkan perkembangan yang luar biasa pada kemampuan motorik halus dan kognitifnya. Daffa dapat mencocokkan huruf balok A sampai D ke dalam papan puzzle dengan mandiri, dan ia juga bisa menyebutkan bunyinya dengan tepat. Ia terlihat sangat antusias selama sesi belajar sambil bermain ini.
                            </p>

                            {/* Attached Images */}
                            <div className="row g-2 mb-4">
                                <div className="col-6">
                                    <img 
                                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600" 
                                        alt="Aktivitas Daffa" 
                                        className="img-fluid rounded-3 object-fit-cover w-100"
                                        style={{ height: "180px" }}
                                    />
                                </div>
                                <div className="col-6">
                                    <img 
                                        src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=600" 
                                        alt="Aktivitas Daffa 2" 
                                        className="img-fluid rounded-3 object-fit-cover w-100"
                                        style={{ height: "180px" }}
                                    />
                                </div>
                            </div>

                            {/* Hal yang bisa dilakukan di rumah */}
                            <div className="mb-3 d-flex gap-2 align-items-start">
                                <IconHome className="text-primary flex-shrink-0 mt-1" size={18} />
                                <div>
                                    <span className="fw-semibold text-dark d-block" style={{ fontSize: "0.85rem" }}>
                                        Hal yang bisa dilakukan di rumah
                                    </span>
                                    <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                                        Latih pengenalan huruf E-H menggunakan kartu gambar. Bermain puzzle balok bersama.
                                    </span>
                                </div>
                            </div>

                            {/* Perlu Perhatian Section */}
                            <div className="mb-4 d-flex gap-2 align-items-start">
                                <IconExclamationCircle className="text-warning flex-shrink-0 mt-1" size={18} />
                                <div>
                                    <span className="fw-semibold text-dark d-block" style={{ fontSize: "0.85rem" }}>
                                        Perlu perhatian
                                    </span>
                                    <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                                        Daffa terkadang masih bingung membedakan huruf B dan D.
                                    </span>
                                </div>
                            </div>

                            <hr className="my-3 text-border" />

                            {/* Teacher Profile Info */}
                            <div className="d-flex align-items-center gap-2">
                                <img 
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" 
                                    alt="Siti Aisyah" 
                                    className="rounded-circle object-fit-cover"
                                    style={{ width: "36px", height: "36px" }}
                                />
                                <div>
                                    <h6 className="m-0 fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>Oleh Siti Aisyah</h6>
                                    <span className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Guru TK B</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & History */}
                    <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                        
                        {/* Perkembangan Daffa Progress Card */}
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1rem" }}>
                                Perkembangan Daffa
                            </h5>
                            
                            <div className="d-flex flex-column gap-3">
                                {/* Kognitif */}
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: "0.8rem" }}>
                                        <span className="text-muted">Perkembangan Kognitif</span>
                                        <div className="text-warning">★ ★ ★ ★ ★</div>
                                    </div>
                                    <div className="progress" style={{ height: "6px" }}>
                                        <div className="progress-bar rounded-pill" role="progressbar" style={{ width: "100%", backgroundColor: "#7C3AED" }}></div>
                                    </div>
                                </div>

                                {/* Sosial & Emosional */}
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: "0.8rem" }}>
                                        <span className="text-muted">Sosial & Emosional</span>
                                        <div className="text-warning">★ ★ ★ ★ <span className="text-light-gray">☆</span></div>
                                    </div>
                                    <div className="progress" style={{ height: "6px" }}>
                                        <div className="progress-bar rounded-pill" role="progressbar" style={{ width: "80%", backgroundColor: "#7C3AED" }}></div>
                                    </div>
                                </div>

                                {/* Sikap & Karakter */}
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: "0.8rem" }}>
                                        <span className="text-muted">Sikap & Karakter</span>
                                        <div className="text-warning">★ ★ ★ ★ ★</div>
                                    </div>
                                    <div className="progress" style={{ height: "6px" }}>
                                        <div className="progress-bar rounded-pill" role="progressbar" style={{ width: "100%", backgroundColor: "#7C3AED" }}></div>
                                    </div>
                                </div>

                                {/* Kesehatan & Kemandirian */}
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: "0.8rem" }}>
                                        <span className="text-muted">Kesehatan & Kemandirian</span>
                                        <div className="text-warning">★ ★ ★ ★ <span className="text-light-gray">☆</span></div>
                                    </div>
                                    <div className="progress" style={{ height: "6px" }}>
                                        <div className="progress-bar rounded-pill" role="progressbar" style={{ width: "80%", backgroundColor: "#7C3AED" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat Catatan Card */}
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1rem" }}>
                                Riwayat Catatan
                            </h5>

                            <div className="d-flex flex-column gap-3">
                                {/* History Item 1 */}
                                <div className="d-flex justify-content-between align-items-start pb-2 border-bottom">
                                    <div>
                                        <h6 className="m-0 fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>
                                            Daffa mulai mewarnai dengan rapi
                                        </h6>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span className="badge rounded-pill" style={{ backgroundColor: "#FFF7ED", color: "#EA580C", fontSize: "0.7rem" }}>
                                                Kreativitas
                                            </span>
                                            <span className="text-warning" style={{ fontSize: "0.75rem" }}>★ ★ ★ ★ ☆</span>
                                        </div>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>18 Mei</span>
                                </div>

                                {/* History Item 2 */}
                                <div className="d-flex justify-content-between align-items-start pb-2 border-bottom">
                                    <div>
                                        <h6 className="m-0 fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>
                                            Berbagi mainan dengan teman
                                        </h6>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span className="badge rounded-pill" style={{ backgroundColor: "#F0FDF4", color: "#16A34A", fontSize: "0.7rem" }}>
                                                Sosial
                                            </span>
                                            <span className="text-warning" style={{ fontSize: "0.75rem" }}>★ ★ ★ ★ ★</span>
                                        </div>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: "0.75rem"}}>15 Mei</span>
                                </div>

                                {/* History Item 3 */}
                                <div className="d-flex justify-content-between align-items-start pb-2">
                                    <div>
                                        <h6 className="m-0 fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>
                                            Kesulitan fokus saat bercerita
                                        </h6>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span className="badge rounded-pill" style={{ backgroundColor: "#FEF2F2", color: "#DC2626", fontSize: "0.7rem" }}>
                                                Perhatian
                                            </span>
                                            <span className="text-warning" style={{ fontSize: "0.75rem" }}>★ ★ ★ ☆ ☆</span>
                                        </div>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>10 Mei</span>
                                </div>
                            </div>

                            {/* View All Button */}
                            <button 
                                className="btn w-100 mt-3 rounded-3 py-2 fw-semibold"
                                style={{ backgroundColor: "#F1F5F9", color: "#334155", fontSize: "0.85rem" }}
                            >
                                Lihat Semua Catatan
                            </button>
                        </div>

                    </div>
                </div>

            </div>
            <Toaster position="top-right" />
        </>
    );
}