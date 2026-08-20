"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    IconChevronLeft,
    IconChevronRight,
    IconCircleCheck,
    IconClock,
    IconRefresh,
    IconCheck,
    IconSearch,
    IconAdjustmentsHorizontal,
    IconDownload,
    IconPlus
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { StatCard } from "../../../components/ui/StatCard";
import { Button } from "../../../components/ui/Button"; 
import { callApi } from "@/lib/api";
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import Swal from 'sweetalert2';
import { ScheduleModal } from "./ScheduleModal";
import { ReviewRescheduleModal } from "./ReviewRescheduleModal";
import { ViewScheduleModal } from "./ViewScheduleModal";
import { AddTrialScheduleModal } from "./AddTrialScheduleModal";

export interface TrialData {
  _id: string;
  id: string;
  studentName: string;
  parentName: string;
  phoneNumber: string;
  programClass: string;
  registrationDate: string;
  status: string;
  avatarUrl?: string;
  initials?: string;
}

const mapStatusToUI = (status: string): string => {
  switch (status) {
    case "WAITING_SCHEDULE":
      return "Menunggu Jadwal";
    case "WAITING_APPROVAL":
      return "Menunggu Persetujuan";
    case "APPROVED":
      return "Disetujui";
    case "RESCHEDULE":
      return "Reschedule";
    case "COMPLETED":
      return "Selesai";
    default:
      return status;
  }
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
};

function IconHourglass(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 2h14M5 22h14M19 2v4a7 7 0 0 1-7 7 7 7 0 0 1-7-7V2M5 22v-4a7 7 0 0 1 7-7 7 7 0 0 1 7 7v4" />
        </svg>
    );
}

function TableRow({ 
    data, 
    onAction,
    onDelete
}: { 
    data: TrialData; 
    onAction: (item: TrialData) => void; 
    onDelete: (item: TrialData) => void;
}) {
    const initials = data.initials || data.studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const [imgError, setImgError] = useState(false);

    return (
        <tr className="align-middle">
            <td className="px-4 py-3">
                <div className="d-flex align-items-center">
                    {data.avatarUrl && !imgError ? (
                        <img 
                            src={data.avatarUrl} 
                            alt={data.studentName} 
                            className="rounded-circle me-3" 
                            style={{ width: "42px", height: "42px", objectFit: "cover" }} 
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold flex-shrink-0" style={{ width: "42px", height: "42px", backgroundColor: "#EEF2FF", color: "#4F46E5", fontSize: "14px" }}>
                            {initials}
                        </div>
                    )}
                    <div>
                        <div className="fw-bold text-dark mb-0" style={{ fontSize: "15px" }}>{data.studentName}</div>
                        <div className="text-muted" style={{ fontSize: "13px", marginTop: "2px" }}>
                            {data.parentName} • {data.phoneNumber}
                        </div>
                    </div>
                </div>
            </td>
            <td className="text-dark fw-medium px-3" style={{ fontSize: "15px" }}>
                {data.programClass}
            </td>
            <td className="text-secondary px-3" style={{ fontSize: "15px", lineHeight: "1.4" }}>
                {data.registrationDate}
            </td>
            <td className="px-3">
                <BadgeStatus status={data.status} />
            </td>
            <td className="text-end px-4">
                <div className="d-flex align-items-center justify-content-end gap-2">
                    {data.status === "Menunggu Jadwal" && (
                        <Button 
                            type="button" 
                            variant="default"
                            size="lg"
                            onClick={() => onAction(data)}
                        >
                            Atur Jadwal
                        </Button>
                    )}
                    {data.status === "Menunggu Persetujuan" && (
                        <Button 
                            type="button" 
                            onClick={() => onAction(data)}
                            variant="link"
                            size="sm"
                        >
                            <span>Lihat Detail</span>
                        </Button>
                    )}
                    {data.status === "Disetujui" && (
                        <Button 
                            type="button" 
                            onClick={() => onAction(data)}
                            variant="link"
                            size="sm"
                        >
                            <span>Lihat Jadwal</span>
                        </Button>
                    )}
                   {data.status === "Reschedule" && (
                    <Button 
                        type="button" 
                        className="btn fw-bold border-0 shadow-none text-dark"
                        style={{ 
                            backgroundColor: '#E2E8F0', 
                            color: '#1E293B', 
                            borderRadius: "10px", 
                            fontSize: "12px", 
                            padding: "8px 14px", 
                            lineHeight: "1.2" 
                        }}
                        onClick={() => onAction(data)}
                    >
                        Review Permintaan
                    </Button>
                )}
                </div>
            </td>
        </tr>
    );
}

