import React from 'react';
import processSteps from '@/data/NFTMarketplace/process.json'

const Process = () => {
  return (
    <section className="process style-12">
      <div className="container">
        <div className="content section-padding border-1 border-bottom brd-light">
          <div className="section-head text-center mb-10 style-12">
            <h6 className="justify-content-center mb-3">
              <img src="/assets/img/icons/star2.png" alt="" className="icon" />
              <span className="mx-2"> process </span>
              <img src="/assets/img/icons/star2.png" alt="" className="icon" />
            </h6>
            <h2> How It <span> Works </span> </h2>
          </div>
          <div className="row gx-0">
            {
              processSteps.map((step, index) => (
                <div className={`col-lg-3 col-sm-6 ${index % 2 !== 0 ? 'pt-lg-5' : ''}`} key={index}>
                  <a href="#" className="process-card">
                    <div className="icon">
                      <img src={step.icon} alt="" />
                    </div>
                    <div className="info">
                      <h6> {step.title} </h6>
                      <p> {step.details} </p>
                      <span className="step"> Step {step.step} </span>
                    </div>
                  </a>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default Process