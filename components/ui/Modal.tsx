"use client";

import React, { useEffect } from "react";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    maxWidth?: string;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean; 
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "xl",
    maxWidth = "1000px",
    showCloseButton = true,
    closeOnOverlayClick = false,
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getSizeClass = () => {
        switch (size) {
            case "sm": return "modal-sm";
            case "md": return "";
            case "lg": return "modal-lg";
            case "xl": return "modal-xl";
            default: return "modal-xl";
        }
    };

    return (
        <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{
                backgroundColor: "rgba(15, 23, 42, 0.4)",
                backdropFilter: "blur(4px)",
                zIndex: 1050,
                overflowY: "auto",
            }}
            onClick={closeOnOverlayClick ? onClose : undefined}
        >
            <div
                className={`modal-dialog modal-dialog-centered mx-auto ${getSizeClass()}`}
                style={{
                    maxWidth: maxWidth || undefined,
                    width: "90%",
                    margin: "1.75rem auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="modal-content border-0 shadow-lg"
                    style={{ borderRadius: "16px", backgroundColor: "#F8FAFC", overflow: "hidden" }}
                >
                    {(title || showCloseButton) && (
                        <div className="modal-header border-bottom px-4 py-3 bg-white">
                            {title && (
                                <h5 className="modal-title fw-bold" style={{ color: "#1E293B", fontSize: "16px" }}>
                                    {title}
                                </h5>
                            )}
                            {showCloseButton && (
                                <button
                                    type="button"
                                    className="btn-close shadow-none ms-auto"
                                    onClick={onClose}
                                    style={{ fontSize: "12px" }}
                                />
                            )}
                        </div>
                    )}
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );
}