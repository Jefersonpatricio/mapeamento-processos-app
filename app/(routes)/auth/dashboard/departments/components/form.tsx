"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

const setores = [
  { value: "financeiro", label: "Financeiro" },
  { value: "rh", label: "Recursos Humanos" },
  { value: "ti", label: "Tecnologia da Informação" },
  { value: "comercial", label: "Comercial" },
  { value: "marketing", label: "Marketing" },
  { value: "operacoes", label: "Operações" },
];

const formSchema = z.object({
  sector: z.string().min(1, "Selecione um setor."),
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
  systems: z
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
  const [systemsInput, setSystemsInput] = React.useState("");
  const [responsiblesInput, setResponsiblesInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sector: initialData?.sector || "",
      criticality: initialData?.criticality || undefined,
      processType: initialData?.processType || undefined,
      parentId: initialData?.parentId || "",
      title: initialData?.title || "",
      systems: initialData?.systems || [],
      responsibles: initialData?.responsibles || [],
      documentLink: initialData?.documentLink || "",
      files: initialData?.files || [],
      description: initialData?.description || "",
    },
  });

  const parentIdValue = form.watch("parentId");
  const parentLabelValue = parentLabel?.trim() || "";
  const isParentLinked = Boolean(parentIdValue);

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(
      mode === "edit" ? "Editando processo:" : "Criando processo:",
      data,
    );
    if (mode === "edit" && processId) {
      console.log("ID do processo:", processId);
    }

    // Simula o envio dos dados
    setTimeout(() => {
      toast(
        mode === "edit"
          ? "Processo atualizado com sucesso!"
          : "Processo criado com sucesso!",
        {
          description: (
            <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
          position: "bottom-right",
          classNames: {
            content: "flex flex-col gap-2",
          },
          style: {
            "--border-radius": "calc(var(--radius)  + 4px)",
          } as React.CSSProperties,
        },
      );
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Card className="w-full border-0 md:border md:border-primary">
      <CardHeader></CardHeader>
      <CardContent className="max-h-[calc(100vh-300px)] overflow-y-auto custom-scroll scroll-smooth scroll-pt-4">
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <input type="hidden" {...form.register("parentId")} />
          <div className="space-y-4">
            <Controller
              name="sector"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-sector">Setor</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isParentLinked}
                  >
                    <SelectTrigger className="w-full" disabled={isParentLinked}>
                      <SelectValue placeholder="Selecione um setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Setores</SelectLabel>
                        {setores.map((setor) => (
                          <SelectItem key={setor.value} value={setor.value}>
                            {setor.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Selecione o setor responsável por este processo.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Nome do Processo - Full Width */}
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
                      Processo pai
                    </FieldLabel>
                    <Input
                      id="form-rhf-demo-parentId"
                      value={parentLabelValue || parentIdValue}
                      readOnly
                      disabled
                    />
                    <FieldDescription>
                      Este processo sera criado como filho do processo pai.
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
                          <RadioGroupItem value="alta" id="criticality-alta" />
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
                  name="systems"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const handleKeyDown = (
                      e: React.KeyboardEvent<HTMLInputElement>,
                    ) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = systemsInput.trim();
                        if (value && !field.value.includes(value)) {
                          field.onChange([...field.value, value]);
                          setSystemsInput("");
                        }
                      } else if (
                        e.key === "Backspace" &&
                        !systemsInput &&
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
                            value={systemsInput}
                            onChange={(e) => setSystemsInput(e.target.value)}
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
                          {Array.isArray(field.value) && field.value.length > 0
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
                      Envie múltiplos documentos relacionados ao processo (PDF,
                      Word, etc).
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

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
      <CardFooter className="gap-2 pt-6 items-center justify-center">
        <Button
          className="w-28"
          type="submit"
          form="form-rhf-demo"
          disabled={isLoading}
        >
          {isLoading && <Spinner data-icon="inline-start" />}
          {isLoading
            ? mode === "edit"
              ? "Salvando..."
              : "Enviando..."
            : mode === "edit"
              ? "Salvar"
              : "Enviar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
