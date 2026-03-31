import { useSession } from "next-auth/react";
import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";

type UseAPIClientOptions = {
  requiresAuth?: boolean;
};

export const useAPIClient = (
  options: UseAPIClientOptions = {}
): AxiosInstance => {
  const { data: session } = useSession();

  const apiClient = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    });

    // Attach interceptor if auth is required
    if (options.requiresAuth) {
      instance.interceptors.request.use(
        (config) => {
          const token = session?.backendToken;

          if (token) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${token}`,
            };
          }

          return config;
        },
        (error) => Promise.reject(error)
      );
    }

    return instance;
  }, [options.requiresAuth, session?.backendToken]);

  return apiClient;
};