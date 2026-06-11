"use client";

import {
  Bell,
  CreditCard,
  Globe2,
  Save,
  Settings,
  Store,
  Truck,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

const mockSettings = {
  storeName: "ViraDev Store",
  supportEmail: "support@viradev.store",
  phone: "+855 12 345 678",
  address: "Phnom Penh, Cambodia",
  currency: "USD",
  timezone: "Asia/Phnom_Penh",
  lowStockAlert: 12,
  freeShippingMinimum: 99,
  taxRate: 10,
  notifications: {
    newOrders: true,
    lowStock: true,
    weeklyReport: false,
  },
  payments: {
    cashOnDelivery: true,
    khqrBakong: true,
    cardPayment: false,
  },
};

type StoreSettings = typeof mockSettings;

export default function SettingAdminPage() {
  const [settings, setSettings] = useState<StoreSettings>(mockSettings);

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const updateNestedToggle = (
    group: "notifications" | "payments",
    field: string,
    checked: boolean,
  ) => {
    setSettings((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: checked,
      },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Mock settings payload:", settings);
    toast.success("Settings saved with mock data.");
  };

  return (
    <section className="min-h-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-orange-600">
              <Settings size={16} />
              Settings
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Store settings</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Settings page for store profile, payments, shipping, security, and notifications.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Save size={18} />
            Save settings
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]">
          <div className="space-y-6">
            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<Store size={20} />} title="Store profile" description="Public business information." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input label="Store name" name="storeName" value={settings.storeName} onChange={updateField} />
                <Input label="Support email" name="supportEmail" type="email" value={settings.supportEmail} onChange={updateField} />
                <Input label="Phone" name="phone" value={settings.phone} onChange={updateField} />
                <Input label="Address" name="address" value={settings.address} onChange={updateField} />
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<Globe2 size={20} />} title="Localization" description="Currency, tax, and reporting defaults." />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <Select label="Currency" name="currency" value={settings.currency} onChange={updateField} options={["USD", "KHR"]} />
                <Select label="Timezone" name="timezone" value={settings.timezone} onChange={updateField} options={["Asia/Phnom_Penh", "UTC"]} />
                <Input label="Tax rate (%)" name="taxRate" type="number" value={settings.taxRate} onChange={updateField} />
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<Truck size={20} />} title="Shipping and stock" description="Operational thresholds for fulfillment." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input label="Low stock alert" name="lowStockAlert" type="number" value={settings.lowStockAlert} onChange={updateField} />
                <Input label="Free shipping minimum" name="freeShippingMinimum" type="number" value={settings.freeShippingMinimum} onChange={updateField} />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<CreditCard size={20} />} title="Payments" description="Enabled payment methods." />
              <div className="mt-5 space-y-3">
                <Toggle label="Cash on delivery" checked={settings.payments.cashOnDelivery} onChange={(checked) => updateNestedToggle("payments", "cashOnDelivery", checked)} />
                <Toggle label="KHQR Bakong" checked={settings.payments.khqrBakong} onChange={(checked) => updateNestedToggle("payments", "khqrBakong", checked)} />
                <Toggle label="Card payment" checked={settings.payments.cardPayment} onChange={(checked) => updateNestedToggle("payments", "cardPayment", checked)} />
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={<Bell size={20} />} title="Notifications" description="Admin alert preferences." />
              <div className="mt-5 space-y-3">
                <Toggle label="New order alerts" checked={settings.notifications.newOrders} onChange={(checked) => updateNestedToggle("notifications", "newOrders", checked)} />
                <Toggle label="Low stock alerts" checked={settings.notifications.lowStock} onChange={(checked) => updateNestedToggle("notifications", "lowStock", checked)} />
                <Toggle label="Weekly report" checked={settings.notifications.weeklyReport} onChange={(checked) => updateNestedToggle("notifications", "weeklyReport", checked)} />
              </div>
            </section>
          </div>
        </div>
      </form>
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
      <div className="rounded-lg bg-orange-50 p-2 text-orange-600 ring-1 ring-orange-100">{icon}</div>
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
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
        className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
      />
    </label>
  );
}
