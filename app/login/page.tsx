import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-0 bg-amber-50/90">
      <div className="-mb-16 z-10">
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
      </div>
      <div className="bg-white rounded-lg shadow-md px-16 py-24">
        <LoginForm />
      </div>
    </div>
  );
}
