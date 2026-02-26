"use client";

import * as React from "react";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath={pathname} />
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-sidebar",
          collapsed ? "ml-20" : "ml-70",
        )}
      >
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <SidebarProvider>
      <AuthContent>{children}</AuthContent>
      <Toaster duration={2000} position="top-center" />
    </SidebarProvider>
  );
}
