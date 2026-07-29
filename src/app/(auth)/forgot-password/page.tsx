"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "../../../../components/i18n/LanguageProvider";
import { IconMail, IconArrowLeft, IconCircleCheck, IconLockCode } from "@tabler/icons-react";
import { Label } from "../../../../components/ui/Label";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Form, FormField } from "../../../../components/ui/Form";
import { callApi } from "@/lib/api";

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await callApi("auth/forget-password", {
                method: "POST",
                body: { email },
            });
            
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err?.message || "Gagal mengirim permintaan reset password. Silakan coba lagi.");
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#032B88", fontWeight: "bold", fontSize: "1.25rem" }}>
                        <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                            <path d="M12 18.5l-7.42-4.05L3 15.5l9 5 9-5-1.58-1.05z" />
                        </svg>
                        <span>Lumina Learn</span>
                    </div>
                    <Link href="/login" style={{ color: "#4A5568", fontSize: "0.875rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <IconArrowLeft size={16} /> Kembali ke Login
                    </Link>
                </div>
                
                {!isSubmitted ? (
                    <>
                        <div style={{ marginBottom: "2rem" }}>
                            <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1A202C", marginBottom: "0.5rem" }}>Lupa Password?</h1>
                            <p style={{ color: "#718096", fontSize: "0.875rem", margin: 0, lineHeight: "1.5" }}>
                                Jangan khawatir! Masukkan email yang terdaftar di akun Anda, kami akan mengirimkan instruksi untuk mengatur ulang password Anda.
                            </p>
                        </div>

                        {error && (
                            <div style={{ 
                                padding: "0.75rem 1rem", 
                                backgroundColor: "#FFF5F5", 
                                border: "1px solid #FEB2B2", 
                                borderRadius: "6px", 
                                color: "#C53030", 
                                fontSize: "0.875rem", 
                                marginBottom: "1.5rem" 
                            }}>
                                {error}
                            </div>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <FormField>
                                <Label style={{ fontSize: "0.875rem" }}>Alamat Email</Label>
                                <Input 
                                    type="email" 
                                    placeholder="nama@email.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    disabled={loading}
                                    icon={<IconMail size={18} stroke={2} style={{ color: "#A0AEC0" }} />}
                                />
                            </FormField>
                            
                            <div className="form-footer mb-4">
                                <Button type="submit" fullWidth disabled={loading}>
                                    {loading ? "Mengirim..." : "Kirim Link Reset Password"}
                                </Button>
                            </div>
                        </Form>
                    </>
                ) : (
                    <div style={{ textAlign: "center", margin: "auto 0" }}>
                        <div style={{ display: "inline-flex", padding: "1rem", backgroundColor: "#E6FFFA", borderRadius: "50%", color: "#319795", marginBottom: "1.5rem" }}>
                            <IconCircleCheck size={48} />
                        </div>
                        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#1A202C", marginBottom: "0.75rem" }}>Periksa Email Anda</h2>
                        <p style={{ color: "#718096", fontSize: "0.875rem", lineHeight: "1.6", marginBottom: "2rem" }}>
                            Kami telah mengirimkan tautan pengaturan ulang password ke <strong style={{ color: "#2D3748" }}>{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.
                        </p>
                        
                        <Button 
                            type="button" 
                            fullWidth
                            onClick={() => setIsSubmitted(false)} 
                            style={{ backgroundColor: "#edf2f7", color: "#4a5568", marginBottom: "1rem" }}
                        >
                            Kirim Ulang Email
                        </Button>
                    </div>
                )}

                <div style={{ textAlign: "center", marginTop: "auto", paddingBottom: "1rem", fontSize: "0.875rem", color: "#4A5568" }}>
                    Ingat password Anda? <Link href="/login" style={{ color: "#032B88", fontWeight: "600", textDecoration: "none" }}>Masuk di sini</Link>
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
                        • KEAMANAN AKUN · LUMINA LEARN
                    </span>
                
                    <h2 style={{ fontSize: "3rem", fontWeight: "700", lineHeight: "1.1", marginBottom: "1.5rem" }}>
                        Aman & <br />
                        <span style={{ color: "#48BB78" }}>Terlindungi.</span>
                    </h2>
                    
                    <p style={{ color: "#A0AEC0", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2.5rem" }}>
                        Kami menerapkan standar enkripsi tinggi untuk memastikan data pribadi, performa akademik siswa, dan akun seluruh pengajar terlindungi dengan aman setiap waktu.
                    </p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ backgroundColor: "rgba(72,187,120,0.2)", color: "#48BB78", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>✓</div>
                            <span style={{ color: "#E2E8F0", fontSize: "0.9rem" }}>Gunakan kombinasi simbol dan angka</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ backgroundColor: "rgba(72,187,120,0.2)", color: "#48BB78", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>✓</div>
                            <span style={{ color: "#E2E8F0", fontSize: "0.9rem" }}>Jangan bagikan kode OTP atau password Anda</span>
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
                    <div style={{ backgroundColor: "rgba(72,187,120,0.2)", color: "#48BB78", padding: "0.5rem", borderRadius: "8px" }}>
                        <IconLockCode size={16} />
                    </div>
                    <div>
                        <div style={{ fontSize: "0.8125rem", fontWeight: "600" }}>Sistem Keamanan Aktif</div>
                        <div style={{ fontSize: "0.6875rem", color: "#A0AEC0" }}>Koneksi Anda dienkripsi SSL</div>
                    </div>
                </div>
            </div>
        </div>
    );
}