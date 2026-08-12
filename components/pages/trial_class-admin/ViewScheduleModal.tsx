"use client";

import { useState, useEffect } from "react";
import { IconX, IconCalendarEvent, IconUser, IconUsers, IconPhone } from "@tabler/icons-react";
import { TrialData } from "./TrialTableList";
import { BadgeStatus } from "../../../components/ui/BadgeStatus";

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TrialData | null;
}

export function ViewScheduleModal({ isOpen, onClose, data }: ViewScheduleModalProps) {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (isOpen) setImgError(false);
    }, [isOpen]);

    if (!isOpen || !data) return null;

    const initials = data.initials || data.studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    const detailTambahan = {
        nisn: "0123456789",
        tempatTanggalLahir: "Jakarta, 15 Agustus 2018",
        namaAyah: data.parentName || "Budi Setiawan",
        namaIbu: "Siti Aminah",
        waktuTrial: "10.00 - 11.00",
        lokasiTrial: `Ruang ${data.programClass}`,
        observer: "Bu Sinta"
    };

    return (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 overflow-hidden position-relative shadow-lg" style={{ borderRadius: "24px", backgroundColor: "#F8FAFC" }}>
                
                    <div className="position-absolute w-100" style={{ height: "140px", background: "linear-gradient(135deg, #E0E7FF 0%, #EEF2FF 100%)", top: 0, left: 0, zIndex: 0 }}>
                        <div className="position-absolute rounded-circle" style={{ width: "200px", height: "200px", backgroundColor: "rgba(79, 70, 229, 0.05)", right: "-50px", top: "-50px" }} />
                    </div>
                    
                    <button 
                        type="button" 
                        className="btn-close position-absolute bg-white rounded-circle p-2 shadow-sm border-0 d-flex align-items-center justify-content-center" 
                        onClick={onClose}
                        style={{ right: "20px", top: "20px", zIndex: 10, width: "36px", height: "36px" }}
                        aria-label="Close"
                    >
                        <IconX size={18} className="text-dark" />
                    </button>

                    <div className="modal-body px-4 pt-5 pb-4 position-relative" style={{ zIndex: 1, marginTop: "40px" }}>
                        <div className="text-center mb-4">
                            <div className="d-inline-block position-relative mb-3">
                                {data.avatarUrl && !imgError ? (
                                <img 
                                    src={data.avatarUrl} 
                                    alt={data.studentName} 
                                    className="rounded-circle border border-4 border-white shadow" 
                                    style={{ width: "110px", height: "110px", objectFit: "cover" }} 
                                    onError={() => setImgError(true)}
                                />
                                ) : (
                                <div className="rounded-circle border border-4 border-white shadow d-flex align-items-center justify-content-center fw-bold text-primary bg-white" style={{ width: "110px", height: "110px", fontSize: "32px" }}>
                                    {initials}
                                </div>
                                )}
                            </div>
                            <h3 className="fw-bold text-dark mb-1" style={{ fontSize: "24px" }}>{data.studentName}</h3>
                            <span className="badge px-3 py-2 rounded-pill fw-semibold" style={{ backgroundColor: "#EEF2FF", color: "#4F46E5", fontSize: "13px" }}>
                                🎓 Grade: {data.programClass}
                            </span>
                        </div>

                        <div className="card border-0 p-4 mb-4 shadow-sm" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="p-2 rounded-3 bg-light text-primary">
                                        <IconCalendarEvent size={20} />
                                    </div>
                                    <h5 className="fw-bold text-dark m-0" style={{ fontSize: "16px", letterSpacing: "0.5px" }}>DETAIL JADWAL TRIAL</h5>
                                </div>
                                <BadgeStatus status={data.status} />
                            </div>
                            
                            <div className="row g-3">
                                <div className="col-6 col-md-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>Tanggal</div>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{data.registrationDate}</div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>Waktu</div>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{detailTambahan.waktuTrial}</div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>Lokasi</div>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{detailTambahan.lokasiTrial}</div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>Observer</div>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{detailTambahan.observer}</div>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <div className="card border-0 p-4 h-100 shadow-sm" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <div className="p-2 rounded-3 bg-light text-secondary">
                                        <IconUser size={18} />
                                        </div>
                                        <h5 className="fw-bold text-dark m-0" style={{ fontSize: "16px" }}>Data Pribadi</h5>
                                    </div>
                                    <div className="mb-3">
                                        <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>Nama Lengkap</div>
                                        <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{data.studentName}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>NISN</div>
                                        <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{detailTambahan.nisn}</div>
                                    </div>
                                    <div>
                                        <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>Tempat, Tanggal Lahir</div>
                                        <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{detailTambahan.tempatTanggalLahir}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="card border-0 p-4 h-100 shadow-sm" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <div className="p-2 rounded-3 bg-light text-secondary">
                                        <IconUsers size={18} />
                                        </div>
                                        <h5 className="fw-bold text-dark m-0" style={{ fontSize: "16px" }}>Data Orang Tua</h5>
                                    </div>
                                    <div className="mb-3">
                                        <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>Nama Ayah</div>
                                        <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{detailTambahan.namaAyah}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>Nama Ibu</div>
                                        <div className="fw-semibold text-dark" style={{ fontSize: "15px" }}>{detailTambahan.namaIbu}</div>
                                    </div>
                                    <div>
                                        <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "11px" }}>No. HP Orang Tua</div>
                                        <div className="d-flex align-items-center justify-content-between fw-semibold text-dark" style={{ fontSize: "15px" }}>
                                        <span>{data.phoneNumber}</span>
                                        <button className="btn btn-light btn-sm p-1 rounded d-flex align-items-center justify-content-center" style={{ width: "28px", height: "28px" }}>
                                            <IconPhone size={14} className="text-muted" />
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer border-top-0 px-4 pb-4 pt-2 bg-light d-flex justify-content-end">
                        <button 
                        type="button" 
                        className="btn text-white fw-bold px-4 py-2" 
                        style={{ backgroundColor: "#0F2C59", borderRadius: "10px", fontSize: "14px" }}
                        onClick={onClose}
                        >
                        Tutup
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}