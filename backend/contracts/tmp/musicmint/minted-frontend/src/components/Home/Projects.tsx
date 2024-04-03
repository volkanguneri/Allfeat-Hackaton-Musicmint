import React, { useEffect } from "react";
import projects from "@/data/NFTMarketplace/projects.json";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import Link from "next/link";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";

SwiperCore.use([Navigation, Pagination, Autoplay]);

const Projects = () => {
  return (
    <section className="projects section-padding style-12">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="section-head style-12">
              <h6 className="mb-3">
                <img
                  src="/assets/img/icons/star2.png"
                  alt=""
                  className="icon"
                />
                <span className="mx-2"> NFTs </span>
              </h6>
              <h2>
                Top <span> NFT </span>
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
                All NFTs
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
              {projects.projects.map((project, index) => (
                <SwiperSlide key={index}>
                  <div className={` mix ${project.filter}`} key={index}>
                    <div className="project-card">
                      <div className="top-inf">
                        <span>
                          <i className="fas fa-heart"></i> {project.hearts}
                        </span>
                        <span>
                          <i className="fas fa-sort color-yellowGreen"></i>
                          {project.sort}
                        </span>
                      </div>
                      <div className="img img-cover">
                        <img src={project.image} alt="" />
                        <Link
                          href="/album/detail"
                          className="butn bg-yellowGreen rounded-3 hover-shadow"
                        >
                          <span className="text-dark">
                            <i className="fal fa-shopping-basket me-1"></i> Buy
                            Now
                          </span>
                        </Link>
                      </div>
                      <div className="info">
                        <small>
                          Highest bid
                          <span className="color-yellowGreen">
                            {project.bid}
                          </span>
                        </small>
                        <h6> {project.title} </h6>
                        <div className="btm-inf">
                          <p>
                            <i className="fal fa-users color-yellowGreen"></i>
                            {project.placeBit}+ Place Bit
                          </p>
                          <p>
                            <i className="fal fa-history color-yellowGreen"></i>
                            History
                          </p>
                        </div>
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

export default Projects;
