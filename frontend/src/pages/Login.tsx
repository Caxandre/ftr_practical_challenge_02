import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, UserRoundPlus } from "lucide-react";
import { Input, Button } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await signIn(values);
      navigate("/", { replace: true });
    } catch {
      setFormError("E-mail ou senha inválidos");
    }
  };

  return (
    <main className="flex min-h-full flex-col items-center px-4 pb-8 pt-[34px]">
      <img className="mb-[25px] h-7 w-auto" src="/Logo.png" alt="Financy" />

      <section className="w-full max-w-[371px] rounded-xl border border-gray-200 bg-white px-[26px] pb-[26px] pt-[27px]">
        <header className="text-center">
          <h1 className="text-base font-semibold leading-5 text-gray-800">Fazer login</h1>
          <p className="mt-1.5 text-sm leading-5 text-gray-500">Entre na sua conta para continuar</p>
        </header>

        <form className="mt-[27px]" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-3">
            <Input
              label="E-mail"
              type="email"
              icon={Mail}
              placeholder="mail@exemplo.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Senha"
              type="password"
              icon={Lock}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs leading-4">
            <label className="flex cursor-pointer items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-gray-300 accent-brand-base"
                {...register("remember")}
              />
              Lembrar-me
            </label>
            <button type="button" className="font-medium text-brand-base hover:text-brand-dark">
              Recuperar senha
            </button>
          </div>

          {formError && <p className="mt-3 text-xs text-feedback-danger">{formError}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-5 h-10 w-full">
            Entrar
          </Button>
        </form>

        <div className="mb-[21px] mt-7 flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          ou
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="mb-3 text-center text-xs leading-4 text-gray-500">
          Ainda não tem uma conta?
        </p>
        <RouterLink
          to="/cadastro"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <UserRoundPlus size={16} aria-hidden />
          Criar conta
        </RouterLink>
      </section>
    </main>
  );
}
