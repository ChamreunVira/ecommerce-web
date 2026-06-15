"use client";

import { userService } from "@/services/user-service";
import { CheckIcon } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import AdminModal from "./AdminModal";

type AddUserModalType = {
  onCreateSuccess: () => void;
  handleClose: () => void;
};

type UserFormData = {
  fullName: string;
  email: string;
  password: string;
  roles: string[];
};

const roles = [
  { label: "Admin", value: "ROLE_ADMIN" },
  { label: "Seller", value: "ROLE_SELLER" },
  { label: "Customer", value: "ROLE_CUSTOMER" },
];

export default function AddUserModal({
  handleClose,
  onCreateSuccess,
}: AddUserModalType) {
  const [userData, setUserData] = useState<UserFormData>({
    fullName: "",
    email: "",
    password: "",
    roles: ["ROLE_CUSTOMER"],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUserFieldsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((current) => ({ ...current, [name]: value }));
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setUserData((current) => {
      const nextRoles = checked
        ? [...new Set([...current.roles, role])]
        : current.roles.filter((item) => item !== role);

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
        onCreateSuccess();
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
      description="Add a customer, seller, or admin account."
      onClose={handleClose}
      maxWidth="max-w-xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            form="create-user-form"
            type="submit"
            disabled={isSaving || userData.roles.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckIcon size={16} />
            {isSaving ? "Creating..." : "Create user"}
          </button>
        </div>
      }
    >
      <form id="create-user-form" onSubmit={handleCreateUser} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            onChange={handleUserFieldsChange}
            placeholder="Chamreun Vira"
            name="fullName"
            value={userData.fullName}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            onChange={handleUserFieldsChange}
            placeholder="user@example.com"
            name="email"
            value={userData.email}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            onChange={handleUserFieldsChange}
            placeholder="Minimum 8 characters"
            name="password"
            value={userData.password}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            required
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">Roles</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {roles.map((role) => (
              <label
                key={role.value}
                className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={userData.roles.includes(role.value)}
                  onChange={(event) => handleRoleChange(role.value, event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                {role.label}
              </label>
            ))}
          </div>
        </fieldset>
      </form>
    </AdminModal>
  );
}
