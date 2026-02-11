import type { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[--app-bg] text-[--app-fg] transition-colors">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
        {children}
      </div>
    </div>
  );
}
