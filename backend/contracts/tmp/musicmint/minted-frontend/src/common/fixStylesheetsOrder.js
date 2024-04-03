export default function fixStylesheetsOrder(isRTL) {
  if (isRTL) {
    let rtlCss = document.querySelector('link[href="/assets/css/rtl_style.css"]');
    let mainCss = document.querySelector('link[href="/assets/css/style.css"]');

    if (!rtlCss || !mainCss) return;

    if (mainCss.nextElementSibling.href?.includes('/assets/css/rtl_style.css')) return;

    // Insert main css before rtl css 
    rtlCss.before(mainCss);
  } else {
    let bootstrapCss = document.querySelector('link[href="/assets/css/lib/bootstrap.min.css"]');
    let mainCss = document.querySelector('link[href="/assets/css/style.css"]');

    if (!bootstrapCss || !mainCss) return;

    if (bootstrapCss.nextElementSibling.href?.includes('/assets/css/style.css')) return;
    // Insert main css after bootstrap css 
    bootstrapCss.after(mainCss);
  }
}