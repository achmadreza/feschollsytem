"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    IconExclamationMark, 
    IconWallet, 
    IconListDetails, 
    IconSpeakerphone, 
    IconStarFilled,
    IconCalendar,
    IconInfoCircle,
    IconUser,
    IconUsers,
    IconCheck,
    IconX
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

interface StudentData {
    id: string;
    schoolCode: string;
    name: string;
    class: string;
    gender: string;
    religion: string;
    status: string;
    address: string;
    birthPlace: string;
    birthdate: string;
    parentId: string;
    parentEmail: string;
    parentName: string;
    phoneNumber: string;
    emergencyContact: string;
    schoolYear: string;
    kk?: string;
    birthCertificate?: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface PaymentItem {
    _id: string;
    paymentType: string;
    amount: number;
}

interface Billing {
    _id: string;
    id: string;
    invoiceNumber: string;
    studentId: string;
    studentName: string;
    studentClass: string;
    schoolCode: string;
    parentId: string;
    parentEmail: string;
    description: string;
    paymentList: PaymentItem[];
    dueDate: string;
    status: string;
    paidAt: string | null;
    payment: any | null;
    createdAt: string;
    updatedAt: string;
    __v?: number;
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

interface Journal {
    id: string;
    target?: string;
    status?: string;
    title: string;
    message: string;
    file?: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export function ParentDashboard() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [student, setStudent] = useState<StudentData | null>(null);
    const [urgentBilling, setUrgentBilling] = useState<Billing | null>(null);
    const [loadingBilling, setLoadingBilling] = useState<boolean>(true);

    const [studentNotes, setStudentNotes] = useState<StudentNote[]>([]);
    const [loadingNotes, setLoadingNotes] = useState<boolean>(true);
    const [journals, setJournals] = useState<Journal[]>([]);
    const [loadingJournals, setLoadingJournals] = useState<boolean>(true);
    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
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

        async function fetchStudentAndBilling() {
            try {
                setLoadingBilling(true);
                const studentRes = await callApi<StudentData[] | { data: StudentData[] }>("/students", {
                    method: "GET"
                });
                
                const studentData = Array.isArray(studentRes) ? studentRes : (studentRes?.data || []);
                
                if (!studentData || studentData.length === 0) {
                    setUrgentBilling(null);
                    return;
                }
                
                const currentStudent = studentData[0];
                setStudent(currentStudent);
                if (currentStudent && currentStudent.id) {
                    const billingRes = await callApi<Billing[] | { data: Billing[] }>(
                        `/billings?studentId=${currentStudent.id}`, 
                        { method: "GET" }
                    );
                    
                    const billings = Array.isArray(billingRes) ? billingRes : (billingRes?.data || []);
                    
                    if (Array.isArray(billings)) {
                        const unpaid = billings.find((b) => b.paidAt === null);
                        setUrgentBilling(unpaid || null);
                    }
                }
            } catch (error) {
                console.error("Gagal mengambil data siswa / tagihan:", error);
                toast.error("Gagal memuat data tagihan");
            } finally {
                setLoadingBilling(false);
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

        async function fetchJournals() {
            try {
                setLoadingJournals(true);
                const response = await callApi("/journals", { method: "GET" });
                const rawData: Journal[] = Array.isArray(response) ? response : (response?.data || []);
                
                // Mengambil pengumuman yang berstatus PUBLISHED sesuai payload
                const publishedData = rawData.filter((item) => item.status === "PUBLISHED");
                
                setJournals(publishedData);
            } catch (error) {
                console.error("Gagal mengambil data journals pengumuman:", error);
                toast.error("Gagal memuat pengumuman terbaru");
            } finally {
                setLoadingJournals(false);
            }
        }

        fetchUser();
        fetchStudentAndBilling();
        fetchStudentNotes();
        fetchJournals();
    }, []);

