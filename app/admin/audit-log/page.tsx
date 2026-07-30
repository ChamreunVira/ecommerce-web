"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { ArrowDownAZ, ChevronRight, Home, ShieldAlert, AlertCircle, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import { AuditModule } from "@/constant/constant";
import { http } from "@/lib/axios";
import { PageResponse } from "@/types/page-response";
import { Table, TableCard } from "@/components/application/table/table";
import { BadgeWithDot } from "@/components/base/badges/badges";

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

const actionColorMap: Record<string, "success" | "blue" | "error" | "indigo" | "gray"> = {
  CREATE: "success",
  UPDATE: "blue",
  DELETE: "error",
  LOGIN: "indigo",
};

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
        params: { page: currentPage - 1, size: pageSize, sortBy, ascending },
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
    void handleFetchAuditLogs(controller.signal);
    return () => controller.abort();
  }, [handleFetchAuditLogs]);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Audit Log</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-primary">
            <ShieldAlert className="text-indigo-500" size={24} />
            System Audit &amp; Activity Logs
          </h1>
          <p className="mt-1 text-sm text-tertiary">A secure trail tracking who did what, when, and why for compliance.</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      <TableCard.Root>
        {/* Controls bar */}
        <div className="flex flex-col gap-3 border-b border-secondary bg-primary px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <ArrowDownAZ size={16} className="text-brand-secondary" />
            <span className="font-medium">Audit log controls</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="h-9 rounded-lg border border-secondary bg-primary px-3 text-sm font-medium text-secondary outline-none focus:border-brand-primary"
            >
              <option value="id">Sort by ID</option>
              <option value="timestamp">Sort by time</option>
              <option value="action">Sort by action</option>
              <option value="module">Sort by module</option>
            </select>
            <button
              type="button"
              onClick={() => { setAscending((v) => !v); setCurrentPage(1); }}
              className="h-9 rounded-lg border border-secondary bg-primary px-3 text-sm font-medium text-secondary transition hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary"
            >
              {ascending ? "Ascending ↑" : "Descending ↓"}
            </button>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="h-9 rounded-lg border border-secondary bg-primary px-3 text-sm font-medium text-secondary outline-none focus:border-brand-primary"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <button
              type="button"
              onClick={() => handleFetchAuditLogs()}
              disabled={isLoading}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-primary px-3 text-sm font-semibold text-white transition hover:bg-brand-primary_hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        <Table aria-label="Audit logs table">
          <Table.Header>
            <Table.Head id="id" label="Log ID" isRowHeader allowsSorting />
            <Table.Head id="action" label="Action" />
            <Table.Head id="module" label="Module & ID" />
            <Table.Head id="performedBy" label="Performed By" />
            <Table.Head id="details" label="Reason / Why" />
            <Table.Head id="timestamp" label="Timestamp" allowsSorting />
          </Table.Header>

          <Table.Body items={isLoading ? [] : auditLogs}>
            {(log) => {
              const color = actionColorMap[log.action] ?? "gray";
              return (
                <Table.Row id={log.id}>
                  <Table.Cell className="font-mono text-xs font-semibold text-primary">
                    #{log.id}
                  </Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot type="pill-color" color={color} size="sm">{log.action}</BadgeWithDot>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="font-semibold text-primary">{log.module}</p>
                    <p className="text-xs text-tertiary">ID: {log.entityId ?? "—"}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="text-sm font-medium text-primary">{log.performedBy ?? "—"}</p>
                    <p className="text-xs text-tertiary">{log.ipAddress ?? ""}</p>
                  </Table.Cell>
                  <Table.Cell className="max-w-xs">
                    <p className="text-sm font-medium text-primary">{log.details ?? "—"}</p>
                    {log.reason && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs italic text-tertiary">
                        <AlertCircle size={12} className="shrink-0 text-indigo-400" />
                        {log.reason}
                      </p>
                    )}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-xs text-tertiary">
                    {new Date(log.timestamp).toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table>

        {!isLoading && auditLogs.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary"><ShieldAlert size={20} /></div>
            <p className="text-sm font-semibold text-primary">No audit logs found</p>
            <p className="text-xs text-tertiary">There are no audit logs for this page.</p>
          </div>
        )}
        {isLoading && <div className="px-6 py-12 text-center text-sm text-tertiary">Loading audit logs…</div>}

        {/* Server-side pagination */}
        <div className="flex items-center justify-between border-t border-secondary bg-primary px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40"
          >
            <ArrowLeft className="size-4" /> Previous
          </button>
          <span className="text-xs text-tertiary">
            Page <span className="font-semibold text-primary">{currentPage}</span> of{" "}
            <span className="font-semibold text-primary">{totalPages}</span> · <span className="font-semibold text-primary">{totalElements}</span> entries
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40"
          >
            Next <ArrowRight className="size-4" />
          </button>
        </div>
      </TableCard.Root>
    </div>
  );
}
