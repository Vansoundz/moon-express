import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Landing = () => {
  return (
    <div
      style={{
        padding: "16px",
      }}
    >
      <Helmet>
        <title>Moon: Welcome</title>
      </Helmet>
      <div
        className="landing"
        style={{
          //   background: `url("/assets/homesbg.jpg")`,
          minHeight: `50vh`,
          backgroundAttachment: `fixed`,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flex: "1 0 300px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "350px" }}>
          <div style={{ fontWeight: 200, fontSize: "44px" }}>
            Serene homes for everyone
          </div>
        </div>
        <div style={{ maxWidth: "350px" }}>
          <h4>Buy sell property</h4>
          <div
            style={{
              fontWeight: 200,
              fontSize: "14px",
              margin: "20px 0",
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            molestiae, delectus accusamus distinctio hic, ad aliquam rem eveniet
            accusantium odio commodi ut quod velit tenetur beatae.
          </div>
          <Link to="/listings" id="view-listings">
            {" "}
            View listings
          </Link>
        </div>
      </div>
      <div
        style={{
          background: `#fff")`,
          minHeight: `60vh`,
        }}
      >
        <div className="features-section">
          <h1>Why choose us</h1>
          <div className="features">
            <div className="feature">
              <div></div>
              <h4>lorem ipsum</h4>
              <div>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Commodi perspiciatis sapiente praesentium omnis nihil
                consequuntur soluta reru
              </div>
            </div>
            <div className="feature">
              <div></div>
              <h4>lorem ipsum</h4>
              <div>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Commodi perspiciatis sapiente praesentium omnis nihil
                consequuntur soluta reru
              </div>
            </div>
            <div className="feature">
              <div></div>
              <h4>lorem ipsum</h4>
              <div>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Commodi perspiciatis sapiente praesentium omnis nihil
                consequuntur soluta reru
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
