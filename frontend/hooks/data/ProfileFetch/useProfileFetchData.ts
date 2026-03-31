import { useQuery } from '@tanstack/react-query';
import { Profile } from '@/types';
import { useProfile } from '@/hooks/api';


interface UseProfileFetchDataParams {
  email: string;
}

export const useProfileFetchData = (params: UseProfileFetchDataParams) => {

  const {fetchProfile} = useProfile();

  const { data, isLoading, isError, error } = useQuery<Profile | null>({
    queryKey: ['profile'],
    queryFn: () => fetchProfile({ email: params.email }),
    refetchInterval: 0,
    refetchOnWindowFocus: false
  });

  return {
    data: data ?? null,
    isNotFound: !data?.isProfileSetupComplete,
    isLoading,
    isError,
    error,
  };
};
