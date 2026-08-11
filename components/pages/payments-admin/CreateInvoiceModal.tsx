"use client";

import { useState, useEffect, useRef } from "react";
import { 
    IconReceipt, 
    IconInfoCircle,
    IconFilePlus,
    IconLoader2,
    IconCheck,
    IconChevronDown,
    IconX,
    IconPlus
} from "@tabler/icons-react";
import { Modal } from "../../ui/Modal";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import { Form } from "../../ui/Form";
import { Button } from "../../ui/Button";
import { callApi } from "@/lib/api";
import Swal from "sweetalert2";

export interface Student {
    id: string | number;
    name: string;
    nisn?: string;
    class?: string;
}

export interface PaymentItem {
    type: string;
    amount: string;
}

export interface InvoiceFormData {
    studentId: string | number;
    studentName: string;
    paymentTypes: string[];
    items: PaymentItem[];
    totalAmount: number;
    month: string;
    year: string;
    dueDate: string;
    notes: string;
}

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess?: () => void;
}

const PAYMENT_OPTIONS = [
    "SPP BULANAN",
    "UANG BUKU / LKS",
    "UANG GEDUNG",
    "EKSKUL",
    "SERAGAM",
    "LAINNYA"
];

export function CreateInvoiceModal({ isOpen, onClose, onSubmitSuccess }: CreateInvoiceModalProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

    const [formData, setFormData] = useState<InvoiceFormData>({
        studentId: "",
        studentName: "",
        paymentTypes: [],
        items: [],
        totalAmount: 0,
        month: "Januari",
        year: currentYear.toString(),
        dueDate: "",
        notes: ""
    });

    const [students, setStudents] = useState<Student[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState<boolean>(false);
    const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
    const [customPaymentInput, setCustomPaymentInput] = useState<string>("");

    const dropdownRef = useRef<HTMLDivElement>(null);
    const paymentDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
        } else {
            setSearchQuery("");
            setIsDropdownOpen(false);
            setIsPaymentDropdownOpen(false);
            setShowCustomInput(false);
            setCustomPaymentInput("");
            setFormData({
                studentId: "",
                studentName: "",
                paymentTypes: [],
                items: [],
                totalAmount: 0,
                month: "Januari",
                year: currentYear.toString(),
                dueDate: "",
                notes: ""
            });
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
                setIsPaymentDropdownOpen(false);
                setShowCustomInput(false);
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

    const togglePaymentType = (type: string, closeDropdown: boolean = false) => {
        if (type === "LAINNYA") {
            setShowCustomInput(true);
            return;
        }

        let updatedTypes: string[];
        let updatedItems: PaymentItem[];

        if (formData.paymentTypes.includes(type)) {
            updatedTypes = formData.paymentTypes.filter((t) => t !== type);
            updatedItems = formData.items.filter((item) => item.type !== type);
        } else {
            updatedTypes = [...formData.paymentTypes, type];
            updatedItems = [...formData.items, { type, amount: "0" }];
        }

        const total = calculateTotal(updatedItems);
        setFormData({
            ...formData,
            paymentTypes: updatedTypes,
            items: updatedItems,
            totalAmount: total
        });

        if (closeDropdown) {
            setIsPaymentDropdownOpen(false);
        }
    };

    const handleAddCustomPayment = () => {
        const trimmedValue = customPaymentInput.trim().toUpperCase();
        if (!trimmedValue) return;
        if (formData.paymentTypes.includes(trimmedValue)) {
            Swal.fire({
                icon: 'warning',
                title: 'Item Sudah Ada',
                text: 'Jenis pembayaran ini sudah ditambahkan.',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        const updatedTypes = [...formData.paymentTypes, trimmedValue];
        const updatedItems = [...formData.items, { type: trimmedValue, amount: "0" }];
        const total = calculateTotal(updatedItems);

        setFormData({
            ...formData,
            paymentTypes: updatedTypes,
            items: updatedItems,
            totalAmount: total
        });

        setCustomPaymentInput("");
        setShowCustomInput(false);
        setIsPaymentDropdownOpen(false);
    };

    const handleItemAmountChange = (type: string, value: string) => {
        const rawValue = value.replace(/\D/g, "");
        const updatedItems = formData.items.map((item) =>
            item.type === type ? { ...item, amount: rawValue } : item
        );
        const total = calculateTotal(updatedItems);

        setFormData({
            ...formData,
            items: updatedItems,
            totalAmount: total
        });
    };

    const calculateTotal = (items: PaymentItem[]) => {
        return items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    };

    const formatNumber = (val: string | number) => {
        if (!val && val !== 0) return "0";
        const rawValue = val.toString().replace(/\D/g, "");
        if (!rawValue) return "0";
        return new Intl.NumberFormat("id-ID").format(Number(rawValue));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.studentId) {
            Swal.fire({
                icon: 'error',
                title: 'Data Belum Lengkap',
                text: 'Silakan pilih siswa terlebih dahulu',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        if (formData.items.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Data Belum Lengkap',
                text: 'Silakan pilih minimal satu jenis pembayaran',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        if (!formData.dueDate) {
            Swal.fire({
                icon: 'error',
                title: 'Data Belum Lengkap',
                text: 'Silakan tentukan tanggal jatuh tempo',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: 'Konfirmasi Tagihan',
            text: `Apakah Anda yakin ingin membuat tagihan untuk ${formData.studentName} sebesar Rp ${formatNumber(formData.totalAmount)}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, Buat Tagihan',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (!confirmResult.isConfirmed) return;

        try {
            setIsSubmitting(true);

            const finalDescription = formData.notes.trim() || `Tagihan Periode ${formData.month} ${formData.year}`;
            const formattedDueDate = new Date(`${formData.dueDate}T10:00:00.000Z`).toISOString();

            const paymentListPayload = formData.items.map((item) => ({
                paymentType: item.type,
                amount: Number(item.amount) || 0
            }));

            const payload = {
                studentId: formData.studentId.toString(),
                description: finalDescription,
                paymentList: paymentListPayload,
                dueDate: formattedDueDate,
                status: "WAITING"
            };

            await callApi("/billings", {
                method: "POST",
                body: payload
            });

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Tagihan sukses dibuat!',
                confirmButtonColor: '#3B82F6'
            });
            
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
            onClose();
        } catch (error) {
            console.error("Gagal membuat tagihan:", error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan saat memproses tagihan. Silakan coba lagi.',
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-3 pb-0 d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <div 
                        className="d-flex align-items-center justify-content-center rounded-4 flex-shrink-0" 
                        style={{ width: "48px", height: "48px", color: "#3B82F6" }}
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
                            Pilih Siswa <span className="text-danger">*</span>
                        </Label>
                        <div className="position-relative">
                            <Input 
                                type="text" 
                                className="form-control border-0 py-2.5 ps-5"
                                placeholder="Cari Nama Siswa atau ID (e.g. 2024001)"
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
                                disabled={isSubmitting}
                            />
                            {isLoadingStudents && (
                                <IconLoader2 
                                    size={18} 
                                    className="position-absolute top-50 translate-middle-y text-secondary animate-spin" 
                                    style={{ right: "14px" }} 
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

                    <div className="position-relative" ref={paymentDropdownRef}>
                        <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                            Jenis Pembayaran (Multi-select) <span className="text-danger">*</span>
                        </Label>
                        <div 
                            className="form-control border-0 py-2 px-3 d-flex align-items-center flex-wrap gap-2 cursor-pointer"
                            style={{ minHeight: "44px" }}
                            onClick={() => !isSubmitting && setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                        >
                            {formData.paymentTypes.map((type) => (
                                <span 
                                    key={type} 
                                    className="badge d-inline-flex align-items-center gap-1.5 py-1.5 px-2.5 rounded-pill text-white"
                                    style={{ backgroundColor: "#818CF8", fontWeight: 500, fontSize: "12px" }}
                                >
                                    {type}
                                    <IconX 
                                        size={14} 
                                        className="cursor-pointer" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isSubmitting) togglePaymentType(type, false);
                                        }} 
                                    />
                                </span>
                            ))}
                            <span className="text-secondary flex-grow-1" style={{ fontSize: "13px" }}>
                                {formData.paymentTypes.length === 0 ? "Pilih jenis pembayaran..." : ""}
                            </span>
                            <IconChevronDown size={18} className="text-secondary ms-auto" />
                        </div>

                        {isPaymentDropdownOpen && (
                            <div className="position-absolute w-100 mt-1 bg-white border rounded-3 shadow-sm z-3 py-1">
                                {showCustomInput ? (
                                    <div className="p-2 d-flex gap-2 align-items-center">
                                        <Input
                                            type="text"
                                            className="form-control form-control-sm text-uppercase"
                                            placeholder="KETIK JENIS PEMBAYARAN BARU..."
                                            value={customPaymentInput}
                                            autoFocus
                                            onChange={(e) => setCustomPaymentInput(e.target.value.toUpperCase())}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddCustomPayment();
                                                }
                                            }}
                                        />
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            className="p-1.5 px-2.5 text-white"
                                            style={{ backgroundColor: "#3B82F6" }}
                                            onClick={handleAddCustomPayment}
                                        >
                                            <IconPlus size={16} />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            className="p-1.5"
                                            onClick={() => {
                                                setShowCustomInput(false);
                                                setCustomPaymentInput("");
                                            }}
                                        >
                                            <IconX size={16} />
                                        </Button>
                                    </div>
                                ) : (
                                    PAYMENT_OPTIONS.map((option) => {
                                        const isChecked = formData.paymentTypes.includes(option);
                                        return (
                                            <div 
                                                key={option}
                                                className="d-flex align-items-center justify-content-between px-3 py-2 cursor-pointer hover-bg-light"
                                                style={{ fontSize: "13px", cursor: "pointer" }}
                                                onClick={() => togglePaymentType(option, option !== "LAINNYA")}
                                            >
                                                <span className={option === "LAINNYA" ? "fw-medium text-primary" : ""}>
                                                    {option === "LAINNYA" ? "+ Tulis Lainnya..." : option}
                                                </span>
                                                {isChecked && <IconCheck size={16} className="text-primary" />}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    {formData.items.length > 0 && (
                        <div className="d-flex flex-column gap-2 mt-1">
                            <span className="fw-bold text-uppercase text-secondary" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                                RINCIAN ITEM
                            </span>
                            {formData.items.map((item) => (
                                <div 
                                    key={item.type} 
                                    className="p-3 d-flex align-items-center justify-content-between rounded-3 bg-light bg-opacity-25 border"
                                >
                                    <span className="fw-semibold text-dark text-truncate pe-2 text-uppercase" style={{ fontSize: "13px", maxWidth: "60%" }}>
                                        {item.type}
                                    </span>
                                    <div className="d-flex align-items-center bg-white rounded-2 px-3 py-1.5 border" style={{ width: "160px" }}>
                                        <span className="text-secondary fw-medium me-2" style={{ fontSize: "12px" }}>Rp</span>
                                        <input 
                                            type="text" 
                                            className="border-0 p-0 text-end fw-bold w-100 text-dark"
                                            style={{ outline: "none", fontSize: "13px" }}
                                            value={formatNumber(item.amount)}
                                            onChange={(e) => handleItemAmountChange(item.type, e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div 
                        className="p-3 px-4 d-flex align-items-center bg-white justify-content-between rounded-3 border mt-1"
                    >
                        <span className="fw-bold text-dark" style={{ fontSize: "15px", color: "#1E1B4B" }}>
                            Total Pembayaran
                        </span>
                        <span className="fw-bold" style={{ fontSize: "22px", color: "#1E1B4B" }}>
                            Rp {formatNumber(formData.totalAmount)}
                        </span>
                    </div>

                    <div className="row g-3">
                        <div className="col-12 col-md-8">
                            <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                                Periode Tagihan
                            </Label>
                            <select 
                                className="form-select border-0 py-2.5 px-3"
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                disabled={isSubmitting}
                            >
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
                        </div>
                        <div className="col-12 col-md-4 d-flex align-items-end">
                            <select 
                                className="form-select border-0 py-2.5 px-3"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                disabled={isSubmitting}
                            >
                                {years.map((y) => (
                                    <option key={y} value={y.toString()}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                            Tanggal Jatuh Tempo <span className="text-danger">*</span>
                        </Label>
                        <div className="position-relative">
                            <input 
                                type="date" 
                                className="form-control border-0 py-2.5 px-3"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="form-label fw-medium text-dark mb-2" style={{ fontSize: "13px" }}>
                            Catatan Tambahan / Deskripsi (Opsional)
                        </Label>
                        <textarea 
                            className="form-control border-0 p-3"
                            rows={3}
                            placeholder="Contoh: Registrasi semester baru..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div 
                        className="p-3 d-flex align-items-start gap-2.5" 
                        style={{ borderRadius: "12px" }}
                    >
                        <IconInfoCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <p className="m-0 text-secondary" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                            Tagihan ini akan otomatis dikirimkan sebagai notifikasi ke aplikasi orang tua setelah diterbitkan. <strong className="text-dark">Status: Menunggu Pembayaran.</strong>
                        </p>
                    </div>
                </div>

                <div 
                    className="p-3 p-sm-4 bg-light bg-opacity-50 d-flex align-items-center justify-content-end gap-3 border-top" 
                >
                    <Button 
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button 
                        type="submit" 
                        className="btn fw-semibold text-white px-4 py-2 d-flex align-items-center gap-2" 
                        variant="default"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <IconLoader2 size={18} className="animate-spin" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <IconFilePlus size={18} />
                                <span>Buat Tagihan</span>
                            </>
                        )}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}