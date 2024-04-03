import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';
// import CountTo from '../CountTo';
import features from '@/data/NFTMarketplace/features.json';

import "swiper/css";
import "swiper/css/autoplay";

SwiperCore.use([Autoplay]);

const Features = () => {
  const [load, setLoad] = useState(false);
  const [position] = useState({ from: 2150, to: 2500 });

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <section className="features pt-100 style-12">
      <div className="container">
        <div className="section-head text-center mb-40 style-12">
          <h6 className="justify-content-center mb-3">
            <img src="/assets/img/icons/star2.png" alt="" className="icon" />
            <span className="mx-2"> featured </span>
            <img src="/assets/img/icons/star2.png" alt="" className="icon" />
          </h6>
          <h2> Best <span> Sellers </span> </h2>
        </div>
        <div className="content">
          <div className="row justify-content-center">
            {
              features.map((feature, index) => (
                <div className="col-lg-3 col-sm-6" key={index}>
                  <a href="#" className="feature-card">
                    <div className="img icon-65 rounded-circle overflow-hidden img-cover me-3">
                      <img src={feature.image} alt="" />
                    </div>
                    <div className="info">
                      <h5> {feature.name} </h5>
                      <p>
                        Rise:
                        <span className="color-yellowGreen ms-1"> $1200000 </span>
                        {/* <CountTo className="counter color-yellowGreen" from={0} to={feature.rise} speed={1500} position={position} /> */}
                      </p>
                    </div>
                  </a>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <div className="features-line-slider12">
        {
          load && (
            <Swiper
              className="swiper-container"
              spaceBetween={0}
              centeredSlides={true}
              speed={10000}
              autoplay={{
                delay: 1
              }}
              loop={true}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                480: {
                  slidesPerView: 1,
                },
                787: {
                  slidesPerView: 1,
                },
                991: {
                  slidesPerView: 2,
                },
                1200: {
                  slidesPerView: 2,
                }
              }}
            >
              <SwiperSlide className="swiper-slide">
                <a href="#"> <img src="/assets/img/icons/star3.png" alt="" /> <h2> Sell your nft </h2> </a>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <a href="#"> <img src="/assets/img/icons/star3.png" alt="" /> <h2> be an portfolio author </h2> </a>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <a href="#"> <img src="/assets/img/icons/star3.png" alt="" /> <h2> nft’s great </h2> </a>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <a href="#"> <img src="/assets/img/icons/star3.png" alt="" /> <h2> Sell your nft </h2> </a>
              </SwiperSlide>
            </Swiper>
          )
        }
        <img src="/assets/img/icons/features/27.png" alt="" className="icon slide_up_down" />
      </div>
    </section>
  )
}

export default Features