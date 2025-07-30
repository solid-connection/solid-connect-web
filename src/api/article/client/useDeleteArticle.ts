import useFetch from "@/utils/apiUtils";

const useDeleteArticle = (articleId: number | null) => {
  const { loading, error, fetchData } = useFetch<void>();

  const deleteArticle = () => {
    if (articleId === null) return;

    fetchData({
      method: "delete",
      url: `/news/${articleId}`,
      body: undefined,
      isToken: true,
    });
  };

  return { deleteArticle, loading, error };
};

export default useDeleteArticle;
