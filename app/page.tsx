import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50/90 font-sans">
      <main className="flex-col min-h-screen w-full max-w-6xl items-center justify-between py-32 px-24 bg-white rounded-lg">
        <div className="h-full w-full">
          <Image
            src="/logo.png"
            alt="Mango consulting logo"
            width={200}
            height={40}
            priority
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-16 mt-24 justify-center">
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex flex-col gap-6">
              <h1 className="text-6xl font-semibold leading-16 tracking-tight text-black">
                Mapeamento de Processos para o seu negócio
              </h1>
              <h3 className="max-w-xl text-lg leading-7 text-zinc-600">
                Sua jornada para a excelência operacional começa aqui. Explore
                nossa maneira de {""}
                <strong>transformar processos</strong> e impulsionar o sucesso
                do seu negócio
              </h3>
            </div>
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 mt-12 text-background transition-colors hover:bg-primary-hover md:w-39.5"
              href="/auth/login"
            >
              Acesse agora
            </a>
          </div>
          <div className="flex h-96 w-full items-center justify-center flex-1 relative">
            <Image
              src="/mango.png"
              alt="Mango character"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
