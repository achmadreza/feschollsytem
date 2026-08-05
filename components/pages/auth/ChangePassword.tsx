"use client";

import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "../../../components/ui/Button"; 
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { FormField, Form } from "../../../components/ui/Form";
import { Toaster, toast } from 'react-hot-toast';
import { callApi } from "@/lib/api";

export function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            const message = "Password baru dan konfirmasi password tidak cocok.";
            setError(message);
            toast.error(message);
            return;
        }

        if (newPassword.length < 6) {
            const message = "Password baru minimal 6 karakter.";
            setError(message);
            toast.error(message);
            return;
        }

        setLoading(true);

        try {
            const response = await callApi("auth/change-password", {
                method: "POST",
                body: {
                    currentPassword,
                    newPassword,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal mengubah password.");
            }

            const successMessage = "Password berhasil diperbarui!";
            setSuccess(successMessage);
            toast.success(successMessage);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ubah Password</h2>

                {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-lg border border-green-200">
                        {success}
                    </div>
                )}

                <Form onSubmit={handleSubmit} className="space-y-4">
                    <FormField>
                        <Label htmlFor="currentPassword">Password Saat Ini</Label>
                        <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            disabled={loading}
                            rightAction={
                                <Button 
                                    type="button" 
                                    variant="link" 
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                                    disabled={loading}
                                    style={{ color: "#032B88", padding: 0 }}
                                >
                                    {showCurrentPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                </Button>
                            }
                        />
                    </FormField>

                    <FormField>
                        <Label htmlFor="newPassword">Password Baru</Label>
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={loading}
                            rightAction={
                                <Button 
                                    type="button" 
                                    variant="link" 
                                    onClick={() => setShowNewPassword(!showNewPassword)} 
                                    disabled={loading}
                                    style={{ color: "#032B88", padding: 0 }}
                                >
                                    {showNewPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                </Button>
                            }
                        />
                    </FormField>

                    <FormField>
                        <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            rightAction={
                                <Button 
                                    type="button" 
                                    variant="link" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    disabled={loading}
                                    style={{ color: "#032B88", padding: 0 }}
                                >
                                    {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                </Button>
                            }
                        />
                        {newPassword && confirmPassword && (
                            <div style={{ 
                                fontSize: "12px", 
                                color: newPassword === confirmPassword ? "#48BB78" : "#E53E3E", 
                                marginTop: "6px", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "4px" 
                            }}>
                                {newPassword === confirmPassword 
                                    ? "✓ Password cocok" 
                                    : "✗ Password baru dan konfirmasi tidak cocok"}
                            </div>
                        )}
                    </FormField>

                    <Button
                        type="submit"
                        disabled={loading || (confirmPassword.length > 0 && newPassword !== confirmPassword)}
                        variant="default"
                        size="lg"
                        className="w-full mt-2"
                    >
                        {loading ? "Menyimpan..." : "Ubah Password"}
                    </Button>
                </Form>
            </div>
            <Toaster position="top-right" />
        </>
    );
}