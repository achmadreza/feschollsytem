"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { 
    IconMail, 
    IconPhone, 
    IconPlus,
    IconSearch,
    IconChevronLeft,
    IconChevronRight,
    IconPencil,
    IconTrash,
    IconEye,
    IconCheck,
    IconX
} from "@tabler/icons-react";
import { useTranslation } from "../../../components/i18n/LanguageProvider";
import { Toaster, toast } from 'react-hot-toast';
export interface AdminData {
  id: number;
  name: string;
  email: string;
  phoneNumber: string; 
  role: string;
  status: boolean;
}

function TableRow({ 
  data, 
  onEdit, 
  onView,
  onDelete 
}: { 
  data: AdminData; 
  onEdit: (item: AdminData) => void;
  onView: (item: AdminData) => void;
  onDelete: (item: AdminData) => void;
}) {
  const { t } = useTranslation();
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
    
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <div className="flex-fill">
             <div className="font-weight-medium" style={{ minWidth: '120px' }}>{data.name}</div>
          </div>
        </div>
      </td>
      <td className="text-muted">
        <div className="d-flex align-items-center text-nowrap">
          <IconPhone size={16} className="me-2 text-secondary" />
          {data.phoneNumber || "-"} 
        </div>
      </td>
      <td className="text-muted">
        <div className="d-flex align-items-center" style={{ wordBreak: 'break-all', minWidth: '150px' }}>
          <IconMail size={16} className="me-2 text-secondary flex-shrink-0" />
          {data.email}
        </div>
      </td>
      <td className="text-muted">
        <div className="fw-bold">{data.role || "-"}</div>
        <div className="d-block mt-1">
            {data.status === true ? (
              <span className="badge badge-outline text-success bg-success-lt border-0" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center' }}>
                  <IconCheck size={14} stroke={3} className="text-success me-1" /> Active
              </span>
            ) : (
              <span className="badge badge-outline text-danger bg-danger-lt border-0" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center' }}>
                  <IconX size={14} stroke={3} className="text-danger me-1" /> Inactive
              </span>
            )}
        </div>
      </td>
      
      <td className="text-end">
        <div className={`dropdown ${showDropdown ? 'show' : ''}`} ref={dropdownRef}>
          <button
            className="btn dropdown-toggle btn-primary btn-md align-text-top"
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {t("company.btn_actions") || "Actions"}
          </button>
          <div 
            className={`dropdown-menu dropdown-menu-end ${showDropdown ? 'show' : ''}`}
            style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: 1000,
                display: showDropdown ? 'block' : 'none',
                minWidth: '180px'
            }}
          >
            <button className="dropdown-item" onClick={() => { onView(data); setShowDropdown(false); }}>
              <IconEye size={16} className="me-2 text-muted"/> View Details
            </button>
            <button className="dropdown-item" onClick={() => { onEdit(data); setShowDropdown(false); }}>
              <IconPencil size={16} className="me-2 text-muted"/> Edit
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item text-danger" onClick={() => { onDelete(data); setShowDropdown(false); }}>
              <IconTrash size={16} className="me-2"/> Delete
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function UserTableList() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [items, setItems] = useState<AdminData[]>([
    { id: 1, name: "John Doe", email: "john@example.com", phoneNumber: "08123456789", role: "Super Admin", status: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phoneNumber: "08987654321", role: "Manager", status: false },
  ]);

  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 2 });
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleEdit = (item: AdminData) => toast.success(`Editing ${item.name}`);
  const handleView = (item: AdminData) => toast.success(`Viewing ${item.name}`);
  const handleDelete = (item: AdminData) => toast.error(`Deleting ${item.name}`);

  return (
    <>
      <div className="container-xl">
        <div className="page-header d-print-none mb-3">
          <div className="row align-items-center g-3">
            <div className="col-12 col-md-6">
              <div className="page-pretitle">OVERVIEW</div>
              <h2 className="page-title">Admin Dashboard Table</h2>
            </div>

            <div className="col-12 col-md-6 ms-auto d-print-none">
              <div className="btn-list justify-content-md-end flex-nowrap overflow-auto pb-1">
                <button className="btn btn-orange text-nowrap" onClick={() => toast.success("Add action triggered")}>
                  <IconPlus size={18} className="me-2" /> Add New Item
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex-wrap gap-3">
            <div className="d-flex gap-2">
                <select 
                    className="form-select w-auto" 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>
            <div className="ms-auto">
                <div className="input-icon">
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control" 
                        placeholder={t("company.search-input") || "Search..."}
                    />
                    <span className="input-icon-addon"><IconSearch size={16} /></span>
                </div>
            </div>
          </div>

          <div className="table-responsive" style={{ minHeight: '200px' }}>
            <table className="table card-table table-vcenter">
              <thead>
                <tr>
                  <th style={{ minWidth: '150px' }}>NAME</th>
                  <th>PHONE</th>
                  <th style={{ minWidth: '180px' }}>EMAIL</th>
                  <th style={{ minWidth: '200px' }}>ROLE & STATUS</th>
                  <th className="w-1 text-end">ACTIONS</th> 
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan={5} className="text-center py-4"><div className="spinner-border text-primary"></div></td></tr>
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <TableRow 
                        key={item.id} 
                        data={item} 
                        onEdit={handleEdit}
                        onView={handleView}
                        onDelete={handleDelete} 
                    />
                  ))
                ) : (
                    <tr>
                        <td colSpan={5} className="text-center p-4">No data found</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && pagination.total > 0 && (
            <div className="card-footer d-flex flex-column flex-md-row align-items-center gap-3">
              <p className="m-0 text-muted">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </p>
              <ul className="pagination m-0 ms-md-auto">
                <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)}>
                    <IconChevronLeft size={16} />
                  </button>
                </li>

                {(() => {
                  const pages = [];
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                      <li key={i} className={`page-item ${pagination.page === i ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(i)}>
                          {i}
                        </button>
                      </li>
                    );
                  }
                  return pages;
                })()}
                
                <li className={`page-item ${pagination.page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)}>
                    <IconChevronRight size={16} />
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <Toaster position="top-right" />
    </>
  );
}