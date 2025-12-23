import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="ml-0 md:ml-64 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
