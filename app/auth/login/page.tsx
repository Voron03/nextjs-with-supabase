import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 relative overflow-hidden text-gray-900">

      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50 to-white" />

      {/* glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-200/30 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200/20 blur-3xl rounded-full" />

      <div className="relative w-full max-w-md">
        <LoginForm />
      </div>

    </div>
  );
}
