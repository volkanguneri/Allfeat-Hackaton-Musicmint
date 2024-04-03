import React from "react";
import collectionsData from "@/data/NFTMarketplace/collections.json";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";

SwiperCore.use([Navigation, Pagination, Autoplay]);

const Collections = () => {
  return (
    <section className="collections section-padding style-12">
      <div className="container">
        <div className="row align-items-center mb-70">
          <div className="col-lg-7">
            <div className="section-head style-12">
              <h6 className="mb-3">
                <img
                  src="/assets/img/icons/star2.png"
                  alt=""
                  className="icon"
                />
                <span className="mx-2"> collections </span>
              </h6>
              <h2>
                Top <span> Collection </span>
              </h2>
            </div>
          </div>
          <div className="col-lg-5 text-lg-end">
            <a href="#" className="butn bg-yellowGreen rounded-3 hover-shadow">
              <span className="text-dark">
                <img
                  className="icon-20 me-1"
                  src="/assets/img/icons/star3.png"
                  alt=""
                />
                All Collector
              </span>
            </a>
          </div>
        </div>

        <div className="content">
          <div className="home-project-slider">
            <Swiper
              className="swiper-container overflow-visible"
              spaceBetween={30}
              speed={1000}
              autoplay={{
                delay: 5000,
              }}
              loop={false}
              pagination={{
                el: ".home-project-slider .swiper-pagination",
                clickable: true,
              }}
              navigation={{
                nextEl: ".home-project-slider .swiper-button-next",
                prevEl: ".home-project-slider .swiper-button-prev",
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                480: {
                  slidesPerView: 1,
                },
                787: {
                  slidesPerView: 2,
                },
                991: {
                  slidesPerView: 3,
                },
                1200: {
                  slidesPerView: 3,
                },
              }}
            >
              {collectionsData.map((collection, index) => (
                <SwiperSlide key={index}>
                  <div className="collection-card">
                    <div className="top-info">
                      <h6> {collection.name} </h6>
                      <p>
                        <img src="/assets/img/icons/star2.png" alt="" />
                        <span className="text-white"> {collection.items} </span>
                        <span> Items </span>
                      </p>
                    </div>
                    <div className="auther-img">
                      <img src={collection.pic} alt="" />
                    </div>
                    <div className="imgs">
                      <div className="main-img img-cover">
                        <img src={collection.image} alt="" />
                      </div>
                      <div className="sub-imgs">
                        {collection.subImages.map((img, idx) => (
                          <img src={img} alt="" key={idx} />
                        ))}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-pagination"></div>

            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collections;
