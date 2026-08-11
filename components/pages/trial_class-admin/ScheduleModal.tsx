"use client";

import { useState } from "react";
import { IconX, IconSend, IconCalendar, IconClock, IconSchool, IconBuildingStore, IconNote, IconUser, IconPhone } from "@tabler/icons-react";
import { TrialData } from "./TrialTableList";
import { Button } from "../../ui/Button"; 

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TrialData | null;
  onSave?: (formData: any) => void;
}

export function ScheduleModal({ isOpen, onClose, data, onSave }: ScheduleModalProps) {
  if (!isOpen || !data) return null;

  const initials = data.initials || data.studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const [note, setNote] = useState("Sangat suka menggambar dan mewarani, agak pemalu.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave({ studentId: data.id, note });
    onClose();
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content border-0 bg-white shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
          
            <div className="modal-header border-0 px-4 pt-4 pb-2 d-flex justify-content-between align-items-start">
                <div>
                <span className="text-uppercase fw-bold text-primary tracking-wider" style={{ fontSize: "11px", color: "#6366F1" }}>Pendaftaran Baru</span>
                <h4 className="modal-title fw-extrabold text-dark mt-1" style={{ fontSize: "22px" }}>Atur Jadwal Trial Class</h4>
                </div>
                <button type="button" className="btn-close shadow-none border-0 bg-transparent p-1" onClick={onClose}>
                <IconX size={20} className="text-secondary" />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="modal-body px-4 py-3" style={{ backgroundColor: "#F8FAFC" }}>
                    <div className="p-3 mb-4 border-0 d-flex align-items-center gap-3" style={{ borderRadius: "16px", backgroundColor: "#EEF2FF" }}>
                        {data.avatarUrl ? (
                            <img src={data.avatarUrl} alt={data.studentName} className="rounded-circle object-cover" style={{ width: "56px", height: "56px" }} />
                        ) : (
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary flex-shrink-0" style={{ width: "56px", height: "56px", backgroundColor: "#E0E7FF", color: "#4F46E5", fontSize: "18px" }}>
                            {initials}
                        </div>
                        )}
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <h5 className="fw-bold text-dark mb-0" style={{ fontSize: "18px" }}>{data.studentName}</h5>
                                <span className="badge text-white px-2 py-1" style={{ backgroundColor: "#6366F1", borderRadius: "6px", fontSize: "10px" }}>{data.programClass}</span>
                            </div>
                            <p className="text-muted mb-0 mt-1" style={{ fontSize: "13px" }}>
                                <IconUser size={14}></IconUser> {data.parentName} (Ayah) <br />
                                <IconPhone size={14}></IconPhone> {data.phoneNumber}
                            </p>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <label className="form-label text-secondary fw-semibold mb-2" style={{ fontSize: "13px" }}><IconCalendar size={14}></IconCalendar>Tanggal Trial Class</label>
                            <input type="date" className="form-control py-2 shadow-none border-light-subtle" style={{ borderRadius: "10px" }} required />
                        </div>
                        <div className="col-6">
                            <label className="form-label text-secondary fw-semibold mb-2" style={{ fontSize: "13px" }}><IconClock size={14}></IconClock> Jam Trial Class</label>
                            <select className="form-select py-2 shadow-none border-light-subtle" style={{ borderRadius: "10px" }} defaultValue="09.00 - 10.00">
                                <option>09.00 - 10.00</option>
                                <option>11.00 - 12.00</option>
                                <option>13.00 - 14.00</option>
                            </select>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <label className="form-label text-secondary fw-semibold mb-2" style={{ fontSize: "13px" }}><IconSchool size={14}></IconSchool> Guru Observer</label>
                            <select className="form-select py-2 shadow-none border-light-subtle" style={{ borderRadius: "10px" }} defaultValue="Bu Sinta">
                                <option>Bu Sinta</option>
                                <option>Pak Bambang</option>
                            </select>
                        </div>
                        <div className="col-6">
                            <label className="form-label text-secondary fw-semibold mb-2" style={{ fontSize: "13px" }}><IconBuildingStore size={14}></IconBuildingStore> Ruangan / Lokasi</label>
                            <select className="form-select py-2 shadow-none border-light-subtle" style={{ borderRadius: "10px" }} defaultValue="Ruang TK A">
                                <option>Ruang TK A</option>
                                <option>Ruang TK B</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between mb-2">
                            <label className="form-label text-secondary fw-semibold mb-0" style={{ fontSize: "13px" }}><IconNote size={14}></IconNote> Catatan (Opsional)</label>
                            <span className="text-muted" style={{ fontSize: "11px" }}>{note.length}/200</span>
                        </div>
                        <textarea 
                        className="form-control shadow-none border-light-subtle" 
                        rows={3} 
                        maxLength={200}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        style={{ borderRadius: "10px", fontSize: "14px" }}
                        />
                    </div>

                    <hr className="text-black-50 my-3" />

                    <div className="mb-2">
                        <p className="text-muted mb-2 fw-semibold" style={{ fontSize: "13px" }}>Kirim Konfirmasi Ke Orang Tua</p>
                        <div className="form-check">
                            <input className="form-check-input shadow-none" type="checkbox" id="emailCheck" style={{ borderColor: "#6366F1" }} />
                            <label className="form-check-label text-dark" htmlFor="emailCheck" style={{ fontSize: "13px" }}>Kirim email ke orang tua</label>
                        </div>
                    </div>
                </div>

                <div className="modal-footer border-0 px-4 py-3 d-flex gap-2 justify-content-end" style={{ backgroundColor: "#F1F5F9" }}>
                    <Button 
                        type="button" 
                        onClick={onClose}
                        variant="outline" 
                        size="lg"
                    >
                        Batal
                    </Button>
                    <Button 
                        type="submit"
                        variant="default"
                        size="lg"
                    >
                        Kirim Jadwal
                    </Button>
                </div>
            </form>

        </div>
      </div>
    </div>
  );
}