export function TrialTableList() {
    const [items, setItems] = useState<TrialData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedTrialData, setSelectedTrialData] = useState<TrialData | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

    const fetchTrialClasses = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await callApi("trial-classes", { method: "GET" });
            const rawData = response.data || response;

            if (Array.isArray(rawData)) {
                const mappedData: TrialData[] = rawData.map((item: any) => ({
                    _id: item._id,
                    id: item.id,
                    studentName: item.student?.name || "Nama Tidak Ada",
                    parentName: item.student?.parentName || "-",
                    phoneNumber: item.student?.phoneNumber || "-",
                    programClass: item.student?.class || "-",
                    registrationDate: formatDate(item.registeredAt || item.createdAt),
                    status: mapStatusToUI(item.status),
                    avatarUrl: item.student?.photo && item.student?.photo !== "test.jpg" ? item.student.photo : undefined
                }));

                setItems(mappedData);
            }
        } catch (error) {
            console.error("Error fetching trial data:", error);
            toast.error("Gagal mengambil data Trial Class.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrialClasses();
    }, [fetchTrialClasses]);

    const handleAction = (item: TrialData) => {
        setSelectedTrialData(item);
        if (item.status === "Menunggu Jadwal") {
            setIsModalOpen(true);
        } else if (item.status === "Reschedule") {
            setIsReviewModalOpen(true);
        } else if (item.status === "Menunggu Persetujuan" || item.status === "Disetujui") {
            setIsViewModalOpen(true);
        }
    };

    const handleCreateNewSchedule = () => {
        setIsAddModalOpen(true);
    };

    const handleDelete = async (item: TrialData) => {
    };

    const handleSaveSchedule = (formData: any) => {
        console.log("Data Jadwal Baru dikirim:", formData);
        const name = selectedTrialData?.studentName || "Siswa Baru";
        toast.success(`Jadwal untuk ${name} sukses disimpan!`);
        setIsModalOpen(false);
        setSelectedTrialData(null);
        fetchTrialClasses();
    };

    const handleAddTrialSubmit = async (formData: any) => {
        console.log("Data Tambah Jadwal Trial Baru:", formData);
        toast.success(`Jadwal Trial Class untuk ${formData.studentName} berhasil ditambahkan!`);
        setIsAddModalOpen(false);
        fetchTrialClasses();
    };

    const handleApproveReschedule = (formData: any) => {
        console.log("Reschedule Disetujui:", formData);
        toast.success(`Jadwal baru untuk ${formData.data.studentName} sukses diperbarui!`);
        setIsReviewModalOpen(false);
        setSelectedTrialData(null);
        fetchTrialClasses();
    };

    const handleRejectReschedule = (data: TrialData) => {
        Swal.fire({
            title: 'Tolak Permintaan?',
            text: `Apakah Anda yakin ingin menolak permohonan reschedule ${data.studentName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Tolak',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                toast.error(`Permintaan reschedule ${data.studentName} telah ditolak.`);
                setIsReviewModalOpen(false);
                setSelectedTrialData(null);
                fetchTrialClasses();
            }
        });
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch = 
            item.studentName.toLowerCase().includes(search.toLowerCase()) ||
            item.parentName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? item.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <div className="container-xl sm:p-5" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                    <div>
                        <h2 className="fw-extrabold text-dark m-0" style={{ fontSize: "28px", letterSpacing: "-0.5px" }}>Trial Class</h2>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-white bg-white border border-light-subtle text-secondary font-medium py-2 px-3 d-flex align-items-center gap-2" style={{ borderRadius: "12px", fontSize: "14px" }}>
                            <IconDownload size={18} className="text-muted" />
                            Export Data
                        </button>
                        <button 
                            className="btn fw-bold text-white py-2 px-3 d-flex align-items-center gap-2 shadow-sm" 
                            style={{ backgroundColor: "#0F2C59", borderRadius: "12px", fontSize: "14px" }}
                            onClick={handleCreateNewSchedule}
                        >
                            <IconPlus size={18} />
                            Tambah Jadwal Trial Class
                        </button>
                    </div>
                </div>

                <div className="row row-cards row-cols-2 row-cols-sm-3 row-cols-lg-5 g-3 mb-4">
                    <div className="col">
                        <StatCard 
                            title="Menunggu Jadwal" 
                            value={items.filter(i => i.status === "Menunggu Jadwal").length.toString()} 
                            badgeText="Jadwal" 
                            badgeColor="bg-purple-lt text-purple" 
                            icon={IconClock} 
                            iconBg="bg-purple-lt" 
                            iconColor="text-purple" 
                            progressColor="#7367F0" 
                            progressValue="100%" 
                        />
                    </div>
                    <div className="col">
                        <StatCard 
                            title="Menunggu Persetujuan" 
                            value={items.filter(i => i.status === "Menunggu Persetujuan").length.toString()} 
                            badgeText="Persetujuan" 
                            badgeColor="bg-blue-lt text-blue" 
                            icon={IconHourglass} 
                            iconBg="bg-blue-lt" 
                            iconColor="text-blue" 
                            progressColor="#00CFE8" 
                            progressValue="100%" 
                        />
                    </div>
                    <div className="col">
                        <StatCard 
                            title="Disetujui" 
                            value={items.filter(i => i.status === "Disetujui").length.toString()} 
                            badgeText="Disetujui" 
                            badgeColor="bg-success-lt text-success" 
                            icon={IconCircleCheck} 
                            iconBg="bg-success-lt" 
                            iconColor="text-success" 
                            progressColor="#28C76F" 
                            progressValue="100%" 
                        />
                    </div>
                    <div className="col">
                        <StatCard 
                            title="Reschedule" 
                            value={items.filter(i => i.status === "Reschedule").length.toString()} 
                            badgeText="Reschedule" 
                            badgeColor="bg-warning-lt text-warning" 
                            icon={IconRefresh} 
                            iconBg="bg-warning-lt" 
                            iconColor="text-warning" 
                            progressColor="#FF9F43" 
                            progressValue="100%" 
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-auto flex-lg-grow-1">
                        <StatCard 
                            title="Selesai" 
                            value={items.filter(i => i.status === "Selesai").length.toString()} 
                            badgeText="Selesai" 
                            badgeColor="bg-info-lt text-info" 
                            icon={IconCheck} 
                            iconBg="bg-info-lt" 
                            iconColor="text-info" 
                            progressColor="#00BAD1" 
                            progressValue="100%" 
                        />
                    </div>
                </div>

                <div className="card shadow-sm border-light mb-4 bg-white" style={{ borderRadius: "16px", overflow: "hidden" }}>
                    <div className="card-header bg-white py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom-0">
                        <div className="d-flex flex-wrap gap-2 flex-grow-1 max-w-xl">
                            <div className="position-relative flex-grow-1">
                                <IconSearch className="position-absolute text-muted" size={16} style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                                <input 
                                    type="text" 
                                    className="form-control bg-light-subtle border-light-subtle ps-5 py-2" 
                                    placeholder="Cari nama siswa / orang tua..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ borderRadius: "10px", fontSize: "14px" }}
                                />
                            </div>
                            <select 
                                className="form-select bg-light-subtle border-light-subtle py-2 text-secondary w-auto"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ borderRadius: "10px", fontSize: "14px", minWidth: "145px" }}
                            >
                                <option value="">Semua Status</option>
                                <option value="Menunggu Jadwal">Menunggu Jadwal</option>
                                <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                                <option value="Disetujui">Disetujui</option>
                                <option value="Reschedule">Reschedule</option>
                            </select>
                            <input 
                                type="date" 
                                className="form-control bg-light-subtle border-light-subtle py-2 text-muted w-auto"
                                style={{ borderRadius: "10px", fontSize: "14px" }}
                            />
                        </div>
                        <button className="btn btn-light bg-light border-light-subtle p-2 text-secondary" style={{ borderRadius: "10px" }}>
                            <IconAdjustmentsHorizontal size={18} />
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table card-table table-vcenter table-hover m-0">
                            <thead>
                                <tr style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #EDF2F7", borderBottom: "1px solid #EDF2F7" }}>
                                    <th className="text-muted fw-bold py-3 px-4" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>SISWA / ORANG TUA</th>
                                    <th className="text-muted fw-bold py-3 px-3" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>PROGRAM / KELAS</th>
                                    <th className="text-muted fw-bold py-3 px-3" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>TGL DAFTAR</th>
                                    <th className="text-muted fw-bold py-3 px-3" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>STATUS</th>
                                    <th className="text-muted fw-bold text-end py-3 px-4" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>AKSI</th> 
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-light">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="text-center p-5 text-muted fw-medium">Memuat data pendaftaran...</td></tr>
                                ) : filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <TableRow 
                                            key={item._id || item.id} 
                                            data={item} 
                                            onAction={handleAction} 
                                            onDelete={handleDelete}
                                        />
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="text-center p-5 text-muted fw-medium">Tidak ada data pendaftaran ditemukan</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="card-footer bg-white d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 px-4 py-3 border-top-0">
                        <p className="m-0 text-secondary fw-medium" style={{ fontSize: "14px" }}>
                            Menampilkan 1-{filteredItems.length} dari {filteredItems.length} data
                        </p>
                        <div className="d-flex gap-1 align-items-center">
                            <button className="btn btn-icon btn-sm btn-white border border-light-subtle rounded-3 p-2 d-flex align-items-center justify-content-center" disabled={true}>
                                <IconChevronLeft size={16} className="text-muted" />
                            </button>
                            <button className="btn btn-sm rounded-3 px-3 fw-bold text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0F2C59', borderColor: '#0F2C59', height: "34px" }}>
                                1
                            </button>
                            <button className="btn btn-icon btn-sm btn-white border border-light-subtle rounded-3 px-3 text-secondary fw-medium d-flex align-items-center justify-content-center" style={{ height: "34px" }}>2</button>
                            <button className="btn btn-icon btn-sm btn-white border border-light-subtle rounded-3 px-3 text-secondary fw-medium d-flex align-items-center justify-content-center" style={{ height: "34px" }}>3</button>
                            <button className="btn btn-icon btn-sm btn-white border border-light-subtle rounded-3 p-2 d-flex align-items-center justify-content-center">
                                <IconChevronRight size={16} className="text-secondary" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AddTrialScheduleModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <ScheduleModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTrialData(null);
                }}
                data={selectedTrialData}
                onSave={handleSaveSchedule}
            />

            <ReviewRescheduleModal 
                isOpen={isReviewModalOpen}
                onClose={() => {
                    setIsReviewModalOpen(false);
                    setSelectedTrialData(null);
                }}
                data={selectedTrialData}
                onApprove={handleApproveReschedule}
                onReject={handleRejectReschedule}
            />

            <ViewScheduleModal 
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedTrialData(null);
                }}
                data={selectedTrialData}
            />

            <Toaster position="top-right" />
        </>
    );
}