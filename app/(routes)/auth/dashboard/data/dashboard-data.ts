export interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface Sector {
  id: string;
  name: string;
  processCount: number;
  systemicCount: number;
  manualCount: number;
  icon: string;
  color: string;
}

export const statsData: StatCard[] = [
  {
    title: "Mapeados",
    value: "15",
    change: "+12.5%",
    changeType: "positive",
    icon: "Users",
  },
  {
    title: "Total de Processos",
    value: "19",
    change: "+3.2%",
    changeType: "positive",
    icon: "FolderOpen",
  },
  {
    title: "Processos Sistêmicos",
    value: "12",
    change: "-8.1%",
    changeType: "negative",
    icon: "Cpu",
  },
  {
    title: "Processos Manuais",
    value: "7",
    change: "+18.2%",
    changeType: "positive",
    icon: "Wrench",
  },
];

export const recentActivityData: RecentActivity[] = [
  {
    id: "1",
    user: "Maria Silva",
    action: "created",
    target: "Project Alpha",
    time: "2 minutes ago",
  },
  {
    id: "2",
    user: "João Santos",
    action: "updated",
    target: "Invoice #1234",
    time: "15 minutes ago",
  },
  {
    id: "3",
    user: "Ana Costa",
    action: "completed",
    target: "Task: Design Review",
    time: "1 hour ago",
  },
  {
    id: "4",
    user: "Pedro Lima",
    action: "commented on",
    target: "Ticket #567",
    time: "2 hours ago",
  },
  {
    id: "5",
    user: "Carla Oliveira",
    action: "assigned",
    target: "Bug Fix #890",
    time: "3 hours ago",
  },
];

export const sectorsData: Sector[] = [
  {
    id: "1",
    name: "RH",
    processCount: 5,
    systemicCount: 3,
    manualCount: 2,
    icon: "Users",
    color: "primary",
  },
  {
    id: "2",
    name: "Vendas",
    processCount: 8,
    systemicCount: 5,
    manualCount: 3,
    icon: "ShoppingCart",
    color: "emerald",
  },
  {
    id: "3",
    name: "Tecnologia",
    processCount: 4,
    systemicCount: 3,
    manualCount: 1,
    icon: "Monitor",
    color: "blue",
  },
  {
    id: "4",
    name: "Marketing",
    processCount: 2,
    systemicCount: 1,
    manualCount: 1,
    icon: "Megaphone",
    color: "purple",
  },
];

export const quickActionsData: QuickAction[] = [
  {
    title: "New Project",
    description: "Create a new project workspace",
    href: "/auth/projects/new",
    icon: "Plus",
  },
  {
    title: "Add User",
    description: "Invite team members",
    href: "/users/invite",
    icon: "UserPlus",
  },
  {
    title: "Create Ticket",
    description: "Submit a support request",
    href: "/tickets/new",
    icon: "Ticket",
  },
  {
    title: "Schedule Meeting",
    description: "Set up a calendar event",
    href: "/calendar/new",
    icon: "Calendar",
  },
];
