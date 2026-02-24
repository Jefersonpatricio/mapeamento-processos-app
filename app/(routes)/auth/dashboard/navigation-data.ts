import {
  MessageSquare,
  FileText,
  Cog,
  Ticket,
  CheckSquare,
  type LucideIcon,
  HomeIcon,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const navigationData: NavigationSection[] = [
  {
    title: "Pages",
    items: [
      {
        name: "Dashboard",
        icon: HomeIcon,
        href: "/auth/dashboard",
      },
      {
        name: "Gestão de processos",
        icon: Cog,
        href: "/auth/dashboard/processes",
      },
      {
        name: "Invoice",
        icon: FileText,
        href: "/invoices",
      },
      {
        name: "Tickets",
        icon: Ticket,
        href: "/tickets",
      },
      {
        name: "Taskboard",
        icon: CheckSquare,
        href: "/tasks",
      },
    ],
  },
];

// Helper to get the section icon
export const sectionIcons: Record<string, LucideIcon> = {
  Pages: FileText,
};
