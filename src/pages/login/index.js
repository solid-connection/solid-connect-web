// import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  router.push("/login/kakao");

  return (
    <div>
      <h1>로그인</h1>
    </div>
  );
}
