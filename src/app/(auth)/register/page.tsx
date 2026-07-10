"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "../../../../components/i18n/LanguageProvider";
import { IconUsersGroup, IconSchool, IconEye, IconAlertTriangle, IconUser, IconMail, IconPhone, IconKey, IconBell } from "@tabler/icons-react";

export default function SignupPage() {
  const { t } = useTranslation();
  const [role, setRole] = useState("orang_tua");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                <Link href="/login" style={{ color: "#4A5568", fontSize: "0.875rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    ← Kembali ke Login
                </Link>
            </div>
            <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1A202C", marginBottom: "0.5rem" }}>Buat Akun Portal</h1>
                <p style={{ color: "#718096", fontSize: "0.875rem", margin: 0 }}>
                    Untuk guru dan orang tua siswa yang sudah terdaftar di Lumina Learn.
                </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                    <label className="form-label" style={{ fontWeight: "500", color: "#4A5568", fontSize: "0.875rem" }}>Saya adalah...</label>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                        <div 
                            onClick={() => setRole("guru")}
                            style={{
                            flex: 1,
                            border: role === "guru" ? "2px solid #032B88" : "1px solid #E2E8F0",
                            borderRadius: "8px",
                            padding: "1rem",
                            textAlign: "center",
                            cursor: "pointer",
                            position: "relative",
                            backgroundColor: role === "guru" ? "#F7FAFC" : "#ffffff",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                            }}
                        >
                            <IconSchool size={32} color={role === "guru" ? "#032B88" : "#A0AEC0"} style={{ marginBottom: "0.5rem" }} />
                            <div style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1A202C" }}>Guru</div>
                                {role === "guru" && (
                            <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#032B88", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</div>
                        )}
                    </div>
                    <div 
                        onClick={() => setRole("orang_tua")}
                        style={{
                        flex: 1,
                        border: role === "orang_tua" ? "2px solid #032B88" : "1px solid #E2E8F0",
                        borderRadius: "8px",
                        padding: "1rem",
                        textAlign: "center",
                        cursor: "pointer",
                        position: "relative",
                        backgroundColor: role === "orang_tua" ? "#F7FAFC" : "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                        }}
                    >
                            <IconUsersGroup size={32} color={role === "orang_tua" ? "#032B88" : "#A0AEC0"} style={{ marginBottom: "0.5rem" }} />
                            <div style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1A202C" }}>Orang Tua</div>
                                {role === "orang_tua" && (
                            <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#032B88", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</div>
                        )}
                    </div>

                    </div>
                </div>
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
                <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: "500", color: "#4A5568", fontSize: "0.875rem" }}>Nama Lengkap</label>
                    <div className="input-icon">
                        <span className="input-icon-addon">
                            <IconUser size={18} stroke={2} style={{ color: "#A0AEC0" }} />
                        </span>
                        <input type="text" className="form-control" placeholder="Sesuai data di sekolah" required />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: "500", color: "#4A5568", fontSize: "0.875rem" }}>Email</label>
                    <div className="input-icon">
                        <span className="input-icon-addon">
                            <IconMail size={18} stroke={2} style={{ color: "#A0AEC0" }} />
                        </span>
                        <input type="email" className="form-control" placeholder="email@aktif.com" required />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#718096", marginTop: "0.25rem" }}>Gunakan email yang terdaftar di data sekolah</div>
                </div>
                <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: "500", color: "#4A5568", fontSize: "0.875rem" }}>Nomor HP / WhatsApp</label>
                    <div className="input-icon">
                        <span className="input-icon-addon">
                            <IconPhone size={18} stroke={2} style={{ color: "#A0AEC0" }} />
                        </span>
                        <input type="text" className="form-control" placeholder="08xxxxxxxxxx" required />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#718096", marginTop: "0.25rem" }}>Untuk verifikasi OTP</div>
                </div>

                <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: "500", color: "#4A5568", fontSize: "0.875rem" }}>Kode Registrasi Sekolah</label>
                    <div className="input-icon">
                        <span className="input-icon-addon">
                            <IconKey size={18} stroke={2} style={{ color: "#A0AEC0" }} />
                        </span>
                        <input type="text" className="form-control" placeholder="Masukkan kode dari admin sekolah" required />
                    </div>
                    <div style={{ backgroundColor: "#FFF5F5", color: "#C53030", padding: "0.5rem 0.75rem", borderRadius: "6px", fontSize: "0.75rem", marginTop: "0.5rem", border: "1px solid #FEB2B2" }}>
                        <IconAlertTriangle size={16} /> Hubungi TU sekolah jika belum memiliki kode
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-6">
                        <label className="form-label" style={{ fontWeight: "500", color: "#4A5568", fontSize: "0.875rem" }}>Buat Password</label>
                        <div className="input-group input-group-flat">
                            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="••••••••" required />
                            <span className="input-group-text">
                                <button type="button" className="link-secondary" style={{ background: 'none', border: 'none', padding: 0 }} onClick={() => setShowPassword(!showPassword)}>
                                    <IconEye size={16} />
                                </button>
                            </span>
                        </div>
                        <div style={{ display: "flex", gap: "2px", marginTop: "0.25rem" }}>
                            <span style={{ flex: 1, height: "4px", backgroundColor: "#48BB78", borderRadius: "2px" }} />
                            <span style={{ flex: 1, height: "4px", backgroundColor: "#48BB78", borderRadius: "2px" }} />
                            <span style={{ flex: 1, height: "4px", backgroundColor: "#48BB78", borderRadius: "2px" }} />
                            <span style={{ flex: 1, height: "4px", backgroundColor: "#E2E8F0", borderRadius: "2px" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#718096", marginTop: "2px" }}>
                            <span style={{ color: "#48BB78" }}>Kekuatan: Kuat</span>
                            <span>Min. 8 Karakter</span>
                        </div>
                    </div>

                    <div className="col-6">
                        <label className="form-label" style={{ fontWeight: "500", color: "#4A5568", fontSize: "0.875rem" }}>Konfirmasi Password</label>
                        <div className="input-group input-group-flat">
                            <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="••••••••" required />
                            <span className="input-group-text">
                                <button type="button" className="link-secondary" style={{ background: 'none', border: 'none', padding: 0 }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <IconEye size={16} />
                                </button>
                            </span>
                        </div>
                        <div style={{ fontSize: "10px", color: "#48BB78", marginTop: "4px", display: "flex", alignItems: "center", gap: "2px" }}>
                            ✓ Password cocok
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="form-check">
                        <input type="checkbox" className="form-check-input" required />
                        <span className="form-check-label" style={{ fontSize: "0.8125rem", color: "#4A5568" }}>
                            Saya menyetujui <Link href="/terms" style={{ color: "#032B88", textDecoration: "none" }}>Syarat & Ketentuan</Link> dan <Link href="/privacy" style={{ color: "#032B88", textDecoration: "none" }}>Kebijakan Privasi</Link> Lumina Learn.
                        </span>
                    </label>
                </div>
                <div className="form-footer">
                    <button type="submit" className="btn w-100" style={{ backgroundColor: "#032B88", color: "#fff", fontWeight: "600", padding: "0.6rem" }}>
                    Daftar & Minta Verifikasi →
                    </button>
                </div>
            </form>

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
                   <IconBell />
                </div>
                <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: "600" }}>Pemberitahuan Baru</div>
                    <div style={{ fontSize: "0.6875rem", color: "#A0AEC0" }}>Laporan semester siap dilihat</div>
                </div>
            </div>
        </div>

    </div>
  );
}