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
  page: number, // Added page parameter to handle pagination
  refresh: boolean // Added refresh parameter to force data re-fetch
): ReturnedData<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController(); // Allows us to cancel the request if needed

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await axios.get<T>(url, {
          params: { page }, // Send page number to the backend
          signal: controller.signal, // Handle request cancellation
        });
        if (!controller.signal.aborted) {
          setError(null);
          setData(result.data); // Update state with fetched data
        }
      } catch (err: any) {
        setData(null);
        if (axios.isAxiosError(err)) {
          setError(err.message || "Error fetching data");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort("Operation canceled by the user."); // Cleanup to prevent memory leaks
    };
  }, [url, page, refresh]); // Added page and refresh as dependencies to trigger re-fetch

  return { data, loading, error };
}
