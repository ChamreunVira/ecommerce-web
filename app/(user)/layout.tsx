"use client";

import CartSidbar from "@/components/CartSidbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar handleToggleCartSidebar={() => setCartOpen(true)} />
      <CartSidbar open={cartOpen} setOpen={setCartOpen} />
      {children}
      <Footer />
    </>
  );
}
