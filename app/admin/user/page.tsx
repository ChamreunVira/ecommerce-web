"use client";
import AddUserModal from "@/components/AddUserModal";
import UpdateCustomerModal from "@/components/UpdateCustomerModal";
import Profile from "@/components/Profile";
import StatsCard from "@/components/StatsCard";
import { useAppContext } from "@/context/AppContext";
import { userService } from "@/services/user-service";
import { User } from "@/types/user";
import { ChevronRight, Home, Plus, UserKey, Users, UserStarIcon, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Edit01, Trash01, DotsVertical } from "@untitledui/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";

const UserAdminPage = () => {
  const { sessionReady } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const handleFetchUser = async () => {
    try {
      const res = await userService.getAll();
      if (res.success) setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteByUserId = async (id: number) => {
    try {
      const response = await userService.delete(id);
      if (response.success) {
        toast.success("User deleted successfully.");
        handleFetchUser();
      }
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  useEffect(() => {
    if (!sessionReady) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await userService.getAll();
        if (res.success) setUsers(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [sessionReady]);

  const allRoles = [...new Set(users.flatMap((u) => u.roles))];

  const filtered = users.filter((u) => {
    const matchQuery =
      !query ||
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchRole = !roleFilter || u.roles.includes(roleFilter);
    return matchQuery && matchRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const customers = users.filter((u) => u.roles.includes("ROLE_CUSTOMER")).length;
  const admins = users.filter((u) => u.roles.includes("ROLE_ADMIN")).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Users</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Users</h1>
          <p className="mt-1 text-sm text-tertiary">Manage customer, seller, and admin accounts.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-primary_hover"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatsCard icon={<Users className="text-indigo-500" size={22} />} accent="bg-indigo-50" label="Total Users" value={users.length} trend={+2} />
        <StatsCard icon={<UserStarIcon className="text-indigo-500" size={22} />} accent="bg-indigo-50" label="Customers" value={customers} trend={+2} />
        <StatsCard icon={<UserKey className="text-indigo-500" size={22} />} accent="bg-indigo-50" label="Admins" value={admins} trend={+2} />
      </div>

      {/* Table */}
      <TableCard.Root>
        {/* Search + Filter bar */}
        <div className="flex flex-col gap-3 border-b border-secondary bg-primary px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="relative max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search users…"
              className="h-9 w-full rounded-lg border border-secondary bg-primary pl-8 pr-3 text-sm font-medium text-primary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="h-9 rounded-lg border border-secondary bg-primary px-3 text-sm font-medium text-secondary outline-none transition focus:border-brand-primary"
          >
            <option value="">All Roles</option>
            {allRoles.map((r) => (
              <option key={r} value={r}>{r.replace("ROLE_", "")}</option>
            ))}
          </select>
        </div>

        <Table aria-label="Users table">
          <Table.Header>
            <Table.Head id="user" label="User" isRowHeader allowsSorting />
            <Table.Head id="roles" label="Roles" />
            <Table.Head id="updated" label="Updated" allowsSorting />
            <Table.Head id="actions" />
          </Table.Header>

          <Table.Body items={isLoading ? [] : paginated}>
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
                      const name = String(role).replace("ROLE_", "");
                      return (
                        <Badge key={role} type="pill-color" color={name === "ADMIN" ? "brand" : "slate"} size="sm">
                          {name}
                        </Badge>
                      );
                    })}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {item.updatedAt ? (
                    <span className="text-xs text-tertiary">
                      {new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  ) : (
                    <span className="text-quaternary">—</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => setEditUser(item)} className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary" aria-label="Edit user">
                      <Edit01 className="size-4" />
                    </button>
                    <button type="button" onClick={() => handleDeleteByUserId(item.id)} className="flex size-8 items-center justify-center rounded-lg text-error-primary transition hover:bg-error-secondary" aria-label="Delete user">
                      <Trash01 className="size-4" />
                    </button>
                    <button type="button" className="flex size-8 items-center justify-center rounded-lg text-quaternary transition hover:bg-secondary hover:text-primary" aria-label="More options">
                      <DotsVertical className="size-4" />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {!isLoading && paginated.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
              <Users size={20} />
            </div>
            <p className="text-sm font-semibold text-primary">No users found</p>
            <p className="text-xs text-tertiary">Try adjusting your search or filters.</p>
          </div>
        )}

        {isLoading && (
          <div className="px-6 py-12 text-center text-sm text-tertiary">Loading users…</div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-secondary bg-primary px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
            Previous
          </button>
          <span className="text-xs text-tertiary">
            Page <span className="font-semibold text-primary">{currentPage}</span> of <span className="font-semibold text-primary">{totalPages}</span>
            {" "}· <span className="font-semibold text-primary">{filtered.length}</span> users
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40"
          >
            Next
            <ArrowRight className="size-4" />
          </button>
        </div>
      </TableCard.Root>

      {isModalOpen && (
        <AddUserModal
          handleCloseAction={() => setIsModalOpen(false)}
          onCreateSuccessAction={() => { setIsModalOpen(false); handleFetchUser(); }}
        />
      )}

      {editUser && (
        <UpdateCustomerModal user={editUser} onClose={() => setEditUser(null)} onUpdated={handleFetchUser} />
      )}
    </div>
  );
};

export default UserAdminPage;