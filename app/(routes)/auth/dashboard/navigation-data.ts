import {
  BarChart3,
  Building2,
  Cog,
  FileText,
  type LucideIcon,
  HomeIcon,
  Settings,
  Users,
  GitBranch,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  disabled?: boolean;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const navigationData: NavigationSection[] = [
  {
    title: "Principal",
    items: [
      {
        name: "Dashboard",
        icon: HomeIcon,
        href: "/auth/dashboard",
      },
      {
        name: "Processos",
        icon: Cog,
        href: "/auth/dashboard/processes",
      },
      {
        name: "Departamentos",
        icon: Building2,
        href: "/auth/dashboard/departments",
      },
    ],
  },
  {
    title: "Análise",
    items: [
      {
        name: "Fluxogramas",
        icon: GitBranch,
        href: "/auth/dashboard/flowcharts",
        disabled: true,
      },
      {
        name: "Relatórios",
        icon: FileText,
        href: "/auth/dashboard/reports",
        disabled: true,
      },
      {
        name: "Indicadores",
        icon: BarChart3,
        href: "/auth/dashboard/indicators",
        disabled: true,
      },
    ],
  },
  {
    title: "Administração",
    items: [
      {
        name: "Usuários",
        icon: Users,
        href: "/auth/dashboard/users",
        disabled: true,
      },
      {
        name: "Configurações",
        icon: Settings,
        href: "/auth/dashboard/settings",
        disabled: true,
      },
    ],
  },
];

// Helper to get the section icon
export const sectionIcons: Record<string, LucideIcon> = {
  Principal: HomeIcon,
  Análise: FileText,
  Administração: Settings,
};
