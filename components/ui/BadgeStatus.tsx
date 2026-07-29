"use client";

import React from "react";

export interface BadgeStatusProps {
    status: string;
    showDot?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export function BadgeStatus({ 
    status, 
    showDot = true, 
    className = "", 
    style 
}: BadgeStatusProps) {
    const getStatusStyle = (statusName: string) => {
        switch (statusName) {
            case "Selesai":
            case "VERIFIED":
                return { backgroundColor: "#D1FAE5", color: "#065F46" };
            case "PROCESS":
            case "PENDING":
                return { backgroundColor: "#FEF3C7", color: "#92400E" };
            case "Ditolak/Bermasalah":
            case "REJECTED":
                return { backgroundColor: "#FEE2E2", color: "#991B1B" };
            default:
                return { backgroundColor: "#E2E8F0", color: "#475569" };
        }
    };

    return (
        <span 
            className={`badge rounded-pill fw-semibold px-2.5 py-1 ${className}`}
            style={{ 
                ...getStatusStyle(status), 
                fontSize: "11px",
                ...style 
            }}
        >
            {status}
        </span>
    );
}