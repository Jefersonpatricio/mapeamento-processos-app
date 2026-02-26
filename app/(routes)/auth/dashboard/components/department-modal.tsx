"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DepartmentModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialValue?: string;
}

export function DepartmentModal({
  isOpen,
  mode,
  onClose,
  onSubmit,
  initialValue = "",
}: DepartmentModalProps) {
  const [departmentName, setDepartmentName] = useState(initialValue);

  useEffect(() => {
    setDepartmentName(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (departmentName.trim()) {
      onSubmit(departmentName);
      setDepartmentName("");
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDepartmentName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo Departamento" : "Editar Departamento"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Crie um novo departamento para organizar seus processos."
              : "Atualize as informações do departamento selecionado."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department-name">Nome do Departamento</Label>
            <Input
              id="department-name"
              placeholder="Ex: RH, Comercial, Tecnologia..."
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!departmentName.trim()}>
              {mode === "create" ? "Criar" : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
