"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
    IconPlus,
    IconChevronLeft,
    IconChevronRight,
    IconPencil,
    IconTrash,
    IconEye,
    IconDotsVertical,
    IconUser,
    IconUsers,
    IconSchool
} from "@tabler/icons-react";
import { Toaster, toast } from 'react-hot-toast';
import { AddRole } from "./AddRole";
import { StatCard } from "../../../components/ui/StatCard";
import { Button } from "../../../components/ui/Button"; 
import { callApi } from "@/lib/api";
import Swal from 'sweetalert2';

export interface AdminData {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  avatarUrl?: string;
}

function TableRow({ data, onEdit, onView, onDelete }: { data: AdminData; onEdit: (item: AdminData) => void; onView: (item: AdminData) => void; onDelete: (item: AdminData) => void; }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isTeacher = data.role.toLowerCase() === "teacher" || data.role.toLowerCase() === "guru";
  const roleBadgeStyle = isTeacher 
    ? { backgroundColor: "#EBE3FF", color: "#6F3AFF" } 
    : { backgroundColor: "#E3EFFF", color: "#3A7BFF" };
    
  return (
    <tr style={{ verticalAlign: "middle" }}>
      <td>
        <div className="d-flex align-items-center py-2">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt={data.fullName} className="rounded-circle me-3" style={{ width: "42px", height: "42px", objectFit: "cover" }} />
          ) : (
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: "42px", height: "42px" }}>
              <IconUser size={20} className="text-muted" />
            </div>
          )}
          <div>
             <div className="fw-semibold text-dark" style={{ fontSize: "14px" }}>{data.fullName}</div>
             <div className="text-muted small" style={{ fontSize: "12px" }}>{data.phone || "-"}</div>
          </div>
        </div>
      </td>
      <td className="text-secondary" style={{ fontSize: "14px" }}>{data.email}</td>
      <td>
        <span className="badge border-0 px-3 py-1.5 rounded-pill fw-medium" style={{ ...roleBadgeStyle, fontSize: "12px", textTransform: "capitalize" }}>
          {data.role}
        </span>
      </td>
      <td className="text-end">
        <div className={`dropdown ${showDropdown ? 'show' : ''}`} ref={dropdownRef} style={{ position: 'relative' }}>
          <Button 
            variant="link" 
            className="p-1 text-secondary" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <IconDotsVertical size={20} />
          </Button>
          
          <div className={`dropdown-menu dropdown-menu-end shadow-sm border ${showDropdown ? 'show' : ''}`} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 1050, display: showDropdown ? 'block' : 'none', minWidth: '160px', borderRadius: '8px' }}>
            {/* <button className="dropdown-item py-2" onClick={() => { onView(data); setShowDropdown(false); }}>
              <IconEye size={16} className="me-2 text-muted"/> Lihat Detail
            </button>
            <button className="dropdown-item py-2" onClick={() => { onEdit(data); setShowDropdown(false); }}>
              <IconPencil size={16} className="me-2 text-muted"/> Edit
            </button>
            <div className="dropdown-divider my-1"></div> */}
            <button className="dropdown-item py-2 text-danger" onClick={() => { onDelete(data); setShowDropdown(false); }}>
              <IconTrash size={16} className="me-2"/> Hapus
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function UserTableList() {
  const [viewMode, setViewMode] = useState<"list" | "create-role">("list");
  const [activeTab, setActiveTab] = useState("Semua");
  const [items, setItems] = useState<AdminData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await callApi<AdminData[] | { data: AdminData[] }>("users", { 
        method: "GET" 
      });
      const dataUsers = Array.isArray(response) ? response : response?.data || [];
      setItems(dataUsers);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (viewMode === "list") {
      fetchUsers();
    }
  }, [viewMode, fetchUsers]);

  const handleEdit = (item: AdminData) => toast.success(`Editing ${item.fullName}`);
  const handleView = (item: AdminData) => toast.success(`Viewing ${item.fullName}`);
  const handleDelete = async (item: AdminData) => {
    const confirmResult = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Data ${item.fullName} akan dihapus secara permanen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });

    if (confirmResult.isConfirmed) {
      try {
        const userId = item.id || item._id;
        await callApi(`users/${userId}`, {
          method: "DELETE"
        });
        toast.success(`Data ${item.fullName} berhasil dihapus`);
        fetchUsers();
      } catch (error) {
        toast.error(`Gagal menghapus data ${item.fullName}`);
      }
    }
  };
  
  const filteredItems = items.filter(item => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Guru") return item.role.toLowerCase() === "teacher" || item.role.toLowerCase() === "guru";
    if (activeTab === "Wali Murid") return item.role.toLowerCase() === "parent";
    if (activeTab === "Admin") return item.role.toLowerCase() === "admin";
    return true;
  });

  const totalUsers = items.length;
  const totalTeachers = items.filter(item => item.role.toLowerCase() === "teacher" || item.role.toLowerCase() === "guru").length;
  const totalParents = items.filter(item => item.role.toLowerCase() === "parent").length;

  if (viewMode === "create-role") {
    return (
      <>
        <AddRole onBack={() => setViewMode("list")} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <div className="container-xl" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
        <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
          <div className="col">
            <StatCard title="Total Users" value={totalUsers.toString()} badgeText="Realtime" badgeColor="bg-success-lt text-success" icon={IconUsers} iconBg="bg-primary-lt" iconColor="text-primary" progressColor="#0F3B8C" progressValue="100%"/>
          </div>
          <div className="col">
            <StatCard title="Teachers Active" value={totalTeachers.toString()} badgeText="Stable" badgeColor="bg-blue-lt text-blue" icon={IconSchool} iconBg="bg-purple-lt" iconColor="text-purple" progressColor="#6F3AFF" progressValue="100%"/>
          </div>
          <div className="col">
            <StatCard title="Parents Active" value={totalParents.toString()} badgeText="Stable" badgeColor="bg-green-lt text-green" icon={IconUsers} iconBg="bg-green-lt" iconColor="text-green" progressColor="#34C759" progressValue="100%"/>
          </div>
        </div>

        <div className="card shadow-sm border-0" style={{ borderRadius: "16px", overflow: "hidden" }}>
          <div className="card-header bg-white py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom-0">
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <div className="btn-group p-1 bg-light rounded-3" role="group" style={{ border: "1px solid #E2E8F0" }}>
                {["Semua", "Guru", "Wali Murid", "Admin"].map((tab) => (
                  <Button
                    key={tab}
                    variant="link"
                    className={`btn-sm px-3 py-2 fw-medium rounded-2 ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                    onClick={() => setActiveTab(tab)}
                    style={{ fontSize: "14px", transition: "all 0.2s" }}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Button 
                onClick={() => setViewMode("create-role")}
                variant="default"
                size="lg"
              >
                <IconPlus size={18} className="me-2" /> Tambah Akses Baru
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table card-table table-vcenter table-hover px-4" style={{ margin: 0 }}>
              <thead>
                <tr style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
                  <th className="text-muted fw-semibold py-3 px-4" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>USER PROFILE</th>
                  <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>EMAIL</th>
                  <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>ROLE</th>
                  <th className="text-muted fw-semibold text-end py-3 px-4" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>AKSI</th> 
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center p-5 text-muted">Memuat data...</td>
                  </tr>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item._id} data={item} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
                  ))
                ) : (
                    <tr>
                        <td colSpan={4} className="text-center p-5 text-muted">Tidak ada data ditemukan</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="card-footer bg-white d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 px-4 py-3 border-top">
            <p className="m-0 text-secondary" style={{ fontSize: "14px" }}>
              Menampilkan {filteredItems.length} dari {items.length} Pengguna
            </p>
            <div className="d-flex gap-1 align-items-center">
              <Button 
                variant="link" 
                className="btn-icon btn-sm btn-white border rounded-2 p-2"
                disabled={true}
              >
                <IconChevronLeft size={16} className="text-secondary" />
              </Button>
              
              <Button className="btn-sm rounded-2 px-3 fw-bold" style={{ backgroundColor: '#002B7F', borderColor: '#002B7F' }}>
                1
              </Button>

              <Button 
                variant="link" 
                className="btn-icon btn-sm btn-white border rounded-2 p-2"
                disabled={true}
              >
                <IconChevronRight size={16} className="text-secondary" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Toaster position="top-right" />
    </>
  );
}