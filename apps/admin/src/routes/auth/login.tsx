import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminSignInApi } from "@/lib/api/auth";
import { saveAccessToken, saveRefreshToken } from "@/lib/utils/localStorage";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await adminSignInApi(email, password);
      const { accessToken, refreshToken } = response.data;

      saveAccessToken(accessToken);
      saveRefreshToken(refreshToken);

      toast("로그인 성공", {
        description: "관리자 페이지로 이동합니다.",
      });

      navigate({ to: "/scores" });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error("로그인 실패", {
        description: error.response?.data?.message || "로그인에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Card className="w-[360px]">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-center text-xl">관리자 로그인</CardTitle>
          <CardDescription className="text-center text-sm">솔리드 커넥션 관리자 페이지입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="h-9"
              />
            </div>
            <Button type="submit" className="mt-2 h-9 w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
