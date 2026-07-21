"use client";

import { Save } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import AdminModal from "./AdminModal";
import { User } from "@/types/user";
import { userService } from "@/services/user-service";

type UserFormData = Omit<User, "id" | "refreshToken" | "accessToken" | "createdAt" | "updatedAt">;

type UpdateCategoryModalProps = {
  user: User;
  onClose: () => void;
  onUpdated: () => void;
};

export default function UpdateCustomerModal({
  user,
  onClose,
  onUpdated,
}: UpdateCategoryModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: user.fullName,
    email: user.email,
    password: '',
    roles: [...user.roles]
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await userService.update(user.id, formData);
      if (response.success) {
        toast.success("Customer updated successfully.");
        onUpdated();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update customer.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminModal
      title="Update Cusomter"
      description="update customer."
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            form="update-category-form"
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      }
    >
      <form id="update-category-form" onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
            Fullname
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500"
            placeholder="Category name"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500"
            placeholder="Category name"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="text"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500"
            placeholder="Category name"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="role">
            Role
          </label>
        </div>
      
      </form>
    </AdminModal>
  );
}
