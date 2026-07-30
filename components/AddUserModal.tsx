"use client";

import { roleService } from "@/services/role-service";
import { userService } from "@/services/user-service";
import { Role } from "@/types/role";
import { CheckIcon } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminModal from "./AdminModal";

type AddUserModalType = {
  onCreateSuccessAction: () => void;
  handleCloseAction: () => void;
};

type UserFormData = {
  fullName: string;
  email: string;
  password: string;
  roles: string[];
};

export default function AddUserModal({
  handleCloseAction,
  onCreateSuccessAction,
}: AddUserModalType) {
  const [userData, setUserData] = useState<UserFormData>({
    fullName: "",
    email: "",
    password: "",
    roles: ["ROLE_CUSTOMER"],
  });
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const res = await roleService.getAllRoles();
        if (res.success && res.data) {
          setAvailableRoles(res.data);
        }
      } catch (err) {
        console.error("Failed to load roles:", err);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleUserFieldsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((current) => ({ ...current, [name]: value }));
  };

  const handleRoleChange = (roleName: string, checked: boolean) => {
    setUserData((current) => {
      const nextRoles = checked
        ? [...new Set([...current.roles, roleName])]
        : current.roles.filter((item) => item !== roleName);

      return { ...current, roles: nextRoles };
    });
  };

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await userService.create(userData);
      if (response.success) {
        toast.success("User added successfully.");
        onCreateSuccessAction();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add user.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminModal
      title="Create user"
      description="Add a customer, seller, or custom role account."
      onClose={handleCloseAction}
      maxWidth="max-w-xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCloseAction}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            form="create-user-form"
            type="submit"
            disabled={isSaving || userData.roles.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckIcon size={16} />
            {isSaving ? "Creating..." : "Create user"}
          </button>
        </div>
      }
    >
      <form id="create-user-form" onSubmit={handleCreateUser} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            onChange={handleUserFieldsChange}
            placeholder="Chamreun Vira"
            name="fullName"
            value={userData.fullName}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            onChange={handleUserFieldsChange}
            placeholder="user@example.com"
            name="email"
            value={userData.email}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            onChange={handleUserFieldsChange}
            placeholder="Minimum 8 characters"
            name="password"
            value={userData.password}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">Assign Roles</legend>
          {loadingRoles ? (
            <p className="mt-2 text-xs text-slate-400">Loading dynamic roles...</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {availableRoles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <input
                    type="checkbox"
                    checked={userData.roles.includes(role.name)}
                    onChange={(event) => handleRoleChange(role.name, event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="font-mono text-xs font-bold truncate">{role.name}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
      </form>
    </AdminModal>
  );
}
