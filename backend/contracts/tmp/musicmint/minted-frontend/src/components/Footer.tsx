import React from "react";

const Footer = () => {
  return (
    <footer className="style-12">
      <div className="container">
        <div className="content">
          <div className="row">
            <div className="col-lg-3">
              <div className="foot-info">
                <div className="foot-logo mb-30">
                  <img src="/assets/image/favIcon.jpg" alt="" />
                </div>
                {/* <p> The world’s first and largest digital NFT marketplace for crypto collectibles & non fungible tokens (NFTs). Buy, sell, & discover exclusive digital items. </p> */}
              </div>
            </div>
            <div className="col-lg-2 offset-lg-2">
              <div className="links mt-5 mt-lg-0">
                <h6> ABOUT </h6>
                <ul>
                  <li>
                    <a href="#"> About Us </a>
                  </li>
                  <li>
                    <a href="#"> Blog </a>
                  </li>
                  <li>
                    <a href="#"> Terms of Service </a>
                  </li>
                  <li>
                    <a href="#"> Privacy Policy </a>
                  </li>
                  <li>
                    <a href="#"> FAQs </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="links mt-5 mt-lg-0">
                <h6> CONTACT US </h6>
                <ul>
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="mailto:artist@mintedwaves.com"
                    >
                      <span className="d-flex">
                        <div
                          className="ant-image"
                          style={{ width: "18px", height: "18px" }}
                        >
                          <img
                            alt="Email"
                            src="/assets/image/icon/email.svg"
                            style={{ height: "18px" }}
                          />
                        </div>
                        <span className="ps-2">artis@mintedwaves.com</span>
                      </span>
                    </a>
                  </li>
                </ul>
                {/* mailto:artist@mintedwaves.com */}
              </div>
            </div>
            <div className="col-lg-2">
              <div className="links mt-5 mt-lg-0">
                <h6> SOCIAL MEDIA </h6>
                <div className="social-icons">
                  <a
                    className="pe-3"
                    href="https://twitter.com/mintedwaves"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      alt="twitter"
                      src="/assets/image/icon/twitter.svg"
                      style={{ width: "36px", height: "36px" }}
                    ></img>
                  </a>
                  <a
                    className="pe-3"
                    href="https://www.facebook.com/mintedwaves"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      alt="instagram"
                      src="/assets/image/icon/instagram.svg"
                      style={{ width: "36px", height: "36px" }}
                    ></img>
                  </a>
                  <a
                    className="pe-3"
                    href="https://www.instagram.com/mintedwaves/"

                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      alt="facebook"
                      src="/assets/image/icon/facebook.svg"
                      style={{ width: "36px", height: "36px" }}
                    ></img>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="foot">
          <p>
            ©Copyright
            <a href="#" className="color-yellowGreen">
              MintedWaves.
            </a>
            All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
