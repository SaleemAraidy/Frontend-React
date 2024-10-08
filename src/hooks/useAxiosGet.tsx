import axios from "axios"; // import CancelToken from axios
import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
 
interface ReturnedData<TResponse> {
  data: AxiosResponse<TResponse>["data"] | null;
  loading: boolean;
  error: string | null;
}
 
export function useAxiosGet<T>(url: string): ReturnedData<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Initialize error state as string
 
  useEffect(() => {
    const controller = new AbortController();
 
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await axios.get<T>(url, {
          signal: controller.signal, // Pass the signal to the request options
        });
        if (!controller.signal.aborted) {
          setError(null);
          setData(result.data);
        }
      } catch (err: any) {
        setData(null);
 
        console.error("err type:", typeof err);
        console.error("axios.isAxiosError(err):", axios.isAxiosError(err));
        console.error("err type:", typeof err);
        console.error("err.response:", err.response);
 
        // Check if error is axiosError
        if (
          axios.isAxiosError(err) &&
          err.response?.data?.type &&
          err.response?.data?.title
        ) {
          setError(`${err.response.data.type}: ${err.response.data.title}`);
        } else {
          setError(err?.message ?? "useAxiosGet - Error fetching data"); // Set error state to error message
          console.error("Error fetching data:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
 
    fetchData().catch((err) => console.error(err));
 
    return () => {
      controller.abort("Operation canceled by the user."); // Cancel the request
    };
  }, [url]);
 
  return { data, loading, error };
}