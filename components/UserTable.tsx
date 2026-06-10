import React from "react";
import Table, { Column } from "./Table";
import { User } from "@/types/user";
import { Edit, Trash } from "lucide-react";
import Profile from "./Profile";

type UserTableType = {
  users: User[];
  handleDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableType> = ({ users, handleDelete }) => {
  const columns: Column<User>[] = [
    {
      header: "#",
      key: "id",
      className: "w-16",
      cellClassName: "font-semibold text-slate-800",
    },
    {
      header: "Avatar",
      key: "avatar",
      className: "w-20",
      render: (_, item) => (
        <Profile fullName={item.fullName} />
      )
    },
    {
      header: "Name",
      key: "fullName",
      render: (value) => <span className="font-semibold text-slate-900">{String(value)}</span>,
    },
    {
      header: "Email",
      key: "email",
      render: (value) => <span className="text-slate-500">{String(value)}</span>,
    },
    {
      header: "Roles",
      key: "roles",
      render: (value) => (
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(value) ? value : []).map((role) => (
            <span key={role} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              {String(role).replace("ROLE_", "")}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Updated",
      key: "updatedAt",
      render: (value) => formatDate(value),
    },
    {
      header: "Actions",
      key: "actions",
      className: "w-28 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-2">
          <button className="rounded-full p-2 text-amber-600 transition hover:bg-amber-50" aria-label="Edit user">
            <Edit size={17} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="rounded-full p-2 text-rose-600 transition hover:bg-rose-50"
            aria-label="Delete user"
          >
            <Trash size={17} />
          </button>
        </div>
      ),
    }
  ];

  return <Table data={users} columns={columns} />;
}

export default UserTable

function formatDate(value: unknown) {
  if (!value) return <span className="text-slate-400">-</span>;
  return <span className="text-sm text-slate-500">{new Date(value as string).toLocaleDateString()}</span>;
}
