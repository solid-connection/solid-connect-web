import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CommunityIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/community/FREE");
  }, [router]);

  return null;
}
