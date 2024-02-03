/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_MAP_API_KEY: "AIzaSyAm-HhRKVeHOF6uXmf6Mgw1yJPxwnlEf0w",
    KAKAO_REDIRECT_URI: "http://localhost:3000/login/kakao",
    KAKAO_JS_KEY: "b929e0134696bee489e7d9b9691161ba",
  },
  images: {
    domains: ["solid-connection.s3.ap-northeast-2.amazonaws.com"],
  },
};

module.exports = nextConfig;
