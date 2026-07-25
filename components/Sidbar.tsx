"use client";

import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import React, { useEffect, useId, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  LayoutGridIcon,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  X,
} from "lucide-react";
import Profile from "./Profile";

type SidebarProps = { children: React.ReactNode };
type SidebarItemProps = {
  label: string;
  active: boolean;
  icon?: React.ReactNode;
  path: string;
  badge?: string | number;
};
type SidebarGroupProps = {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};
type NavigationContextValue = {
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
const groupStorageKey = (label: string) =>
  `admin-sidebar-group-${label.toLowerCase().replace(/\s+/g, "-")}`;

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
          className="fixed left-4 top-4 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm outline-none transition duration-200 hover:bg-slate-50 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
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
        className={`fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-xl shadow-slate-950/5 transition-transform duration-200 motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-950 md:sticky md:top-0 md:z-30 md:h-screen md:shadow-none md:transition-[width] md:duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${collapsed ? "w-[72px] md:w-[72px]" : "w-[280px] md:w-[280px]"}`}
      >
        <header className="sticky top-0 z-10 shrink-0 border-b border-slate-100 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              onClick={closeMobile}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="ViraDev workspace dashboard"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                <LayoutGridIcon size={19} />
              </span>
              {!collapsed && (
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold tracking-[-0.01em] text-slate-950 dark:text-white">
                    ViraDev
                  </span>
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                    Commerce workspace
                  </span>
                </span>
              )}
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
                size={15}
                className="pointer-events-none absolute left-3 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-9 pr-12 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="Search"
              />
              <kbd className="pointer-events-none absolute right-2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                ⌘K
              </kbd>
            </label>
          ) : (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-600 dark:border-slate-700 dark:bg-slate-900"
              title="Search (Ctrl K)"
              aria-label="Expand sidebar to search navigation"
            >
              <Search size={17} />
            </button>
          )}
        </header>
        {/* CRITICAL FIX: Conditional padding + overflow-x-hidden */}
        <nav
          className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-4 ${collapsed ? "px-2" : "px-6"} [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-indigo-400 [&::-webkit-scrollbar-button]:hidden`}
          aria-label="Primary navigation"
        >
          <div className="space-y-1">{children}</div>
        </nav>
        <footer className="sticky bottom-0 shrink-0 border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
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
              className="h-9 min-h-9 w-9 min-w-9 text-sm"
            />
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {user?.fullName || "Admin user"}
                </span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
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
  const className = `flex h-9 w-full items-center gap-3 rounded-lg text-sm font-medium text-slate-600 outline-none transition duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${collapsed ? "justify-center px-0" : "px-2"}`;
  const content = (
    <>
      <span className="shrink-0" aria-hidden="true">
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
    ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
    : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

  return (
    <Link
      href={path}
      /* CRITICAL FIXES FOR COLLAPSED STATE:
         - box-border: padding included in width
         - max-w-full: never exceed container
         - overflow-hidden: clip anything that overflows
         - collapsed: remove border-l-2 and horizontal padding */
      className={`group box-border flex h-10 max-w-full items-center gap-3 overflow-hidden rounded-lg border-l-2 text-[14px] outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none ${colors} ${active ? "font-semibold" : "font-medium"} ${collapsed ? "justify-center border-transparent px-0" : "px-3"} ${nested && !collapsed ? "h-9" : ""}`}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
    >
      <span
        className={`shrink-0 transition-colors duration-200 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200"}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!collapsed && badge !== undefined && (
        <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {badge}
        </span>
      )}
    </Link>
  );
};

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  label,
  icon,
  children,
  defaultOpen = false,
}) => {
  const { collapsed, query } = useNavigationContext();
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return defaultOpen;
    const saved = window.localStorage.getItem(groupStorageKey(label));
    return saved === null ? defaultOpen : saved === "true";
  });
  const contentId = useId();
  const toggle = () =>
    setOpen((previous) => {
      const next = !previous;
      window.localStorage.setItem(groupStorageKey(label), String(next));
      return next;
    });
  const hasMatchingChild = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement<SidebarItemProps>(child) &&
      child.props.label.toLowerCase().includes(query.toLowerCase()),
  );
  const matchesGroup =
    !query ||
    label.toLowerCase().includes(query.toLowerCase()) ||
    hasMatchingChild;
  const childQuery = label.toLowerCase().includes(query.toLowerCase())
    ? ""
    : query;
  const groupIsOpen = query ? true : open;

  if (collapsed)
    return (
      <div className="relative">
        <button
          type="button"
          onClick={toggle}
          className={`flex h-10 w-full items-center justify-center rounded-lg text-slate-500 outline-none transition duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white ${groupIsOpen ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white" : ""}`}
          aria-expanded={groupIsOpen}
          aria-controls={contentId}
          aria-label={`${label} navigation`}
          title={label}
        >
          <span aria-hidden="true">{icon}</span>
        </button>
        {/* Flyout: higher z-index, pointer-events toggle */}
        <div
          id={contentId}
          className={`absolute left-[calc(100%+8px)] top-0 z-[100] w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10 transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${groupIsOpen ? "visible translate-x-0 opacity-100" : "invisible pointer-events-none -translate-x-1 opacity-0"}`}
        >
          <p className="whitespace-nowrap px-2 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            {label}
          </p>
          <NavigationContext.Provider
            value={{ collapsed: false, nested: true, query: childQuery }}
          >
            <div className="space-y-1">{children}</div>
          </NavigationContext.Provider>
        </div>
      </div>
    );

  if (!matchesGroup) return null;
  return (
    <section className="pt-3 first:pt-0">
      <div className="bg-slate-100 dark:bg-slate-800" />
      <button
        type="button"
        onClick={toggle}
        className="flex h-9 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-[14px] text-slate-700 outline-none transition duration-200 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        aria-expanded={groupIsOpen}
        aria-controls={contentId}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-slate-400" aria-hidden="true">
            {icon}
          </span>
          <span className="truncate">{label}</span>
        </span>
        <ChevronRight
          size={15}
          className={`shrink-0 transition-transform duration-200 ${groupIsOpen ? "rotate-90" : ""}`}
        />
      </button>
      <div
        id={contentId}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${groupIsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <NavigationContext.Provider
            value={{ collapsed: false, nested: true, query: childQuery }}
          >
            <div className="mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700">
              {children}
            </div>
          </NavigationContext.Provider>
        </div>
      </div>
    </section>
  );
};

export default Sidbar;