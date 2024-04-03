
import news from '@/data/SinglePost/all-news.json';

const metadata={ imgLetter: news.user.imgLetter, user: news.user, commentsCount: news.commentsCount, viewsCount: news.viewsCount }

const Metadata= ({ rtl = false }) => {
  return (
    <div className="d-flex small align-items-center justify-content-between mb-70 fs-12px">
      <div className="l_side d-flex align-items-center">
        <a href="#" className="me-3 me-lg-5">
          <span className="icon-20 rounded-circle d-inline-flex justify-content-center align-items-center text-uppercase bg-main p-1 me-2 text-white">
            { metadata.user.imgLetter }
          </span>
          <span className="">
            { rtl ? 'بواسطة' : 'By' } { metadata.user.name }
          </span>
        </a>
        <a href="#" className="me-3 me-lg-5">
          <i className="bi bi-chat-left-text me-1"></i>
          <span>{ metadata.commentsCount } { rtl ? 'تعليقات' : 'Comments' }</span>
        </a>
        <a href="#">
          <i className="bi bi-eye me-1"></i>
          <span>{ metadata.viewsCount } { rtl ? 'مشاهدات' : 'Views' }</span>
        </a>
      </div>
      <div className="r-side mt-1">
        <a href="#">
          <i className="bi bi-info-circle me-1"></i>
          <span>{ rtl ? 'تبليغ' : 'Report' }</span>
        </a>
      </div>
    </div>
  )
}

export default Metadata