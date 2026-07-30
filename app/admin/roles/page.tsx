"use client";

import React, { useEffect, useState } from "react";
import { Role } from "@/types/role";
import { roleService } from "@/services/role-service";
import RoleModal from "@/components/RoleModal";
import HasPermission from "@/components/HasPermission";
import AdminNavbar from "@/components/AdminNavbar";
import { ShieldCheck, Plus, Edit2, Trash2, Key, Users, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getAllRoles();
      if (response.success && response.data) {
        setRoles(response.data);
      }
    } catch (err) {
      toast.error("Failed to load dynamic roles");
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
      toast.error("Default ADMIN role cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete role '${name}'?`)) return;

    try {
      await roleService.deleteRole(id);
      toast.success(`Role '${name}' deleted successfully`);
      fetchRoles();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete role");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <AdminNavbar />

      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <ShieldCheck size={22} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Roles & Permissions Management
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Create custom roles and assign dynamic module permissions to user accounts
            </p>
          </div>

          <HasPermission name="ROLE_WRITE">
            <button
              onClick={handleCreateRole}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create Custom Role
            </button>
          </HasPermission>
        </div>

        {/* Roles Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 font-medium">Loading security roles...</div>
        ) : roles.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck size={48} className="mx-auto text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No roles found</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by creating your first custom system role.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg">
                      {role.name}
                    </span>

                    <div className="flex items-center gap-1">
                      <HasPermission name="ROLE_UPDATE">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                          title="Edit Role"
                        >
                          <Edit2 size={16} />
                        </button>
                      </HasPermission>

                      {role.name !== "ROLE_ADMIN" && (
                        <HasPermission name="ROLE_DELETE">
                          <button
                            onClick={() => handleDeleteRole(role.id, role.name)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                            title="Delete Role"
                          >
                            <Trash2 size={16} />
                          </button>
                        </HasPermission>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 min-h-[40px]">
                    {role.description || "No description provided."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Key size={14} className="text-indigo-500" />
                        Permissions ({role.permissions?.length || 0})
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                      {role.permissions && role.permissions.length > 0 ? (
                        role.permissions.map((perm) => (
                          <span
                            key={perm.id}
                            className="inline-flex items-center gap-1 font-mono text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                          >
                            <CheckCircle2 size={10} className="text-emerald-500" />
                            {perm.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs italic text-slate-400">No permissions assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>ID: #{role.id}</span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {role.name === "ROLE_ADMIN" ? "System Core" : "Custom Role"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
        onSuccess={fetchRoles}
      />
    </div>
  );
}
