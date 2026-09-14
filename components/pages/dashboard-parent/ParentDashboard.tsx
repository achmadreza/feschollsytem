"use client";

import { useState, useEffect } from "react";
import { 
    IconPlus, 
    IconExclamationMark, 
    IconWallet, 
    IconListDetails, 
    IconSpeakerphone, 
    IconStarFilled,
    IconCalendar,
    IconX,
    IconInfoCircle,
    IconUser,
    IconUsers
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { Button } from "../../../components/ui/Button";
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
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface Media {
    id: string;
    title: string;
    file?: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export function ParentDashboard() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [studentNotes, setStudentNotes] = useState<StudentNote[]>([]);
    const [loadingNotes, setLoadingNotes] = useState<boolean>(true);
    const [medias, setMedias] = useState<Media[]>([]);
    const [loadingMedias, setLoadingMedias] = useState<boolean>(true);

    // State untuk Modal Detail
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await getUser();
                const user = response?.user || response;
                setUserData(user); 
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
            }
        }

        async function fetchStudentNotes() {
            try {
                setLoadingNotes(true);
                const response = await callApi("/student-notes", { method: "GET" });
                const data = Array.isArray(response) ? response : (response?.data || []);
                setStudentNotes(data);
            } catch (error) {
                console.error("Gagal mengambil data catatan harian:", error);
                toast.error("Gagal memuat catatan harian");
            } finally {
                setLoadingNotes(false);
            }
        }

        async function fetchMedias() {
            try {
                setLoadingMedias(true);
                const response = await callApi("/media", { method: "GET" });
                const data = Array.isArray(response) ? response : (response?.data || []);
                setMedias(data);
            } catch (error) {
                console.error("Gagal mengambil data media pengumuman:", error);
                toast.error("Gagal memuat pengumuman terbaru");
            } finally {
                setLoadingMedias(false);
            }
        }

        fetchUser();
        fetchStudentNotes();
        fetchMedias();
    }, []);

    // Function untuk fetch detail media/pengumuman berdasarkan ID
    const handleOpenMediaDetail = async (id: string) => {
        try {
            setLoadingDetail(true);
            setShowModal(true);
            const response = await callApi(`/media/${id}`, { method: "GET" });
            const data = response?.data || response;
            setSelectedMedia(data);
        } catch (error) {
            console.error("Gagal mengambil detail pengumuman:", error);
            toast.error("Gagal memuat detail pengumuman");
            setShowModal(false);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMedia(null);
    };

    const formatDayDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return {
                day: date.getDate(),
                month: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date)
            };
        } catch {
            return { day: "-", month: "-" };
        }
    };

    const formatDateDisplay = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }).format(date);
        } catch {
            return "-";
        }
    };

    const formatFullDateTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }).format(date);
        } catch {
            return "-";
        }
    };

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
                            <h1 className="fw-bold mb-2 display-6">
                                Welcome back, <br />
                                {userData?.fullName || userData?.name || "Mr. Aria Wijaya"}
                            </h1>
                            <p className="text-white-50 mb-0 max-w-md" style={{ maxWidth: '420px', fontSize: '0.95rem' }}>
                                Stay updated with Lucas's academic progress and school activities in real-time. Everything is organized for your peace of mind.
                            </p>
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
                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">
                                    {studentNotes.length} Catatan
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {loadingNotes ? (
                                    <div className="p-4 text-center text-muted small">
                                        Memuat catatan harian...
                                    </div>
                                ) : studentNotes.length === 0 ? (
                                    <div className="p-4 text-center text-muted small">
                                        Tidak ada catatan harian.
                                    </div>
                                ) : (
                                    studentNotes.map((note) => (
                                        <div key={note.id} className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1" style={{ fontSize: "0.75rem" }}>
                                                        {note.category}
                                                    </span>
                                                    <div className="d-flex text-warning">
                                                        {Array.from({ length: note.indicator || 0 }).map((_, i) => (
                                                            <IconStarFilled key={i} size={14} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <small className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                                                    <IconCalendar size={12} /> {formatDateDisplay(note.notedAt || note.createdAt)}
                                                </small>
                                            </div>

                                            <div className="d-flex gap-3 align-items-start">
                                                <div className="flex-grow-1">
                                                    <h6 className="fw-bold text-dark mb-1">{note.title}</h6>
                                                    <p className="text-secondary small mb-2">{note.description}</p>
                                                    
                                                    {note.suggestion && (
                                                        <small className="d-block text-muted style-italic" style={{ fontSize: "0.75rem" }}>
                                                            <strong>Saran:</strong> {note.suggestion}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
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
                                    {medias.length} Pengumuman
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {loadingMedias ? (
                                    <div className="p-4 text-center text-muted small">
                                        Memuat pengumuman...
                                    </div>
                                ) : medias.length === 0 ? (
                                    <div className="p-4 text-center text-muted small">
                                        Tidak ada pengumuman terbaru.
                                    </div>
                                ) : (
                                    medias.map((item, index) => {
                                        const { day, month } = formatDayDate(item.createdAt);
                                        const isLast = index === medias.length - 1;

                                        return (
                                            <div 
                                                key={item.id} 
                                                onClick={() => handleOpenMediaDetail(item.id)}
                                                className={`d-flex gap-3 align-items-start cursor-pointer rounded-3 p-2 transition-all ${!isLast ? 'border-bottom' : ''}`}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <div className="bg-dark text-white rounded-3 p-2 text-center flex-shrink-0" style={{ width: "50px", backgroundColor: "#0F172A" }}>
                                                    <small className="d-block text-uppercase fw-semibold" style={{ fontSize: "0.65rem" }}>{month}</small>
                                                    <span className="fw-bold fs-5">{day}</span>
                                                </div>

                                                <div className="flex-grow-1">
                                                    <h6 className="fw-bold text-dark mb-1 hover-text-primary">{item.title}</h6>
                                                    <p className="text-secondary small mb-0 text-truncate-2" style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden"
                                                    }}>
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* MODAL DETAIL PENGUMUMAN */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                            {/* Modal Header */}
                            <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-start" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-flex align-items-center justify-content-center">
                                        <IconSpeakerphone size={24} />
                                    </div>
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold rounded-pill px-2 py-1" style={{ fontSize: "0.75rem" }}>
                                                Kegiatan Siswa
                                            </span>
                                            <small className="text-muted">• Resmi dari Sekolah</small>
                                        </div>
                                        <h5 className="modal-title fw-bold text-dark" style={{ fontSize: "1.25rem" }}>
                                            Detail Pengumuman Sekolah
                                        </h5>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-close bg-light rounded-circle p-2 shadow-sm" 
                                    onClick={handleCloseModal}
                                    aria-label="Close"
                                ></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body p-4">
                                {loadingDetail ? (
                                    <div className="py-5 text-center text-muted">
                                        <div className="spinner-border text-primary mb-2" role="status"></div>
                                        <p className="small mb-0">Memuat detail pengumuman...</p>
                                    </div>
                                ) : selectedMedia ? (
                                    <div className="d-flex flex-column gap-3">
                                        {/* Title */}
                                        <h3 className="fw-bold text-dark mb-1" style={{ fontSize: "1.5rem" }}>
                                            {selectedMedia.title}
                                        </h3>

                                        {/* Meta Information */}
                                        <div className="d-flex flex-wrap gap-3 text-muted small border-bottom pb-3" style={{ fontSize: "0.85rem" }}>
                                            <span className="d-flex align-items-center gap-1">
                                                <IconCalendar size={16} /> Diterbitkan: {formatFullDateTime(selectedMedia.createdAt)}
                                            </span>
                                            <span className="d-flex align-items-center gap-1">
                                                <IconUser size={16} /> Penerbit: Wali Kelas
                                            </span>
                                            <span className="d-flex align-items-center gap-1">
                                                <IconUsers size={16} /> Sasaran: Semua Orang Tua Siswa
                                            </span>
                                        </div>

                                        {/* Description Content Box */}
                                        <div className="p-3 rounded-3 bg-light bg-opacity-75 border border-light-subtle">
                                            <p className="text-dark mb-0 style-normal" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                                                {selectedMedia.description}
                                            </p>
                                        </div>

                                        {/* Notice Box */}
                                        <div className="p-3 rounded-3 bg-warning bg-opacity-10 border border-warning border-opacity-20 d-flex gap-2 align-items-start mt-2">
                                            <IconInfoCircle className="text-warning flex-shrink-0 mt-1" size={18} />
                                            <p className="small text-dark mb-0">
                                                Jika ada kendala atau pertanyaan lainnya, Bapak/Ibu dapat langsung menghubungi wali kelas via WhatsApp (WA).
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-4 text-center text-muted">Data tidak ditemukan.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toaster position="top-right" />
        </>
    );
}