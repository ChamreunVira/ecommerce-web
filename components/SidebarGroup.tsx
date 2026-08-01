import { ChevronRight } from "lucide-react";
import React, { useId, useState } from "react";
import { NavigationContextValue, SidebarItemProps } from "./Sidbar";

type SidebarGroupProps = {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const NavigationContext = React.createContext<NavigationContextValue>({
  collapsed: false,
  nested: false,
  query: "",
});
const useNavigationContext = () => React.useContext(NavigationContext);

const groupStorageKey = (label: string) =>
  `admin-sidebar-group-${label.toLowerCase().replace(/\s+/g, "-")}`;

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
      typeof child.props.label === "string" &&
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
          className={`flex h-10 w-full items-center justify-center rounded-lg text-slate-600 outline-none transition duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-600 motion-reduce:transition-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white ${groupIsOpen ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white" : ""}`}
          aria-expanded={groupIsOpen}
          aria-controls={contentId}
          aria-label={`${label} navigation`}
          title={label}
        >
          <span aria-hidden="true">{icon}</span>
        </button>
        {/* Flyout */}
        <div
          id={contentId}
          className={`absolute left-[calc(100%+8px)] top-0 z-100 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10 transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${groupIsOpen ? "visible translate-x-0 opacity-100" : "invisible pointer-events-none -translate-x-1 opacity-0"}`}
        >
          <p className="whitespace-nowrap px-2 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
    <section className="pt-2 first:pt-0">
      <button
        type="button"
        onClick={toggle}
        className="flex h-9 w-full text-[14px] font-semibold text-slate-700 hover:text-slate-950 items-center justify-between gap-3 rounded-lg px-3 text-left outline-none transition duration-200 hover:bg-slate-100/70 focus-visible:ring-2 focus-visible:ring-indigo-600 motion-reduce:transition-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
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
          size={14}
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
            <div className="mt-1 space-y-1 border-l-2 border-slate-200/70 pl-2.5 ml-3 dark:border-slate-700">
              {children}
            </div>
          </NavigationContext.Provider>
        </div>
      </div>
    </section>
  );
};

export default SidebarGroup;