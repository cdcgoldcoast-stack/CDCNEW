"use client";

import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type BlogShellProps = {
  children: ReactNode;
};

export default function BlogShell({ children }: BlogShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-16 pt-24 md:pt-32">{children}</main>
      <Footer />
    </div>
  );
}
