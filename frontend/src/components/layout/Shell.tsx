import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full">
      <Navbar />
      <main className="app-main px-10 py-10 max-sm:px-4 max-sm:py-6">{children}</main>
    </div>
  );
}
