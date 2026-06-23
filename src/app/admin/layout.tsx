import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <Sidebar role="SUPER_ADMIN" />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}
