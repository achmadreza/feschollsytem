"use client";

import { useState, useEffect } from "react";
import { IconUsers, IconCalendar, IconLoader2 } from "@tabler/icons-react";
import { callApi } from "@/lib/api";
import { Toaster, toast } from "react-hot-toast";
import { Label } from "../../ui/Label";
import { Input } from "../../ui/Input";
import { Form } from "../../ui/Form";

export interface Student {
  _id: string;
  id: string;
  name: string;
  parentId?: string;
  parentName: string;
  parentEmail?: string;
  phoneNumber?: string;
  class?: string;
  schoolCode?: string;
  [key: string]: any;
}

export interface Teacher {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  schoolCode?: string;
  role: string;
}

interface AddTrialScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddTrialScheduleModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTrialScheduleModalProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState<boolean>(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

    const [selectedParentId, setSelectedParentId] = useState<string>("");
    const [parentName, setParentName] = useState<string>("");
    const [registrationDate, setRegistrationDate] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const fetchStudents = async () => {
        try {
            setIsLoadingStudents(true);
            const res = await callApi("students", { method: "GET" });
            const data = Array.isArray(res) ? res : res?.data || res?.students || [];
            setStudents(data);
        } catch (error) {
            console.error("Gagal mengambil data siswa:", error);
            toast.error("Gagal memuat data siswa");
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            setIsLoadingTeachers(true);
            const res = await callApi("users?role=teacher", { method: "GET" });
            const data = Array.isArray(res) ? res : res?.data || res?.users || [];
            setTeachers(data);
        } catch (error) {
            console.error("Gagal mengambil data guru:", error);
            toast.error("Gagal memuat data guru");
        } finally {
            setIsLoadingTeachers(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
            fetchTeachers();
            setSelectedStudentId("");
            setSelectedTeacherId("");
            setSelectedParentId("");
            setParentName("");
            
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            
            const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
            setRegistrationDate(currentDateTime);
        }
    }, [isOpen]);

    const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const studentId = e.target.value;
        setSelectedStudentId(studentId);

        const foundStudent = students.find(
            (s) => s.id === studentId || s._id === studentId
        );

        if (foundStudent) {
            setSelectedParentId(foundStudent.parentId || "");
            setParentName(foundStudent.parentName || "-");
        } else {
            setSelectedParentId("");
            setParentName("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedStudentId) {
            toast.error("Silakan pilih Student terlebih dahulu.");
            return;
        }

        if (!registrationDate) {
            toast.error("Silakan pilih Tanggal Registered.");
            return;
        }

        setIsSubmitting(true);

        try {
            const dateObj = new Date(registrationDate);
            const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
            const registeredAtIso = new Date(dateObj.getTime() - timezoneOffset).toISOString();

            const payload = {
                parentId: selectedParentId,
                studentId: selectedStudentId,
                teacherId: selectedTeacherId,
                registeredAt: registeredAtIso,
                status: "WAITING_SCHEDULE",
            };

            await callApi("trial-classes", {
                method: "POST",
                body: payload,
            });

            toast.success("Jadwal trial class berhasil disimpan!", {
                duration: 1500,
            });
            
            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error: any) {
            const apiErrors = error?.response?.data?.message || error?.message;
            if (Array.isArray(apiErrors)) {
                apiErrors.forEach((msg: string) => {
                    toast.error(msg);
                });
            } 
            else if (typeof apiErrors === "string") {
                toast.error(apiErrors);
            }
            else {
                toast.error("Gagal menyimpan jadwal trial.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{
                duration: 2000,
            }} />
            <div
                className="modal fade show d-block"
                tabIndex={-1}
                style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px" }}>
                            <div className="modal-header border-bottom p-4">
                                <h5 className="modal-title fw-bold text-dark m-0" style={{ fontSize: "18px" }}>
                                    Tambah Jadwal Trial Class
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close shadow-none"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <Label className="form-label fw-semibold text-dark small mb-1">
                                        Nama Siswa <span className="text-danger">*</span>
                                        </Label>
                                        <select
                                            className="form-select border-light-subtle py-2 px-3 text-dark"
                                            value={selectedStudentId}
                                            onChange={handleStudentChange}
                                            disabled={isLoadingStudents || isSubmitting}
                                            style={{ borderRadius: "10px", fontSize: "14px" }}
                                            required
                                            >
                                            <option value="" disabled>
                                                {isLoadingStudents ? "Memuat data siswa..." : "-- Pilih Student --"}
                                            </option>
                                            {students.map((student) => (
                                                <option key={student.id || student._id} value={student.id || student._id}>
                                                {student.name} {student.class ? `(${student.class})` : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <Label className="form-label fw-semibold text-dark small mb-1">
                                            Pilih Guru
                                        </Label>
                                        <select
                                            className="form-select border-light-subtle py-2 px-3 text-dark"
                                            value={selectedTeacherId}
                                            onChange={(e) => setSelectedTeacherId(e.target.value)}
                                            disabled={isLoadingTeachers || isSubmitting}
                                            style={{ borderRadius: "10px", fontSize: "14px" }}
                                            >
                                            <option value="" disabled>
                                                {isLoadingTeachers ? "Memuat data guru..." : "-- Pilih Guru --"}
                                            </option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher.id || teacher._id} value={teacher.id || teacher._id}>
                                                {teacher.fullName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <Label className="form-label fw-semibold text-dark small mb-1">
                                        Nama Orangtua
                                        </Label>
                                        <div className="input-group">
                                        <span className="input-group-text bg-light border-light-subtle text-muted">
                                            <IconUsers size={18} />
                                        </span>
                                        <Input
                                            type="text"
                                            className="form-control py-2 text-dark fw-medium"
                                            value={parentName}
                                            readOnly
                                            placeholder="Nama orang tua akan otomatis terisi"
                                            style={{ borderRadius: "0 10px 10px 0", fontSize: "14px" }}
                                        />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <Label className="form-label fw-semibold text-dark small mb-1">
                                        Tanggal Registered <span className="text-danger">*</span>
                                        </Label>
                                        <div className="input-group">
                                        <span className="input-group-text bg-light-subtle border-light-subtle text-muted">
                                            <IconCalendar size={18} />
                                        </span>
                                        <Input
                                            type="datetime-local"
                                            className="form-control py-2 text-dark"
                                            value={registrationDate}
                                            onChange={(e) => setRegistrationDate(e.target.value)}
                                            disabled={isSubmitting}
                                            style={{ borderRadius: "0 10px 10px 0", fontSize: "14px" }}
                                            required
                                        />
                                        </div>
                                    </div>

                                </div>

                                <div className="modal-footer border-top p-3 px-4 d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-light fw-medium border px-4 py-2"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        style={{ borderRadius: "10px", fontSize: "14px" }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn fw-bold text-white px-4 py-2 d-flex align-items-center gap-2"
                                        disabled={isSubmitting}
                                        style={{ backgroundColor: "#0F2C59", borderRadius: "10px", fontSize: "14px" }}
                                    >
                                        {isSubmitting && <IconLoader2 size={16} className="animate-spin" />}
                                        Simpan Jadwal
                                    </button>
                                </div>
                            </Form>

                        </div>
                    </div>
                </div>
        </>
    );
}