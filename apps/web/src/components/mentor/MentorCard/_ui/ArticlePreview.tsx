import Image from "@/components/ui/FallbackImage";
import type { Article } from "@/types/news";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";

interface ArticlePreviewProps {
  article: Article;
}

const ArticlePreview = ({ article }: ArticlePreviewProps) => {
  const thumbnailUrl = normalizeImageUrlToUploadCdn(article.thumbnailUrl);
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-lg bg-k-50 transition-opacity hover:opacity-90"
    >
      <div className="relative h-32 w-full bg-gradient-to-br from-blue-400 to-blue-600">
        <Image src={thumbnailUrl} alt={article.title} fill className="object-cover" />
      </div>
      <p className="line-clamp-1 px-3 py-2 text-k-800 typo-sb-7">{article.title}</p>
    </a>
  );
};

export default ArticlePreview;
