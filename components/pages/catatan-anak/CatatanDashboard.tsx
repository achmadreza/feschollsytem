"use client";

import { useState, useEffect } from "react";
import { 
    IconPlus, 
    IconFileText, 
    IconSend,
    IconStar, 
    IconCalendar, 
    IconDotsVertical, 
    IconMail,
    IconArrowLeft,
    IconLoader2
} from "@tabler/icons-react";
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "../../../components/ui/Button"; 
import { TambahCatatanForm } from "./TambahCatatanForm"; 
import { callApi } from "@/lib/api";

interface StudentNote {
    id: string;
    studentId: string;
    parentId: string;
    category: string;
    notedAt: string;
    indicator: number;
    title: string;
    description: string;
    photo?: string;
    suggestion?: string;
    attention?: string;
    followUp?: string;
    createdAt: string;
    updatedAt: string;
}

export function CatatanDashboard() {
    const [showForm, setShowForm] = useState(false);
    const [notes, setNotes] = useState<StudentNote[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
    const fetchStudentNotes = async () => {
        setLoading(true);
        try {
            const response = await callApi<StudentNote[] | { data: StudentNote[] }>("student-notes", {
                method: "GET",
            });
            
            const data = Array.isArray(response) ? response : response?.data;
            if (Array.isArray(data)) {
                setNotes(data);
            }
        } catch (error: any) {
            console.error("Gagal mengambil data catatan:", error);
            toast.error("Gagal memuat catatan siswa");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentNotes();
    }, []);

    const renderCategoryBadge = (category: string) => {
        let styleClass = "bg-purple-50 text-purple-600 border-purple-100";
        let dotColor = "bg-purple-600";

        const catLower = category?.toLowerCase() || "";

        if (catLower.includes("sosial") || catLower.includes("social")) {
            styleClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
            dotColor = "bg-emerald-600";
        } else if (catLower.includes("perkembangan") || catLower.includes("progress")) {
            styleClass = "bg-purple-50 text-purple-600 border-purple-100";
            dotColor = "bg-purple-600";
        }

        return (
            <span className={`px-3 py-1 rounded-pill fw-medium border d-inline-flex align-items-center gap-2 ${styleClass}`} style={{ fontSize: "13px" }}>
                {category === "PROGRESS" ? "Perkembangan" : category}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return { date: "-", time: "-" };
        const dateObj = new Date(dateString);
        return {
            date: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB"
        };
    };

    return (
        <>
            <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
                
                {showForm ? (
                    <div>
                        <button 
                            className="btn btn-link text-decoration-none text-secondary mb-3 p-0 d-flex align-items-center gap-1"
                            onClick={() => {
                                setShowForm(false);
                                fetchStudentNotes();
                            }}
                        >
                            <IconArrowLeft size={18} /> Kembali ke Dashboard
                        </button>
                        <TambahCatatanForm onClose={() => {
                            setShowForm(false);
                            fetchStudentNotes();
                        }} />
                    </div>
                ) : (
                    <>
                        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                            <div>
                                <h2 className="fw-bold text-dark m-0" style={{ fontSize: "28px" }}>Dashboard</h2>
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

                        <div className="row g-3 mb-4">
                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="bg-white p-3 rounded-4 border border-gray-100 shadow-sm h-100 d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <span className="text-secondary fw-semibold" style={{ fontSize: "13px" }}>Catatan Hari Ini</span>
                                            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: "28px" }}>{notes.length}</h3>
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
                                            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: "28px" }}>{notes.length}</h3>
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
                                            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: "28px" }}>0</h3>
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
                                            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: "28px" }}>
                                                {notes.length > 0 
                                                    ? (notes.reduce((acc, curr) => acc + (curr.indicator || 0), 0) / notes.length).toFixed(1)
                                                    : "0"}
                                            </h3>
                                        </div>
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-3">
                                            <IconStar size={20} />
                                        </div>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: "12px" }}>dari 5</span>
                                </div>
                            </div>
                        </div>

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

                        <div className="bg-white rounded-4 border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-gray-100">
                                <div>
                                    <h4 className="fw-bold text-dark m-0">Catatan Terbaru</h4>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="py-3 px-4 text-muted fw-semibold uppercase" style={{ fontSize: "11px"}}>SISWA</th>
                                            <th className="py-3 px-4 text-muted fw-semibold uppercase" style={{ fontSize: "11px" }}>JUDUL CATATAN</th>
                                            <th className="py-3 px-4 text-muted fw-semibold uppercase" style={{ fontSize: "11px" }}>KATEGORI</th>
                                            <th className="py-3 px-4 text-muted fw-semibold uppercase" style={{ fontSize: "11px" }}>WAKTU</th>
                                            {/* <th className="py-3 px-4 text-muted fw-semibold uppercase text-end" style={{ fontSize: "11px" }}>AKSI</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-5">
                                                    <div className="d-flex align-items-center justify-content-center gap-2 text-muted">
                                                        <IconLoader2 className="spinner-border text-primary border-0" size={24} />
                                                        <span>Memuat data catatan...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : notes.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-5 text-muted">
                                                    Belum ada catatan siswa yang tersedia.
                                                </td>
                                            </tr>
                                        ) : (
                                            notes.map((item) => {
                                                const formatted = formatDate(item.notedAt || item.createdAt);

                                                return (
                                                    <tr key={item.id} className="border-bottom border-gray-100">
                                                        <td className="py-3 px-4">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div>
                                                                    <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                                                                        {item.title || "Siswa"}
                                                                    </div>
                                                                    <div className="text-muted" style={{ fontSize: "12px" }}>
                                                                        ID: #{item.studentId ? item.studentId.substring(0, 7) : item.id.substring(0, 7)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="py-3 px-4 text-dark fw-medium" style={{ fontSize: "14px" }}>
                                                            {item.title}
                                                        </td>

                                                        <td className="py-3 px-4">
                                                            {renderCategoryBadge(item.category)}
                                                        </td>

                                                        <td className="py-3 px-4">
                                                            <div className="text-dark fw-medium" style={{ fontSize: "13px" }}>{formatted.date}</div>
                                                            <div className="text-muted" style={{ fontSize: "11px" }}>{formatted.time}</div>
                                                        </td>

                                                        {/* AKSI Column */}
                                                        {/* <td className="py-3 px-4 text-end">
                                                            <button className="btn btn-link text-muted p-1 border-0">
                                                                <IconDotsVertical size={18} />
                                                            </button>
                                                        </td> */}
                                                    </tr>
                                                );
                                            })
                                        )}
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