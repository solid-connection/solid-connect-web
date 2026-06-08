import type { FC, SVGProps } from "react";
import { toast } from "react-hot-toast";

import { IconToastCap, IconToastLike, IconToastLink, IconToastLogo, IconToastUniv } from "@/public/svgs/toast";

export type ToastIconKey = "like" | "link" | "univ" | "cap" | "logo";

const ICONS: Record<ToastIconKey, FC<SVGProps<SVGSVGElement>>> = {
  like: IconToastLike,
  link: IconToastLink,
  univ: IconToastUniv,
  cap: IconToastCap,
  logo: IconToastLogo,
};

const TOAST_DURATION = 3000;
const TOAST_COOLDOWN = 3500;
const activeToastKeys = new Set<string>();

export const showIconToast = (icon: ToastIconKey, message: string) => {
  const Icon = ICONS[icon];
  const key = `${icon}:${message}`;

  if (activeToastKeys.has(key)) return;
  activeToastKeys.add(key);

  toast.custom(
    () => (
      <div className="animate-fadeIn pointer-events-auto flex min-h-[62px] w-full max-w-[350px] items-center justify-center gap-2.5 rounded-[12px] bg-white px-5 py-4 shadow-magic-toast">
        <Icon className="flex-shrink-0" />
        <span className="break-words bg-gradient-to-r from-primary to-sub-a bg-clip-text text-center font-serif text-[16px] font-semibold leading-[150%] text-transparent [-webkit-text-fill-color:transparent]">
          {message}
        </span>
      </div>
    ),
    { duration: TOAST_DURATION },
  );

  setTimeout(() => activeToastKeys.delete(key), TOAST_COOLDOWN);
};
