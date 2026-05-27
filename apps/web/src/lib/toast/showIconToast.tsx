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
      <div className="animate-fadeIn pointer-events-auto flex h-[62px] w-[350px] items-center justify-center gap-2.5 rounded-[12px] bg-white px-5 py-4 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.25)]">
        <Icon className="flex-shrink-0" />
        <span
          className="text-center font-serif text-[16px] font-semibold leading-[150%]"
          style={{
            backgroundImage: "linear-gradient(90deg, #5950F6 0%, #388CE8 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {message}
        </span>
      </div>
    ),
    { duration: TOAST_DURATION },
  );

  setTimeout(() => activeToastKeys.delete(key), TOAST_COOLDOWN);
};
