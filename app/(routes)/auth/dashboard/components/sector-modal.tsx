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

interface SectorModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialValue?: string;
}

export function SectorModal({
  isOpen,
  mode,
  onClose,
  onSubmit,
  initialValue = "",
}: SectorModalProps) {
  const [sectorName, setSectorName] = useState(initialValue);

  // Atualiza o valor quando o modal abre com um novo initialValue
  useEffect(() => {
    setSectorName(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sectorName.trim()) {
      onSubmit(sectorName);
      setSectorName("");
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSectorName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo Setor" : "Editar Setor"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Crie um novo setor para organizar seus processos."
              : "Atualize as informações do setor selecionado."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sector-name">Nome do Setor</Label>
            <Input
              id="sector-name"
              placeholder="Ex: RH, Comercial, Tecnologia..."
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
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
            <Button type="submit" disabled={!sectorName.trim()}>
              {mode === "create" ? "Criar" : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
