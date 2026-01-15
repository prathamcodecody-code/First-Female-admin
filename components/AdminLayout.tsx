import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./Sidebar"), {
  ssr: false,
  loading: () => null, // or small skeleton
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Sidebar />
      <main className="ml-0 md:ml-64 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
