import LegacyTable, { Column } from "@/components/Table";
import { Eye, Pencil, Trash2 } from "lucide-react";

export type GateAccessLog = {
  id: number;
  employeeName: string;
  badgeId: string;
  gate: string;
  accessTime: string;
  deviceName: string;
  status: "Success" | "Failed";
};

export const data: GateAccessLog[] = [
  {
    id: 1001,
    employeeName: "Chamreun Vira",
    badgeId: "KH-AC-2048",
    gate: "Warehouse Gate A",
    accessTime: "2026-06-10 08:12",
    deviceName: "RFID Reader A-01",
    status: "Success",
  },
  {
    id: 1002,
    employeeName: "Srey Roth",
    badgeId: "KH-AC-1816",
    gate: "Loading Dock",
    accessTime: "2026-06-10 08:27",
    deviceName: "RFID Reader D-02",
    status: "Failed",
  },
  {
    id: 1003,
    employeeName: "Dara Sok",
    badgeId: "KH-AC-2197",
    gate: "Staff Entrance",
    accessTime: "2026-06-10 09:04",
    deviceName: "Face Terminal S-01",
    status: "Success",
  },
  {
    id: 1004,
    employeeName: "Malis Chan",
    badgeId: "KH-AC-1733",
    gate: "Server Room",
    accessTime: "2026-06-10 09:31",
    deviceName: "Biometric Lock SR-03",
    status: "Failed",
  },
];

export const columns: Column<GateAccessLog>[] = [
  {
    header: "Log ID",
    key: "id",
    className: "w-24",
    cellClassName: "font-semibold text-slate-800",
    render: (value) => <span>#{String(value)}</span>,
  },
  {
    header: "Employee",
    key: "employeeName",
    render: (value, item) => (
      <div>
        <p className="font-semibold text-slate-900">{String(value)}</p>
        <p className="text-xs text-slate-500">{item.badgeId}</p>
      </div>
    ),
  },
  {
    header: "Gate",
    key: "gate",
    render: (value) => <span className="text-slate-700">{String(value)}</span>,
  },
  {
    header: "Access Time",
    key: "accessTime",
    render: (value) => <span className="whitespace-nowrap text-slate-500">{String(value)}</span>,
  },
  {
    header: "Device",
    key: "deviceName",
    render: (value) => <span className="text-slate-500">{String(value)}</span>,
  },
  {
    header: "Status",
    key: "status",
    className: "w-28",
    render: (value) => {
      const status = String(value) as GateAccessLog["status"];
      const isSuccess = status === "Success";

      return (
        <span
          className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
            isSuccess
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-100 bg-rose-50 text-rose-700"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    header: "Actions",
    key: "actions",
    className: "w-32 text-right",
    cellClassName: "text-right",
    render: (_, item) => (
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={`View access log ${item.id}`}
        >
          <Eye size={16} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={`Edit access log ${item.id}`}
        >
          <Pencil size={16} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-rose-600"
          aria-label={`Delete access log ${item.id}`}
        >
          <Trash2 size={16} strokeWidth={1.75} />
        </button>
      </div>
    ),
  },
];

export default function TableTest() {
  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-5 rounded-md border border-slate-200 bg-white p-5">
        <h1 className="text-lg font-semibold text-slate-900">IoT Gate Access Logs</h1>
        <p className="mt-1 text-sm text-slate-500">
          Mock data for testing the reusable dynamic table component.
        </p>
      </div>

      <LegacyTable data={data} columns={columns} />
    </main>
  );
}
