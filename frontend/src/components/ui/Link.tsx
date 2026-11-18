import type { AnchorHTMLAttributes } from "react";
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";
import { cn } from "../../lib/cn";

const linkClass = "text-sm font-medium text-brand-base underline-offset-2 hover:text-brand-dark hover:underline";

export function Link({ className, ...props }: RouterLinkProps) {
  return <RouterLink className={cn(linkClass, className)} {...props} />;
}

export function AnchorLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn(linkClass, className)} {...props} />;
}
