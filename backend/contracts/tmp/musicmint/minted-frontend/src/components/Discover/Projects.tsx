import React, { useEffect } from "react";
import projects from "@/data/NFTMarketplace/projects.json";

const Projects = () => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!mixitup) return;
  //     mixitup('.projects')
  //   }, 0);
  // }, []);

  const addActiveClass = (e: any) => {
    document
      .querySelectorAll("span[data-filter]")
      .forEach((el) => el.classList.remove("active"));
    e.currentTarget.classList.add("active");
  };

  return (
    <section className="projects section-padding style-12">
      <div className="container">
        <div className="section-head text-center mb-70 style-12">
          <h6 className="justify-content-center mb-3">
            <img src="/assets/img/icons/star2.png" alt="" className="icon" />
            <span className="mx-2"> Discover </span>
            <img src="/assets/img/icons/star2.png" alt="" className="icon" />
          </h6>
          <h2>
            Discover <span> NFTs </span>
          </h2>
        </div>
        <div className="content">
          <div className="mix_tabs mb-20">
            {projects.filters.map((filter, index) => (
              <span
                className={`${index === 0 ? "active" : ""} tab-link`}
                data-filter={filter.filter}
                key={index}
                onClick={addActiveClass}
              >
                <img
                  src="/assets/img/icons/star3.png"
                  alt=""
                  className="icon"
                />
                {filter.text}
              </span>
            ))}
          </div>
          <div className="row items">
            {projects.projects.map((project, index) => (
              <div
                className={`col-lg-3 col-sm-6 mix ${project.filter}`}
                key={index}
              >
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
                    <a
                      href="#"
                      className="butn bg-yellowGreen rounded-3 hover-shadow"
                    >
                      <span className="text-dark">
                        <i className="fal fa-shopping-basket me-1"></i> Buy Now
                      </span>
                    </a>
                  </div>
                  <div className="info">
                    <small>
                      Highest bid
                      <span className="color-yellowGreen">{project.bid}</span>
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
            ))}
          </div>
          <div
            className={`pagination style-5 color-5 justify-content-center mt-60`}
          >
            <a href="#" className="active">
              <span>1</span>
            </a>
            <a href="#">
              <span>2</span>
            </a>
            <a href="#">
              <span>3</span>
            </a>
            <a href="#">
              <span>4</span>
            </a>
            <a href="#">
              <span>...</span>
            </a>
            <a href="#">
              <span>20</span>
            </a>
            <a href="#">
              <span className="text">
                next <i className="fas fa-chevron-right"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
