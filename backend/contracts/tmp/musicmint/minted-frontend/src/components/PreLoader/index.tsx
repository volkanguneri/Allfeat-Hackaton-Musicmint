import { useEffect } from 'react';
import loadingPace from '@/common/loadingPace';

const PreLoader = () => {
  useEffect(() => {
    setTimeout(() => loadingPace(), 0);
  }, [])

  return (
    <div id="preloader"></div>
  )
}

export default PreLoader