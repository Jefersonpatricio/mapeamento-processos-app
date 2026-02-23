import {
  LayoutGrid,
  MessageSquare,
  FileText,
  Calendar,
  Ticket,
  CheckSquare,
  UserPlus,
  BookOpen,
  Rss,
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
    title: "Applications",
    items: [
      {
        name: "Chat",
        icon: MessageSquare,
        href: "/chat",
      },
      {
        name: "Note",
        icon: FileText,
        href: "/notes",
        badge: "active",
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        name: "Dashboard",
        icon: HomeIcon,
        href: "/auth/dashboard",
      },
      {
        name: "Calendar",
        icon: Calendar,
        href: "/calendar",
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
  {
    title: "Additional",
    items: [
      {
        name: "Register",
        icon: UserPlus,
        href: "/register",
      },
      {
        name: "Documentation",
        icon: BookOpen,
        href: "/docs",
      },
      {
        name: "Blog",
        icon: Rss,
        href: "/blog",
      },
    ],
  },
];

// Helper to get the section icon
export const sectionIcons: Record<string, LucideIcon> = {
  Applications: LayoutGrid,
  Pages: FileText,
  Additional: BookOpen,
};
