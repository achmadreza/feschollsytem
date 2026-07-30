"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    IconPlus,
    IconChevronLeft,
    IconChevronRight,
    IconUsers,
    IconCircleCheck,
    IconArrowRight,
    IconX,
    IconProgressCheck,
    IconTrash
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { StatCard } from "../../../components/ui/StatCard";
import { Button } from "../../../components/ui/Button"; 
import { callApi } from "@/lib/api";
import { StudentDetailModal } from "./StudentDetailModal";
import { StudentForm } from "./StudentForm";
import { BadgeStatus } from "../../../components/ui/BadgeStatus";
import Swal from 'sweetalert2';

export interface StudentData {
  _id: string;
  id: string;
  name: string;
  class: string;
  gender: string;
  religion: string;
  status: string;
  address: string;
  birthPlace: string;
  birthdate: string;
  fatherName: string;
  motherName: string;
  emailParent: string;
  phoneNumber: string;
  schoolYear: string;
  kk: string;
  birthCertificate?: string;
  photo?: string;
  createdAt: string;
  updatedAt?: string;
  studentName?: string;
  regId?: string;
  grade?: string;
  regDate?: string;
  avatarUrl?: string;
  initials?: string;
}

function TableRow({ 
    data, 
    onView,
    onDelete,
    onStatusChange
}: { 
    data: StudentData; 
    onEdit: (item: StudentData) => void; 
    onView: (item: StudentData) => void; 
    onDelete: (item: StudentData) => void; 
    onStatusChange: (item: StudentData, newStatus: string) => void;
}) {
    const displayName = data.name || data.studentName || "Tanpa Nama";
    const initials = data.initials || displayName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const formattedDate = data.createdAt ? new Date(data.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }) : data.regDate || "-";
    const [imgError, setImgError] = useState(false);
    
    const getPhotoUrl = (path?: string) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
            return path;
        }
        const baseUrl = process.env.NEXT_PUBLIC_API_URL; 
        return `${baseUrl}/${path.replace(/^\//, "")}`;
    };

    const photoSrc = getPhotoUrl(data.photo || data.avatarUrl);

    return (
        <tr style={{ verticalAlign: "middle" }}>
            <td>
                <div className="d-flex align-items-center py-2 px-3">
                {photoSrc && !imgError ? (
                    <img 
                        src={photoSrc} 
                        alt={displayName} 
                        className="rounded-circle me-3" 
                        style={{ width: "40px", height: "40px", objectFit: "cover" }} 
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold flex-shrink-0" style={{ width: "40px", height: "40px", backgroundColor: "#EEF2FF", color: "#4F46E5", fontSize: "13px" }}>
                    {initials}
                    </div>
                )}
                <div>
                    <div className="fw-semibold text-dark" style={{ fontSize: "14px" }}>{displayName}</div>
                    <div className="text-muted small" style={{ fontSize: "12px" }}>ID: {data.id || data.regId || data._id}</div>
                </div>
                </div>
            </td>
            <td className="text-secondary font-medium" style={{ fontSize: "14px" }}>
                {data.class || data.grade || "-"}
            </td>
            <td className="text-muted" style={{ fontSize: "14px" }}>
                {formattedDate}
            </td>
            <td>
                <BadgeStatus status={data.status} />
            </td>
            <td>
                <select 
                    className="form-select form-select-sm border-light-subtle shadow-none" 
                    value={data.status || "PROCESS"}
                    onChange={(e) => onStatusChange(data, e.target.value)}
                    style={{ fontSize: "13px", width: "130px", cursor: "pointer", borderRadius: '8px' }}
                >
                    <option value="PROCESS">PROCESS</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="FINISHED">FINISHED</option>
                </select>
            </td>
            <td className="text-end px-3">
                <div className="d-flex align-items-center justify-content-end gap-2">
                    <Button 
                        type="button" 
                        variant="danger"
                        size="sm"
                        title="Hapus Data Siswa"
                        onClick={() => onDelete(data)}
                    >
                        <IconTrash size={16} />
                    </Button>
                    <Button 
                        type="button" 
                        onClick={() => onView(data)}
                        variant="link"
                        size="sm"
                    >
                        <span>View Details</span>
                        <IconArrowRight size={12} />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export function StudentTableList() {
    const [items, setItems] = useState<StudentData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await callApi<StudentData[] | { data: StudentData[] }>("students", { 
                method: "GET" 
            });
            const rawData = Array.isArray(response) ? response : response?.data || [];
            
            const dataStudents: StudentData[] = rawData.map(item => ({
                ...item,
                studentName: item.name || item.studentName,
                grade: item.class || item.grade,
                regId: item.id || item._id,
                regDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : item.regDate
            }));

            setItems(dataStudents);
        } catch (error) {
            console.error("Error fetching students:", error);
            toast.error("Gagal mengambil data siswa.");
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const totalRegistrasi = items.length;

    const totalProses = items.filter(item => {
        const status = item.status?.toUpperCase();
        return status === "PROCESS" || status === "PROSES" || status === "PENDING";
    }).length;

    const totalDitolak = items.filter(item => {
        const status = item.status?.toUpperCase();
        return status === "REJECTED" || status === "DITOLAK";
    }).length;

    const totalSelesai = items.filter(item => {
        const status = item.status?.toUpperCase();
        return status === "FINISHED" || status === "COMPLETED" || status === "APPROVED" || status === "SELESAI";
    }).length;

    const handleCreateNew = () => {
        setSelectedStudent(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: StudentData) => {
        setSelectedStudent(item);
        setIsDetailModalOpen(false);
        setIsFormOpen(true);
    };

    const handleView = (item: StudentData) => {
        setSelectedStudent(item);
        setIsDetailModalOpen(true);
    };
    
    const handleStatusChange = async (item: StudentData, newStatus: string) => {
        const targetId = item._id || item.id;
        try {
            await callApi(`students/${targetId}`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus })
            });

            setItems(prev => prev.map(s => (s._id === targetId || s.id === targetId) ? { ...s, status: newStatus } : s));
            toast.success(`Status ${item.name || item.studentName} diperbarui menjadi ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Gagal memperbarui status.");
        }
    };

    const handleDelete = async (item: StudentData) => {
        const name = item.name || item.studentName || "Siswa";
        const targetId = item._id || item.id;

        const confirmResult = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data ${name} akan dihapus secara permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        try {
            await callApi(`students/${targetId}`, {
                method: "DELETE"
            });

            setItems(prev => prev.filter(s => (s._id !== targetId && s.id !== targetId)));
            toast.success(`Data ${name} berhasil dihapus.`);
        } catch (error) {
            console.error("Error deleting student:", error);
            toast.error(`Gagal menghapus data ${name}.`);
        }
    };

    const handleSaveStudent = (savedStudent: StudentData) => {
        if (selectedStudent) {
            setItems(prev => prev.map(item => item._id === savedStudent._id || item.id === savedStudent.id ? { ...item, ...savedStudent } : item));
            toast.success(`Data ${savedStudent.name || savedStudent.studentName} berhasil diperbarui!`);
        } else {
            setItems(prev => [savedStudent, ...prev]);
            toast.success(`Registrasi ${savedStudent.name || savedStudent.studentName} berhasil ditambahkan!`);
        }
        setIsFormOpen(false);
    };

    return (
        <>
            <div className="container-xl" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                    <div>
                        <h2 className="fw-bold text-dark m-0" style={{ fontSize: "24px" }}>Registrasi & Data Siswa</h2>
                        <p className="text-secondary m-0 mt-1" style={{ fontSize: "14px" }}>
                        Kelola pendaftaran siswa baru dan verifikasi berkas akademik.
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={handleCreateNew}
                        >
                            <IconPlus size={18} className="me-2" />
                            <span>Tambah Registrasi Baru</span>
                        </Button>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
                    <div className="col">
                        <StatCard title="Total Registrasi" value={totalRegistrasi.toString()} badgeText="Total" badgeColor="bg-primary-lt text-primary" icon={IconUsers} iconBg="bg-light" iconColor="text-dark" progressColor="#0F3B8C" progressValue="100%" />
                    </div>
                    <div className="col">
                        <StatCard title="Ditolak" value={totalDitolak.toString()} badgeText="Ditolak" badgeColor="bg-danger-lt text-danger" icon={IconX} iconBg="bg-danger-lt" iconColor="text-danger" progressColor="#f93328" progressValue="100%" />
                    </div>
                    <div className="col">
                        <StatCard title="Proses" value={totalProses.toString()} badgeText="Proses" badgeColor="bg-warning-lt text-warning" icon={IconProgressCheck} iconBg="bg-warning-lt" iconColor="text-warning" progressColor="#FF9F43" progressValue="100%" />
                    </div>
                    <div className="col">
                        <StatCard title="Selesai" value={totalSelesai.toString()} badgeText="Finish" badgeColor="bg-success-lt text-success" icon={IconCircleCheck} iconBg="bg-success-lt" iconColor="text-success" progressColor="#28C76F" progressValue="100%" />
                    </div>
                </div>

                <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                    <div className="card-header bg-white py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom-0">
                        <h3 className="fw-semibold text-dark m-0" style={{ fontSize: "16px" }}>Enrollment Registry</h3>
                    </div>

                    <div className="table-responsive">
                        <table className="table card-table table-vcenter table-hover" style={{ margin: 0 }}>
                            <thead>
                                <tr style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
                                    <th className="text-muted fw-semibold py-3 px-4" style={{ fontSize: "12px" }}>STUDENT NAME</th>
                                    <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px" }}>CLASS</th>
                                    <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px" }}>REG. DATE</th>
                                    <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px" }}>STATUS</th>
                                    <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px" }}>UPDATE STATUS</th>
                                    <th className="text-muted fw-semibold text-end py-3 px-4" style={{ fontSize: "12px" }}>ACTIONS</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={6} className="text-center p-5 text-muted">Memuat data...</td></tr>
                                ) : items.length > 0 ? (
                                    items.map((item) => (
                                        <TableRow 
                                            key={item._id || item.id} 
                                            data={item} 
                                            onEdit={handleEdit} 
                                            onView={handleView} 
                                            onDelete={handleDelete} 
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                ) : (
                                    <tr><td colSpan={6} className="text-center p-5 text-muted">Tidak ada data pendaftaran ditemukan</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                
                    <div className="card-footer bg-white d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 px-4 py-3 border-top">
                        <p className="m-0 text-secondary" style={{ fontSize: "14px" }}>Menampilkan {items.length} dari {items.length} entri</p>
                        <div className="d-flex gap-1 align-items-center">
                            <Button variant="link" className="btn-icon btn-sm btn-white border rounded-2 p-2" disabled={true}><IconChevronLeft size={16} className="text-secondary" /></Button>
                            <Button className="btn-sm rounded-2 px-3 fw-bold text-white" style={{ backgroundColor: '#002B7F', borderColor: '#002B7F' }}>1</Button>
                            <Button variant="link" className="btn-icon btn-sm btn-white border rounded-2 px-3 py-1 text-secondary">2</Button>
                            <Button variant="link" className="btn-icon btn-sm btn-white border rounded-2 px-3 py-1 text-secondary">3</Button>
                            <Button variant="link" className="btn-icon btn-sm btn-white border rounded-2 p-2"><IconChevronRight size={16} className="text-secondary" /></Button>
                        </div>
                    </div>
                </div>
            </div>

            <StudentDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                student={selectedStudent}
                onEdit={handleEdit}
                onSaveSuccess={handleSaveStudent}
            />

            <StudentForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                student={selectedStudent}
                onSave={handleSaveStudent}
            />

            <Toaster position="top-right" />
        </>
    );
}