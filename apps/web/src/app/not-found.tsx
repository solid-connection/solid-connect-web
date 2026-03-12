import { IconNotFound } from "@/public/svgs/loading";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <IconNotFound />
      <div className="mt-8">
        <span className="font-serif typo-sb-7">{"존재하지 않는 페이지입니다"}</span>
      </div>
    </div>
  );
};

export default NotFoundPage;
