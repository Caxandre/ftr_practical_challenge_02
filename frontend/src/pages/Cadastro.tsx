import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Mail, Lock, UserRound } from "lucide-react";
import { Input, Button } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { signUpSchema, type SignUpFormValues } from "../schemas/auth.schema";

export function Cadastro() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (values: SignUpFormValues) => {
    setFormError(null);
    try {
      await signUp(values);
      navigate("/", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível criar a conta";
      setFormError(message.includes("cadastrado") ? "E-mail já cadastrado" : message);
    }
  };

  return (
    <main className="flex min-h-full flex-col items-center px-4 pb-8 pt-10">
      <img className="mb-[27px] h-7 w-auto" src="/Logo.png" alt="Financy" />

      <section className="w-full max-w-[371px] rounded-xl border border-gray-200 bg-white px-[26px] pb-[26px] pt-[27px]">
        <header className="text-center">
          <h1 className="text-base font-semibold leading-5 text-gray-800">Criar conta</h1>
          <p className="mt-1.5 text-sm leading-5 text-gray-500">
            Comece a controlar suas finanças ainda hoje
          </p>
        </header>

        <form className="mt-[27px]" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Input
              label="Nome completo"
              icon={UserRound}
              placeholder="Seu nome completo"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="E-mail"
              type="email"
              icon={Mail}
              placeholder="mail@exemplo.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <div>
              <Input
                label="Senha"
                type="password"
                icon={Lock}
                placeholder="Digite sua senha"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />
              {!errors.password && (
                <p className="mt-1.5 text-[10px] leading-3.5 text-gray-500">
                  A senha deve ter no mínimo 8 caracteres
                </p>
              )}
            </div>
          </div>

          {formError && <p className="mt-3 text-xs text-feedback-danger">{formError}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-[15px] h-10 w-full">
            Cadastrar
          </Button>
        </form>

        <div className="mb-[21px] mt-5 flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          ou
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="mb-3 text-center text-xs leading-4 text-gray-500">
          Já tem uma conta?
        </p>
        <RouterLink
          to="/"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <LogIn size={16} aria-hidden />
          Fazer login
        </RouterLink>
      </section>
    </main>
  );
}
