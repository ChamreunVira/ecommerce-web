"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { ArrowDownAZ, ChevronRight, Home, ShieldAlert, AlertCircle, RefreshCw } from "lucide-react";
import { AuditModule } from "@/constant/constant";
import { http } from "@/lib/axios";
import { PageResponse } from "@/types/page-response";
import LegacyTable, { Column } from "@/components/Table";

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  VIEW = "VIEW",
  LOGIN = "LOGIN",
}

export interface AuditLogs {
  id: number;
  action: AuditAction;
  module: AuditModule;
  entityId: string | null;
  performedBy: string | null;
  role: string | null;
  ipAddress: string | null;
  timestamp: string;
  details: string | null;
  reason: string | null;
  oldValues: string | null;
  newValues: string | null;
}

export default function AuditLogPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLogs[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [ascending, setAscending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFetchAuditLogs = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await http.get<PageResponse<AuditLogs>>("/audit", {
        params: {
          // The API is zero-indexed; the UI pagination is one-indexed.
          page: currentPage - 1,
          size: pageSize,
          sortBy,
          ascending,
        },
        signal,
      });
      if (response.status === 200) {
        const data = response.data;
        setAuditLogs(data.content);
        setTotalPages(data.totalPage);
        setTotalElements(data.totalElement);
      }
    } catch (error: unknown) {
      if (!isAxiosError(error) || error.code !== "ERR_CANCELED") {
        setError("Unable to load audit logs. Please try again.");
      }
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [ascending, currentPage, pageSize, sortBy]);

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- this effect synchronizes the table with its server query.
    void handleFetchAuditLogs(controller.signal);
    return () => controller.abort();
  }, [handleFetchAuditLogs]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-emerald-100 text-emerald-700 ring-emerald-200";
      case "UPDATE": return "bg-sky-100 text-sky-700 ring-sky-200";
      case "DELETE": return "bg-rose-100 text-rose-700 ring-rose-200";
      case "LOGIN": return "bg-indigo-100 text-indigo-700 ring-indigo-200";
      default: return "bg-slate-100 text-slate-700 ring-slate-200";
    }
  };

  const columns: Column<AuditLogs>[] = [
    {
      header: "Log ID",
      key: "id",
      cellClassName: "font-mono text-xs text-slate-500",
      render: (_, log) => <span>{log.id}</span>
    },
    {
      header: "Action",
      key: "action",
      render: (_, log) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase font-bold ring-1 ${getActionColor(log.action)}`}>
          {log.action}
        </span>
      )
    },
    {
      header: "Module & ID",
      key: "module",
      render: (_, log) => (
        <>
          <p className="font-semibold text-slate-700">{log.module}</p>
          <p className="text-xs text-slate-400">ID: {log.entityId}</p>
        </>
      )
    },
    {
      header: "Performed By",
      key: "performedBy",
      render: (_, log) => (
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            {log.performedBy}
          </div>
          <p className="text-xs text-slate-400">{log.ipAddress}</p>
        </>
      )
    },
    {
      header: "Reason / Why",
      key: "details",
      className: "w-1/4",
      render: (_, log) => (
        <>
          <p className="text-sm font-medium text-slate-800">{log.details}</p>
          {log.reason && (
            <p className="mt-0.5 text-xs text-slate-500 italic flex items-center gap-1 font-normal">
              <AlertCircle size={12} className="text-indigo-400 shrink-0" />
              {log.reason}
            </p>
          )}
        </>
      )
    },
    {
      header: "Timestamp",
      key: "timestamp",
      className: "text-right",
      cellClassName: "text-right whitespace-nowrap text-slate-500 text-xs",
      render: (_, log) => <span>{new Date(log.timestamp).toLocaleString()}</span>
    }
  ];

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
            <ShieldAlert className="text-indigo-500" size={24} />
            System Audit & Activity Logs
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A secure trail tracking who did what, when, and why for compliance.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ArrowDownAZ size={16} className="text-indigo-500" />
          <span className="font-medium">Audit log controls</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="audit-sort">Sort audit logs</label>
          <select
            id="audit-sort"
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="id">Sort by ID</option>
            <option value="timestamp">Sort by time</option>
            <option value="action">Sort by action</option>
            <option value="module">Sort by module</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setAscending((value) => !value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            {ascending ? "Ascending" : "Descending"}
          </button>
          <label className="sr-only" htmlFor="audit-page-size">Audit logs per page</label>
          <select
            id="audit-page-size"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <button
            type="button"
            onClick={() => handleFetchAuditLogs()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <LegacyTable
        data={auditLogs}
        columns={columns}
        rowKey="id"
        emptyTitle={isLoading ? "Loading audit logs" : "No audit logs found"}
        emptyDescription={isLoading ? "Please wait while the latest activity is retrieved." : "There are no audit logs for this page."}
        pagination={{
          currentPage,
          pageSize,
          totalElements,
          totalPages,
          onPageChange: (page) => setCurrentPage(page)
        }}
      />
    </div>
  );
}
