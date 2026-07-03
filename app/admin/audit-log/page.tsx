"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, ShieldAlert, Monitor, TerminalSquare, AlertCircle } from "lucide-react";

export type AuditEvent = {
  logId: string;
  action: string;
  module: "ORDER" | "PRODUCT" | "USER" | "CATEGORY" | "SYSTEM" | "SETTING";
  entityId: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  timestamp: string;
  details: string;
  reason: string;
  oldValues?: string;
  newValues?: string;
};

const mockAuditLogs: AuditEvent[] = [
  {
    logId: "AUD-10492",
    action: "UPDATE",
    module: "PRODUCT",
    entityId: "1042",
    performedBy: "Admin Virak",
    role: "ROLE_ADMIN",
    ipAddress: "192.168.1.45",
    timestamp: "2026-07-03 16:30:11",
    details: "Changed stock level from 15 to 45",
    reason: "Restocked inventory batch #51",
    oldValues: "{\"qty\": 15}",
    newValues: "{\"qty\": 45}",
  },
  {
    logId: "AUD-10491",
    action: "DELETE",
    module: "CATEGORY",
    entityId: "18",
    performedBy: "Manager Sok",
    role: "ROLE_MANAGER",
    ipAddress: "192.168.1.120",
    timestamp: "2026-07-03 14:15:22",
    details: "Deleted category 'Old Tech'",
    reason: "Phasing out obsolete category and migrating items",
  },
  {
    logId: "AUD-10490",
    action: "LOGIN",
    module: "SYSTEM",
    entityId: "Sys-Auth",
    performedBy: "Admin Virak",
    role: "ROLE_ADMIN",
    ipAddress: "192.168.1.1",
    timestamp: "2026-07-03 09:00:05",
    details: "Successful login via Portal",
    reason: "New session started",
  },
  {
    logId: "AUD-10489",
    action: "CREATE",
    module: "ORDER",
    entityId: "8891",
    performedBy: "System_API",
    role: "ROLE_SYSTEM",
    ipAddress: "127.0.0.1",
    timestamp: "2026-07-02 23:45:00",
    details: "Placed order for $120.00",
    reason: "Customer checkout via mobile app",
  },
  {
    logId: "AUD-10488",
    action: "UPDATE",
    module: "USER",
    entityId: "User-34",
    performedBy: "SuperAdmin Rith",
    role: "ROLE_SUPERADMIN",
    ipAddress: "10.0.0.5",
    timestamp: "2026-07-01 10:20:10",
    details: "Modified roles for user 'Sok'",
    reason: "Promoted standard employee to Manager position",
    oldValues: "{\"roles\": [\"ROLE_EMPLOYEE\"]}",
    newValues: "{\"roles\": [\"ROLE_MANAGER\"]}",
  },
  {
    logId: "AUD-10487",
    action: "UPDATE",
    module: "SETTING",
    entityId: "Store-Config",
    performedBy: "SuperAdmin Rith",
    role: "ROLE_SUPERADMIN",
    ipAddress: "10.0.0.5",
    timestamp: "2026-06-30 08:15:00",
    details: "Modified global Tax Rate",
    reason: "Quarterly tax policy regulation update",
    oldValues: "{\"taxRate\": 0.05}",
    newValues: "{\"taxRate\": 0.07}",
  }
];

export default function AuditLogPage() {
  const [logs] = useState<AuditEvent[]>(mockAuditLogs);

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-emerald-100 text-emerald-700 ring-emerald-200";
      case "UPDATE": return "bg-sky-100 text-sky-700 ring-sky-200";
      case "DELETE": return "bg-rose-100 text-rose-700 ring-rose-200";
      case "LOGIN": return "bg-indigo-100 text-indigo-700 ring-indigo-200";
      default: return "bg-slate-100 text-slate-700 ring-slate-200";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1 hover:text-slate-800 transition-colors"
        >
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Audit Log</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
            <ShieldAlert className="text-orange-500" size={24} />
            System Audit & Activity Logs
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A secure trail tracking who did what, when, and why for compliance.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Log ID</th>
                <th className="px-5 py-4 font-semibold">Action</th>
                <th className="px-5 py-4 font-semibold">Module & ID</th>
                <th className="px-5 py-4 font-semibold">Performed By</th>
                <th className="px-5 py-4 font-semibold" style={{ width: "25%" }}>Reason / Why</th>
                <th className="px-5 py-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.logId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-slate-500">{log.logId}</span>
                  </td>
                  <td className="px-5 py-4">
                     <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase font-bold ring-1 ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-700">{log.module}</p>
                    <p className="text-xs text-slate-400">ID: {log.entityId}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      {log.performedBy}
                    </div>
                    <p className="text-xs text-slate-400">{log.ipAddress}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">{log.details}</p>
                    <p className="mt-0.5 text-xs text-slate-500 italic flex items-center gap-1">
                      <AlertCircle size={12} className="text-orange-400"/>
                      {log.reason}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap text-slate-500 text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
