import React from 'react'

const Details = ({ style = 5 , rtl = false }) => {
  return (
    <div className="blog-details-slider mb-100">
      <div className="section-head text-center mb-60 style-5">
        <h2 className="mb-20">Crypto Trend 2023</h2>
        <small className="d-block date text">
          <a href="#" className={`text-uppercase border-end brd-gray pe-3 me-3 color-blue${style} fw-bold`}>news</a>
          <i className="bi bi-clock me-1"></i>
          <span className="op-8 ms-1">{ rtl ? 'تم النشر' : 'Posted on' } 15 Days ago</span>
        </small>
      </div>
      <div className="content-card">
        <div className="img">
          <img src="/assets/img/blog/1.jpeg" alt="" />
        </div>
        <div className="info">
          <div className="row">
            <div className="col-lg-6">
              <div className="cont">
                <small className="date small mb-20"> <span className="text-uppercase border-end brd-gray pe-3 me-3"> News </span> <i className="far fa-clock me-1"></i> Posted on 3 Days ago </small>
                <h2 className="title">
                  Solutions For Big Data Issue, Expert Perspective
                </h2>
                <p className="fs-12px mt-10 text-light text-info">If there’s one way that wireless technology has changed the way we work, it’s that will everyone is now connected [...]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details