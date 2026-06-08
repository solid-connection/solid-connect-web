import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type UniversityZoneLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
};

const UniversityZoneLink = ({ className, ...props }: UniversityZoneLinkProps) => {
  return <a className={cn("block", className)} {...props} />;
};

export default UniversityZoneLink;
