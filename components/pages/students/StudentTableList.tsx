"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    IconPlus,
    IconChevronLeft,
    IconChevronRight,
    IconUsers,
    IconShieldCheck,
    IconReceipt,
    IconCircleCheck,
    IconFilter,
    IconDownload,
    IconArrowRight
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { StatCard } from "../../../components/ui/StatCard";
import { Button } from "../../../components/ui/Button"; 
import { callApi } from "@/lib/api";
import { StudentDetailModal } from "./StudentDetailModal";
import { StudentForm } from "./StudentForm";
import { BadgeStatus } from "../../../components/ui/BadgeStatus";

export interface StudentData {
  _id: string;
  id: string;
  studentName: string;
  regId: string;
  grade: string;
  regDate: string;
  status: "Selesai" | "Proses" | "Ditolak/Bermasalah" | string;
  avatarUrl?: string;
  initials?: string;
}

function TableRow({ 
    data, 
    onEdit, 
    onView, 
    onDelete 
}: { 
    data: StudentData; 
    onEdit: (item: StudentData) => void; 
    onView: (item: StudentData) => void; 
    onDelete: (item: StudentData) => void; 
}) {
    const initials = data.initials || data.studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    return (
        <tr style={{ verticalAlign: "middle" }}>
            <td>
                <div className="d-flex align-items-center py-2 px-3">
                {data.avatarUrl ? (
                    <img src={data.avatarUrl} alt={data.studentName} className="rounded-circle me-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                ) : (
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{ width: "40px", height: "40px", backgroundColor: "#EEF2FF", color: "#4F46E5", fontSize: "13px" }}>
                    {initials}
                    </div>
                )}
                <div>
                    <div className="fw-semibold text-dark" style={{ fontSize: "14px" }}>{data.studentName}</div>
                    <div className="text-muted small" style={{ fontSize: "12px" }}>ID: {data.regId || data.id}</div>
                </div>
                </div>
            </td>
            <td className="text-secondary font-medium" style={{ fontSize: "14px" }}>{data.grade}</td>
            <td className="text-muted" style={{ fontSize: "14px" }}>{data.regDate}</td>
            <td>
                <BadgeStatus status={data.status} />
            </td>
            <td className="text-end px-3">
                <div className="d-flex align-items-center justify-content-end gap-2">
                <Button variant="link" className="p-0 text-primary text-decoration-none fw-semibold d-inline-flex align-items-center" onClick={() => onView(data)} style={{ fontSize: "13px" }}>
                    View Details <IconArrowRight size={14} className="ms-1" />
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

    const dummyStudents: StudentData[] = [
        { _id: "1", id: "REG-2024-0012", regId: "REG-2024-0012", studentName: "Ahmad Maulana", initials: "AM", grade: "Grade 10 - Science", regDate: "12 Oct 2023", status: "Selesai" },
        { _id: "2", id: "REG-2024-0015", regId: "REG-2024-0015", studentName: "Siti Pertiwi", initials: "SP", grade: "Grade 11 - Art", regDate: "14 Oct 2023", status: "Proses" },
        { _id: "3", id: "REG-2024-0019", regId: "REG-2024-0019", studentName: "Budi Kusuma", initials: "BK", grade: "Grade 10 - Social", regDate: "15 Oct 2023", status: "Ditolak/Bermasalah" },
    ];

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await callApi<StudentData[] | { data: StudentData[] }>("students/registrations", { 
                method: "GET" 
            });
            const dataStudents = Array.isArray(response) ? response : response?.data || [];
            setItems(dataStudents.length > 0 ? dataStudents : dummyStudents);
        } catch (error) {
            setItems(dummyStudents);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

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
    
    const handleDelete = (item: StudentData) => toast.error(`Deleting ${item.studentName}`);

    const handleSaveStudent = (savedStudent: StudentData) => {
        if (selectedStudent) {
            setItems(prev => prev.map(item => item._id === savedStudent._id || item.id === savedStudent.id ? { ...item, ...savedStudent } : item));
            toast.success(`Data ${savedStudent.studentName} berhasil diperbarui!`);
        } else {
            setItems(prev => [savedStudent, ...prev]);
            toast.success(`Registrasi ${savedStudent.studentName} berhasil ditambahkan!`);
        }
        setIsFormOpen(false);
    };

    return (
        <>
            <div className="container-xl py-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                    <div>
                        <h2 className="fw-bold text-dark m-0" style={{ fontSize: "24px" }}>Registrasi & Data Siswa</h2>
                        <p className="text-secondary m-0 mt-1" style={{ fontSize: "14px" }}>
                        Kelola pendaftaran siswa baru dan verifikasi berkas akademik.
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button 
                            className="btn-primary px-3 py-2 rounded-3 fw-medium d-flex align-items-center shadow-sm" 
                            style={{ backgroundColor: "#0F2C59", borderColor: "#0F2C59" }}
                            onClick={handleCreateNew}
                        >
                            <IconPlus size={18} className="me-2" />
                            <span>Tambah Registrasi Baru</span>
                        </Button>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
                    <div className="col">
                        <StatCard title="Total Registrasi" value="1,284" badgeText="+12%" badgeColor="bg-success-lt text-success" icon={IconUsers} iconBg="bg-light" iconColor="text-dark" progressColor="#0F3B8C" progressValue="100%" />
                    </div>
                    <div className="col">
                        <StatCard title="Verifikasi Dokumen" value="412" badgeText="Aktif" badgeColor="bg-purple-lt text-purple" icon={IconShieldCheck} iconBg="bg-purple-lt" iconColor="text-purple" progressColor="#6F3AFF" progressValue="100%" />
                    </div>
                    <div className="col">
                        <StatCard title="Menunggu Pembayaran" value="89" badgeText="Pending" badgeColor="bg-warning-lt text-warning" icon={IconReceipt} iconBg="bg-warning-lt" iconColor="text-warning" progressColor="#FF9F43" progressValue="100%" />
                    </div>
                    <div className="col">
                        <StatCard title="Selesai" value="783" badgeText="Finish" badgeColor="bg-success-lt text-success" icon={IconCircleCheck} iconBg="bg-success-lt" iconColor="text-success" progressColor="#28C76F" progressValue="100%" />
                    </div>
                </div>

                <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                    <div className="card-header bg-white py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom-0">
                        <h3 className="fw-semibold text-dark m-0" style={{ fontSize: "16px" }}>Enrollment Registry</h3>
                        <div className="d-flex align-items-center gap-2">
                            <Button variant="link" className="btn-sm btn-white border rounded-2 px-3 py-1.5 text-secondary d-flex align-items-center text-decoration-none">
                                <IconDownload size={16} className="me-1.5" /> Export CSV
                            </Button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table card-table table-vcenter table-hover" style={{ margin: 0 }}>
                            <thead>
                                <tr style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
                                    <th className="text-muted fw-semibold py-3 px-4" style={{ fontSize: "12px" }}>STUDENT NAME</th>
                                    <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px" }}>GRADE</th>
                                    <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px" }}>REG. DATE</th>
                                    <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px" }}>STATUS</th>
                                    <th className="text-muted fw-semibold text-end py-3 px-4" style={{ fontSize: "12px" }}>ACTIONS</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={5} className="text-center p-5 text-muted">Memuat data...</td></tr>
                                ) : items.length > 0 ? (
                                    items.map((item) => (
                                        <TableRow key={item._id} data={item} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="text-center p-5 text-muted">Tidak ada data pendaftaran ditemukan</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                
                    <div className="card-footer bg-white d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 px-4 py-3 border-top">
                        <p className="m-0 text-secondary" style={{ fontSize: "14px" }}>Menampilkan {items.length} dari 124 entri</p>
                        <div className="d-flex gap-1 align-items-center">
                            <Button variant="link" className="btn-icon btn-sm btn-white border rounded-2 p-2" disabled={true}><IconChevronLeft size={16} className="text-secondary" /></Button>
                            <Button className="btn-sm rounded-2 px-3 fw-bold text-white" style={{ backgroundColor: '#002B7F', borderColor: '#002B7F' }}>1</Button>
                            <Button variant="link" className="btn-icon btn-sm btn-white border rounded-2 px-3 py-1 text-secondary">2</Button>
                            <Button variant="link" className="btn-icon btn-sm btn-white border rounded-2 px-3 py-1 text-secondary">3</Button>
                            <Button variant="link" className="btn-icon btn-sm btn-white border rounded-2 p-2"><IconChevronRight size={16} className="text-secondary" /></Button>
                        </div>
                    </div>
                </div>

                {/* <div className="rounded-4 p-4 text-white shadow-sm" style={{ background: "linear-gradient(135deg, #051329 0%, #0A2540 50%, #111C44 100%)" }}>
                    <h4 className="fw-bold mb-2" style={{ fontSize: "16px" }}>Informasi Sistem Pendaftaran</h4>
                    <p className="text-white-50 mb-4" style={{ fontSize: "13px", maxWidth: "800px", lineHeight: "1.6" }}>
                        Update terakhir dilakukan pada pukul 08:30 WIB. Semua data dokumen yang diunggah akan melalui verifikasi otomatis oleh sistem AI sebelum divalidasi oleh administrator.
                    </p>

                    <div className="row g-3">
                        <div className="col-12 col-md-4">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                <div className="h2 fw-bold m-0">98%</div>
                                <div className="text-white-50 text-uppercase fw-bold mt-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>VERIFIKASI AKURASI</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                <div className="h2 fw-bold m-0">~15m</div>
                                <div className="text-white-50 text-uppercase fw-bold mt-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>WAKTU RATA-RATA</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                <div className="h2 fw-bold m-0">24/7</div>
                                <div className="text-white-50 text-uppercase fw-bold mt-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>SYSTEM UPTIME</div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            <StudentDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                student={selectedStudent}
                onEdit={handleEdit}
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