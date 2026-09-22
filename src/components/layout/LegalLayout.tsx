import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Container } from "../ui/Container";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />
      <main className="flex-1 py-section">
        <Container className="max-w-3xl">
          <h1 className="font-display text-display-lg text-ink">{title}</h1>
          <p className="mt-xs font-body text-body-sm text-ink-soft">last updated {updated}</p>
          <div className="prose-legal mt-xxl flex flex-col gap-lg font-body text-body-md text-ink-soft [&_h2]:font-display [&_h2]:text-display-sm [&_h2]:text-ink [&_ul]:list-disc [&_ul]:pl-lg [&_li]:mt-xxs">
            {children}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
