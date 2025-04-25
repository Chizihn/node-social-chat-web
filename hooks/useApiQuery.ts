import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

type FetchFunction<T> = () => Promise<T>;

interface ApiQueryOptions<TData, TError = AxiosError>
  extends Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    "queryFn" | "queryKey"
  > {
  queryKey: QueryKey;
  url: string;
  axiosConfig?: AxiosRequestConfig;
  enabled?: boolean;
}

/**
 * Reusable useApiQuery hook using axios and TanStack React Query
 */
export function useApiQuery<TData = unknown, TError = AxiosError>({
  queryKey,
  url,
  axiosConfig,
  enabled = true,
  ...options
}: ApiQueryOptions<TData, TError>) {
  const fetchData: FetchFunction<TData> = async () => {
    const response = await axios.get<TData>(url, axiosConfig);
    return response.data;
  };

  return useQuery<TData, TError>({
    queryKey,
    queryFn: fetchData,
    enabled,
    ...options,
  });
}
