"use client";

import { DashboardHeader } from "./components/dashboard-header";
import { HeaderProvider } from "./components/header-context";
import { useAuth } from "@/app/contexts/auth-context";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  let headerConfig = {
    title: `Olá, ${user?.name || "Usuário"}`,
    description:
      "Bem-vindo de volta! Aqui está uma visão geral das suas atividades recentes e estatísticas.",
    showLastUpdated: true,
  };

  if (pathname.includes("/departments/new")) {
    headerConfig = {
      title: "Detalhamento de novo processo",
      description: "Informe os detalhes do novo processo que deseja mapear.",
      showLastUpdated: false,
    };
  }

  if (
    pathname === "/auth/dashboard/departments" ||
    pathname === "/dashboard/departments"
  ) {
    headerConfig = {
      title: "Departamentos",
      description:
        "Gerencie os departamentos da sua organização e seus processos.",
      showLastUpdated: false,
    };
  }

  if (pathname.includes("/dashboard/processes")) {
    headerConfig = {
      title: "Gestão de processos",
      description: "Crie novos e veja os detalhes dos seus processos.",
      showLastUpdated: false,
    };
  }

  if (pathname.includes("/dashboard/processes/new")) {
    headerConfig = {
      title: "Criação de novo processo",
      description: "Informe os detalhes do novo processo que deseja mapear.",
      showLastUpdated: false,
    };
  } else if (/\/dashboard\/processes\/[^/]+\/edit/.test(pathname)) {
    headerConfig = {
      title: "Edição de processo",
      description: "Edite os detalhes do processo selecionado.",
      showLastUpdated: false,
    };
  }

  return (
    <HeaderProvider {...headerConfig}>
      <div className="min-h-screen bg-background">
        <DashboardHeader {...headerConfig} />
        {children}
      </div>
    </HeaderProvider>
  );
}
