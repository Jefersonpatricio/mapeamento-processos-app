"use client";

import * as React from "react";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/sidebar";
import { UserProvider } from "@/app/contexts/user-context";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
    <UserProvider>
      <SidebarProvider>
        <AuthContent>{children}</AuthContent>
      </SidebarProvider>
    </UserProvider>
  );
}
