"use client";

import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import React, { useEffect, useId, useRef, useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  FileText,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  X,
} from "lucide-react";
import { assets } from "@/assets/assets";
import Profile from "./Profile";
import Image from "next/image";

type SidebarProps = { children: React.ReactNode };
export type SidebarItemProps = {
  label: string;
  active: boolean;
  icon?: React.ReactNode;
  path: string;
  badge?: string | number;
};

export type NavigationContextValue = {
  collapsed: boolean;
  nested: boolean;
  query: string;
};
const NavigationContext = React.createContext<NavigationContextValue>({
  collapsed: false,
  nested: false,
  query: "",
});
const useNavigationContext = () => React.useContext(NavigationContext);
const sidebarStorageKey = "admin-sidebar-collapsed";


const Sidbar: React.FC<SidebarProps> = ({ children }) => {
  const { user } = useAppContext();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(sidebarStorageKey) === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(sidebarStorageKey, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!isDesktop || !collapsed) {
          setMobileOpen(true);
          window.setTimeout(() => searchInputRef.current?.focus(), 0);
        }
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [collapsed, isDesktop]);

  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  const closeMobile = () => setMobileOpen(false);
  const expanded = !isDesktop || !collapsed;

  return (
    <NavigationContext.Provider
      value={{ collapsed: isDesktop && collapsed, nested: false, query }}
    >
      {!mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-4 z-60 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm outline-none transition duration-200 hover:bg-slate-50 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
      )}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px] md:hidden"
        />
      )}
      <aside
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-xl shadow-slate-950/5 transition-transform duration-200 motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-950 md:sticky md:top-0 md:z-30 md:h-screen md:shadow-none md:transition-[width] md:duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${collapsed ? "w-18 md:w-18" : "w-70 md:w-70"}`}
      >
        <header className="sticky top-0 z-10 shrink-0 border-b border-slate-100 bg-white px-3.5 py-3.5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/dashboard"
              onClick={closeMobile}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-xl outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-900"
              aria-label="ViraDev workspace dashboard"
            >
              <Image width={120} height={0} src={assets.brand} alt="brand" />
            </Link>
            <button
              type="button"
              onClick={() =>
                isDesktop ? setCollapsed((value) => !value) : closeMobile()
              }
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 outline-none transition duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label={
                isDesktop
                  ? collapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
                  : "Close navigation menu"
              }
            >
              {!mounted ? (
                <Menu size={18} />
              ) : isDesktop ? (
                collapsed ? (
                  <PanelLeftOpen size={18} />
                ) : (
                  <PanelLeftClose size={18} />
                )
              ) : (
                <X size={18} />
              )}
            </button>
          </div>
          {expanded ? (
            <label
              className="group relative mt-3 flex items-center"
              aria-label="Search navigation"
            >
              <Search
                size={16}
                className="pointer-events-none absolute left-3 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                className="h-9.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-9 pr-12 text-sm font-medium text-slate-900 outline-none transition duration-200 placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="Search..."
              />
              <kbd className="pointer-events-none absolute right-2.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                ⌘K
              </kbd>
            </label>
          ) : (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="mt-3 inline-flex h-9.5 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 outline-none hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              title="Search (Ctrl K)"
              aria-label="Expand sidebar to search navigation"
            >
              <Search size={18} />
            </button>
          )}
        </header>
        {/* CRITICAL FIX: Conditional padding + overflow-x-hidden */}
        <nav
          className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-4 ${collapsed ? "px-2" : "px-4"} [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-indigo-400 [&::-webkit-scrollbar-button]:hidden`}
          aria-label="Primary navigation"
        >
          <div className="space-y-1.5">{children}</div>
        </nav>
        <footer className="sticky bottom-0 shrink-0 border-t border-slate-100 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950">
          <div className="space-y-1 border-b border-slate-100 pb-3 dark:border-slate-800">
            <FooterItem
              href="/admin/setting"
              icon={<Settings size={18} />}
              label="Settings"
              onClick={closeMobile}
            />
            <FooterItem icon={<CircleHelp size={18} />} label="Help" />
            <FooterItem icon={<FileText size={18} />} label="Documentation" />
          </div>
          <button
            type="button"
            className={`mt-3 flex w-full items-center gap-3 rounded-xl p-2 text-left outline-none transition duration-200 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:hover:bg-slate-800 ${collapsed ? "justify-center" : ""}`}
            aria-label="Open user profile menu"
          >
            <Profile
              fullName={user?.fullName || "Anonymous"}
              className="h-9.5 min-h-9.5 w-9.5 min-w-9.5 text-sm font-semibold"
            />
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                  {user?.fullName || "Admin user"}
                </span>
                <span className="block truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                  {user?.email || "admin@example.com"}
                </span>
              </span>
            )}
            {!collapsed && <ChevronDown size={16} className="text-slate-400" />}
          </button>
        </footer>
      </aside>
    </NavigationContext.Provider>
  );
};

type FooterItemProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
};
const FooterItem = ({ icon, label, href, onClick }: FooterItemProps) => {
  const { collapsed } = useNavigationContext();
  const className = `flex h-9.5 w-full items-center gap-3 rounded-lg text-sm font-semibold text-slate-700 outline-none transition duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${collapsed ? "justify-center px-0" : "px-2.5"}`;
  const content = (
    <>
      <span className="shrink-0 text-slate-500" aria-hidden="true">
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  );
  return href ? (
    <Link
      href={href}
      onClick={onClick}
      className={className}
      aria-label={label}
      title={collapsed ? label : undefined}
    >
      {content}
    </Link>
  ) : (
    <button
      type="button"
      className={className}
      aria-label={label}
      title={collapsed ? label : undefined}
    >
      {content}
    </button>
  );
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active,
  path,
  badge,
}) => {
  const { collapsed, nested, query } = useNavigationContext();
  if (query && !label.toLowerCase().includes(query.toLowerCase())) return null;

  const colors = active
    ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 font-bold dark:bg-indigo-500/10 dark:text-indigo-300"
    : "border-transparent text-slate-700 hover:bg-slate-100/80 hover:text-slate-950 font-semibold dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

  return (
    <Link
      href={path}
      className={`group box-border flex h-10 max-w-full items-center gap-3 overflow-hidden rounded-lg border-l-[3px] text-sm outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-indigo-600 motion-reduce:transition-none ${colors} ${collapsed ? "justify-center border-transparent px-0" : "px-3"} ${nested && !collapsed ? "h-9" : ""}`}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
    >
      <span
        className={`shrink-0 transition-colors duration-200 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200"}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!collapsed && badge !== undefined && (
        <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-bold leading-none text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default Sidbar;