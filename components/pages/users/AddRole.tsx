"use client";

import { useState } from "react";
import { IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import { toast } from 'react-hot-toast';
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Form, FormField } from "../../../components/ui/Form"; 

interface AddRoleProps {
  onBack: () => void;
}

export function AddRole({ onBack }: AddRoleProps) {
  const [userType, setUserType] = useState<"Guru" | "Wali Murid" | "Admin">("Guru");
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const pages = ["Dashboard", "Absensi", "Catatan Harian", "Kegiatan & Foto", "Pengumumaman", "Nilai", "Portfolio TK"];
  const actions = ["Read", "Create", "Update", "Delete"] as const;
  
  const [permissions, setPermissions] = useState<Record<string, Record<typeof actions[number], boolean>>>(
    pages.reduce((acc, page) => {
      acc[page] = { Read: page === "Dashboard", Create: false, Update: false, Delete: false };
      return acc;
    }, {} as any)
  );

  const togglePermission = (page: string, action: typeof actions[number]) => {
    setPermissions(prev => ({
      ...prev,
      [page]: { ...prev[page], [action]: !prev[page][action] }
    }));
  };

  const toggleColumn = (action: typeof actions[number]) => {
    const allChecked = pages.every(page => permissions[page][action]);
    setPermissions(prev => {
      const updated = { ...prev };
      pages.forEach(page => {
        updated[page] = { ...updated[page], [action]: !allChecked };
      });
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Role "${roleName || 'Baru'}" berhasil dikonfigurasi!`);
    onBack();
  };

  return (
    <div className="container-xl py-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Button 
        variant="link"
        className="text-secondary mb-4 d-flex align-items-center gap-2 text-decoration-none fw-medium" 
        onClick={onBack}
        style={{ fontSize: "14px" }}
      >
        <IconArrowLeft size={18} /> Kembali ke Daftar Pengguna
      </Button>

      <Form onSubmit={handleSubmit}>
        <div className="card shadow-sm border mb-4 p-4 bg-white" style={{ borderRadius: "16px", borderColor: "#E2E8F0" }}>
          <h5 className="fw-bold mb-4" style={{ color: "#0A192F", fontSize: "18px" }}>Role Creation Form</h5>
          <div className="mb-4">
            <Label className="text-muted small fw-bold text-uppercase mb-3 d-block" style={{ letterSpacing: "0.5px" }}>
              USER TYPE
            </Label>
            <div className="row g-3">
              {[
                { id: "Guru", label: "Guru", desc: "Teaching faculty access" },
                { id: "Wali Murid", label: "Wali Murid", desc: "Parental monitoring access" },
                { id: "Admin", label: "Admin", desc: "System management access" }
              ].map((item) => (
                <div className="col-md-4" key={item.id}>
                  <div 
                    className={`card p-3 border-2 transition-all`}
                    style={{ 
                      cursor: 'pointer', 
                      borderRadius: '12px',
                      borderStyle: 'solid',
                      borderColor: userType === item.id ? '#002B7F' : '#E2E8F0',
                      backgroundColor: userType === item.id ? '#F0F4FF' : '#FFFFFF' 
                    }}
                    onClick={() => setUserType(item.id as any)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Input 
                        type="radio" 
                        className="form-check-input m-0" 
                        checked={userType === item.id} 
                        onChange={() => setUserType(item.id as any)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>{item.label}</div>
                        <div className="text-muted small" style={{ fontSize: "12px" }}>{item.desc}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row g-3 mb-3">
            <FormField className="col-md-6 mb-3">
              <Label className="text-muted small fw-bold text-uppercase mb-2 d-block" style={{ letterSpacing: "0.5px" }}>NAME</Label>
              <Input 
                type="text" 
                className="form-control rounded-3 p-2.5" 
                placeholder="Type Name Role" 
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
                required
              />
            </FormField>
            
            <FormField className="col-md-6 mb-3">
              <Label className="text-muted small fw-bold text-uppercase mb-2 d-block" style={{ letterSpacing: "0.5px" }}>DESCRIPTION</Label>
              <Input 
                type="text" 
                className="form-control rounded-3 p-2.5" 
                placeholder="Type Description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
              />
            </FormField>
          </div>

          {(userType === "Wali Murid" || userType === "Admin") && (
            <div className="row g-3 mt-1">
              <FormField className="col-12 mb-3">
                <Label className="text-muted small fw-bold text-uppercase mb-2 d-block" style={{ letterSpacing: "0.5px" }}>EMAIL ADDRESS</Label>
                <Input 
                  type="email" 
                  className="form-control rounded-3 p-2.5" 
                  placeholder="Type Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
                  required
                />
              </FormField>
            </div>
          )}
        </div>

        {userType === "Guru" && (
          <div className="card shadow-sm border mb-4 bg-white" style={{ borderRadius: "16px", overflow: "hidden", borderColor: "#E2E8F0" }}>
            <div className="p-4 border-bottom-0">
              <h5 className="fw-bold m-0" style={{ color: "#0A192F", fontSize: "18px" }}>Permission Matrix</h5>
            </div>
            
            <div className="table-responsive">
              <table className="table table-vcenter table-hover m-0">
                <thead>
                  <tr className="text-center" style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
                    <th className="text-start text-muted fw-semibold py-3 px-4" style={{ fontSize: "13px", width: "40%" }}>Page</th>
                    {actions.map(action => (
                      <th key={action} className="text-muted fw-semibold py-3" style={{ fontSize: "13px" }}>
                        <div className="mb-2">{action}</div>
                        <input 
                          type="checkbox" 
                          className="form-check-input"
                          checked={pages.every(page => permissions[page][action])}
                          onChange={() => toggleColumn(action)}
                          style={{ width: "16px", height: "16px" }}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page} style={{ verticalAlign: "middle" }} className="text-center">
                      <td className="text-start fw-medium text-dark py-3 px-4" style={{ fontSize: "14px" }}>{page}</td>
                      {actions.map(action => (
                        <td key={action} className="py-3">
                          <input 
                            type="checkbox" 
                            className="form-check-input" 
                            checked={permissions[page][action]}
                            onChange={() => togglePermission(page, action)}
                            style={{ width: "16px", height: "16px" }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end gap-3 mb-5">
          <Button 
            type="button" 
            className="btn-outline-secondary px-4 py-2 fw-medium" 
            onClick={onBack}
            style={{ borderRadius: "8px", backgroundColor: "transparent", color: "#0d0d0d" }}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            className="px-4 py-2 rounded-3 fw-medium d-flex align-items-center gap-2" 
            style={{ borderRadius: "8px" }}
          >
            <IconCircleCheck size={18} /> Create Role
          </Button>
        </div>
      </Form>
    </div>
  );
}