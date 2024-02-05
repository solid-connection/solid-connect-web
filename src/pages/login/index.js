// import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
  return (
    <div>
      <h1>로그인 페이지</h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  // const { req } = context;
  // const token = req.cookies["accessToken"];
  return {
    redirect: {
      destination: "/login/kakao",
      permanent: false,
    },
  };

  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
