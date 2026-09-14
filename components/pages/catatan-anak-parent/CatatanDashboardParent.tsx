"use client";

import { useEffect, useState } from "react";
import { 
    IconNotes,
    IconTrendingUp,
    IconAlertCircle,
    IconStar,
    IconHome,
    IconExclamationCircle
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { callApi } from "@/lib/api";

// Interface data catatan
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
    createdAt?: string;
    updatedAt?: string;
}

// Dummy data sebagai fallback jika API Inquiry Disabled (Error 400)
const FALLBACK_NOTES: StudentNote[] = [
    {
        id: "e99bd83c-d14e-4d1d-8562-54f5f97d9b15",
        studentId: "e356ec65-4fdb-4af1-8572-7e738ac8d19b",
        parentId: "1",
        category: "HEALTH",
        notedAt: "2026-09-06T09:00:00.000Z",
        indicator: 4,
        title: "Learning progress",
        description: "Shows strong participation during reading activities.",
        photo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600",
        suggestion: "Practice reading for 15 minutes each day.",
        attention: "Needs additional support with sentence construction.",
        followUp: "Review progress with the parent next week."
    },
    {
        id: "942b76c9-a208-49e3-b2f4-d9c81c005743",
        studentId: "e356ec65-4fdb-4af1-8572-7e738ac8d19b",
        parentId: "1",
        category: "PROGRESS",
        notedAt: "2026-09-14T00:00:00.000Z",
        indicator: 3,
        title: "TEST",
        description: "test deskripsi",
        photo: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=600",
        suggestion: "test",
        attention: "test",
        followUp: "test"
    }
];

