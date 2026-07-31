"use client";

import { useState, useEffect, useRef } from "react";
import { 
    IconReceipt, 
    IconInfoCircle,
    IconFilePlus,
    IconLoader2,
    IconCheck,
    IconChevronDown
} from "@tabler/icons-react";
import { Modal } from "../../ui/Modal";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import { Form } from "../../ui/Form";
import { Button } from "../../ui/Button";
import { callApi } from "@/lib/api";

export interface Student {
    id: string | number;
    name: string;
    nisn?: string;
    class?: string;
}

export interface InvoiceFormData {
    studentId: string | number;
    studentName: string;
    paymentType: string;
    month: string;
    year: string;
    amount: string;
    dueDate: string;
    notes: string;
}

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: InvoiceFormData) => void;
}

export function CreateInvoiceModal({ isOpen, onClose, onSubmit }: CreateInvoiceModalProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

    const [formData, setFormData] = useState<InvoiceFormData>({
        studentId: "",
        studentName: "",
        paymentType: "",
        month: "",
        year: currentYear.toString(),
        amount: "",
        dueDate: `${currentYear}-10-05`,
        notes: ""
    });

    const [students, setStudents] = useState<Student[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
        } else {
            setSearchQuery("");
            setIsDropdownOpen(false);
            setFormData({
                studentId: "",
                studentName: "",
                paymentType: "",
                month: "",
                year: currentYear.toString(),
                amount: "",
                dueDate: `${currentYear}-10-05`,
                notes: ""
            });
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchStudents = async () => {
        try {
            setIsLoadingStudents(true);
            const res = await callApi("/students", { method: "GET" });
            const data = Array.isArray(res) ? res : res?.data || res?.students || [];
            setStudents(data);
        } catch (error) {
            console.error("Gagal mengambil data siswa:", error);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const filteredStudents = students.filter((s) => {
        const query = searchQuery.toLowerCase();
        const nameMatch = s.name?.toLowerCase().includes(query);
        const nisnMatch = s.nisn?.toString().toLowerCase().includes(query);
        const idMatch = s.id?.toString().toLowerCase().includes(query);
        return nameMatch || nisnMatch || idMatch;
    });

    const handleSelectStudent = (student: Student) => {
        setFormData((prev) => ({
            ...prev,
            studentId: student.id,
            studentName: student.name
        }));
        setSearchQuery(student.name);
        setIsDropdownOpen(false);
    };

    const formatNumber = (val: string) => {
        const rawValue = val.replace(/\D/g, "");
        if (!rawValue) return "";
        return new Intl.NumberFormat("id-ID").format(Number(rawValue));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value);
        setFormData({ ...formData, amount: formatted });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.studentId) {
            alert("Silakan pilih siswa terlebih dahulu");
            return;
        }

        const cleanAmount = formData.amount.replace(/\D/g, "");
        
        if (onSubmit) {
            onSubmit({
                ...formData,
                amount: cleanAmount
            });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-3 pb-0 d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <div 
                        className="d-flex align-items-center justify-content-center rounded-4 flex-shrink-0" 
                        style={{ width: "48px", height: "48px", backgroundColor: "#EEF2FF", color: "#3B82F6" }}
                    >
                        <IconReceipt size={26} />
                    </div>
                    <div>
                        <h5 className="fw-bold text-dark m-0" style={{ fontSize: "18px" }}>
                            Buat Tagihan Baru
                        </h5>
                        <p className="text-secondary m-0 mt-1" style={{ fontSize: "13px" }}>
                            Manage individual student billing entries
                        </p>
                    </div>
                </div>
            </div>

            <Form onSubmit={handleSubmit}>
                <div className="p-3 p-sm-4 d-flex flex-column gap-3">
                    <div className="position-relative" ref={dropdownRef}>
                        <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                            Pilih Siswa
                        </Label>
                        <div className="position-relative">
                            <Input 
                                type="text" 
                                className="form-control border-0 py-2.5" 
                                placeholder="Pilih Nama Siswa..."
                                value={searchQuery}
                                onFocus={() => setIsDropdownOpen(true)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(true);
                                    if (formData.studentId) {
                                        setFormData((prev) => ({ ...prev, studentId: "", studentName: "" }));
                                    }
                                }}
                                required
                            />
                            {isLoadingStudents ? (
                                <IconLoader2 
                                    size={18} 
                                    className="position-absolute top-50 translate-middle-y text-secondary animate-spin" 
                                    style={{ right: "14px" }} 
                                />
                            ) : (
                                <IconChevronDown 
                                    size={18} 
                                    className="position-absolute top-50 translate-middle-y text-secondary" 
                                    style={{ right: "14px", pointerEvents: "none" }} 
                                />
                            )}
                        </div>

                        {isDropdownOpen && (
                            <div 
                                className="position-absolute w-100 mt-1 bg-white border rounded-3 shadow-sm z-3 overflow-auto"
                                style={{ maxHeight: "200px" }}
                            >
                                {isLoadingStudents ? (
                                    <div className="p-3 text-center text-muted" style={{ fontSize: "13px" }}>
                                        Memuat data siswa...
                                    </div>
                                ) : filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => {
                                        const isSelected = formData.studentId === student.id;
                                        return (
                                            <div
                                                key={student.id}
                                                className={`p-2.5 px-3 d-flex align-items-center justify-content-between cursor-pointer border-bottom ${
                                                    isSelected ? "bg-light text-primary" : "text-dark hover-bg-light"
                                                }`}
                                                style={{ cursor: "pointer", fontSize: "13px" }}
                                                onClick={() => handleSelectStudent(student)}
                                            >
                                                <div>
                                                    <div className="fw-semibold">{student.name}</div>
                                                    <div className="text-muted" style={{ fontSize: "11px" }}>
                                                        {student.nisn ? `NISN: ${student.nisn}` : `ID: ${student.id}`} 
                                                        {student.class ? ` • Kelas: ${student.class}` : ""}
                                                    </div>
                                                </div>
                                                {isSelected && <IconCheck size={16} className="text-primary" />}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-3 text-center text-muted" style={{ fontSize: "13px" }}>
                                        Siswa tidak ditemukan
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                                Jenis Pembayaran
                            </Label>
                            <select 
                                className="form-select border-0 py-2.5 px-3"
                                value={formData.paymentType}
                                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                            >
                                <option value="" disabled>Pilih Jenis Pembayaran</option>
                                <option value="SPP Bulanan">SPP Bulanan</option>
                                <option value="Uang Gedung">Uang Gedung</option>
                                <option value="Ekskul">Ekskul</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                                Periode Tagihan
                            </Label>
                            <div className="d-flex gap-2">
                                <select 
                                    className="form-select border-0 py-2.5 px-2 px-sm-3 flex-grow-1"
                                    value={formData.month}
                                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                >
                                    <option value="" disabled>Pilih Bulan</option>
                                    <option value="Januari">Januari</option>
                                    <option value="Februari">Februari</option>
                                    <option value="Maret">Maret</option>
                                    <option value="April">April</option>
                                    <option value="Mei">Mei</option>
                                    <option value="Juni">Juni</option>
                                    <option value="Juli">Juli</option>
                                    <option value="Agustus">Agustus</option>
                                    <option value="September">September</option>
                                    <option value="Oktober">Oktober</option>
                                    <option value="November">November</option>
                                    <option value="Desember">Desember</option>
                                </select>
                                
                                <select 
                                    className="form-select border-0 py-2.5 px-2 px-sm-3"
                                    style={{ width: "100px" }}
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year.toString()}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                                Jumlah Tagihan (Amount)
                            </Label>
                            <div className="input-group">
                                <span 
                                    className="input-group-text border-0 fw-medium text-secondary px-3" 
                                    style={{ backgroundColor: "#F1F5F9", borderRadius: "12px 0 0 12px", fontSize: "14px" }}
                                >
                                    Rp
                                </span>
                                <Input 
                                    type="text" 
                                    className="form-control border-0 py-2.5 fw-bold text-dark"
                                    placeholder="0"
                                    value={formData.amount}
                                    onChange={handleAmountChange}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                                Tanggal Jatuh Tempo
                            </Label>
                            <div className="position-relative">
                                <input 
                                    type="date" 
                                    className="form-control border-0 py-2.5 px-3" 
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                            Catatan Tambahan (Opsional)
                        </Label>
                        <textarea 
                            className="form-control border-0 p-3" 
                            rows={3}
                            placeholder="Contoh: Termasuk biaya seragam olahraga tambahan..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div 
                        className="p-3 d-flex align-items-start gap-2.5" 
                        style={{ backgroundColor: "#EEF2FF", borderRadius: "12px" }}
                    >
                        <IconInfoCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <p className="m-0 text-secondary" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                            Tagihan ini akan otomatis dikirimkan sebagai notifikasi ke aplikasi orang tua setelah diterbitkan. <strong className="text-dark">Status: Menunggu Pembayaran.</strong>
                        </p>
                    </div>
                </div>

                <div 
                    className="p-3 p-sm-4 bg-light bg-opacity-50 d-flex align-items-center justify-content-end gap-3 border-top" 
                    style={{ borderColor: "#F1F5F9" }}
                >
                    <Button 
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        size="lg"
                    >
                        Batal
                    </Button>
                    <Button 
                        type="submit" 
                        className="btn fw-semibold text-white px-4 py-2 d-flex align-items-center gap-2" 
                        variant="default"
                        size="lg"
                    >
                        <IconFilePlus size={18} />
                        <span>Buat Tagihan</span>
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}