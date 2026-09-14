"use client";

import { useEffect, useState } from "react";
import { 
    IconNotes,
    IconTrendingUp,
    IconAlertCircle,
    IconStar,
    IconHome,
    IconExclamationCircle,
    IconChevronDown,
    IconChevronUp
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { callApi } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface UserData {
    id?: string;
    fullName?: string;
    name?: string;
    email?: string;
    role?: string;
    schoolCode?: string;
}

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

export function CatatanDashboard() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [notes, setNotes] = useState<StudentNote[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openNoteId, setOpenNoteId] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            const response = await getUser();
            const user = response?.user || response;
            setUserData(user); 
        } catch (error) {
            console.error("Gagal mengambil data user:", error);
        }
    };

    const fetchStudentNotes = async () => {
        setLoading(true);
        try {
            const response = await callApi("/student-notes", { method: "GET" });
            
            let data: StudentNote[] = [];
            if (Array.isArray(response)) {
                data = response;
            } else if (response?.data && Array.isArray(response.data)) {
                data = response.data;
            } else {
                const errorMsg = response?.pesan || response?.message || "Gagal mengambil data catatan.";
                toast.error(errorMsg);
            }

            setNotes(data);
            if (data.length > 0) {
                setOpenNoteId(data[0].id); // Default buka item pertama di accordion
            }
        } catch (error: any) {
            console.error("Fetch error:", error);
            toast.error("Gagal terhubung ke server.");
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentNotes();
        fetchUser();
    }, []);

    const toggleAccordion = (id: string) => {
        setOpenNoteId(prev => (prev === id ? null : id));
    };

    // Stat Calculations
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
                        Halo, {userData?.fullName || userData?.name || ""}
                    </h2>
                    <p className="text-muted m-0 mt-1" style={{ fontSize: "0.9rem" }}>
                        Berikut perkembangan dan aktivitas siswa hari ini.
                    </p>
                </div>

                {/* Top Summary Cards */}
                <div className="row g-3 mb-4">
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
                    {/* KOLOM KIRI: Accordion Daftar Semua Catatan Siswa */}
                    <div className="col-12 col-lg-8">
                        {loading ? (
                            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
                                <p className="text-muted m-0">Memuat data...</p>
                            </div>
                        ) : notes.length === 0 ? (
                            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
                                <p className="text-muted m-0">Tidak ada data catatan tersedia.</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {notes.map((note) => {
                                    const isOpen = openNoteId === note.id;
                                    return (
                                        <div key={note.id} className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                                            {/* Accordion Header */}
                                            <div 
                                                className="p-4 d-flex justify-content-between align-items-center cursor-pointer"
                                                onClick={() => toggleAccordion(note.id)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <div>
                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                        <span className="badge rounded-pill px-3 py-1.5" style={{ backgroundColor: "#FFF7ED", color: "#EA580C", fontWeight: 500, fontSize: "0.75rem" }}>
                                                            ⭐ {note.category}
                                                        </span>
                                                        <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                                                            {formatDate(note.notedAt)}
                                                        </span>
                                                    </div>
                                                    <h4 className="fw-bold text-dark m-0" style={{ fontSize: "1.1rem" }}>
                                                        {note.title}
                                                    </h4>
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    {isOpen ? <IconChevronUp size={22} className="text-secondary" /> : <IconChevronDown size={22} className="text-secondary" />}
                                                </div>
                                            </div>

                                            {/* Accordion Body Detail */}
                                            {isOpen && (
                                                <div className="px-4 pb-4 border-top pt-3">
                                                    {/* Rating Stars & Status */}
                                                    <div className="d-flex align-items-center gap-3 mb-3">
                                                        <div className="d-flex gap-1">
                                                            {renderStars(note.indicator)}
                                                        </div>
                                                        <span className="fw-medium" style={{ color: "#7C3AED", fontSize: "0.85rem" }}>
                                                            • Indikator {note.indicator} Stars
                                                        </span>
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-secondary lh-base mb-4" style={{ fontSize: "0.9rem" }}>
                                                        {note.description}
                                                    </p>

                                                    {/* Photo */}
                                                    {note.photo && (
                                                        <div className="row g-2 mb-4">
                                                            <div className="col-12 col-md-6">
                                                                <img 
                                                                    src={note.photo.startsWith("data:") || note.photo.startsWith("http") ? note.photo : "data:image/jpeg;base64," + note.photo} 
                                                                    alt="Aktivitas Siswa" 
                                                                    className="img-fluid rounded-3 object-fit-cover w-100"
                                                                    style={{ height: "180px" }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Suggestion */}
                                                    {note.suggestion && (
                                                        <div className="mb-3 d-flex gap-2 align-items-start">
                                                            <IconHome className="text-primary flex-shrink-0 mt-1" size={18} />
                                                            <div>
                                                                <span className="fw-semibold text-dark d-block" style={{ fontSize: "0.85rem" }}>
                                                                    Hal yang bisa dilakukan di rumah
                                                                </span>
                                                                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                                    {note.suggestion}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Attention */}
                                                    {note.attention && (
                                                        <div className="d-flex gap-2 align-items-start">
                                                            <IconExclamationCircle className="text-warning flex-shrink-0 mt-1" size={18} />
                                                            <div>
                                                                <span className="fw-semibold text-dark d-block" style={{ fontSize: "0.85rem" }}>
                                                                    Perlu perhatian
                                                                </span>
                                                                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                                    {note.attention}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* KOLOM KANAN: Riwayat Catatan Asli (Simple List) */}
                    <div className="col-12 col-lg-4">
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1rem" }}>
                                Riwayat Catatan
                            </h5>

                            <div className="d-flex flex-column gap-3">
                                {notes.length === 0 ? (
                                    <p className="text-muted" style={{ fontSize: "0.85rem" }}>Belum ada data.</p>
                                ) : (
                                    notes.map((item) => (
                                        <div 
                                            key={item.id} 
                                            className={`d-flex justify-content-between align-items-start pb-2 border-bottom cursor-pointer p-2 rounded-2 ${openNoteId === item.id ? "bg-light" : ""}`}
                                            onClick={() => setOpenNoteId(item.id)}
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
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Toaster position="top-right" />
        </>
    );
}