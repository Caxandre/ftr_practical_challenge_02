import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, UserRound } from "lucide-react";
import { Input, Button } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { profileSchema, type ProfileFormValues } from "../schemas/auth.schema";
import { UPDATE_PROFILE_MUTATION } from "../graphql/mutations/auth";

export function Perfil() {
  const { user, setUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", password: "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email, password: "" });
  }, [user, reset]);

  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION);

  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const onSubmit = async (values: ProfileFormValues) => {
    setSuccess(false);
    setError(null);
    try {
      const result = await updateProfile({
        variables: {
          data: {
            name: values.name,
          },
        },
      });
      if (result.data?.updateProfile) {
        setUser(result.data.updateProfile);
        setSuccess(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível salvar as alterações";
      setError(message.includes("cadastrado") ? "E-mail já cadastrado" : message);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="profile-page flex justify-center">
      <section className="profile-card w-full border border-gray-200 bg-white px-6 py-7">
        <header className="flex flex-col items-center text-center">
          <div className="profile-avatar flex items-center justify-center rounded-full bg-gray-300 text-base font-medium text-gray-800">
            {initials}
          </div>
          <h1 className="mt-5 text-base font-semibold leading-5 text-gray-800">{user?.name}</h1>
          <p className="mt-1 text-xs text-gray-500">{user?.email}</p>
        </header>

        <div className="profile-divider bg-gray-200" />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Nome completo"
            icon={UserRound}
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="mt-3">
            <Input
              label="E-mail"
              type="email"
              icon={Mail}
              readOnly
              aria-readonly="true"
              error={errors.email?.message}
              {...register("email")}
            />
            <p className="profile-email-helper mt-1.5 text-gray-500">O e-mail não pode ser alterado</p>
          </div>

          {success && <p className="mt-3 text-xs text-feedback-success">Alterações salvas com sucesso.</p>}
          {error && <p className="mt-3 text-xs text-feedback-danger">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="profile-save-button mt-6 w-full">
            Salvar alterações
          </Button>
          <Button
            type="button"
            variant="outline"
            className="profile-logout-button mt-3 w-full"
            onClick={handleSignOut}
          >
            <LogOut size={16} aria-hidden />
            Sair da conta
          </Button>
        </form>
      </section>
    </div>
  );
}
