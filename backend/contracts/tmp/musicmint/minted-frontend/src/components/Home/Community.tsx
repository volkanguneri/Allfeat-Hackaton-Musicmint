import React from 'react';

const Community = () => {
  return (
    <section className="community style-12">
      <div className="container">
        <div className="content">
          <h2> Stay In The <span> Community </span> </h2>
          <div className="form-group">
            <span className="icon"> <i className="fas fa-envelope-open"></i> </span>
            <input type="text" placeholder="Business email..." />
            <button className="butn bg-yellowGreen hover-shadow border-0">
              <span className="text-dark"> Subscribe </span>
            </button>
          </div>
          <div className="social-icons">
            <a href="#"> <i className="fas fa-envelope"></i> </a>
            <a href="#"> <i className="fab fa-tiktok"></i> </a>
            <a href="#"> <i className="fab fa-discord"></i> </a>
            <a href="#"> <i className="fab fa-twitter"></i> </a>
            <a href="#"> <i className="fab fa-youtube"></i> </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Community