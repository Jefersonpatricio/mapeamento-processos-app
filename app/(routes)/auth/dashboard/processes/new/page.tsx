"use client";

import { useSearchParams } from "next/navigation";

import { NewProcessForm } from "../../departments/components/form";

export default function Page() {
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId") || "";
  const parentLabel = searchParams.get("parentLabel") || "";
  const parentSector = searchParams.get("parentSector") || "";
  const initialData = parentId ? { parentId, sector: parentSector } : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <NewProcessForm initialData={initialData} parentLabel={parentLabel} />
    </div>
  );
}
