import React from "react";
import Table, { Column } from "./Table";
import { User } from "@/types/user";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Profile from "./Profile";

type UserTableType = {
  users: User[];
  handleDelete: (id: number) => void;
  handleUpdate?: (user: User) => void;
  option: React.ReactNode;
};

const UserTable: React.FC<UserTableType> = ({
  users,
  handleDelete,
  handleUpdate,
  option
}) => {
  const columns: Column<User>[] = [
    {
      header: "User",
      key: "fullName",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <Profile fullName={item.fullName} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              {item.fullName}
            </p>
            <p className="truncate text-xs text-slate-400">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Roles",
      key: "roles",
      render: (value) => (
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(value) ? value : []).map((role) => (
            <span
              key={role}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
            >
              {String(role).replace("ROLE_", "")}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Updated",
      key: "updatedAt",
      render: (value) =>
        value ? (
          <span className="text-xs text-slate-500">
            {new Date(value as string).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      header: "Action",
      key: "actions",
      className: "w-28 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleUpdate?.(item)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-amber-500 transition hover:bg-amber-50"
            aria-label="Edit user"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-rose-500 transition hover:bg-rose-50"
            aria-label="Delete user"
          >
            <Trash size={15} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100">
            <MoreHorizontal size={15} />
          </button>
        </div>
      ),
    },
  ];

  return <Table data={users} columns={columns} option={option} />;
};

export default UserTable;
