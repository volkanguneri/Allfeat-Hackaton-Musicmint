import { useEffect } from 'react';
import scrollToTop from '@/common/scrollToTop';

const ScrollToTop = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <a href="#" className={`to_top bg-gray rounded-circle icon-40 d-inline-flex align-items-center justify-content-center`}>
      <i className={`bi bi-chevron-up fs-6 text-dark`}></i>
    </a>
  );
};

export default ScrollToTop;
