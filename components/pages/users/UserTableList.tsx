"use client";

import { useState, useEffect, useRef } from "react";
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

export interface AdminData {
  id: number;
  name: string;
  subText: string;
  email: string;
  role: string;
  lastLogin: string;
  status: "Active" | "Pending" | "Inactive";
  avatarUrl?: string;
}

function StatCard({ title, value, badgeText, badgeColor, icon: Icon, iconBg, iconColor, progressColor, progressValue }: any) {
  return (
    <div className="card shadow-sm border-0 p-4 mb-4 flex-fill bg-white" style={{ borderRadius: "16px" }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className={`p-2 rounded-3 ${iconBg} ${iconColor} d-inline-flex`}>
          <Icon size={24} />
        </div>
        <span className={`badge ${badgeColor} border-0 rounded-pill px-2 py-1`} style={{ fontSize: "11px fw-semibold" }}>
          {badgeText}
        </span>
      </div>
      <div className="text-muted small fw-medium mb-1">{title}</div>
      <h2 className="fw-bold mb-3" style={{ color: "#0A192F", fontSize: "32px" }}>{value}</h2>
      <div className="progress" style={{ height: "4px", backgroundColor: "#F1F3F5" }}>
        <div className="progress-bar" style={{ width: progressValue, backgroundColor: progressColor }}></div>
      </div>
    </div>
  );
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

  const roleBadgeStyle = data.role === "Teacher" 
    ? { backgroundColor: "#EBE3FF", color: "#6F3AFF" } 
    : { backgroundColor: "#E3EFFF", color: "#3A7BFF" };
    
  return (
    <tr style={{ verticalAlign: "middle" }}>
      <td>
        <div className="d-flex align-items-center py-2">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt={data.name} className="rounded-circle me-3" style={{ width: "42px", height: "42px", objectFit: "cover" }} />
          ) : (
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: "42px", height: "42px" }}>
              <IconUser size={20} className="text-muted" />
            </div>
          )}
          <div>
             <div className="fw-semibold text-dark" style={{ fontSize: "14px" }}>{data.name}</div>
             <div className="text-muted small" style={{ fontSize: "12px" }}>{data.subText}</div>
          </div>
        </div>
      </td>
      <td className="text-secondary" style={{ fontSize: "14px" }}>{data.email}</td>
      <td>
        <span className="badge border-0 px-3 py-1.5 rounded-pill fw-medium" style={{ ...roleBadgeStyle, fontSize: "12px" }}>
          {data.role}
        </span>
      </td>
      <td className="text-secondary" style={{ fontSize: "14px" }}>{data.lastLogin}</td>
      <td>
        <div className="d-flex align-items-center">
          <span className="rounded-circle me-2" style={{ width: "7px", height: "7px", backgroundColor: data.status === "Active" ? "#34C759" : data.status === "Pending" ? "#FF3B30" : "#8E8E93" }}/>
          <span style={{ color: data.status === "Active" ? "#34C759" : data.status === "Pending" ? "#FF3B30" : "#8E8E93", fontSize: "14px", fontWeight: 500 }}>
            {data.status}
          </span>
        </div>
      </td>
      <td className="text-end">
        <div className={`dropdown ${showDropdown ? 'show' : ''}`} ref={dropdownRef} style={{ position: 'relative' }}>
          <button className="btn btn-link text-secondary p-1 border-0" type="button" onClick={() => setShowDropdown(!showDropdown)}>
            <IconDotsVertical size={20} />
          </button>
          <div className={`dropdown-menu dropdown-menu-end shadow-sm border ${showDropdown ? 'show' : ''}`} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 1050, display: showDropdown ? 'block' : 'none', minWidth: '160px', borderRadius: '8px' }}>
            <button className="dropdown-item py-2" onClick={() => { onView(data); setShowDropdown(false); }}>
              <IconEye size={16} className="me-2 text-muted"/> Lihat Detail
            </button>
            <button className="dropdown-item py-2" onClick={() => { onEdit(data); setShowDropdown(false); }}>
              <IconPencil size={16} className="me-2 text-muted"/> Edit
            </button>
            <div className="dropdown-divider my-1"></div>
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
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [items] = useState<AdminData[]>([
    { id: 1, name: "Aisyah Rahmawati", subText: "NIK: 1992031201", email: "aisyah.r@school.id", role: "Teacher", lastLogin: "10 menit yang lalu", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" },
    { id: 2, name: "Budi Santoso", subText: "Wali: Kelas 4B", email: "budi.santoso@email.com", role: "Parent", lastLogin: "Kemarin, 14:20", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop" },
    { id: 3, name: "Lestari Wijaya", subText: "Wali: Kelas 1A", email: "lestari.wijaya@gmail.com", role: "Parent", lastLogin: "-", status: "Pending" },
    { id: 4, name: "Dian Pratama", subText: "NIK: 1985110302", email: "dian.pr@school.id", role: "Teacher", lastLogin: "2 jam yang lalu", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
  ]);

  const handleEdit = (item: AdminData) => toast.success(`Editing ${item.name}`);
  const handleView = (item: AdminData) => toast.success(`Viewing ${item.name}`);
  const handleDelete = (item: AdminData) => toast.error(`Deleting ${item.name}`);

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === "Semua" || 
      (activeTab === "Guru" && item.role === "Teacher") || 
      (activeTab === "Wali Murid" && item.role === "Parent");
      
    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;
    
    return matchesTab && matchesStatus;
  });

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
      <div className="container-xl py-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
        <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
          <div className="col">
            <StatCard title="Total Users" value="1,284" badgeText="+12% Bulan Ini" badgeColor="bg-success-lt text-success" icon={IconUsers} iconBg="bg-primary-lt" iconColor="text-primary" progressColor="#0F3B8C" progressValue="65%"/>
          </div>
          <div className="col">
            <StatCard title="Teachers Active" value="86" badgeText="Stable" badgeColor="bg-blue-lt text-blue" icon={IconSchool} iconBg="bg-purple-lt" iconColor="text-purple" progressColor="#6F3AFF" progressValue="45%"/>
          </div>
          <div className="col">
            <StatCard title="Parents Active" value="1,198" badgeText="Need Verification" badgeColor="bg-danger-lt text-danger" icon={IconUsers} iconBg="bg-green-lt" iconColor="text-green" progressColor="#34C759" progressValue="80%"/>
          </div>
        </div>

        <div className="card shadow-sm border-0" style={{ borderRadius: "16px", overflow: "hidden" }}>
          <div className="card-header bg-white py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom-0">
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <div className="btn-group p-1 bg-light rounded-3" role="group" style={{ border: "1px solid #E2E8F0" }}>
                {["Semua", "Guru", "Wali Murid"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`btn btn-sm border-0 px-3 py-2 fw-medium rounded-2 ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                    onClick={() => setActiveTab(tab)}
                    style={{ fontSize: "14px", transition: "all 0.2s" }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ minWidth: "150px" }}>
                <select className="form-select border rounded-3 text-secondary" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ borderColor: "#E2E8F0", padding: "8px 12px", fontSize: "14px" }}>
                    <option value="Semua">Status: Semua</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div>
              <button 
                className="btn text-white fw-medium px-3 py-2 rounded-3 d-flex align-items-center" 
                onClick={() => setViewMode("create-role")}
                style={{ backgroundColor: "#002B7F", border: "none", fontSize: "14px" }}
              >
                <IconPlus size={18} className="me-2" /> Tambah Akses Baru
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table card-table table-vcenter table-hover px-4" style={{ margin: 0 }}>
              <thead>
                <tr style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
                  <th className="text-muted fw-semibold py-3 px-4" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>USER PROFILE</th>
                  <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>EMAIL</th>
                  <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>ROLE</th>
                  <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>LAST LOGIN</th>
                  <th className="text-muted fw-semibold py-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>STATUS</th>
                  <th className="text-muted fw-semibold text-end py-3 px-4" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>AKSI</th> 
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id} data={item} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
                  ))
                ) : (
                    <tr>
                        <td colSpan={6} className="text-center p-5 text-muted">Tidak ada data ditemukan</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="card-footer bg-white d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 px-4 py-3 border-top">
            <p className="m-0 text-secondary" style={{ fontSize: "14px" }}>Menampilkan {filteredItems.length} dari 1,284 Pengguna</p>
            <div className="d-flex gap-1 align-items-center">
              <button className="btn btn-icon btn-sm btn-white border rounded-2 p-2"><IconChevronLeft size={16} className="text-secondary" /></button>
              <button className="btn btn-sm border-0 bg-primary text-white rounded-2 px-3 fw-bold">1</button>
              <button className="btn btn-sm btn-white border text-secondary rounded-2 px-3">2</button>
              <button className="btn btn-sm btn-white border text-secondary rounded-2 px-3">3</button>
              <button className="btn btn-icon btn-sm btn-white border rounded-2 p-2"><IconChevronRight size={16} className="text-secondary" /></button>
            </div>
          </div>
        </div>
      </div>
      
      <Toaster position="top-right" />
    </>
  );
}