    const handleOpenJournalDetail = async (id: string) => {
        try {
            setLoadingDetail(true);
            setShowModal(true);
            
            // Mengambil langsung dari list journals yang sudah difetch sesuai payload
            const foundItem = journals.find((item) => item.id === id);

            if (foundItem) {
                setSelectedJournal(foundItem);
            } else {
                const response = await callApi(`/journals/${id}`, { method: "GET" });
                const data = response?.data || response;
                setSelectedJournal(data);
            }
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
        setSelectedJournal(null);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateTotalBilling = (paymentList: PaymentItem[] = []) => {
        return paymentList.reduce((acc, item) => acc + (item.amount || 0), 0);
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
                <div 
                    className="card border-0 text-white mb-4 p-4 rounded-4 shadow-sm" 
                    style={{ background: "linear-gradient(135deg, #3B4CCA 0%, #6157F6 100%)" }}
                >
                    <div className="row align-items-center g-4">
                        <div className="col-lg-7">
                            <h1 className="fw-bold mb-2 display-6">
                                Welcome back, <br />
                                {userData?.fullName || userData?.name || ""}
                            </h1>
                        </div>
                    </div>
                </div>

                {loadingBilling ? (
                    <div className="card border-0 bg-white p-4 rounded-4 mb-4 shadow-sm text-center text-muted small">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                        Memuat data tagihan...
                    </div>
                ) : urgentBilling ? (
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
                                        <small className="text-muted">
                                            Batas Waktu: {formatDateDisplay(urgentBilling.dueDate)}
                                        </small>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">
                                        {urgentBilling.paymentList?.[0]?.paymentType || urgentBilling.description}
                                    </h5>
                                    <p className="text-secondary small mb-0">
                                        {urgentBilling.description}. Harap segera melakukan penyelesaian untuk kelancaran administrasi.
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3 ms-auto ms-md-0 flex-shrink-0">
                                <div className="text-end">
                                    <small className="text-muted d-block">Total Tagihan</small>
                                    <span className="fs-4 fw-bold text-danger">
                                        {formatCurrency(calculateTotalBilling(urgentBilling.paymentList))}
                                    </span>
                                </div>
                                <Link 
                                    href="/payments-parent" 
                                    className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none" 
                                    style={{ backgroundColor: "#0F172A" }}
                                >
                                    <IconWallet size={18} />
                                    <span>Bayar Sekarang</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card border-success border-opacity-10 bg-white p-3 p-md-4 rounded-4 mb-4 shadow-sm">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40 }}>
                                <IconCheck size={24} />
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-0">Tidak Ada Tagihan Mendesak</h6>
                                <small className="text-muted">Semua pembayaran administrasi siswa saat ini sudah lunas.</small>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row g-4">
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

                    <div className="col-lg-5">
                        <div className="card border-0 bg-white p-4 rounded-4 shadow-sm h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center gap-2">
                                    <IconSpeakerphone className="text-secondary" size={20} />
                                    <h5 className="fw-bold mb-0">Informasi Pengumuman</h5>
                                </div>
                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">
                                    {journals.length} Pengumuman
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {loadingJournals ? (
                                    <div className="p-4 text-center text-muted small">
                                        Memuat pengumuman...
                                    </div>
                                ) : journals.length === 0 ? (
                                    <div className="p-4 text-center text-muted small">
                                        Tidak ada pengumuman terbaru.
                                    </div>
                                ) : (
                                    journals.map((item, index) => {
                                        const { day, month } = formatDayDate(item.createdAt);
                                        const isLast = index === journals.length - 1;

                                        return (
                                            <div 
                                                key={item.id} 
                                                onClick={() => handleOpenJournalDetail(item.id)}
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
                                                        {item.message}
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

            {showModal && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                            <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-start" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-flex align-items-center justify-content-center">
                                        <IconSpeakerphone size={24} />
                                    </div>
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold rounded-pill px-2 py-1 text-capitalize" style={{ fontSize: "0.75rem" }}>
                                                {selectedJournal?.target || "Kegiatan Siswa"}
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
                                    className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center border shadow-sm" 
                                    onClick={handleCloseModal}
                                    aria-label="Close"
                                    style={{ width: "36px", height: "36px", flexShrink: 0 }}
                                >
                                    <IconX size={20} className="text-dark" />
                                </button>
                            </div>

                            <div className="modal-body p-4">
                                {loadingDetail ? (
                                    <div className="py-5 text-center text-muted">
                                        <div className="spinner-border text-primary mb-2" role="status"></div>
                                        <p className="small mb-0">Memuat detail pengumuman...</p>
                                    </div>
                                ) : selectedJournal ? (
                                    <div className="d-flex flex-column gap-3">
                                        <h3 className="fw-bold text-dark mb-1" style={{ fontSize: "1.5rem" }}>
                                            {selectedJournal.title}
                                        </h3>

                                        <div className="d-flex flex-wrap gap-3 text-muted small border-bottom pb-3" style={{ fontSize: "0.85rem" }}>
                                            <span className="d-flex align-items-center gap-1">
                                                <IconCalendar size={16} /> Diterbitkan: {formatFullDateTime(selectedJournal.createdAt)}
                                            </span>
                                            <span className="d-flex align-items-center gap-1">
                                                <IconUser size={16} /> Penerbit: Wali Kelas
                                            </span>
                                            <span className="d-flex align-items-center gap-1 text-capitalize">
                                                <IconUsers size={16} /> Sasaran: {selectedJournal.target || "Semua Orang Tua Siswa"}
                                            </span>
                                        </div>

                                        <div className="p-3 rounded-3 bg-light bg-opacity-75 border border-light-subtle">
                                            <p className="text-dark mb-0 style-normal" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                                                {selectedJournal.message}
                                            </p>
                                        </div>

                                        {/* Tampilkan Foto Base64 jika ada */}
                                        {selectedJournal.photo && (
                                            <div className="mt-2 text-center">
                                                <img 
                                                    src={selectedJournal.photo.startsWith("data:image") ? selectedJournal.photo : `data:image/png;base64,${selectedJournal.photo}`} 
                                                    alt="Lampiran Pengumuman" 
                                                    className="img-fluid rounded-3 border"
                                                    style={{ maxHeight: "300px", objectFit: "cover" }}
                                                />
                                            </div>
                                        )}

                                        {/* Tampilkan File jika ada */}
                                        {selectedJournal.file && (
                                            <div className="mt-1">
                                                <a 
                                                    href={selectedJournal.file} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
                                                >
                                                    Lihat Lampiran File
                                                </a>
                                            </div>
                                        )}

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