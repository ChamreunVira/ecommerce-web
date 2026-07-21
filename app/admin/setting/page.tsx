"use client";

import {
  Bell,
  CreditCard,
  Globe2,
  Save,
  Settings,
  Store,
  Truck,
  UserCircle,
  Calendar,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { http } from "@/lib/axios";

type StoreSettings = {
  id: number,
  name: string,
  supportEmail: string,
  phone: string,
  address: string,
  currency: string,
  timeZone: string,
  lowStockAlert: number,
  freeShippingMinimum: number,
  taxRate: number,
  notificationNewOrders: boolean,
  notificationLowStock: boolean,
  notificationWeeklyReport: boolean,
  paymentCod: boolean,
  paymentKhqr: boolean,
  paymentCard: boolean
};

type PersonalProfile = {
  fullName: string;
  personalEmail: string;
  phoneNumber: string;
  bio: string;
  dateOfBirth: string;
};

const defaultProfile: PersonalProfile = {
  fullName: "Admin Virak",
  personalEmail: "virak@vst4rekh.com",
  phoneNumber: "+855 12 345 678",
  bio: "Store administrator responsible for managing products, orders, and customers.",
  dateOfBirth: "1995-06-15",
};

export default function SettingAdminPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [profile, setProfile] = useState<PersonalProfile>(defaultProfile);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const updateProfile = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setSettings((prev) => prev ? {...prev, [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value } : null);
  };

  const handleFetchSettings = async () => {
    try {
      const response = await http.get(process.env.NEXT_PUBLIC_BASE_URL + "/settings");
      if (response) {
        setSettings(response.data.data[0]);
      }
    } catch (err: any) {
      console.log("Failed to fetch settings", err);
      toast.error("Failed to fetch settings.");
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await http.get(process.env.NEXT_PUBLIC_BASE_URL + "/settings");
      if (response) {
        setSettings(response.data.data[0]);
        toast.success("Settings saved successfully!");
      }
    } catch (err: any) {
      console.log("Failed to save settings", err);
      toast.error("Failed to save settings.");
    }
  };

  useEffect(() => {
    handleFetchSettings();
    return () => new AbortController().abort();
  }, []);

  return (
    <section className="min-h-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-indigo-600">
              <Settings size={16} />
              Settings
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Store settings</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Settings page for store profile, payments, shipping, security, and notifications.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Change Password
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              <Save size={18} />
              Save settings
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]">
          <div className="space-y-6">

            {/* Personal Profile */}
            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<UserCircle size={20} />} title="Personal Profile" description="Your personal account details and public-facing info." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input label="Full Name" name="fullName" value={profile.fullName} onChange={updateProfile} />
                <Input label="Email" name="personalEmail" type="email" value={profile.personalEmail} onChange={updateProfile} />
                <Input label="Phone Number" name="phoneNumber" value={profile.phoneNumber} onChange={updateProfile} />
                {/* Date of Birth with styled date picker */}
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-indigo-500" />
                    Date of Birth
                  </span>
                  <div className="relative mt-2">
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={updateProfile}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition appearance-none cursor-pointer focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </label>
                <div className="md:col-span-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Bio</span>
                    <textarea
                      name="bio"
                      rows={3}
                      value={profile.bio}
                      onChange={updateProfile}
                      placeholder="Write a short bio about yourself..."
                      className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<Store size={20} />} title="Store profile" description="Public business information." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input label="Store name" name="storeName" value={settings?.name || ""} onChange={updateField} />
                <Input label="Support email" name="supportEmail" type="email" value={settings?.supportEmail || ""} onChange={updateField} />
                <Input label="Phone" name="phone" value={settings?.phone || ""} onChange={updateField} />
                <Input label="Address" name="address" value={settings?.address || ""} onChange={updateField} />
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<Globe2 size={20} />} title="Localization" description="Currency, tax, and reporting defaults." />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <Select label="Currency" name="currency" value={settings?.currency || "USD"} onChange={updateField} options={["USD", "KHR"]} />
                <Select label="Timezone" name="timeZone" value={settings?.timeZone || "UTC"} onChange={updateField} options={["Asia/Phnom_Penh", "UTC"]} />
                <Input label="Tax rate (%)" name="taxRate" type="number" value={settings?.taxRate || ""} onChange={updateField} />
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<Truck size={20} />} title="Shipping and stock" description="Operational thresholds for fulfillment." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input label="Low stock alert" name="lowStockAlert" type="number" value={settings?.lowStockAlert || ""} onChange={updateField} />
                <Input label="Free shipping minimum" name="freeShippingMinimum" type="number" value={settings?.freeShippingMinimum || ""} onChange={updateField} />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<CreditCard size={20} />} title="Payments" description="Enabled payment methods." />
              <div className="mt-5 space-y-3">
                <Toggle label="Cash on delivery" checked={settings?.paymentCod || true} onChange={(checked) => setSettings(settings ? {...settings, paymentCod: checked} : null)} />
                <Toggle label="KHQR Bakong" checked={settings?.paymentKhqr || true} onChange={(checked) => setSettings(settings ? {...settings, paymentKhqr: checked} : null)} />
                <Toggle label="Card payment" checked={settings?.paymentCard || true} onChange={(checked) => setSettings(settings ? {...settings, paymentCard: checked} : null)} />
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<Bell size={20} />} title="Notifications" description="Admin alert preferences." />
              <div className="mt-5 space-y-3">
                <Toggle label="New order alerts" checked={settings?.notificationNewOrders || true} onChange={() => setSettings(settings ? {...settings, notificationNewOrders: !settings?.notificationNewOrders} : null)} />
                <Toggle label="Low stock alerts" checked={settings?.notificationLowStock || true} onChange={(checked) => setSettings(settings ? {...settings, notificationLowStock: checked} : null)} />
                <Toggle label="Weekly report" checked={settings?.notificationWeeklyReport || true} onChange={(checked) => setSettings(settings ? {...settings, notificationWeeklyReport: checked} : null)} />
              </div>
            </section>
          </div>
        </div>
      </form>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </section>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 ring-1 ring-indigo-100">{icon}</div>
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}

function Select({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
      />
    </label>
  );
}
