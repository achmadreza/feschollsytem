"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../../../components/i18n/LanguageProvider";
import { callApi } from "@/lib/api";
import { setToken, setUser, User, checkPermission } from "@/lib/auth";
import { useAuth } from "../../../../components/auth/AuthProvider";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";

function LoginContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setUser: setContextUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "500px", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "between", 
        padding: "3rem 2.5rem" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#032B88", fontWeight: "bold", fontSize: "1.25rem", marginBottom: "2rem" }}>
          <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            <path d="M12 18.5l-7.42-4.05L3 15.5l9 5 9-5-1.58-1.05z" />
          </svg>
          <span>Lumina Learn</span>
        </div>
        <div style={{ margin: "auto 0", width: "100%" }}>
          <h1 style={{ fontSize: "1.85rem", fontWeight: "700", marginBottom: "0.5rem" }}>Selamat Datang</h1>
          <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "2rem" }}>
            Masuk ke portal Anda — Admin, Guru, atau Orang Tua
          </p>

          {errorMsg && <div className="alert alert-danger mb-3">{errorMsg}</div>}

          <form>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: "500", color: "#4A5568" }}>Nomor Registrasi atau Email</label>
              <div className="input-icon">
                <span className="input-icon-addon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 21v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" /><circle cx="12" cy="11" r="3" /></svg>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Contoh: ADM-2024-001"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: "500", color: "#4A5568" }}>Password</label>
              <div className="input-group input-group-flat">
                <span className="input-group-text" style={{ paddingLeft: "0.75rem", paddingRight: "0.5rem" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="input-group-text">
                  <button
                    type="button"
                    className="link-secondary"
                    style={{ background: 'none', border: 'none', padding: 0 }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ fontSize: "0.875rem" }}>
              <label className="form-check m-0">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="form-check-label">Ingat Saya</span>
              </label>
              <Link href="/forgot-password" style={{ color: "#032B88", fontWeight: "600", textDecoration: "none" }}>
                Lupa Password?
              </Link>
            </div>
            <div className="form-footer">
              <Link href="/users" type="submit" className="btn w-100" style={{ backgroundColor: "#032B88", color: "#fff", fontWeight: "500" }}>
                Masuk ke Dashboard
              </Link>
            </div>
            <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "#718096" }}>
              Belum punya akun?{" "}
              <Link href="/register" style={{ color: "#032B88", fontWeight: "600", textDecoration: "none" }}>
                Register di sini
              </Link>
            </div>
          </form>
          <div className="mb-4"></div>
          <div className="card mb-4" style={{ backgroundColor: "#F0F2FA", border: "none", borderRadius: "8px" }}>
            <div className="card-body d-flex align-items-start gap-3 p-3">
              <div style={{ backgroundColor: "#fff", padding: "0.5rem", borderRadius: "6px", color: "#032B88", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "600", color: "#2D3748" }}>Siswa Baru / Pendaftar PPDB?</p>
                <Link href="/ppdb" style={{ fontSize: "0.875rem", fontWeight: "700", color: "#032B88", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                  Daftar PPDB ➔
                </Link>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <div style={{ fontWeight: "700", color: "#A0AEC0", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>
              ADMIN · GURU · ORANG TUA
            </div>
          </div>
        </div>
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p className="text-dark" style={{ fontSize: "10px", color: "#A0AEC0", margin: 0 }}>
            © 2026 Lumina Learn Technology. Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
      <div className="d-none d-lg-flex" style={{ 
        flex: 1, 
        backgroundColor: "#032B88", 
        color: "#ffffff", 
        flexDirection: "column", 
        justifyContent: "space-between", 
        padding: "4rem", 
        position: "relative", 
        overflow: "hidden" 
      }}>
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "600px", height: "600px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ 
          width: "100%", 
          maxWidth: "500px", 
          margin: "auto", 
          aspectRatio: "4/3", 
          backgroundColor: "rgba(255,255,255,0.1)", 
          backdropFilter: "blur(12px)", 
          borderRadius: "16px", 
          border: "1px solid rgba(255,255,255,0.2)", 
          padding: "1.5rem", 
          display: "flex", 
          flexDirection: "column", 
          gap: "1rem", 
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          zIndex: 2
        }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "rgba(248,113,113,0.8)" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "rgba(250,204,21,0.8)" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "rgba(74,222,128,0.8)" }} />
          </div>
          <div style={{ width: "66%", height: "16px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "6px" }} />
          <div style={{ width: "100%", height: "8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "6px" }} />
          <div style={{ width: "80%", height: "8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "6px" }} />
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.8)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ width: "80px", height: "10px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "6px" }} />
              <div style={{ width: "48px", height: "8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "6px" }} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "600px", zIndex: 2 }}>
          <span style={{ 
            display: "inline-block", 
            padding: "0.25rem 0.75rem", 
            backgroundColor: "rgba(255,255,255,0.1)", 
            backdropFilter: "blur(4px)", 
            fontSize: "0.75rem", 
            fontWeight: "600", 
            letterSpacing: "0.05em", 
            borderRadius: "9999px", 
            marginTop: "3rem",
            marginBottom: "1rem", 
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            GLOBAL ACADEMIC EXCELLENCE
          </span>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "700", lineHeight: "1.2", marginBottom: "1rem" }}>
            Memberdayakan pemimpin masa depan.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", lineHeight: "1.6", marginBottom: "2.5rem" }}>
            Bergabung dengan 5.000+ siswa di seluruh negeri yang memanfaatkan ekosistem digital terintegrasi untuk mencapai prestasi akademik tertinggi.
          </p>
          <div style={{ display: "flex", gap: "3rem", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>98%</div>
              <div style={{ fontSize: "10px", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: "500", marginTop: "0.25rem" }}>Tingkat Kelulusan</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>120+</div>
              <div style={{ fontSize: "10px", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: "500", marginTop: "0.25rem" }}>Kemitraan Global</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}