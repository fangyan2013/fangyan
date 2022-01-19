from playwright.sync_api import Playwright, sync_playwright


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to http://www.baidu.com/
    page.goto("http://www.baidu.com/")

    # Click text=十九届六中全会公报发布
    with page.expect_popup() as popup_info:
        page.click("text=十九届六中全会公报发布")
    page1 = popup_info.value

    # Click text=百度一下
    # with page1.expect_navigation(url="https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&tn=baidutop10&wd=%E5%8D%81%E4%B9%9D%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E5%85%AC%E6%8A%A5%E5%8F%91%E5%B8%83&oq=%25E5%258D%2581%25E4%25B9%259D%25E5%25B1%258A%25E5%2585%25AD%25E4%25B8%25AD%25E5%2585%25A8%25E4%25BC%259A%25E5%2585%25AC%25E6%258A%25A5%25E5%258F%2591%25E5%25B8%2583&rsv_pq=bb9e12c300028baa&rsv_t=6a2eICgZfZpIqVC6rhiQGQKlDtj7n6gE7seT%2BzpWV%2BaiTcmLCqZoIvl%2B6w1hD9Zffg&rqlang=cn&rsv_dl=tb&rsv_btype=t&bs=%E5%8D%81%E4%B9%9D%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E5%85%AC%E6%8A%A5%E5%8F%91%E5%B8%83&__eis=1&__eist=2"):
    with page1.expect_navigation():
        page1.click("text=百度一下")
    # assert page1.url == "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&tn=baidutop10&wd=%E5%8D%81%E4%B9%9D%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E5%85%AC%E6%8A%A5%E5%8F%91%E5%B8%83&oq=%25E5%258D%2581%25E4%25B9%259D%25E5%25B1%258A%25E5%2585%25AD%25E4%25B8%25AD%25E5%2585%25A8%25E4%25BC%259A%25E5%2585%25AC%25E6%258A%25A5%25E5%258F%2591%25E5%25B8%2583&rsv_pq=bb9e12c300028baa&rsv_t=6a2eICgZfZpIqVC6rhiQGQKlDtj7n6gE7seT%2BzpWV%2BaiTcmLCqZoIvl%2B6w1hD9Zffg&rqlang=cn&rsv_dl=tb&rsv_btype=t"

    # Click a:has-text("图片")
    # with page1.expect_navigation(url="https://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&dyTabStr=MCwxLDIsNiw0LDUsMyw3LDgsOQ%3D%3D&word=%E5%8D%81%E4%B9%9D%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E5%85%AC%E6%8A%A5%E5%8F%91%E5%B8%83"):
    with page1.expect_navigation():
        page1.click("a:has-text(\"图片\")")
    # assert page1.url == "https://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&dyTabStr=MCwxLDIsNiw0LDUsMyw3LDgsOQ%3D%3D&word=%E5%8D%81%E4%B9%9D%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E5%85%AC%E6%8A%A5%E5%8F%91%E5%B8%83"

    # Close page
    page1.close()

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
