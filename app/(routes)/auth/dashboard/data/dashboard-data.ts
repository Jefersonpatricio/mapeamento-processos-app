export interface StatCard {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
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
  action: "create" | "edit" | "navigate";
  icon: string;
  href?: string;
}

export interface Department {
  id: string;
  name: string;
  processCount: number;
  systemicCount: number;
  manualCount: number;
  icon: string;
  color: string;
}

export const recentActivityData: RecentActivity[] = [
  {
    id: "1",
    user: "Maria Silva",
    action: "criou o processo",
    target: "Onboarding de Colaboradores",
    time: "há 2 minutos",
  },
  {
    id: "2",
    user: "João Santos",
    action: "editou o processo",
    target: "Avaliação de Fornecedores",
    time: "há 15 minutos",
  },
  {
    id: "3",
    user: "Ana Costa",
    action: "adicionou documentação em",
    target: "Fechamento Contábil",
    time: "há 1 hora",
  },
  {
    id: "4",
    user: "Pedro Lima",
    action: "revisou o processo",
    target: "Gestão de Estoque",
    time: "há 2 horas",
  },
  {
    id: "5",
    user: "Carla Oliveira",
    action: "criou o departamento",
    target: "Jurídico",
    time: "há 3 horas",
  },
];

export const departmentsData: Department[] = [
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
    name: "Comercial",
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
    title: "Novo processo",
    description: "Mapeie um novo processo para um departamento",
    action: "navigate",
    icon: "Cog",
    href: "/auth/dashboard/processes/new",
  },
  {
    title: "Ver processos",
    description: "Visualize e gerencie todos os processos cadastrados",
    action: "navigate",
    icon: "List",
    href: "/auth/dashboard/processes",
  },
  {
    title: "Novo departamento",
    description: "Crie um novo departamento para organizar seus processos",
    action: "create",
    icon: "Plus",
  },
  {
    title: "Editar departamento",
    description: "Edite ou apague um departamento existente",
    action: "edit",
    icon: "Edit",
  },
];
