import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useId, useState } from "react";
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
	const emailInputId = useId();
	const passwordInputId = useId();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signInMutation = useMutation({
		mutationFn: ({ nextEmail, nextPassword }: { nextEmail: string; nextPassword: string }) =>
			adminSignInApi(nextEmail, nextPassword),
	});

	const isLoading = signInMutation.isPending;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const response = await signInMutation.mutateAsync({ nextEmail: email, nextPassword: password });
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
		}
	};

	return (
		<div className="flex min-h-[calc(100vh-132px)] items-center justify-center px-4 py-8">
			<Card className="w-full max-w-[400px] border-k-100 bg-k-0 shadow-sdw-a">
				<CardHeader className="space-y-1.5 pb-4">
					<div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary typo-bold-4">
						SC
					</div>
					<CardTitle className="text-center typo-bold-4 text-k-900">관리자 로그인</CardTitle>
					<CardDescription className="text-center typo-regular-3 text-k-500">
						솔리드 커넥션 운영 콘솔에 접속합니다
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-1">
							<Label htmlFor={emailInputId} className="typo-sb-11 text-k-700">
								이메일
							</Label>
							<Input
								id={emailInputId}
								type="email"
								placeholder="admin@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
								required
								className="h-11 border-k-100 bg-bg-50 typo-regular-3 text-k-800 placeholder:text-k-400"
							/>
						</div>
						<div className="space-y-1">
							<Label htmlFor={passwordInputId} className="typo-sb-11 text-k-700">
								비밀번호
							</Label>
							<Input
								id={passwordInputId}
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
								required
								className="h-11 border-k-100 bg-bg-50 typo-regular-3 text-k-800"
							/>
						</div>
						<Button type="submit" className="mt-2 h-11 w-full rounded-lg typo-sb-9" disabled={isLoading}>
							{isLoading ? "로그인 중..." : "로그인"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
