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
                                Selamat Pagi, {userData?.fullName || ""}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                                <h4 className="fw-bold mb-0 text-dark">Pengumuman Terbaru</h4>
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
                                <h4 className="fw-bold mb-0 text-dark">Kegiatan Terbaru</h4>
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
                                                            alt={item.title || "Gambar Kegiatan"}
                                                            style={{ objectFit: "cover" }}
                                                        />
                                                    ) : (
                                                        <div className="text-muted d-flex flex-column align-items-center gap-1">
                                                            <IconPhoto size={36} stroke={1.5} />
                                                            <span className="fs-xs text-secondary">Tidak ada gambar</span>
                                                        </div>
                                                    )}
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
                            <h4 className="fw-bold mb-3 text-dark">Aksi Cepat</h4>
                            <div className="d-flex flex-column gap-2">
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
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <Toaster position="top-right" />
        </>
    );
}