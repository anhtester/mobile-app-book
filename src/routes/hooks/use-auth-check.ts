import { useEffect } from 'react';

import { useAuth } from 'src/store/auth';

import { toast } from 'src/components/toast';

import { useRouter } from './use-router';
import { usePathname } from './use-pathname';

export const useAuthCheck = () => {
  const { auth, authChecked } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authChecked && !auth) {
      toast.error('Please login first');
      router.replace(`/sign-in?redirect=${pathname}`);
    }
  }, [auth, authChecked, pathname, router]);
};