export function CatatanDashboard() {
    const [notes, setNotes] = useState<StudentNote[]>([]);
    const [selectedNote, setSelectedNote] = useState<StudentNote | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchStudentNotes();
    }, []);

    const fetchStudentNotes = async () => {
        setLoading(true);
        try {
            // Pemanggilan endpoint API
            const response = await callApi("/student-notes", { method: "GET" });
            
            if (Array.isArray(response)) {
                setNotes(response);
                setSelectedNote(response[0] || null);
            } else if (response?.kode === 400 || response?.pesan) {
                // Menangani response error backend: {"kode":400,"pesan":"Inquiry function is disabled"}
                toast.error(`API Error: ${response.pesan || "Inquiry function disabled"}. Memuat data fallback.`);
                setNotes(FALLBACK_NOTES);
                setSelectedNote(FALLBACK_NOTES[0]);
            } else {
                setNotes(FALLBACK_NOTES);
                setSelectedNote(FALLBACK_NOTES[0]);
            }
        } catch (error: any) {
            console.error("Fetch error:", error);
            toast.error("Gagal mengambil data dari server. Memproses data cadangan.");
            setNotes(FALLBACK_NOTES);
            setSelectedNote(FALLBACK_NOTES[0]);
        } finally {
            setLoading(false);
        }
    };

    // Kalkulasi Statistik Dinamis dari Array Data
    const totalCatatan = notes.length;
    const perkembanganPositif = notes.filter(n => n.indicator >= 4).length;
    const perluPerhatian = notes.filter(n => n.indicator < 4).length;
    const avgRating = totalCatatan > 0 
        ? (notes.reduce((acc, curr) => acc + curr.indicator, 0) / totalCatatan).toFixed(1)
        : "0.0";

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <IconStar 
                key={i} 
                fill={i < rating ? "#F59E0B" : "#E2E8F0"} 
                size={18} 
                stroke={0} 
            />
        ));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    return (
        <>
            <div className="container-xl py-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "sans-serif" }}>
                
                {/* Header Greeting */}
                <div className="mb-4">
                    <h2 className="fw-bold text-dark m-0 d-flex align-items-center gap-2" style={{ fontSize: "1.75rem" }}>
                        Halo, Bapak Reza 👋
                    </h2>
                    <p className="text-muted m-0 mt-1" style={{ fontSize: "0.9rem" }}>
                        Berikut perkembangan dan aktivitas siswa hari ini.
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
                                        <span className="fw-bold text-dark fs-3">{loading ? "-" : totalCatatan}</span>
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
                                        <span className="fw-bold text-dark fs-3">{loading ? "-" : perkembanganPositif}</span>
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
                                        <span className="fw-bold text-dark fs-3">{loading ? "-" : perluPerhatian}</span>
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
                                        <span className="fw-bold text-dark fs-3">{loading ? "-" : avgRating}</span>
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
                        {selectedNote ? (
                            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                                {/* Card Top Meta */}
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                    <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#FFF7ED", color: "#EA580C", fontWeight: 500, fontSize: "0.8rem" }}>
                                        ⭐ {selectedNote.category}
                                    </span>
                                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                                        {formatDate(selectedNote.notedAt)}
                                    </span>
                                </div>

                                {/* Rating Stars & Status */}
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="d-flex gap-1">
                                        {renderStars(selectedNote.indicator)}
                                    </div>
                                    <span className="fw-medium" style={{ color: "#7C3AED", fontSize: "0.85rem" }}>
                                        • Indikator {selectedNote.indicator} Stars
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h4 className="fw-bold text-dark mb-2" style={{ fontSize: "1.2rem" }}>
                                    {selectedNote.title}
                                </h4>
                                <p className="text-secondary lh-base mb-4" style={{ fontSize: "0.9rem" }}>
                                    {selectedNote.description}
                                </p>

                                {/* Attached Images (Base64 atau URL) */}
                                {selectedNote.photo && (
                                    <div className="row g-2 mb-4">
                                        <div className="col-12 col-md-6">
                                            <img 
                                                src={selectedNote.photo.startsWith("data:") || selectedNote.photo.startsWith("http") ? selectedNote.photo : "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"} 
                                                alt="Aktivitas Siswa" 
                                                className="img-fluid rounded-3 object-fit-cover w-100"
                                                style={{ height: "180px" }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Saran / Hal yang bisa dilakukan di rumah */}
                                {selectedNote.suggestion && (
                                    <div className="mb-3 d-flex gap-2 align-items-start">
                                        <IconHome className="text-primary flex-shrink-0 mt-1" size={18} />
                                        <div>
                                            <span className="fw-semibold text-dark d-block" style={{ fontSize: "0.85rem" }}>
                                                Hal yang bisa dilakukan di rumah
                                            </span>
                                            <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                {selectedNote.suggestion}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Perlu Perhatian Section */}
                                {selectedNote.attention && (
                                    <div className="mb-4 d-flex gap-2 align-items-start">
                                        <IconExclamationCircle className="text-warning flex-shrink-0 mt-1" size={18} />
                                        <div>
                                            <span className="fw-semibold text-dark d-block" style={{ fontSize: "0.85rem" }}>
                                                Perlu perhatian
                                            </span>
                                            <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                {selectedNote.attention}
                                            </span>
                                        </div>
                                    </div>
                                )}

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
                        ) : (
                            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
                                <p className="text-muted m-0">Tidak ada data catatan tersedia.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Stats & History */}
                    <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                        
                        {/* Riwayat Catatan Card */}
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1rem" }}>
                                Riwayat Catatan
                            </h5>

                            <div className="d-flex flex-column gap-3">
                                {notes.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={`d-flex justify-content-between align-items-start pb-2 border-bottom cursor-pointer p-2 rounded-2 ${selectedNote?.id === item.id ? "bg-light" : ""}`}
                                        onClick={() => setSelectedNote(item)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div>
                                            <h6 className="m-0 fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>
                                                {item.title}
                                            </h6>
                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                <span className="badge rounded-pill" style={{ backgroundColor: "#FFF7ED", color: "#EA580C", fontSize: "0.7rem" }}>
                                                    {item.category}
                                                </span>
                                                <span className="text-warning" style={{ fontSize: "0.75rem" }}>
                                                    ★ {item.indicator}/5
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                            {formatDate(item.notedAt)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <Toaster position="top-right" />
        </>
    );
}