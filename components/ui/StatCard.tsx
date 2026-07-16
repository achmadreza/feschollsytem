import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  badgeText: string;
  badgeColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  progressColor: string;
  progressValue: string;
}

export function StatCard({
  title,
  value,
  badgeText,
  badgeColor,
  icon: Icon,
  iconBg,
  iconColor,
  progressColor,
  progressValue,
}: StatCardProps) {
  return (
    <div className="card shadow-sm border-0 p-4 mb-4 flex-fill bg-white" style={{ borderRadius: "16px" }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className={`p-2 rounded-3 ${iconBg} ${iconColor} d-inline-flex`}>
          <Icon size={24} />
        </div>
        <span className={`badge ${badgeColor} border-0 rounded-pill px-2 py-1`} style={{ fontSize: "11px", fontWeight: "600" }}>
          {badgeText}
        </span>
      </div>
      <div className="text-muted small fw-medium mb-1">{title}</div>
      <h2 className="fw-bold mb-3" style={{ color: "#0A192F", fontSize: "32px" }}>{value}</h2>
      <div className="progress" style={{ height: "4px", backgroundColor: "#F1F3F5" }}>
        <div className="progress-bar" style={{ width: progressValue, backgroundColor: progressColor }}></div>
      </div>
    </div>
  );
}