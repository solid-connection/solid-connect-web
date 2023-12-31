import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div>
      <button onClick={() => signIn("kakao")}>카카오로 로그인</button>
    </div>
  );
}
