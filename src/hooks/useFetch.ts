import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

const useFetch = (url, method = "GET", body = null) => {
  const { getAccessToken } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
