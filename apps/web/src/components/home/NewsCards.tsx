import Image from "next/image";
import { useImageFallback } from "@/hooks/useImageFallback";

import type { News } from "@/types/news";

type NewsCardsProps = {
  newsList: News[];
};

const NewsCards = ({ newsList }: NewsCardsProps) => {
  const { getSrc, handleError } = useImageFallback("/svgs/placeholders/news-thumbnail-placeholder.svg");

  return (
    <div className="flex flex-col gap-4">
      {newsList.map((news) => (
        <a key={news.id} target="_blank" href={news.url} rel="noreferrer">
          <div className="flex gap-4">
            <Image
              className="h-[90px] w-[170px] shrink-0 rounded-xl object-cover"
              src={getSrc(news.imageUrl)}
              alt={news.title}
              width={170}
              height={90}
              onError={handleError}
            />
            <div className="mr-5 flex flex-col gap-0.5">
              <div className="text-serif text-text-brown typo-sb-9">{news.title}</div>
              <div className="font-serif text-gray-150 typo-regular-6">{news.description}</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default NewsCards;
