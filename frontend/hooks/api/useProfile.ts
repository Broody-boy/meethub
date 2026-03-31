import { AxiosError } from 'axios';
import { Profile } from '@/types';
import { useAPIClient } from '../common/useAPIClient';

interface FetchProfileFnParams {
  email: string;
}

export const useProfile = () => {

  const apiClient = useAPIClient({requiresAuth: true});

  const fetchProfile = async (params: FetchProfileFnParams): Promise<Profile | null> => {

    try {
      const { data } = await apiClient.get<Profile>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
        params: {
          email: params.email
        }
      });
      return data;
    } catch (err) {
      if ((err as AxiosError).response?.status === 404) return null;
      throw err;
    }

  }

  return {
    fetchProfile
  }
}