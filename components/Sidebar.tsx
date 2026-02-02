"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Folder,
  Package,
  ShoppingCart,
  MessageSquare,
  Percent,
  Star,
  Settings,
  Menu,
  X,
  PenIcon,
  PersonStanding,
  SplinePointer,
   Phone,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const LinkItem = (href: string, label: string, Icon: React.ElementType) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`
        flex items-center gap-3 px-6 py-3 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all duration-300
        ${
          pathname === href
            ? "bg-brandPink text-white shadow-lg shadow-brandPink/20"
            : "text-gray-500 hover:bg-brandPink/5 hover:text-brandPink"
        }
      `}
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center px-4 z-40">
        <button onClick={() => setOpen(true)} className="p-2 text-brandBlack">
          <Menu size={24} />
        </button>
        <h1 className="ml-2 font-black uppercase tracking-tighter italic font-serif text-brandPink">
          Admin
        </h1>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white
          border-r flex flex-col z-50
          transform transition-transform duration-500 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* TOP: BRANDING */}
        <div className="p-6 border-b border-gray-50 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-4 md:hidden text-gray-400"
          >
            <X size={20} />
          </button>

          <h1 className="text-xl font-black uppercase tracking-tighter italic font-serif text-brandPink">
            First<span className="text-brandBlack">Female</span>
          </h1>
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">Management Portal</p>
        </div>

        {/* MIDDLE: SCROLLABLE NAVIGATION */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {LinkItem("/dashboard", "Dashboard", LayoutDashboard)}
          <div className="h-px bg-gray-50 my-4 mx-2" /> {/* Section Divider */}
          {LinkItem("/categories", "Categories", Folder)}
          {LinkItem("/products", "Products", Package)}
          {LinkItem("/orders", "Orders", ShoppingCart)}
          {LinkItem("/homepage", "Edit Home", PenIcon)}
          {LinkItem("/coupons", "Coupons", SplinePointer)}
          {LinkItem("/feedback", "Feedback", MessageSquare)}
          {LinkItem("/contacts", "Contacts", Phone)}
          {LinkItem("/users", "Users", PersonStanding)}
          {LinkItem("/discounts", "Discounts", Percent)}
          {LinkItem("/trending", "Trending", Star)}
          {LinkItem("/reviews", "Reviews", Star)}
          {LinkItem("/settings", "Settings", Settings)}
        </div>

        {/* BOTTOM: FIXED LOGOUT */}
        <div className="p-6 border-t border-gray-50 bg-white">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full px-6 py-4 rounded-sm bg-brandBlack text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 transition-all shadow-xl active:scale-95"
          >
            Logout Session
          </button>
        </div>
      </aside>

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl p-8 w-full max-w-sm border-t-4 border-brandPink">
            <h3 className="text-sm font-black uppercase tracking-widest mb-2 text-brandBlack">
              Confirm Logout
            </h3>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight mb-8">
              You will need to re-authenticate to access the admin portal.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/login");
                }}
                className="w-full py-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest"
              >
                Logout Now
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


