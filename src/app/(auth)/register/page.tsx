"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "../../../../components/i18n/LanguageProvider";
import { 
    IconUsersGroup, 
    IconSchool, 
    IconEye, 
    IconEyeOff,
    IconUser, 
    IconMail, 
    IconPhone, 
    IconBell 
} from "@tabler/icons-react";
import { callApi } from "@/lib/api";
import { Label } from "../../../../components/ui/Label";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Form, FormField } from "../../../../components/ui/Form";
import Swal from 'sweetalert2';
import { toast, Toaster } from 'react-hot-toast';

export default function SignupPage() {
    const { t } = useTranslation();
    const [role, setRole] = useState("teacher");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, "");
        setPhone(numericValue);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            const msg = "Password dan Konfirmasi Password tidak cocok!";
            toast.error(msg);
            return;
        }

        const confirmResult = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Pastikan data yang Anda masukkan sudah benar.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: 'Ya, Kirim Data!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        try {
            setLoading(true);
            await callApi("auth/register", {
                method: "POST",
                body: {
                    fullName,
                    email,
                    password,
                    phone,
                    role,
                    confirmPassword,
                    googleOAuthID: "",
                },
            });

            toast.success('Pendaftaran berhasil! Silakan tunggu konfirmasi verifikasi.');

            setTimeout(() => {
                window.location.href = "/login";
            }, 3000);
            
        } catch (error: any) {
            console.error(error);
            const finalErrorMsg = error?.message || "Gagal menyambung ke server.";
            toast.error(finalErrorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "#ffffff", overflow: "hidden" }}>
            <div style={{ 
                width: "100%", 
                maxWidth: "550px", 
                display: "flex", 
                flexDirection: "column", 
                padding: "2.5rem 3rem",
                backgroundColor: "#ffffff",
                height: "100%",
                overflowY: "auto"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#032B88", fontWeight: "bold", fontSize: "1.25rem" }}>
                        <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                            <path d="M12 18.5l-7.42-4.05L3 15.5l9 5 9-5-1.58-1.05z" />
                        </svg>
                        <span>Lumina Learn</span>
                    </div>
                    <Link href="/login" style={{ color: "#4A5568", fontSize: "0.875rem", textDecoration: "none" }}>
                        ← Kembali ke Login
                    </Link>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1A202C", marginBottom: "0.5rem" }}>Buat Akun Portal</h1>
                    <p style={{ color: "#718096", fontSize: "0.875rem", margin: 0 }}>
                        Untuk guru dan orang tua siswa yang sudah terdaftar di Lumina Learn.
                    </p>
                </div>

                <Form onSubmit={handleSubmit}>
                    <FormField>
                        <Label>Saya adalah...</Label>
                        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                            <div 
                                onClick={() => setRole("teacher")}
                                style={{
                                    flex: 1,
                                    border: role === "teacher" ? "2px solid #032B88" : "1px solid #E2E8F0",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    position: "relative",
                                    backgroundColor: role === "teacher" ? "#F7FAFC" : "#ffffff",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <IconSchool size={32} color={role === "teacher" ? "#032B88" : "#A0AEC0"} style={{ marginBottom: "0.5rem" }} />
                                <div style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1A202C" }}>Guru</div>
                                {role === "teacher" && (
                                    <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#032B88", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</div>
                                )}
                            </div>

                            <div 
                                onClick={() => setRole("parent")}
                                style={{
                                    flex: 1,
                                    border: role === "parent" ? "2px solid #032B88" : "1px solid #E2E8F0",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    position: "relative",
                                    backgroundColor: role === "parent" ? "#F7FAFC" : "#ffffff",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <IconUsersGroup size={32} color={role === "parent" ? "#032B88" : "#A0AEC0"} style={{ marginBottom: "0.5rem" }} />
                                <div style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1A202C" }}>Orang Tua</div>
                                {role === "parent" && (
                                    <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#032B88", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</div>
                                )}
                            </div>
                        </div>
                    </FormField>

                    <div style={{ display: "flex", gap: "0.75rem", backgroundColor: "#EEF2F6", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
                        <div style={{ color: "#032B88", marginTop: "2px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                            </svg>
                        </div>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#4A5568", lineHeight: "1.4" }}>
                            Pembuatan akun memerlukan verifikasi dari admin sekolah. Anda akan menerima email konfirmasi dalam 1x24 jam.
                        </p>
                    </div>

                    <FormField>
                        <Label>Nama Lengkap</Label>
                        <Input 
                            type="text" 
                            placeholder="Sesuai data di sekolah" 
                            value={fullName}
                            onChange={(e: any) => setFullName(e.target.value)}
                            required 
                            icon={<IconUser size={18} stroke={2} style={{ color: "#A0AEC0" }} />}
                        />
                    </FormField>

                    <FormField>
                        <Label>Email</Label>
                        <Input 
                            type="email" 
                            placeholder="email@aktif.com" 
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                            required 
                            icon={<IconMail size={18} stroke={2} style={{ color: "#A0AEC0" }} />}
                        />
                        <div style={{ fontSize: "0.75rem", color: "#718096", marginTop: "0.25rem" }}>Gunakan email yang terdaftar di data sekolah</div>
                    </FormField>

                    <FormField>
                        <Label>Nomor HP / WhatsApp</Label>
                        <Input 
                            type="text" 
                            placeholder="08xxxxxxxxxx" 
                            value={phone}
                            onChange={handlePhoneChange}
                            required 
                            icon={<IconPhone size={18} stroke={2} style={{ color: "#A0AEC0" }} />}
                        />
                        <div style={{ fontSize: "0.75rem", color: "#718096", marginTop: "0.25rem" }}>Untuk verifikasi OTP</div>
                    </FormField>

                    <div className="row mb-3">
                        <div className="col-6">
                            <FormField>
                                <Label>Buat Password</Label>
                                <Input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                    required 
                                    iconAction={{
                                        icon: showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />,
                                        onClick: () => setShowPassword(!showPassword)
                                    }}
                                />
                                <div style={{ display: "flex", gap: "2px", marginTop: "0.25rem" }}>
                                    <span style={{ flex: 1, height: "4px", backgroundColor: password.length >= 8 ? "#48BB78" : "#E2E8F0", borderRadius: "2px" }} />
                                    <span style={{ flex: 1, height: "4px", backgroundColor: password.length >= 8 ? "#48BB78" : "#E2E8F0", borderRadius: "2px" }} />
                                    <span style={{ flex: 1, height: "4px", backgroundColor: password.length >= 8 ? "#48BB78" : "#E2E8F0", borderRadius: "2px" }} />
                                </div>
                                <div style={{ display: "flex", fontSize: "10px", color: "#718096", marginTop: "2px", justifyContent: "space-between" }}>
                                    <span style={{ color: password.length >= 8 ? "#48BB78" : "#718096" }}>
                                        {password.length >= 8 ? "Kekuatan: Kuat" : "Kekuatan: Kurang"}
                                    </span>
                                    <span>Min. 8 Karakter</span>
                                </div>
                            </FormField>
                        </div>

                        <div className="col-6">
                            <FormField>
                                <Label>Konfirmasi Password</Label>
                                <Input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={confirmPassword}
                                    onChange={(e: any) => setConfirmPassword(e.target.value)}
                                    required 
                                    iconAction={{
                                        icon: showConfirmPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />,
                                        onClick: () => setShowConfirmPassword(!showConfirmPassword)
                                    }}
                                />
                                {password && confirmPassword && (
                                    <div style={{ 
                                        fontSize: "10px", 
                                        color: password === confirmPassword ? "#48BB78" : "#E53E3E", 
                                        marginTop: "4px", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: "2px" 
                                    }}>
                                        {password === confirmPassword ? "✓ Password cocok" : "✗ Password tidak cocok"}
                                    </div>
                                )}
                            </FormField>
                        </div>
                    </div>

                    <div className="mb-4" style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <Input type="checkbox" id="terms" className="form-check-input" style={{ marginTop: "3px" }} required />
                        <Label htmlFor="terms" style={{ fontSize: "0.8125rem", color: "#4A5568", cursor: "pointer", lineHeight: "1.4" }}>
                            Saya menyetujui <Link href="/terms" style={{ color: "#032B88", textDecoration: "none" }}>Syarat & Ketentuan</Link> dan <Link href="/privacy" style={{ color: "#032B88", textDecoration: "none" }}>Kebijakan Privasi</Link> Lumina Learn.
                        </Label>
                    </div>

                    <div className="form-footer">
                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? "Memproses..." : "Daftar & Minta Verifikasi →"}
                        </Button>
                    </div>
                </Form>

                <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "1rem", fontSize: "0.875rem", color: "#4A5568" }}>
                    Sudah punya akun? <Link href="/login" style={{ color: "#032B88", fontWeight: "600", textDecoration: "none" }}>Masuk di sini</Link>
                </div>
            </div>

            <div className="d-none d-lg-flex" style={{ 
                flex: 1, 
                backgroundColor: "#111827", 
                color: "#ffffff", 
                flexDirection: "column", 
                justifyContent: "center", 
                padding: "4rem", 
                height: "100%",
                position: "relative"
            }}>
                <div style={{ 
                    position: "absolute", 
                    bottom: "-10%", 
                    right: "-10%", 
                    width: "500px", 
                    height: "500px", 
                    borderRadius: "50%", 
                    background: "radial-gradient(circle, rgba(107,70,193,0.35) 0%, rgba(0,0,0,0) 70%)", 
                    pointerEvents: "none" 
                }} />
                
                <div style={{ maxWidth: "550px", zIndex: 2, margin: "0 auto" }}>
                    <span style={{ 
                        display: "inline-block", 
                        padding: "0.25rem 0.75rem", 
                        backgroundColor: "rgba(255,255,255,0.08)", 
                        backdropFilter: "blur(4px)", 
                        fontSize: "0.75rem", 
                        fontWeight: "600", 
                        letterSpacing: "0.05em", 
                        borderRadius: "9999px", 
                        marginBottom: "1.5rem", 
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#CBD5E0"
                    }}>
                        • PORTAL TERPADU · LUMINA LEARN
                    </span>
                    
                    <h2 style={{ fontSize: "3rem", fontWeight: "700", lineHeight: "1.1", marginBottom: "1.5rem" }}>
                        Bergabung ke <br />
                        <span style={{ color: "#48BB78" }}>Komunitas Kami.</span>
                    </h2>
                
                    <p style={{ color: "#A0AEC0", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2.5rem" }}>
                        Guru dan orang tua siswa Lumina Learn dapat mengakses portal untuk memantau perkembangan, berkomunikasi, dan berkolaborasi dalam satu platform terpadu.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ backgroundColor: "rgba(72,187,120,0.2)", color: "#48BB78", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>✓</div>
                            <span style={{ color: "#E2E8F0", fontSize: "0.9rem" }}>Pantau kehadiran dan nilai real-time</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ backgroundColor: "rgba(72,187,120,0.2)", color: "#48BB78", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>✓</div>
                            <span style={{ color: "#E2E8F0", fontSize: "0.9rem" }}>Komunikasi langsung dengan guru</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ backgroundColor: "rgba(72,187,120,0.2)", color: "#48BB78", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>✓</div>
                            <span style={{ color: "#E2E8F0", fontSize: "0.9rem" }}>Akses laporan dan invoice kapan saja</span>
                        </div>
                    </div>
                </div>

                <div style={{ 
                    position: "absolute", 
                    bottom: "3rem", 
                    right: "3rem", 
                    backgroundColor: "rgba(45, 55, 72, 0.7)", 
                    backdropFilter: "blur(10px)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: "12px", 
                    padding: "0.75rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    zIndex: 3
                }}>
                    <div style={{ backgroundColor: "rgba(159,122,234,0.2)", color: "#B794F4", padding: "0.5rem", borderRadius: "8px" }}>
                       <IconBell size={18} />
                    </div>
                    <div>
                        <div style={{ fontSize: "0.8125rem", fontWeight: "600" }}>Pemberitahuan Baru</div>
                        <div style={{ fontSize: "0.6875rem", color: "#A0AEC0" }}>Laporan semester siap dilihat</div>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    );
}