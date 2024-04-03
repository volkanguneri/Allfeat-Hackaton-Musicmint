import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import posts from '@/data/SinglePost/posts.json';
import postsRTL from '@/data/SinglePost/posts-rtl.json';

import "swiper/css";
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

SwiperCore.use([Navigation, Pagination, Autoplay]);

const PopularPosts = ({ style = "5", rtl = false }) => {
  const data = rtl ? postsRTL : posts;

  return (
    <section className="popular-posts related Posts section-padding pb-100">
      <div className="container">
        <h5 className="fw-bold text-uppercase mb-50">{ rtl ? 'المنشورات ذات الصلة' : 'Related Posts' }</h5>
        <div className="related-postes-slider position-relative">
          <Swiper
            className="swiper-container"
            slidesPerView={3}
            spaceBetween={80}
            centeredSlides={true}
            speed={1000}
            pagination={false}
            navigation={{
              nextEl: '.related-postes-slider .swiper-button-next',
              prevEl: '.related-postes-slider .swiper-button-prev'
            }}
            mousewheel={false}
            keyboard={true}
            autoplay={{
              delay: 4000
            }}
            loop={true}
            breakpoints={{
              0: {
                slidesPerView: 1
              },
              480: {
                slidesPerView: 1
              },
              787: {
                slidesPerView: 2
              },
              991: {
                slidesPerView: 2
              },
              1200: {
                slidesPerView: 3
              }
            }}
          >
            { 
              data.map((post, index) => (
                <SwiperSlide key={index}>
                  <div className="card border-0 bg-transparent rounded-0 p-0  d-block">
                      <a className="img radius-7 overflow-hidden img-cover">
                        <img src={post.image} className="card-img-top" alt="..." />
                      </a>
                    <div className="card-body px-0">
                      <small className="d-block date mt-10 fs-10px fw-bold">
                        <a href="#" className={`text-uppercase border-end brd-gray pe-3 me-3 color-blue${style}`}>{ post.type }</a>
                        <i className="bi bi-clock me-1"></i>
                        <a href="#" className="op-8">{ rtl ? 'تم النشر' : 'Posted on' } { post.time }</a>
                      </small>
                      <h5 className="fw-bold mt-10 title">
                        <Link href="/page-single-post-5">{ post.title }</Link>
                      </h5>
                      <p className="small mt-2 op-8">{ post.short_desc }</p>
                      <div className="d-flex small mt-20 align-items-center justify-content-between op-9">
                        <div className="l_side d-flex align-items-center">
                          <span className="icon-20 rounded-circle d-inline-flex justify-content-center align-items-center text-uppercase bg-main p-1 me-2 text-white">
                            { post.userImgLetter }
                          </span>
                          <a href="#" className="mt-1">
                            { rtl ? 'بواسطة' : 'By' } { post.username }
                          </a>
                        </div>
                        <div className="r-side mt-1">
                          <i className="bi bi-chat-left-text me-1"></i>
                          <a href="#">{ post.comments }</a>
                          <i className="bi bi-eye ms-4 me-1"></i>
                          <a href="#">{ post.views }</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )) 
            }
          </Swiper>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      </div>
    </section>
  )
}

export default PopularPosts