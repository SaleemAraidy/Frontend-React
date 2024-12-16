import axios from "axios";
import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";

interface ReturnedData<T> {
  data: AxiosResponse<T>["data"] | null;
  loading: boolean;
  error: string | null;
}

export function usePaginatedAxiosGet<T>(
  url: string,
  refresh: boolean,
  limit: number = 10 // Default limit per page
): ReturnedData<T[]> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaginatedData = async () => {
      setLoading(true);
      setError(null);
      const allData: T[] = [];
      let page = 1;

      try {
        while (true) {
          const response = await axios.get<T[]>(
            `${url}?page=${page}&limit=${limit}`
          );
          if (response.data.length === 0) break; // Exit loop if no more data
          allData.push(...response.data); // Append data from this page
          page++;
        }
        setData(allData);
      } catch (err: any) {
        setData(null);
        if (axios.isAxiosError(err) && err.response?.data?.title) {
          setError(`${err.response.data.type}: ${err.response.data.title}`);
        } else {
          setError(
            err?.message ?? "usePaginatedAxiosGet - Error fetching data"
          );
          console.error("Error fetching paginated data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaginatedData().catch((err) => console.error(err));
  }, [url, refresh, limit]);

  return { data, loading, error };
}
