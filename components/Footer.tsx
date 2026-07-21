import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

type FooterItems = {
  category: string;
  items: { label: string; path: string }[];
};

const footer: FooterItems[] = [
  {
    category: "Company",
    items: [
      { label: "Home", path: "/" },
      { label: "Shop", path: "/all-product" },
      { label: "About us", path: "/" },
      { label: "Contact us", path: "/" },
    ],
  },
  {
    category: "Support",
    items: [
      { label: "Shipping", path: "/" },
      { label: "Returns", path: "/" },
      { label: "Privacy policy", path: "/" },
      { label: "Help center", path: "/" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="app-container py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image className="w-20 object-contain" src={assets.brand} alt="brand" />
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
              Clean shopping for everyday tech, accessories, and essentials with
              simple checkout and reliable local delivery.
            </p>
          </div>

          {footer.map((section) => (
            <div key={section.category}>
              <h2 className="text-sm font-semibold text-slate-950">
                {section.category}
              </h2>
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li key={`${section.category}-${item.label}`}>
                    <Link
                      href={item.path}
                      className="text-sm text-slate-500 transition hover:text-indigo-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500 md:flex-row md:items-center">
          <p>© 2026 Ecommerce App. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span>(097) 3056 7474</span>
            <span>virachamreun@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
