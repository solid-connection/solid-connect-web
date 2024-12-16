import { IconNotFound } from "@/public/svgs/loading";

type NotFoundProps = {
  text?: string;
};

const NotFound = ({ text = "" }: NotFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <IconNotFound />
      <div className="mt-8">
        <span className="font-serif text-base font-semibold">{text}</span>
      </div>
    </div>
  );
};

export default NotFound;
