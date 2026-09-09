"use client";

import { useState } from "react";
import { 
    IconPlus, 
    IconExclamationMark, 
    IconWallet, 
    IconListDetails, 
    IconSpeakerphone, 
    IconUser, 
    IconStarFilled 
} from "@tabler/icons-react";
import { Toaster } from 'react-hot-toast';
import { Button } from "../../../components/ui/Button";

export function ParentDashboard() {
    return (
        <>
            <div className="container-xl p-3 p-md-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "sans-serif" }}>
                
                {/* 1. HERO HEADER BANNER */}
                <div 
                    className="card border-0 text-white mb-4 p-4 rounded-4 shadow-sm" 
                    style={{ background: "linear-gradient(135deg, #3B4CCA 0%, #6157F6 100%)" }}
                >
                    <div className="row align-items-center g-4">
                        <div className="col-lg-7">
                            <span className="badge bg-white bg-opacity-20 text-white text-uppercase px-3 py-2 rounded-pill fw-semibold mb-3 style-badge">
                                Academic Year 2023/2024
                            </span>
                            <h1 className="fw-bold mb-2 display-6">Welcome back, <br />Mr. Aria Wijaya</h1>
                            <p className="text-white-50 mb-0 max-w-md" style={{ maxWidth: '420px', fontSize: '0.95rem' }}>
                                Stay updated with Lucas's academic progress and school activities in real-time. Everything is organized for your peace of mind.
                            </p>
                        </div>
                        <div className="col-lg-5">
                            <div className="p-3 rounded-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(8px)" }}>
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="position-relative">
                                        <img 
                                            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" 
                                            alt="Lucas Wijaya" 
                                            className="rounded-3 object-fit-cover"
                                            style={{ width: "50px", height: "50px" }}
                                        />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0 text-white">Lucas Wijaya</h5>
                                        <small className="text-white-50">Grade 11 - Science A</small>
                                    </div>
                                </div>

                                {/* Progress Bar Attendance */}
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between text-white small mb-1">
                                        <span className="text-white-50">Attendance Rate</span>
                                        <span className="fw-bold">92%</span>
                                    </div>
                                    <div className="progress rounded-pill" style={{ height: "6px", backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                                        <div className="progress-bar bg-success rounded-pill" style={{ width: "92%" }}></div>
                                    </div>
                                </div>

                                <Button className="w-100 btn-dark d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 border-0" style={{ backgroundColor: "#0F172A" }}>
                                    <IconPlus size={18} />
                                    <span>Tambah Data Siswa</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. TAGIHAN MENDESAK ALERT BAR */}
                <div className="card border-danger border-opacity-10 bg-white p-3 p-md-4 rounded-4 mb-4 shadow-sm">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                        <div className="d-flex gap-3 align-items-start">
                            <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40 }}>
                                <IconExclamationMark size={24} />
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <span className="badge bg-danger bg-opacity-10 text-danger text-uppercase fw-semibold px-2 py-1 rounded-1" style={{ fontSize: "0.7rem" }}>
                                        Tagihan Mendesak
                                    </span>
                                    <small className="text-muted">Batas Waktu: 20 Okt 2023</small>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">SPP Semester Gasal (Bulan Oktober)</h5>
                                <p className="text-secondary small mb-0">
                                    Pembayaran telah lewat jatuh tempo 3 hari. Harap segera melakukan penyelesaian untuk kelancaran administrasi.
                                </p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 ms-auto ms-md-0 flex-shrink-0">
                            <div className="text-end">
                                <small className="text-muted d-block">Total Tagihan</small>
                                <span className="fs-4 fw-bold text-danger">Rp 4.250.000</span>
                            </div>
                            <Button className="btn-dark d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ backgroundColor: "#0F172A" }}>
                                <IconWallet size={18} />
                                <span>Bayar Sekarang</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 3. TWO COLUMN CONTENT SECTION */}
                <div className="row g-4">
                    {/* LEFT COLUMN: CATATAN HARIAN */}
                    <div className="col-lg-7">
                        <div className="card border-0 bg-white p-4 rounded-4 shadow-sm h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center gap-2">
                                    <IconListDetails className="text-secondary" size={20} />
                                    <h5 className="fw-bold mb-0">Catatan Harian</h5>
                                </div>
                                <a href="#" className="text-decoration-none fw-semibold small text-primary">Lihat Semua &gt;</a>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {/* Note Item 1 */}
                                <div className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1" style={{ fontSize: "0.75rem" }}>
                                                Perkembangan Bahasa
                                            </span>
                                            <div className="d-flex text-warning">
                                                <IconStarFilled size={14} /><IconStarFilled size={14} /><IconStarFilled size={14} />
                                            </div>
                                        </div>
                                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>Hari ini, 10:15</small>
                                    </div>
                                    <h6 className="fw-bold text-dark mb-1">Mampu Mengenal & Menulis Huruf A-D</h6>
                                    <p className="text-secondary small mb-2">
                                        Lucas sangat antusias dalam menyusun kartu suku kata dan mampu menuliskan huruf dengan rapi tanpa bimbingan berlebih.
                                    </p>
                                    <small className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                                        <IconUser size={12} /> Guru: Ibu Rahmawati, S.Pd.
                                    </small>
                                </div>

                                {/* Note Item 2 */}
                                <div className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1" style={{ fontSize: "0.75rem" }}>
                                                Kemandirian & Logika
                                            </span>
                                            <div className="d-flex text-warning">
                                                <IconStarFilled size={14} /><IconStarFilled size={14} /><IconStarFilled size={14} />
                                            </div>
                                        </div>
                                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>Kemarin, 14:00</small>
                                    </div>
                                    <h6 className="fw-bold text-dark mb-1">Menyelesaikan Puzzle Tangram Mandiri</h6>
                                    <p className="text-secondary small mb-2">
                                        Dapat mengelompokkan bentuk geometri dan menyusun tangram hewan dalam waktu 15 menit dengan fokus tinggi.
                                    </p>
                                    <small className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                                        <IconUser size={12} /> Guru: Bpk. Bambang Pamungkas
                                    </small>
                                </div>

                                {/* Note Item 3 */}
                                <div className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-2 py-1" style={{ fontSize: "0.75rem" }}>
                                                Sosial Emosional
                                            </span>
                                            <div className="d-flex text-warning">
                                                <IconStarFilled size={14} /><IconStarFilled size={14} />
                                            </div>
                                        </div>
                                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>24 Okt 2023</small>
                                    </div>
                                    <h6 className="fw-bold text-dark mb-1">Berbagi Mainan & Kerja Sama Kelompok</h6>
                                    <p className="text-secondary small mb-2">
                                        Menunjukkan sikap suportif terhadap teman sekelas saat sesi bermain kelompok balok kayu di ruang kelas.
                                    </p>
                                    <small className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                                        <IconUser size={12} /> Guru: Ibu Rahmawati, S.Pd.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: INFORMASI PENGUMUMAN */}
                    <div className="col-lg-5">
                        <div className="card border-0 bg-white p-4 rounded-4 shadow-sm h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center gap-2">
                                    <IconSpeakerphone className="text-secondary" size={20} />
                                    <h5 className="fw-bold mb-0">Informasi Pengumuman</h5>
                                </div>
                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">
                                    3 Pengumuman
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {/* Announcement Item 1 */}
                                <div className="d-flex gap-3 align-items-start pb-3 border-bottom">
                                    <div className="bg-dark text-white rounded-3 p-2 text-center flex-shrink-0" style={{ width: "50px", backgroundColor: "#0F172A" }}>
                                        <small className="d-block text-uppercase fw-semibold" style={{ fontSize: "0.65rem" }}>Besok</small>
                                        <span className="fw-bold fs-5">26</span>
                                    </div>
                                    <div>
                                        <span className="badge bg-success bg-opacity-10 text-success rounded-1 px-2 py-1 mb-1" style={{ fontSize: "0.7rem" }}>
                                            Kegiatan Luar
                                        </span>
                                        <h6 className="fw-bold text-dark mb-1">Membawa 1 Bibit Tanaman / Pohon</h6>
                                        <p className="text-secondary small mb-0 text-truncate-2">
                                            Peringatan Hari Bumi di sekolah. Harap membawakan bibit tanaman berukuran...
                                        </p>
                                    </div>
                                </div>

                                {/* Announcement Item 2 */}
                                <div className="d-flex gap-3 align-items-start pb-3 border-bottom">
                                    <div className="bg-primary text-white rounded-3 p-2 text-center flex-shrink-0" style={{ width: "50px", backgroundColor: "#6157F6" }}>
                                        <small className="d-block text-uppercase fw-semibold" style={{ fontSize: "0.65rem" }}>Okt</small>
                                        <span className="fw-bold fs-5">28</span>
                                    </div>
                                    <div>
                                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-1 px-2 py-1 mb-1" style={{ fontSize: "0.7rem" }}>
                                            Wajib Hadir
                                        </span>
                                        <h6 className="fw-bold text-dark mb-1">Parent-Teacher Meeting (PTM)</h6>
                                        <p className="text-secondary small mb-0 text-truncate-2">
                                            Evaluasi pertengahan semester bersama wali kelas di Auditorium Utama mulai pukul
                                        </p>
                                    </div>
                                </div>

                                {/* Announcement Item 3 */}
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-secondary bg-opacity-20 text-dark rounded-3 p-2 text-center flex-shrink-0" style={{ width: "50px" }}>
                                        <small className="d-block text-uppercase fw-semibold text-muted" style={{ fontSize: "0.65rem" }}>Des</small>
                                        <span className="fw-bold fs-5 text-secondary">18</span>
                                    </div>
                                    <div>
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-1 px-2 py-1 mb-1" style={{ fontSize: "0.7rem" }}>
                                            Jadwal Libur
                                        </span>
                                        <h6 className="fw-bold text-dark mb-1">Pemberitahuan Libur Semester Gasal</h6>
                                        <p className="text-secondary small mb-0 text-truncate-2">
                                            Periode libur akhir semester dimulai 18 Des 2023 hingga 2 Jan 2024. Masuk kembali 3...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Toaster position="top-right" />
        </>
    );
}