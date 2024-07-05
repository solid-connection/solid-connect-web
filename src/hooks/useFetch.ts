import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

type FetchResult<T> = [T | null, any, boolean];

const useFetch = <T>(url, method = "GET", body = null): FetchResult<T> => {
  const { getAccessToken } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  url = process.env.NEXT_PUBLIC_API_SERVER_URL + url;
  console.log("url", url);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await getAccessToken();
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

        const response = await axios({
          method,
          url,
          headers,
          data: body,
        });
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          const newAccessToken = await getAccessToken();
          if (newAccessToken) {
            const headers = { Authorization: `Bearer ${newAccessToken}` };
            const response = await axios({
              method,
              url,
              headers,
              data: body,
            });
            setData(response.data);
          } else {
            document.location.href = "/login";
          }
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return [data, error, loading];
};

export default useFetch;
