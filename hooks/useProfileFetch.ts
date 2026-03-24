import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Profile } from '@/types';

interface FetchProfileParams {
  email: string;
}

const fetchProfile = async (params: FetchProfileParams): Promise<Profile | null> => {
  try {
    const { data } = await axios.get<Profile>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {params});
    return data;
  } catch (err) {
    if ((err as AxiosError).response?.status === 404) return null;
    throw err;
  }
};


interface UseProfileFetchParams {
  email: string;
}

const useProfileFetch = (params: UseProfileFetchParams) => {
  const { data, isLoading, isError, error } = useQuery<Profile | null>({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(params),
  });

  return {
    data: data ?? null,
    isNotFound: data === null,
    isLoading,
    isError,
    error,
  };
};

export default useProfileFetch;
