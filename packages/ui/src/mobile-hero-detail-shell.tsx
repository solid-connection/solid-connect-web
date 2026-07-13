import type { ReactNode } from "react";

export type MobileHeroDetailStat = {
  key: string;
  content: ReactNode;
};

export type MobileHeroDetailShellProps = {
  background: ReactNode;
  logo: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  stats?: MobileHeroDetailStat[];
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  children: ReactNode;
};

export const MobileHeroDetailShell = ({
  background,
  logo,
  title,
  subtitle,
  stats = [],
  leftAction,
  rightAction,
  children,
}: MobileHeroDetailShellProps) => (
  <div className="relative min-h-screen bg-k-0">
    <section className="relative h-[236px] overflow-hidden bg-k-100">
      <div className="absolute inset-0">{background}</div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/60" />
      {leftAction || rightAction ? (
        <div className="absolute left-5 right-5 top-4 z-10 flex items-center justify-between gap-3">
          <div className="flex min-w-10 items-center justify-start">{leftAction}</div>
          <div className="flex min-w-10 items-center justify-end">{rightAction}</div>
        </div>
      ) : null}
    </section>

    <main className="relative z-10 -mt-[66px] min-h-[calc(100vh-170px)] rounded-t-[30px] bg-k-0 px-5 pb-20 pt-10">
      <header className="flex flex-col items-center">
        <div className="flex max-w-full items-center justify-center gap-2.5">
          <div className="shrink-0">{logo}</div>
          <div className="min-w-0">
            <h1 className="truncate text-k-900 typo-sb-2">{title}</h1>
            {subtitle ? <p className="mt-0.5 truncate text-k-400 typo-medium-1">{subtitle}</p> : null}
          </div>
        </div>

        {stats.length > 0 ? (
          <dl className="mt-9 flex w-full items-center justify-center divide-x divide-k-100">
            {stats.map((stat) => (
              <div key={stat.key} className="flex min-w-0 flex-1 justify-center px-3 text-center text-k-900 typo-sb-9">
                {stat.content}
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      {stats.length > 0 ? <div className="mt-7 h-1 bg-k-50" /> : null}
      <div>{children}</div>
    </main>
  </div>
);
