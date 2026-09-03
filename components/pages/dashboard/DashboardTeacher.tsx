"use client";

import { useState, useEffect } from "react";
import { 
    IconCalendar, 
    IconClock, 
    IconUserCheck, 
    IconUserX, 
    IconUserExclamation, 
    IconBuildingHospital, 
    IconCalendarEvent,
    IconUserPlus,
    IconUpload,
    IconPlus,
    IconDotsVertical,
    IconLayoutGrid,
    IconUser,
    IconBell,
    IconPhoto
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { callApi } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface UserData {
    id: string;
    fullName: string;
    email: string;
    role: string;
    schoolCode: string;
}

// Interface sesuai response API journals
interface Announcement {
    _id: string;
    id: string;
    target: string;
    status: string;
    title: string;
    message: string;
    file?: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface Media {
    _id: string;
    title: string;
    file: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export function DashboardTeacher() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState<boolean>(true);
    const [medias, setMedias] = useState<Media[]>([]);
    const [loadingMedias, setLoadingMedias] = useState<boolean>(true);

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

        async function fetchAnnouncements() {
            try {
                setLoadingAnnouncements(true);
                const response = await callApi("/journals", { method: "GET" });
                const data = Array.isArray(response) ? response : (response?.data || []);
                setAnnouncements(data);
            } catch (error) {
                console.error("Gagal mengambil data pengumuman:", error);
                toast.error("Gagal memuat pengumuman terbaru");
            } finally {
                setLoadingAnnouncements(false);
            }
        }

        async function fetchMedias() {
            try {
                setLoadingMedias(true);
                const response = await callApi("/media", { method: "GET" });
                const data = Array.isArray(response) ? response : (response?.data || []);
                setMedias(data);
            } catch (error) {
                console.error("Gagal mengambil data media kegiatan:", error);
                toast.error("Gagal memuat kegiatan terbaru");
            } finally {
                setLoadingMedias(false);
            }
        }

        fetchUser();
        fetchAnnouncements();
        fetchMedias();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("id-ID", {
                day: "2-digit",
                month: "short"
            }).format(date).toUpperCase();
        } catch {
            return "-";
        }
    };

    const formatTimeAgo = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

            if (diffInSeconds < 60) return "Baru saja";
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
            return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
        } catch {
            return "-";
        }
    };

    return (
        <>
            <div className="container-xl p-3 p-md-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
                <div 
                    className="card border-0 text-white mb-4 p-4 rounded-4" 
                    style={{ background: "linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)" }}
                >
                    <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                            <div 
                                className="rounded-circle border border-2 border-white d-flex align-items-center justify-content-center bg-white text-primary"
                                style={{ width: "64px", height: "64px" }}
                            >
                                <IconUser size={36} />
                            </div>
                            <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
                        </div>
                        <div>
                            <h2 className="fw-bold mb-1 fs-3 text-white">
                                Selamat Pagi, {userData?.fullName || "Bu Ani"}
                            </h2>
                            <p className="mb-2 small" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                                Hari ini ada 31 siswa yang terdaftar di kelas Anda. Mari buat hari ini produktif!
                            </p>
                            <div className="d-flex flex-wrap gap-2 pt-1">
                                <span 
                                    className="badge fw-normal px-3 py-2 rounded-pill d-flex align-items-center gap-1 text-white"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(4px)" }}
                                >
                                    <IconCalendar size={14} className="text-white" /> Selasa, 24 Okt 2023
                                </span>
                                <span 
                                    className="badge fw-normal px-3 py-2 rounded-pill d-flex align-items-center gap-1 text-white"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(4px)" }}
                                >
                                    <IconClock size={14} className="text-white" /> 07:45 WIB
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted small fw-semibold d-block mb-1">HADIR</span>
                                    <h3 className="fw-bold mb-0 text-dark">28</h3>
                                </div>
                                <div className="p-2 rounded-3" style={{ backgroundColor: "#ECFDF5", color: "#10B981" }}>
                                    <IconUserCheck size={28} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted small fw-semibold d-block mb-1">TIDAK HADIR</span>
                                    <h3 className="fw-bold mb-0 text-dark">2</h3>
                                </div>
                                <div className="p-2 rounded-3" style={{ backgroundColor: "#FFE4E6", color: "#F43F5E" }}>
                                    <IconUserX size={28} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted small fw-semibold d-block mb-1">IZIN</span>
                                    <h3 className="fw-bold mb-0 text-dark">1</h3>
                                </div>
                                <div className="p-2 rounded-3" style={{ backgroundColor: "#F3E8FF", color: "#A855F7" }}>
                                    <IconUserExclamation size={28} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted small fw-semibold d-block mb-1">SAKIT</span>
                                    <h3 className="fw-bold mb-0 text-dark">0</h3>
                                </div>
                                <div className="p-2 rounded-3 text-secondary" style={{ backgroundColor: "#F1F5F9" }}>
                                    <IconBuildingHospital size={28} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                                <h6 className="fw-bold mb-0 text-dark">Pengumuman Terbaru</h6>
                                <a href="#" className="text-primary text-decoration-none small fw-semibold">Lihat Semua &gt;</a>
                            </div>
                            <div className="card-body p-0">
                                <div className="list-group list-group-flush">
                                    {loadingAnnouncements ? (
                                        <div className="p-4 text-center text-muted small">
                                            Memuat pengumuman...
                                        </div>
                                    ) : announcements.length === 0 ? (
                                        <div className="p-4 text-center text-muted small">
                                            Tidak ada pengumuman terbaru.
                                        </div>
                                    ) : (
                                        announcements.map((item) => (
                                            <div key={item._id || item.id} className="list-group-item p-3 border-light">
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                                                        <IconBell size={18} />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <h6 className="mb-0 fw-semibold fs-6">{item.title}</h6>
                                                            <span className="badge bg-light text-muted fw-normal">
                                                                {formatDate(item.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: "450px" }}>
                                                            {item.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0 text-dark">Kegiatan Terbaru</h6>
                                <button className="btn btn-light btn-sm p-1 rounded-2">
                                    <IconLayoutGrid size={18} className="text-muted" />
                                </button>
                            </div>

                            {loadingMedias ? (
                                <div className="card border-0 shadow-sm p-4 text-center text-muted small">
                                    Memuat kegiatan...
                                </div>
                            ) : medias.length === 0 ? (
                                <div className="card border-0 shadow-sm p-4 text-center text-muted small">
                                    Tidak ada kegiatan terbaru.
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {medias.map((item) => (
                                        <div key={item._id || item.id} className="col-12 col-md-6">
                                            <div className="card border-0 shadow-sm rounded-3 overflow-hidden h-100">
                                                
                                                <div 
                                                    className="position-relative bg-light d-flex align-items-center justify-content-center overflow-hidden" 
                                                    style={{ height: "160px" }}
                                                >
                                                    {item.file ? (
                                                        <img 
                                                            src={item.file} 
                                                            className="w-100 h-100" 
                                                            alt=""
                                                            style={{ objectFit: "cover" }}
                                                            onError={(e) => {
                                                                (e.target as HTMLElement).style.display = 'none';
                                                            }}
                                                        />
                                                    ) : null}

                                                    <div className="position-absolute text-muted d-flex flex-column align-items-center gap-1" style={{ zIndex: 0 }}>
                                                        <IconPhoto size={36} stroke={1.5} />
                                                        <span className="fs-xs text-secondary">Tidak ada gambar</span>
                                                    </div>
                                                </div>

                                                <div className="card-body p-3 d-flex flex-column justify-content-between">
                                                    <div>
                                                        <h6 className="fw-semibold mb-1 text-dark text-truncate">{item.title}</h6>
                                                        <p className="text-muted small mb-3" style={{
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                            fontSize: "13px"
                                                        }}>
                                                            {item.description || "Tidak ada deskripsi"}
                                                        </p>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                                                        <div className="avatar-group d-flex align-items-center">
                                                            <img src="https://i.pravatar.cc/100?img=1" className="rounded-circle border border-white" style={{ width: "24px", height: "24px", marginRight: "-8px" }} alt="" />
                                                            <img src="https://i.pravatar.cc/100?img=2" className="rounded-circle border border-white" style={{ width: "24px", height: "24px" }} alt="" />
                                                        </div>
                                                        <span className="text-muted small" style={{ fontSize: "11px" }}>
                                                            {formatTimeAgo(item.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="card border-0 shadow-sm rounded-3 p-3 mb-4">
                            <h6 className="fw-bold mb-3 text-dark">Aksi Cepat</h6>
                            <div className="d-flex flex-column gap-2">
                                <button className="btn text-start p-2.5 rounded-3 border-0 d-flex align-items-center gap-3 text-white fw-medium" style={{ backgroundColor: "#0B192C" }}>
                                    <div className="p-1.5 bg-white bg-opacity-10 rounded-2">
                                        <IconUserPlus size={18} />
                                    </div>
                                    Input Absensi Harian
                                </button>
                                <button className="btn text-start p-2.5 rounded-3 border-0 d-flex align-items-center gap-3 fw-medium text-dark" style={{ backgroundColor: "#F1F5F9" }}>
                                    <div className="p-1.5 bg-primary bg-opacity-10 text-primary rounded-2">
                                        <IconUpload size={18} />
                                    </div>
                                    Unggah Foto Kegiatan
                                </button>
                                <button className="btn text-start p-2.5 rounded-3 border-0 d-flex align-items-center gap-3 fw-medium text-dark" style={{ backgroundColor: "#F1F5F9" }}>
                                    <div className="p-1.5 bg-success bg-opacity-10 text-success rounded-2">
                                        <IconPlus size={18} />
                                    </div>
                                    Buat Pengumuman Baru
                                </button>
                                <button className="btn text-start p-2.5 rounded-3 border-0 d-flex align-items-center gap-3 fw-medium text-dark" style={{ backgroundColor: "#F1F5F9" }}>
                                    <div className="p-1.5 bg-opacity-10 rounded-2" style={{ backgroundColor: "#F3E8FF", color: "#A855F7" }}>
                                        <IconCalendarEvent size={18} />
                                    </div>
                                    Jadwal Pelajaran
                                </button>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0 text-dark">Progres Nilai</h6>
                                <button className="btn btn-link text-muted p-0">
                                    <IconDotsVertical size={18} />
                                </button>
                            </div>

                            <div className="d-flex flex-column align-items-center justify-content-center my-3">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center position-relative mb-3"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        background: "conic-gradient(#0F172A 0% 50%, #E2E8F0 50% 100%)",
                                        borderRadius: "50%"
                                    }}
                                >
                                    <div 
                                        className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: "90px", height: "90px" }}
                                    >
                                        <span className="fw-bold fs-4 text-dark">50%</span>
                                    </div>
                                </div>
                                <h6 className="fw-bold mb-1 text-dark">12/24 Siswa</h6>
                                <p className="text-muted small text-center mb-0">Siswa telah dinilai minggu ini</p>
                            </div>

                            <div className="border-top pt-3 mt-2">
                                <span className="text-muted fw-semibold small d-block mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                                    DETAIL MINGGU INI
                                </span>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="small d-flex align-items-center gap-2">
                                            <span className="rounded-circle bg-dark d-inline-block" style={{ width: "8px", height: "8px" }}></span>
                                            Kognitif
                                        </span>
                                        <span className="fw-semibold small">10/24</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="small d-flex align-items-center gap-2">
                                            <span className="rounded-circle d-inline-block" style={{ width: "8px", height: "8px", backgroundColor: "#A855F7" }}></span>
                                            Motorik
                                        </span>
                                        <span className="fw-semibold small">15/24</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="small d-flex align-items-center gap-2">
                                            <span className="rounded-circle bg-success d-inline-block" style={{ width: "8px", height: "8px" }}></span>
                                            Sosial Emosional
                                        </span>
                                        <span className="fw-semibold small">11/24</span>
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