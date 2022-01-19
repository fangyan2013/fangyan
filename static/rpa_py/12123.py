from playwright.sync_api import Playwright, sync_playwright


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to https://www.baidu.com/
    page.goto("https://www.baidu.com/")

    # Click input[name="wd"]
    page.click("input[name=\"wd\"]")

    # Fill input[name="wd"]
    page.fill("input[name=\"wd\"]", "喝水")

    # Click text=百度一下
    # with page.expect_navigation(url="https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E5%96%9D%E6%B0%B4&fenlei=256&rsv_pq=fb35b4b60001514c&rsv_t=a46791siGtpb%2ByZ5DUUama0qxYkZeMSod5h%2FvQLcnHl1LEDvwS73PQgXhIA&rqlang=cn&rsv_enter=0&rsv_dl=tb&rsv_sug3=10&rsv_sug1=7&rsv_sug7=100&rsv_btype=i&prefixsug=%25E5%2596%259D%25E6%25B0%25B4&rsp=0&inputT=7348&rsv_sug4=7348&rsv_jmp=fail"):
    with page.expect_navigation():
        page.click("text=百度一下")
    # assert page.url == "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E5%96%9D%E6%B0%B4&fenlei=256&rsv_pq=fb35b4b60001514c&rsv_t=a46791siGtpb%2ByZ5DUUama0qxYkZeMSod5h%2FvQLcnHl1LEDvwS73PQgXhIA&rqlang=cn&rsv_enter=0&rsv_dl=tb&rsv_sug3=10&rsv_sug1=7&rsv_sug7=100&rsv_btype=i&prefixsug=%25E5%2596%259D%25E6%25B0%25B4&rsp=0&inputT=7348&rsv_sug4=7348"

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
