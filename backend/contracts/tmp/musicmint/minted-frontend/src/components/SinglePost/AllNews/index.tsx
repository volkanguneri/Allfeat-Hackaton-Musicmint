import Details from "./Details";
import Metadata from "./Metadata";
import Content from "./Content";
import Comments from "./Comments";
import Sidebar from "./Sidebar";

import news from "@/data/SinglePost/all-news.json";
import newsRTL from "@/data/SinglePost/all-news-rtl.json";

const AllNews = ({
  isWide = true,
  leftSidebar = false,
  style = "5",
  rtl = false,
}) => {
  const data = rtl ? newsRTL : news;

  return (
    <section className="all-news section-padding pt-50 blog bg-transparent style-3">
      <div className="container">
        <Details />
        <div className="row gx-4 gx-lg-5">
          {!isWide && leftSidebar && <Sidebar />}
          <div className={isWide ? "col-lg-12" : "col-lg-8"}>
            <Metadata />
            <div className="blog-content-info">
              <Content />
              <Comments />
            </div>
          </div>
          {!isWide && !leftSidebar && <Sidebar />}
        </div>
      </div>
    </section>
  );
};

export default AllNews;
