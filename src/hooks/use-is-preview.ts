import { useDebugValue } from 'react';
import { useRouter } from 'next/router';

const useIsPreview = () => {
  const router = useRouter();
  // on safari it was observed next/router was returning the full path, but not
  // parsing it into router.query, so double check both to determine preview state
  const isPreview = router.query.preview === 'true' || router.asPath.includes('preview=true');
  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue(isPreview);
  }
  return isPreview;
};

export default useIsPreview;
