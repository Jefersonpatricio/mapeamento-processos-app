"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2, Save, Trash2, TriangleAlert, X } from "lucide-react";
import { useDepartments } from "@/hooks/use-departments";
import {
  useProcesses,
  formTypeToApi,
  formCriticalityToApi,
} from "@/hooks/use-processes";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  department: z.string().min(1, "Selecione um departamento."),
  criticality: z.enum(["baixa", "media", "alta"], {
    message: "Selecione um nível de criticidade.",
  }),
  processType: z.enum(["sistematico", "manual"], {
    message: "Selecione o tipo do processo.",
  }),
  parentId: z.string().optional().or(z.literal("")),
  title: z
    .string()
    .min(2, "O nome do processo deve conter pelo menos 2 caracteres.")
    .max(32, "O nome do processo deve conter no máximo 32 caracteres."),
  tools: z
    .array(z.string())
    .min(1, "Adicione pelo menos um sistema ou ferramenta."),
  responsibles: z
    .array(z.string())
    .min(1, "Adicione pelo menos um responsável."),
  documentLink: z
    .string()
    .url("Insira uma URL válida")
    .optional()
    .or(z.literal("")),
  files: z.array(z.instanceof(File)).optional(),
  active: z.boolean().optional(),
  description: z
    .string()
    .min(20, "A descrição deve conter pelo menos 20 caracteres.")
    .max(100, "A descrição deve conter no máximo 100 caracteres."),
});

type FormData = z.infer<typeof formSchema>;

interface NewProcessFormProps {
  initialData?: Partial<FormData>;
  mode?: "create" | "edit";
  processId?: string;
  parentLabel?: string;
}

