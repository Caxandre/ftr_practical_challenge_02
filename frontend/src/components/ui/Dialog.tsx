import type { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";
import { cn } from "../../lib/cn";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, contentClassName, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-gray-800/50 data-[state=open]:animate-in data-[state=open]:fade-in" />
        <RadixDialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none",
            contentClassName
          )}
        >
          <div className="dialog-header mb-5 flex items-start justify-between">
            <div>
              <RadixDialog.Title className="dialog-title text-lg font-semibold text-gray-800">
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="dialog-description mt-1 text-sm text-gray-500">
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close asChild>
              <IconButton icon={X} className="dialog-close" aria-label="Fechar" />
            </RadixDialog.Close>
          </div>

          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
