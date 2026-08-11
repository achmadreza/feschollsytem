"use client";

import { useState } from "react";
import { TrialData } from "./TrialTableList";
import { IconCalendar, IconUser, IconPhone, IconMessage, IconCheck } from "@tabler/icons-react";
import { Button } from "../../ui/Button"; 

interface ReviewRescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: TrialData | null;
    onApprove: (data: any) => void;
    onReject: (data: any) => void;
}

export function ReviewRescheduleModal({ isOpen, onClose, data, onApprove, onReject }: ReviewRescheduleModalProps) {
    const [newDate, setNewDate] = useState("2026-07-27");
    const [newTime, setNewTime] = useState("10.30 - 11.30");
    const [observer, setObserver] = useState("Ms. Indah Sari");

    if (!isOpen || !data) return null;

    const initials = data.studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px" }}>
                    <div className="modal-header border-bottom-0 pt-4 px-4 align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-purple-lt text-purple rounded-3 d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px", backgroundColor: "#F3E8FF", color: "#7C3AED" }}>
                                <IconCalendar size={22} />
                            </div>
                            <div>
                                <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: "18px" }}>Review Reschedule</h5>
                                <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>PERMINTAAN #TR-{data.id}</span>
                            </div>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>

                    <div className="modal-body px-4 py-3" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                        <div className="d-flex align-items-center mb-4 p-2">
                            {data.avatarUrl ? (
                                <img src={data.avatarUrl} alt={data.studentName} className="rounded-3 me-3 border border-2 border-primary" style={{ width: "68px", height: "68px", objectFit: "cover" }} />
                            ) : (
                                <div className="rounded-3 d-flex align-items-center justify-content-center me-3 fw-bold flex-shrink-0" style={{ width: "68px", height: "68px", backgroundColor: "#EEF2FF", color: "#4F46E5", fontSize: "20px" }}>
                                    {initials}
                                </div>
                            )}
                            <div>
                                <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "20px" }}>{data.studentName} <span className="badge bg-dark text-white rounded-2 ms-1" style={{ fontSize: "10px", padding: "3px 6px" }}>{data.programClass}</span></h4>
                                <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "13px" }}><IconUser size={14}/> {data.parentName} (Parent)</div>
                                <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "13px", marginTop: "2px" }}><IconPhone size={14}/> {data.phoneNumber}</div>
                            </div>
                        </div>

                        <div className="p-3 mb-4 rounded-4 border-start border-4" style={{ backgroundColor: "#F3E8FF", borderColor: "#7C3AED" }}>
                            <div className="d-flex align-items-center gap-2 mb-2 text-purple fw-bold" style={{ fontSize: "11px", color: "#7C3AED", letterSpacing: "0.5px" }}>
                                <IconMessage size={14} /> PESAN ORANG TUA
                            </div>
                            <p className="text-dark mb-0 italic" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                                "Mohon maaf, pada tanggal 21 Juli kami ada keperluan mendadak. Apakah bisa dijadwalkan ulang ke hari Sabtu?"
                            </p>
                        </div>

                        <div className="mb-3">
                            <span className="text-muted fw-bold d-block mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>JADWAL SAAT INI</span>
                            <div className="card border-0 p-3" style={{ backgroundColor: "#F8FAFC", borderRadius: "14px" }}>
                                <div className="row text-center text-sm-start">
                                    <div className="col-sm-4 mb-2 mb-sm-0">
                                        <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Tanggal</div>
                                        <div className="fw-bold text-dark">{data.registrationDate}</div>
                                    </div>
                                    <div className="col-sm-4 mb-2 mb-sm-0">
                                        <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Waktu</div>
                                        <div className="fw-bold text-dark">09.00 - 10.00</div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Lokasi</div>
                                        <div className="fw-bold text-dark">Ruang {data.programClass}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-2">
                            <span className="fw-bold d-block mb-2" style={{ fontSize: "11px", color: "#0F2C59", letterSpacing: "0.5px" }}>USULAN JADWAL BARU</span>
                            <div className="card border-0 p-4" style={{ backgroundColor: "#EEF2FF", borderRadius: "16px" }}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold text-dark mb-2" style={{ fontSize: "13px" }}>Pilih Tanggal Baru</label>
                                        <input type="date" className="form-control bg-white border-0 py-2.5 shadow-sm px-3" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ borderRadius: "10px" }} />
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label fw-semibold text-dark mb-2" style={{ fontSize: "13px" }}>Slot Waktu</label>
                                        <select className="form-select bg-white border-0 py-2.5 shadow-sm px-3" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ borderRadius: "10px" }}>
                                            <option value="10.30 - 11.30">10.30 - 11.30</option>
                                            <option value="13.00 - 14.00">13.00 - 14.00</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label fw-semibold text-dark mb-2" style={{ fontSize: "13px" }}>Observer / Guru</label>
                                        <select className="form-select bg-white border-0 py-2.5 shadow-sm px-3" value={observer} onChange={(e) => setObserver(e.target.value)} style={{ borderRadius: "10px" }}>
                                            <option value="Ms. Indah Sari">Ms. Indah Sari</option>
                                            <option value="Mr. Rian">Mr. Rian</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-3 p-2.5 bg-white rounded-3 d-flex align-items-center gap-2 border border-success-subtle shadow-none" style={{ backgroundColor: "#F0FDF4" }}>
                                    <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "18px", height: "18px" }}>
                                        <IconCheck size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-success fw-medium" style={{ fontSize: "12px" }}>Slot tersedia untuk tanggal dan waktu yang dipilih.</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="modal-footer border-top-0 d-flex justify-content-end gap-2 px-4 pb-4 pt-2">
                        <button type="button" className="btn btn-outline-danger px-4 py-2.5 fw-bold" style={{ borderRadius: "12px", fontSize: "14px" }} onClick={() => onReject(data)}>
                            Tolak Reschedule
                        </button>
                        <Button 
                            type="submit"
                            variant="default"
                            size="lg"
                            >
                            <IconCheck size={16} /> Setujui & Update Jadwal
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}