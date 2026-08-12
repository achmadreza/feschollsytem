"use client";

import React, { useState } from "react";
import { 
    IconArrowLeft,
    IconCalendarMonth,
    IconClock,
    IconInfoCircle,
    IconChevronLeft,
    IconChevronRight,
    IconArrowRight,
    IconCheck
} from "@tabler/icons-react";

interface TrialParentRescheduleProps {
    onBack: () => void;
    onNext: () => void;
}

export function TrialParentReschedule({ onBack, onNext }: TrialParentRescheduleProps) {
    const [reason, setReason] = useState("Acara keluarga mendadak di luar kota.");
    const maxLength = 200;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const monthName = today.toLocaleDateString("id-ID", { month: "long" });
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const dates = Array.from({ length: totalDaysInMonth }, (_, index) => {
        const dayNumber = index + 1;
        return {
            day: dayNumber,
            current: true
        };
    });

    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

    return (
        <div className="container-xl" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", paddingBottom: "2rem", fontFamily: "sans-serif" }}>
            <button 
                onClick={onBack}
                className="btn btn-link text-decoration-none text-muted d-flex align-items-center gap-2 ps-0 mb-4 fw-semibold"
            >
                <IconArrowLeft size={18} /> Kembali ke Detail Jadwal
            </button>

            <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
                <div className="d-flex align-items-center justify-content-between w-100 flex-wrap flex-md-nowrap gap-3 text-center">
                    <div className="d-flex flex-column align-items-center flex-grow-1">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm fw-bold mb-2" style={{ width: "36px", height: "36px" }}>
                            <IconCheck size={18} />
                        </div>
                        <span className="fw-semibold text-muted" style={{ fontSize: "0.85rem" }}>Pilih Jadwal</span>
                    </div>
                    
                    <div className="flex-grow-1 d-none d-md-block" style={{ borderTop: "2px solid #06245C", marginTop: "-25px" }}></div>
                    
                    <div className="d-flex flex-column align-items-center flex-grow-1">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm fw-bold mb-2" style={{ width: "36px", height: "36px" }}>
                            <IconCheck size={18} />
                        </div>
                        <span className="fw-semibold text-muted" style={{ fontSize: "0.85rem" }}>Detail Siswa</span>
                    </div>
                    
                    <div className="flex-grow-1 d-none d-md-block" style={{ borderTop: "2px solid #E2E8F0", marginTop: "-25px" }}></div>
                    
                    <div className="d-flex flex-column align-items-center flex-grow-1">
                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm fw-bold mb-2 border border-dark border-2" style={{ width: "36px", height: "36px", backgroundColor: "#06245C" }}>
                            3
                        </div>
                        <span className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>Ajukan Perubahan</span>
                    </div>
                    
                    <div className="flex-grow-1 d-none d-md-block" style={{ borderTop: "2px solid #E2E8F0", marginTop: "-25px" }}></div>
                    
                    <div className="d-flex flex-column align-items-center flex-grow-1 opacity-50">
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold mb-2" style={{ width: "36px", height: "36px" }}>
                            4
                        </div>
                        <span className="fw-semibold text-muted" style={{ fontSize: "0.85rem" }}>Konfirmasi</span>
                    </div>
                </div>
            </div>

            <div className="card border-0 rounded-4 shadow-sm overflow-hidden bg-white">
                <div className="row g-0">
                    <div className="col-lg-4 text-white p-4 p-md-5 d-flex flex-column justify-content-between" 
                        style={{ background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)", minHeight: "450px" }}>
                        
                        <div>
                            <div className="p-3 bg-white bg-opacity-10 rounded-3 d-inline-block mb-4">
                                <IconCalendarMonth size={28} className="text-white" />
                            </div>
                            <h2 className="fw-bold mb-3" style={{ fontSize: "1.85rem", letterSpacing: "-0.5px" }}>Atur Ulang Jadwal Trial</h2>
                            <p className="text-white-50" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                                Kami memahami rencana bisa berubah. Pilih waktu yang lebih sesuai untuk kunjungan Anda.
                            </p>
                        </div>

                        <div className="my-4 text-center d-flex justify-content-center">
                            <div className="position-relative bg-white bg-opacity-10 rounded-4 p-4 d-flex align-items-center justify-content-center shadow-lg" style={{ width: "120px", height: "120px", backdropFilter: "blur(5px)" }}>
                                <IconClock size={56} className="text-white-50" />
                            </div>
                        </div>

                        <div className="p-3 rounded-3 border border-white border-opacity-10" 
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(5px)" }}>
                            <div className="d-flex gap-2 align-items-start">
                                <IconInfoCircle size={20} className="text-info flex-shrink-0 mt-0.5" />
                                <div>
                                    <h6 className="fw-bold text-white mb-1" style={{ fontSize: "0.85rem" }}>Catatan Admin</h6>
                                    <p className="text-white-50 mb-0" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                                        Setiap permintaan perubahan akan ditinjau dalam 1x24 jam. Anda akan menerima notifikasi jika jadwal baru disetujui.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 p-4 p-md-5 bg-white">
                        <div className="mb-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <label className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>Pilih Tanggal Baru</label>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold text-muted text-uppercase" style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}>
                                        {monthName} {currentYear}
                                    </span>
                                    <button className="btn btn-sm btn-light p-1 border-0 rounded-circle"><IconChevronLeft size={16} /></button>
                                    <button className="btn btn-sm btn-light p-1 border-0 rounded-circle"><IconChevronRight size={16} /></button>
                                </div>
                            </div>

                            <div className="row g-2 text-center row-cols-7 fw-semibold text-secondary mb-2" style={{ fontSize: "0.85rem" }}>
                                <div className="col" style={{ width: "14.28%" }}>S</div>
                                <div className="col" style={{ width: "14.28%" }}>M</div>
                                <div className="col" style={{ width: "14.28%" }}>T</div>
                                <div className="col" style={{ width: "14.28%" }}>W</div>
                                <div className="col" style={{ width: "14.28%" }}>T</div>
                                <div className="col" style={{ width: "14.28%" }}>F</div>
                                <div className="col" style={{ width: "14.28%" }}>S</div>
                            </div>
                            
                            <div className="d-flex flex-wrap text-center align-items-center gap-y-2" style={{ fontSize: "0.9rem" }}>
                                {dates.map((item, idx) => {
                                    const isSelected = item.day === selectedDay;
                                    return (
                                        <div key={idx} style={{ width: "14.28%", padding: "0.25rem" }}>
                                            <button 
                                                onClick={() => setSelectedDay(item.day)}
                                                className={`btn w-100 py-2 border-0 rounded-3 fw-bold ${
                                                    isSelected 
                                                        ? "btn-primary shadow-sm text-white" 
                                                        : "btn-light text-dark"
                                                }`}
                                                style={isSelected ? { backgroundColor: "#06245C" } : {}}
                                                type="button"
                                            >
                                                {item.day}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="fw-bold text-dark mb-2" style={{ fontSize: "0.95rem" }}>Pilih Slot Waktu</label>
                            <select className="form-select form-select-lg rounded-3 border-2 border-light-subtle text-muted" style={{ fontSize: "0.95rem" }}>
                                <option>Pilih jam kunjungan...</option>
                                <option value="1">08:30 - 10:00 WIB</option>
                                <option value="2">10:30 - 12:00 WIB</option>
                                <option value="3">13:00 - 14:30 WIB</option>
                            </select>
                        </div>

                        <div className="mb-5">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <label className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>Alasan Perubahan</label>
                                <span className="badge bg-light text-secondary rounded-pill border py-1 px-2" style={{ fontSize: "0.75rem" }}>
                                    {reason.length} / {maxLength}
                                </span>
                            </div>
                            <textarea 
                                className="form-control rounded-3 p-3 border-0 bg-light" 
                                rows={4} 
                                style={{ resize: "none", fontSize: "0.95rem", backgroundColor: "#F1F5F9" }}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Tulis alasan perubahan disini..."
                                maxLength={maxLength}
                            />
                        </div>

                        <div className="d-flex flex-column align-items-center gap-3">
                            <button 
                                onClick={onNext}
                                className="btn text-white w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm border-0" 
                                style={{ backgroundColor: "#7C3AED" }}
                            >
                                Lanjut ke Konfirmasi <IconArrowRight size={18} />
                            </button>
                            <button 
                                onClick={onBack}
                                className="btn btn-link text-decoration-none fw-bold text-uppercase" 
                                style={{ color: "#64748B", fontSize: "0.85rem", letterSpacing: "1px" }}
                            >
                                BATAL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}