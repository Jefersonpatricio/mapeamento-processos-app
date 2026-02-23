"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
];

const formSchema = z.object({
  sector: z.string().min(1, "Selecione um setor."),
  criticality: z.enum(["baixa", "media", "alta"], {
    message: "Selecione um nível de criticidade.",
  }),
  processType: z.enum(["sistematico", "manual"], {
    message: "Selecione o tipo do processo.",
  }),
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
  file: z.instanceof(File).optional(),
  description: z
    .string()
    .min(20, "A descrição deve conter pelo menos 20 caracteres.")
    .max(100, "A descrição deve conter no máximo 100 caracteres."),
});

export function BugReportForm() {
  const [systemsInput, setSystemsInput] = React.useState("");
  const [responsiblesInput, setResponsiblesInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sector: "",
      criticality: undefined,
      processType: undefined,
      title: "",
      systems: [],
      responsibles: [],
      documentLink: "",
      file: undefined,
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Dados do formulário:", data);

    // Simula o envio dos dados (aqui você faria a requisição para a API)
    setTimeout(() => {
      toast("You submitted the following values:", {
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
      });
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Card className="w-full border-primary">
      <CardHeader>
        <CardTitle>Detalhamento de novo processo</CardTitle>
        <CardDescription>
          Informe os detalhes do novo processo que deseja mapear.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Setor */}
            <Controller
              name="sector"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-sector">Setor</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
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

              {/* Criticidade */}
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

              {/* Tipo de Processo */}
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

              {/* Sistemas - Full Width */}
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

              {/* Responsáveis - Full Width */}
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
                          Digite o nome do responsável e pressione Enter para
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

              {/* Link do Documento */}
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

              {/* Upload de Arquivo */}
              <Controller
                name="file"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-file">
                      Upload de Arquivo (opcional)
                    </FieldLabel>
                    <input
                      id="form-rhf-demo-file"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <FieldDescription>
                      Envie um documento relacionado ao processo (PDF, Word,
                      etc).
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Descrição - Full Width */}
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
          {isLoading ? "Enviando..." : "Enviar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
