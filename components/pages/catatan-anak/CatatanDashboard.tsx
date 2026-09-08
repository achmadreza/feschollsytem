"use client";

import { useState } from "react";
import { 
    IconPlus, 
    IconFileText, 
    IconSend,
    IconStar, 
    IconCalendar, 
    IconDotsVertical, 
    IconMail,
    IconArrowLeft
} from "@tabler/icons-react";
import { Toaster } from 'react-hot-toast';
import { Button } from "../../../components/ui/Button"; 
import { TambahCatatanForm } from "./TambahCatatanForm"; // Import Komponen Form Baru

export function CatatanDashboard() {
    const [showForm, setShowForm] = useState(false);
    const today = new Date();
    
    const optionsDate: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    const formattedToday = today.toLocaleDateString('id-ID', optionsDate);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 3 + i);
        return {
            dateObj: d,
            day: d.toLocaleDateString('id-ID', { weekday: 'narrow' }),
            date: d.getDate(),
            active: d.toDateString() === today.toDateString()
        };
    });

    const getWeekNumber = (d: Date) => {
        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        return Math.ceil(((d.getTime() - startOfMonth.getTime()) / 86400000 + startOfMonth.getDay() + 1) / 7);
    };

    const currentWeekNumber = getWeekNumber(today);

    const [notes] = useState([
        {
            id: "#TK-021",
            name: "Daffa Alfareza",
            avatar: "https://i.pravatar.cc/150?img=11",
            title: "Daffa mampu mengenal huruf A-D",
            category: "Perkembangan",
            categoryType: "purple",
            time: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            subTime: "10:30 WIB"
        },
        {
            id: "#TK-014",
            name: "Aurelia Putri",
            avatar: "https://i.pravatar.cc/150?img=5",
            title: "Berbagi mainan dengan teman",
            category: "Sosial & Emosional",
            categoryType: "green",
            time: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            subTime: "09:45 WIB"
        }
    ]);

    const getBadgeStyle = (type: string) => {
        switch (type) {
            case "purple": return "bg-purple-100 text-purple-700 border-purple-200";
            case "green": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <>
            <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
                
                {/* Switch View antara Dashboard dan Form Tambah Catatan */}
                {showForm ? (
                    <div>
                        <button 
                            className="btn btn-link text-decoration-none text-secondary mb-3 p-0 d-flex align-items-center gap-1"
                            onClick={() => setShowForm(false)}
                        >
                            <IconArrowLeft size={18} /> Kembali ke Dashboard
                        </button>
                        <TambahCatatanForm onClose={() => setShowForm(false)} />
                    </div>
                ) : (
                    <>
                        {/* Header Section */}
                        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                            <div>
                                <h2 className="fw-bold text-dark m-0" style={{ fontSize: "28px" }}>Dashboard</h2>
                                <p className="text-muted m-0 mt-1" style={{ fontSize: "14px" }}>
                                    Ringkasan aktivitas dan perkembangan kelas TK B
                                </p>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <Button 
                                    onClick={() => setShowForm(true)} 
                                    className="bg-primary text-white border-0 fw-semibold d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm"
                                >
                                    <IconPlus size={18} />
                                    <span>Tambah Catatan Baru</span>
                                </Button>
                            </div>
                        </div>

                        {/* Cards Section */}
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="bg-white p-3 rounded-4 border border-gray-100 shadow-sm h-100 d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <span className="text-secondary fw-semibold" style={{ fontSize: "13px" }}>Catatan Hari Ini</span>
                                            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: "28px" }}>8</h3>
                                        </div>
                                        <div className="p-2 bg-light rounded-3 text-secondary">
                                            <IconFileText size={20} />
                                        </div>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: "12px" }}>catatan dibuat</span>
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="bg-white p-3 rounded-4 border border-gray-100 shadow-sm h-100 d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <span className="text-secondary fw-semibold" style={{ fontSize: "13px" }}>Terkirim ke Orang Tua</span>
                                            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: "28px" }}>7</h3>
                                        </div>
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-3">
                                            <IconSend size={20} />
                                        </div>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: "12px" }}>catatan</span>
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="bg-white p-3 rounded-4 border border-gray-100 shadow-sm h-100 d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <span className="text-secondary fw-semibold" style={{ fontSize: "13px" }}>Belum Dibaca Orang Tua</span>
                                            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: "28px" }}>1</h3>
                                        </div>
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-3">
                                            <IconMail size={20} />
                                        </div>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: "12px" }}>catatan</span>
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="bg-white p-3 rounded-4 border border-gray-100 shadow-sm h-100 d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <span className="text-secondary fw-semibold" style={{ fontSize: "13px" }}>Rata-rata Perkembangan</span>
                                            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: "28px" }}>4.6</h3>
                                        </div>
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-3">
                                            <IconStar size={20} />
                                        </div>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: "12px" }}>dari 5</span>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Bar */}
                        <div className="bg-white p-3 rounded-4 border border-gray-100 shadow-sm mb-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div className="d-flex align-items-center gap-2">
                                    <IconCalendar size={18} className="text-secondary" />
                                    <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                        Hari Ini – {formattedToday}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center gap-2 overflow-auto py-1">
                                    {weekDays.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className={`d-flex flex-column align-items-center justify-content-center rounded-3 px-3 py-1 ${
                                                item.active ? "bg-dark text-white fw-bold shadow-sm" : "text-muted bg-light"
                                            }`}
                                            style={{ minWidth: "40px", cursor: "pointer" }}
                                        >
                                            <span style={{ fontSize: "11px" }}>{item.day}</span>
                                            <span style={{ fontSize: "13px" }}>{item.date}</span>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-muted fw-medium" style={{ fontSize: "13px" }}>
                                    Minggu {currentWeekNumber}
                                </span>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="bg-white rounded-4 border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-gray-100">
                                <div>
                                    <h5 className="fw-bold text-dark m-0">Catatan Terbaru</h5>
                                    <p className="text-muted m-0 mt-1" style={{ fontSize: "13px" }}>
                                        Pantauan pencatatan terkini untuk siswa di kelas TK B
                                    </p>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="py-3 px-4 text-muted fw-semibold uppercase" style={{ fontSize: "11px" }}>SISWA</th>
                                            <th className="py-3 px-4 text-muted fw-semibold uppercase" style={{ fontSize: "11px" }}>JUDUL CATATAN</th>
                                            <th className="py-3 px-4 text-muted fw-semibold uppercase" style={{ fontSize: "11px" }}>KATEGORI</th>
                                            <th className="py-3 px-4 text-muted fw-semibold uppercase" style={{ fontSize: "11px" }}>WAKTU</th>
                                            <th className="py-3 px-4 text-muted fw-semibold uppercase text-end" style={{ fontSize: "11px" }}>AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notes.map((item, idx) => (
                                            <tr key={idx} className="border-bottom border-gray-100">
                                                <td className="py-3 px-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img src={item.avatar} alt={item.name} className="rounded-circle object-fit-cover" style={{ width: "40px", height: "40px" }} />
                                                        <div>
                                                            <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>{item.name}</div>
                                                            <div className="text-muted" style={{ fontSize: "12px" }}>ID: {item.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-dark fw-medium" style={{ fontSize: "14px" }}>{item.title}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-3 py-1 rounded-pill fw-medium border ${getBadgeStyle(item.categoryType)}`} style={{ fontSize: "12px" }}>
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-dark fw-medium" style={{ fontSize: "13px" }}>{item.time}</div>
                                                    <div className="text-muted" style={{ fontSize: "11px" }}>{item.subTime}</div>
                                                </td>
                                                <td className="py-3 px-4 text-end">
                                                    <button className="btn btn-link text-muted p-1">
                                                        <IconDotsVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

            </div>
            <Toaster position="top-right" />
        </>
    );
}