export function NewProcessForm({
  initialData,
  mode = "create",
  processId,
  parentLabel,
}: NewProcessFormProps = {}) {
  const router = useRouter();
  const { departments, loading: loadingDepts } = useDepartments();
  const { createProcess, updateProcess, deleteProcess } = useProcesses();
  const [toolsInput, setToolsInput] = React.useState("");
  const [responsiblesInput, setResponsiblesInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: initialData?.department || "",
      criticality: initialData?.criticality || undefined,
      processType: initialData?.processType || undefined,
      parentId: initialData?.parentId || "",
      title: initialData?.title || "",
      tools: initialData?.tools || [],
      responsibles: initialData?.responsibles || [],
      documentLink: initialData?.documentLink || "",
      files: initialData?.files || [],
      description: initialData?.description || "",
      active: initialData?.active ?? true,
    },
  });

  const parentIdValue = form.watch("parentId");
  const processTitle = form.watch("title");
  const parentLabelValue = parentLabel?.trim() || "";
  const isParentLinked = Boolean(parentIdValue);

  const { processes } = useProcesses();
  const currentProcess =
    mode === "edit" && processId
      ? processes.find((p) => p.id === processId)
      : undefined;
  const isParent = !!currentProcess && currentProcess.childCount > 0;
  const subprocessCount = currentProcess?.childCount;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const dto = {
        name: data.title,
        type: formTypeToApi(data.processType),
        criticality: formCriticalityToApi(data.criticality),
        description: data.description,
        departmentId: data.department,
        ...(data.parentId ? { parentId: data.parentId } : {}),
        tools: data.tools,
        responsibles: data.responsibles,
        ...(data.documentLink ? { documentLink: data.documentLink } : {}),
        ...(mode === "edit" ? { active: data.active ?? true } : {}),
      };

      if (mode === "edit" && processId) {
        await updateProcess(processId, dto);
        toast.success("Processo atualizado com sucesso!");
      } else {
        await createProcess(dto);
        toast.success("Processo criado com sucesso!");
      }
      router.push("/auth/dashboard/processes");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar processo.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteConfirmed() {
    if (mode === "edit" && processId) {
      setIsDeleting(true);
      try {
        await deleteProcess(processId);
        toast.success("Processo apagado com sucesso!");
        router.push("/auth/dashboard/processes");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao apagar processo.",
        );
      } finally {
        setIsDeleting(false);
        setShowDeleteDialog(false);
      }
    }
  }

  return (
    <>
      <Card className="w-full border-0 md:border md:border-primary">
        <CardHeader></CardHeader>
        <CardContent className="max-h-[calc(100vh-300px)] overflow-y-auto custom-scroll scroll-smooth scroll-pt-4">
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <input type="hidden" {...form.register("parentId")} />
            <div className="space-y-4">
              <Controller
                name="department"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-department">
                      Departamento
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isParentLinked}
                    >
                      <SelectTrigger
                        className="w-full"
                        disabled={isParentLinked}
                      >
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Departamentos</SelectLabel>
                          {loadingDepts ? (
                            <SelectItem value="__loading" disabled>
                              Carregando...
                            </SelectItem>
                          ) : (
                            departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      Selecione o departamento responsável por este processo.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 mb-4">
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Nome do Processo
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-rhf-demo-title"
                          aria-invalid={fieldState.invalid}
                          placeholder="Nome do novo processo"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {parentIdValue ? (
                  <div className="sm:col-span-2">
                    <Field>
                      <FieldLabel htmlFor="form-rhf-demo-parentId">
                        Macroprocesso
                      </FieldLabel>
                      <Input
                        id="form-rhf-demo-parentId"
                        value={parentLabelValue || parentIdValue}
                        readOnly
                        disabled
                      />
                      <FieldDescription>
                        Este processo será criado como subprocesso do
                        macroprocesso selecionado.
                      </FieldDescription>
                    </Field>
                  </div>
                ) : null}

                <Controller
                  name="criticality"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Nível de Criticidade</FieldLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <div className="flex flex-wrap gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="baixa"
                              id="criticality-baixa"
                            />
                            <Label htmlFor="criticality-baixa">Baixa</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="media"
                              id="criticality-media"
                            />
                            <Label htmlFor="criticality-media">Média</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="alta"
                              id="criticality-alta"
                            />
                            <Label htmlFor="criticality-alta">Alta</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="mb-6" />

                <Controller
                  name="processType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Tipo de Processo</FieldLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <div className="flex flex-wrap gap-5 mb-4">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="sistematico"
                              id="processType-sistematico"
                            />
                            <Label htmlFor="processType-sistematico">
                              Sistemático
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="manual"
                              id="processType-manual"
                            />
                            <Label htmlFor="processType-manual">Manual</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="sm:col-span-2">
                  <Controller
                    name="tools"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const handleKeyDown = (
                        e: React.KeyboardEvent<HTMLInputElement>,
                      ) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = toolsInput.trim();
                          if (value && !field.value.includes(value)) {
                            field.onChange([...field.value, value]);
                            setToolsInput("");
                          }
                        } else if (
                          e.key === "Backspace" &&
                          !toolsInput &&
                          field.value.length > 0
                        ) {
                          field.onChange(field.value.slice(0, -1));
                        }
                      };

                      const removeTag = (tagToRemove: string) => {
                        field.onChange(
                          field.value.filter((tag) => tag !== tagToRemove),
                        );
                      };

                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            Sistemas e ferramentas utilizadas
                          </FieldLabel>
                          <div className="flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            {field.value.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="ml-1 rounded-sm opacity-70 hover:opacity-100"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              value={toolsInput}
                              onChange={(e) => setToolsInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder={
                                field.value.length === 0
                                  ? "Nome da ferramenta..."
                                  : ""
                              }
                              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-30"
                            />
                          </div>
                          <FieldDescription>
                            Digite o nome da ferramenta e pressione Enter para
                            adicionar.
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Controller
                    name="responsibles"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const handleKeyDown = (
                        e: React.KeyboardEvent<HTMLInputElement>,
                      ) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = responsiblesInput.trim();
                          if (value && !field.value.includes(value)) {
                            field.onChange([...field.value, value]);
                            setResponsiblesInput("");
                          }
                        } else if (
                          e.key === "Backspace" &&
                          !responsiblesInput &&
                          field.value.length > 0
                        ) {
                          field.onChange(field.value.slice(0, -1));
                        }
                      };

                      const removeTag = (tagToRemove: string) => {
                        field.onChange(
                          field.value.filter((tag) => tag !== tagToRemove),
                        );
                      };

                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Responsáveis pelo processo</FieldLabel>
                          <div className="flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            {field.value.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="ml-1 rounded-sm opacity-70 hover:opacity-100"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              value={responsiblesInput}
                              onChange={(e) =>
                                setResponsiblesInput(e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              placeholder={
                                field.value.length === 0
                                  ? "Nome do responsável..."
                                  : ""
                              }
                              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-30"
                            />
                          </div>
                          <FieldDescription>
                            Preencha com os responsáveis e pressione Enter para
                            adicionar.
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>

                <Controller
                  name="documentLink"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-documentLink">
                        Link do documento (opcional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-documentLink"
                        aria-invalid={fieldState.invalid}
                        placeholder="https://exemplo.com/documento"
                        autoComplete="off"
                        type="url"
                      />
                      <FieldDescription>
                        Cole o link de um documento associado a este processo.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="files"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-files">
                        Upload de Documentos (opcional)
                      </FieldLabel>
                      <label
                        htmlFor="form-rhf-demo-files"
                        className="flex items-center justify-center w-full px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {Array.isArray(field.value) &&
                            field.value.length > 0
                              ? `${field.value.length} arquivo(s) selecionado(s)`
                              : "Escolher arquivos..."}
                          </span>
                        </div>
                        <input
                          id="form-rhf-demo-files"
                          type="file"
                          multiple
                          onChange={(e) => {
                            const files = e.target.files
                              ? Array.from(e.target.files)
                              : [];
                            field.onChange(files);
                          }}
                          className="hidden"
                        />
                      </label>
                      <FieldDescription>
                        Envie múltiplos documentos relacionados ao processo
                        (PDF, Word, etc).
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {mode === "edit" && (
                  <div className="sm:col-span-2">
                    <Controller
                      name="active"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <div className="flex items-center justify-between rounded-lg border border-input px-4 py-3">
                            <div className="space-y-0.5">
                              <FieldLabel
                                htmlFor="form-rhf-demo-active"
                                className="cursor-pointer"
                              >
                                Status do processo
                              </FieldLabel>
                              <FieldDescription>
                                {field.value
                                  ? "Processo ativo"
                                  : "Processo inativo"}
                              </FieldDescription>
                            </div>
                            <Switch
                              id="form-rhf-demo-active"
                              checked={field.value ?? true}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </Field>
                      )}
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-description">
                          Descrição do processo
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="form-rhf-demo-description"
                            placeholder="Descreva o processo detalhadamente"
                            rows={3}
                            className="resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {field.value.length}/100 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="gap-12 pt-6 items-center justify-center">
          {mode === "edit" && (
            <Button
              variant="destructive"
              className="text-white"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLoading}
            >
              <Trash2 />
              Apagar processo
            </Button>
          )}
          <Button type="submit" form="form-rhf-demo" disabled={isLoading}>
            {isLoading && <Spinner data-icon="inline-start" />}
            {isLoading
              ? mode === "edit"
                ? "Salvando..."
                : "Enviando..."
              : mode === "edit"
                ? "Salvar processo"
                : "Enviar"}
            <Save />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(v) => !isDeleting && setShowDeleteDialog(v)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <TriangleAlert className="size-5 text-destructive" />
              </div>
              <div className="flex flex-col gap-1">
                <AlertDialogTitle className="leading-tight">
                  Apagar processo
                </AlertDialogTitle>
                <span className="inline-flex w-fit items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                  Ação permanente
                </span>
              </div>
            </div>
            <AlertDialogDescription asChild>
              <div className="mt-1 space-y-2 text-sm text-muted-foreground">
                <p>
                  Deseja realmente apagar o processo{" "}
                  <span className="font-semibold text-foreground">
                    {processTitle || "sem nome"}
                  </span>
                  ?
                </p>
                {isParent ? (
                  <p className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-destructive">
                    Este processo possui{" "}
                    <strong>
                      {subprocessCount} subprocesso
                      {subprocessCount === 1 ? "" : "s"}
                    </strong>{" "}
                    e todos serão apagados junto.
                  </p>
                ) : (
                  <p>Esta ação não pode ser desfeita.</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-2 flex-row justify-between">
            <AlertDialogCancel disabled={isDeleting} className="mt-0">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirmed();
              }}
              className="gap-2 bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {isDeleting ? "Apagando..." : "Apagar processo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
