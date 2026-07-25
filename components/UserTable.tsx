"use client";

import React from "react";
import Table, { Column } from "./Table";
import { User } from "@/types/user";
import { Edit01, Trash01, DotsVertical } from "@untitledui/icons";
import Profile from "./Profile";
import { Badge } from "@/components/base/badges/badges";

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
  option,
}) => {
  const columns: Column<User>[] = [
    {
      header: "User",
      key: "fullName",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <Profile fullName={item.fullName} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">
              {item.fullName}
            </p>
            <p className="truncate text-xs text-tertiary">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Roles",
      key: "roles",
      render: (value) => (
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(value) ? value : []).map((role) => {
            const roleName = String(role).replace("ROLE_", "");
            const isBrand = roleName === "ADMIN";
            return (
              <Badge
                key={role}
                type="pill-color"
                color={isBrand ? "brand" : "slate"}
                size="sm"
              >
                {roleName}
              </Badge>
            );
          })}
        </div>
      ),
    },
    {
      header: "Updated",
      key: "updatedAt",
      render: (value) =>
        value ? (
          <span className="text-xs text-tertiary">
            {new Date(value as string).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-quaternary">—</span>
        ),
    },
    {
      header: "Action",
      key: "actions",
      className: "w-28 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleUpdate?.(item)}
            className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
            aria-label="Edit user"
          >
            <Edit01 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            className="flex size-8 items-center justify-center rounded-lg text-error-primary transition hover:bg-error-secondary"
            aria-label="Delete user"
          >
            <Trash01 className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-quaternary transition hover:bg-secondary hover:text-primary"
            aria-label="More options"
          >
            <DotsVertical className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return <Table data={users} columns={columns} option={option} />;
};

export default UserTable;

