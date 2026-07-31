"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Role } from "@/types/role";
import { roleService } from "@/services/role-service";
import RoleModal from "@/components/RoleModal";
import HasPermission from "@/components/HasPermission";
import StatsCard from "@/components/StatsCard";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import {
  ShieldCheck,
  Plus,
  Search,
  Home,
  ChevronRight,
  Key,
  Shield,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Edit01, Trash01, DotsVertical } from "@untitledui/icons";
import { toast } from "react-toastify";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "SYSTEM" | "CUSTOM">("ALL");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getAllRoles();
      if (response.success && response.data) {
        setRoles(response.data);
      }
    } catch {
      toast.error("Failed to load security roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = async (id: number, name: string) => {
    if (name === "ROLE_ADMIN") {
      toast.error("Default ADMIN role is a core system role and cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete role '${name}'?`)) return;

    try {
      await roleService.deleteRole(id);
      toast.success(`Role '${name}' deleted successfully.`);
      fetchRoles();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete role.");
    }
  };

  const filteredRoles = roles.filter((r) => {
    const matchQuery =
      !query ||
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(query.toLowerCase()));

    const isSystem = r.name === "ROLE_ADMIN" || r.name === "ROLE_CUSTOMER";
    const matchType =
      typeFilter === "ALL" ||
      (typeFilter === "SYSTEM" && isSystem) ||
      (typeFilter === "CUSTOM" && !isSystem);

    return matchQuery && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / PAGE_SIZE));
  const paginated = filteredRoles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Compute stats
  const totalPermissionsCount = roles.reduce(
    (acc, r) => acc + (r.permissions?.length || 0),
    0,
  );
  const systemRolesCount = roles.filter(
    (r) => r.name === "ROLE_ADMIN" || r.name === "ROLE_CUSTOMER",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1 transition-colors hover:text-primary"
        >
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Roles & Permissions</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Roles & Permissions Management
          </h1>
          <p className="mt-1 text-sm text-tertiary">
            Define custom access roles and assign granular module permissions to user accounts.
          </p>
        </div>

        <HasPermission name="ROLE_WRITE">
          <button
            onClick={handleCreateRole}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-600"
          >
            <Plus size={16} />
            Create Custom Role
          </button>
        </HasPermission>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          icon={<Shield className="text-indigo-500" size={22} />}
          accent="bg-indigo-50"
          label="Total System Roles"
          value={roles.length}
          trend={0}
        />
        <StatsCard
          icon={<Key className="text-indigo-500" size={22} />}
          accent="bg-indigo-50"
          label="Configured Permissions"
          value={totalPermissionsCount}
          trend={0}
        />
        <StatsCard
          icon={<ShieldCheck className="text-indigo-500" size={22} />}
          accent="bg-indigo-50"
          label="System Core Roles"
          value={systemRolesCount}
          trend={0}
        />
      </div>

      {/* Table Card */}
      <TableCard.Root>
        {/* Search + Filter Bar */}
        <div className="flex flex-col gap-3 border-b border-secondary bg-primary px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="relative max-w-xs">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search roles or permissions…"
              className="h-9 w-full rounded-lg border border-secondary bg-primary pl-8 pr-3 text-sm font-medium text-primary outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="h-9 rounded-lg border border-secondary bg-primary px-3 text-sm font-medium text-secondary outline-none transition focus:border-indigo-500"
            >
              <option value="ALL">All Role Types</option>
              <option value="SYSTEM">System Core</option>
              <option value="CUSTOM">Custom Roles</option>
            </select>
          </div>
        </div>

        {/* Roles Table */}
        <Table aria-label="Security roles table">
          <Table.Header>
            <Table.Head id="role" label="Role Name" isRowHeader allowsSorting />
            <Table.Head id="description" label="Description" />
            <Table.Head id="permissions" label="Assigned Permissions" />
            <Table.Head id="scope" label="Scope" />
            <Table.Head id="actions" />
          </Table.Header>

          <Table.Body items={loading ? [] : paginated}>
            {(item) => {
              const isSystemCore =
                item.name === "ROLE_ADMIN" || item.name === "ROLE_CUSTOMER";
              const permList = item.permissions || [];
              const displayPerms = permList.slice(0, 3);
              const remainingCount = permList.length - displayPerms.length;

              return (
                <Table.Row id={item.id}>
                  {/* Role Name */}
                  <Table.Cell>
                    <div className="flex items-center gap-2.5">
                      <Badge type="pill-color" color="brand" size="md">
                        {item.name}
                      </Badge>
                    </div>
                  </Table.Cell>

                  {/* Description */}
                  <Table.Cell>
                    <p className="max-w-xs truncate text-xs text-secondary">
                      {item.description || "No description provided."}
                    </p>
                  </Table.Cell>

                  {/* Permissions */}
                  <Table.Cell>
                    <div className="flex flex-wrap items-center gap-1.5 max-w-md py-1">
                      {displayPerms.length > 0 ? (
                        displayPerms.map((perm) => (
                          <span
                            key={perm.id}
                            className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {perm.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs italic text-tertiary">
                          No permissions
                        </span>
                      )}
                      {remainingCount > 0 && (
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                          +{remainingCount} more
                        </span>
                      )}
                    </div>
                  </Table.Cell>

                  {/* Scope */}
                  <Table.Cell>
                    <Badge
                      type="pill-color"
                      color={isSystemCore ? "slate" : "brand"}
                      size="sm"
                    >
                      {isSystemCore ? "System Core" : "Custom Role"}
                    </Badge>
                  </Table.Cell>

                  {/* Actions */}
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-1">
                      <HasPermission name="ROLE_UPDATE">
                        <button
                          type="button"
                          onClick={() => handleEditRole(item)}
                          className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
                          aria-label="Edit role"
                        >
                          <Edit01 className="size-4" />
                        </button>
                      </HasPermission>

                      {item.name !== "ROLE_ADMIN" && (
                        <HasPermission name="ROLE_DELETE">
                          <button
                            type="button"
                            onClick={() => handleDeleteRole(item.id, item.name)}
                            className="flex size-8 items-center justify-center rounded-lg text-error-primary transition hover:bg-error-secondary"
                            aria-label="Delete role"
                          >
                            <Trash01 className="size-4" />
                          </button>
                        </HasPermission>
                      )}

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
              );
            }}
          </Table.Body>
        </Table>

        {/* Empty state */}
        {!loading && paginated.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
              <ShieldCheck size={20} />
            </div>
            <p className="text-sm font-semibold text-primary">No roles found</p>
            <p className="text-xs text-tertiary">
              Try adjusting your search query or filter.
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="px-6 py-12 text-center text-sm text-tertiary">
            Loading roles and permissions…
          </div>
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
            Page <span className="font-semibold text-primary">{currentPage}</span> of{" "}
            <span className="font-semibold text-primary">{totalPages}</span> ·{" "}
            <span className="font-semibold text-primary">{filteredRoles.length}</span>{" "}
            roles
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

      {/* Role Edit/Create Modal */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
        onSuccess={fetchRoles}
      />
    </div>
  );
}
