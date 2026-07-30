"use client";

import React from "react";
import { Table, TableCard } from "@/components/application/table/table";
import { User } from "@/types/user";
import { Edit01, Trash01, DotsVertical } from "@untitledui/icons";
import Profile from "./Profile";
import { Badge } from "@/components/base/badges/badges";

type UserTableType = {
  users: User[];
  handleDelete: (id: number) => void;
  handleUpdate?: (user: User) => void;
  option?: React.ReactNode;
};

const UserTable: React.FC<UserTableType> = ({
  users,
  handleDelete,
  handleUpdate,
  option,
}) => {
  return (
    <TableCard.Root>
      {option && (
        <div className="border-b border-secondary bg-primary px-6 py-4">
          {option}
        </div>
      )}

      <Table aria-label="Users table">
        <Table.Header>
          <Table.Head id="user" label="User" isRowHeader allowsSorting />
          <Table.Head id="roles" label="Roles" />
          <Table.Head id="updated" label="Updated" allowsSorting />
          <Table.Head id="actions" />
        </Table.Header>

        <Table.Body items={users}>
          {(item) => (
            <Table.Row id={item.id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <Profile fullName={item.fullName} className="size-9 text-sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary">{item.fullName}</p>
                    <p className="truncate text-xs text-tertiary">{item.email}</p>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(item.roles) ? item.roles : []).map((role) => {
                    const roleName = String(role).replace("ROLE_", "");
                    const isBrand = roleName === "ADMIN";
                    return (
                      <Badge key={role} type="pill-color" color={isBrand ? "brand" : "slate"} size="sm">
                        {roleName}
                      </Badge>
                    );
                  })}
                </div>
              </Table.Cell>
              <Table.Cell>
                {item.updatedAt ? (
                  <span className="text-xs text-tertiary">
                    {new Date(item.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ) : (
                  <span className="text-quaternary">—</span>
                )}
              </Table.Cell>
              <Table.Cell>
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
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {users.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-primary">No users found</p>
          <p className="text-xs text-tertiary">Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="flex items-center border-t border-secondary bg-primary px-6 py-3.5">
        <span className="text-xs text-tertiary">
          Showing <span className="font-semibold text-primary">{users.length}</span> {users.length !== 1 ? "users" : "user"}
        </span>
      </div>
    </TableCard.Root>
  );
};

export default UserTable;
