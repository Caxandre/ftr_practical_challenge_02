import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { cn } from "../../lib/cn";
import { toCents, centsToInputValue } from "../../lib/formatCurrency";
import { toDateInputValue } from "../../lib/formatDate";
import { Dialog, FilterSelect, Input, Button } from "../ui";
import { transactionSchema, type TransactionFormValues } from "../../schemas/transaction.schema";
import {
  CREATE_TRANSACTION_MUTATION,
  UPDATE_TRANSACTION_MUTATION,
} from "../../graphql/mutations/transaction";
import { DASHBOARD_QUERY } from "../../graphql/queries/dashboard";
import { CATEGORIES_QUERY } from "../../graphql/queries/categories";
import { TRANSACTIONS_QUERY } from "../../graphql/queries/transactions";
import type { Category } from "../../hooks/useCategories";
import type { Transaction } from "../../hooks/useTransactions";

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  transaction?: Transaction | null;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  categories,
  transaction,
}: TransactionFormDialogProps) {
  const isEditing = Boolean(transaction);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "EXPENSE", description: "", amount: "", date: "", categoryId: "" },
  });

  useEffect(() => {
    if (open) {
      reset(
        transaction
          ? {
              type: transaction.type,
              description: transaction.description,
              amount: centsToInputValue(transaction.amount),
              date: toDateInputValue(transaction.date),
              categoryId: transaction.category.id,
            }
          : { type: "EXPENSE", description: "", amount: "", date: "", categoryId: "" }
      );
    }
  }, [open, transaction, categories, reset]);

  const refetchQueries = [DASHBOARD_QUERY, CATEGORIES_QUERY, TRANSACTIONS_QUERY];

  const [createTransaction] = useMutation(CREATE_TRANSACTION_MUTATION, { refetchQueries });
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION_MUTATION, { refetchQueries });

  const type = watch("type");
  const categoryId = watch("categoryId");

  const onSubmit = async (values: TransactionFormValues) => {
    const input = {
      description: values.description,
      amount: toCents(values.amount),
      type: values.type,
      date: new Date(values.date).toISOString(),
      categoryId: values.categoryId,
    };

    if (isEditing && transaction) {
      await updateTransaction({ variables: { id: transaction.id, data: input } });
    } else {
      await createTransaction({ variables: { data: input } });
    }

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Editar transação" : "Nova transação"}
      description={isEditing ? "Atualize os dados da transação" : "Registre sua despesa ou receita"}
      contentClassName="transaction-dialog"
    >
      <form className="transaction-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="transaction-type-switch">
          {(["EXPENSE", "INCOME"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setValue("type", option)}
              className={cn(
                "transaction-type-option",
                type === option ? (option === "EXPENSE" ? "is-expense" : "is-income") : ""
              )}
            >
              {option === "EXPENSE" ? <CircleArrowDown size={14} aria-hidden /> : <CircleArrowUp size={14} aria-hidden />}
              {option === "EXPENSE" ? "Despesa" : "Receita"}
            </button>
          ))}
        </div>

        <Input
          label="Descrição"
          placeholder="Ex: Almoço no restaurante"
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="transaction-date-value-grid">
          <Input label="Data" type="date" error={errors.date?.message} {...register("date")} />
          <Input
            label="Valor"
            inputMode="decimal"
            placeholder="0,00"
            leftElement={<span className="transaction-currency-prefix">R$</span>}
            error={errors.amount?.message}
            {...register("amount")}
          />
        </div>

        <FilterSelect
          label="Categoria"
          value={categoryId}
          error={errors.categoryId?.message}
          onChange={(value) => setValue("categoryId", value, { shouldDirty: true, shouldValidate: true })}
          options={[
            { value: "", label: "Selecione uma categoria" },
            ...categories.map((category) => ({ value: category.id, label: category.name })),
          ]}
        />

        <Button type="submit" disabled={isSubmitting} className="transaction-save-button w-full">
          Salvar
        </Button>
      </form>
    </Dialog>
  );
}
