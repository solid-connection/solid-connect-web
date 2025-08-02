import Image from "next/image";

import styles from "./news-cards.module.css";

import { News } from "@/types/news";

type NewsCardsProps = {
  newsList: News[];
};

const NewsCards = ({ newsList }: NewsCardsProps) => (
  <div className="flex flex-col gap-4">
    {newsList.map((news) => (
      <a key={news.id} target="_blank" href={news.url} rel="noreferrer">
        <div className="flex gap-4">
          <Image
            className="h-[90px] w-[170px] shrink-0 rounded-xl object-cover"
            src={news.imageUrl}
            alt={news.title}
            width={170}
            height={90}
          />
          <div className="mr-5 flex flex-col gap-0.5">
            <div className="text-serif text-sm font-semibold leading-normal text-[#44413d]">{news.title}</div>
            <div className="font-serif text-[10px] font-normal leading-normal text-[#808080]">{news.description}</div>
          </div>
        </div>
      </a>
    ))}
  </div>
);

export default NewsCards;
