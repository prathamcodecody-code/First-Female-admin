"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import SectionCard from "@/components/common/SectionCard";
import AdminLayout from "@/components/AdminLayout";

export default function AdminHomepage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/homepage").then(res => {
      setSections(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading homepage sections...</p>;

  return (
    
    <AdminLayout>
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Homepage Sections</h1>
        <Link
          href="/homepage/create"
          className="px-4 py-2 bg-black text-white text-sm rounded"
        >
          + Add Section
        </Link>
      </div>

      <div className="space-y-4">
        {sections.map(section => (
          <SectionCard
            key={section.id}
            section={section}
            onUpdate={() => refresh(setSections)}
          />
        ))}
      </div>
    </div>
    </AdminLayout>
    );
}

async function refresh(setter: any) {
  const res = await api.get("/admin/homepage");
  setter(res.data);
}
