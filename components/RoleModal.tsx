"use client";

import React, { useEffect, useState } from "react";
import { Permission, Role, RoleRequest } from "@/types/role";
import { roleService } from "@/services/role-service";
import { X, ShieldCheck, CheckSquare, Square, Info } from "lucide-react";
import { toast } from "react-toastify";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  onSuccess: () => void;
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  role,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPermissions();
      if (role) {
        setName(role.name.replace(/^ROLE_/, ""));
        setDescription(role.description || "");
        setSelectedPermissionIds(role.permissions?.map((p) => p.id) || []);
      } else {
        setName("");
        setDescription("");
        setSelectedPermissionIds([]);
      }
    }
  }, [isOpen, role]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await roleService.getAllPermissions();
      if (res.success && res.data) {
        setAllPermissions(res.data);
      }
    } catch (err) {
      toast.error("Failed to load system permissions");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Group permissions by module
  const permissionsByModule = allPermissions.reduce((acc, perm) => {
    const mod = perm.module || "SYSTEM";
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const togglePermission = (id: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleModulePermissions = (modulePermissions: Permission[]) => {
    const moduleIds = modulePermissions.map((p) => p.id);
    const allSelected = moduleIds.every((id) => selectedPermissionIds.includes(id));

    if (allSelected) {
      setSelectedPermissionIds((prev) => prev.filter((id) => !moduleIds.includes(id)));
    } else {
      setSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...moduleIds])));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Role name is required");
      return;
    }

    try {
      setSaving(true);
      const formattedName = name.startsWith("ROLE_") ? name : `ROLE_${name.toUpperCase().replace(/\s+/g, "_")}`;
      const payload: RoleRequest = {
        name: formattedName,
        description,
        permissionIds: selectedPermissionIds,
      };

      if (role) {
        await roleService.updateRole(role.id, payload);
        toast.success("Role updated successfully");
      } else {
        await roleService.createRole(payload);
        toast.success("Role created successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {role ? "Edit Role & Permissions" : "Create New Role"}
              </h2>
              <p className="text-xs text-slate-500">
                Define role name and assign granular module permissions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Role Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Role Identifier Name *
              </label>
              <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/50">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  ROLE_
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="MANAGER"
                  className="w-full bg-transparent font-medium text-slate-900 outline-none dark:text-white placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Can manage store products, categories, and view reports"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            {/* Permissions Matrix */}
            <div>
              <div className="flex items-center justify-between pb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Module Permissions Matrix ({selectedPermissionIds.length} selected)
                </label>
              </div>

              {loading ? (
                <div className="py-8 text-center text-sm text-slate-500">Loading permissions...</div>
              ) : (
                <div className="space-y-4 pt-2">
                  {Object.entries(permissionsByModule).map(([moduleName, perms]) => {
                    const allInModuleSelected = perms.every((p) => selectedPermissionIds.includes(p.id));
                    return (
                      <div
                        key={moduleName}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5 dark:border-slate-700/60">
                          <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {moduleName} Module
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleModulePermissions(perms)}
                            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                          >
                            {allInModuleSelected ? "Deselect Module" : "Select All in Module"}
                          </button>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {perms.map((perm) => {
                            const isSelected = selectedPermissionIds.includes(perm.id);
                            return (
                              <div
                                key={perm.id}
                                onClick={() => togglePermission(perm.id)}
                                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition ${
                                  isSelected
                                    ? "border-indigo-300 bg-indigo-50/60 text-slate-900 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300"
                                }`}
                              >
                                <span className="mt-0.5 text-indigo-600 dark:text-indigo-400">
                                  {isSelected ? <CheckSquare size={16} /> : <Square size={16} className="text-slate-400" />}
                                </span>
                                <div>
                                  <p className="font-mono text-xs font-bold leading-tight">{perm.name}</p>
                                  {perm.description && (
                                    <p className="text-[11px] text-slate-500">{perm.description}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : role ? "Update Role" : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
