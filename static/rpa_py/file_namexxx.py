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
    page.fill("input[name=\"wd\"]", "电脑")

    # Click text=百度一下
    # with page.expect_navigation(url="https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E7%94%B5%E8%84%91&fenlei=256&rsv_pq=bfc240120006a006&rsv_t=3f12TayQYAbG9C81oGYQPTKnAjQB2wz9BErrW%2B7WymEB0YzPnl8zUfqNMU8&rqlang=cn&rsv_enter=0&rsv_dl=tb&rsv_sug3=7&rsv_sug1=2&rsv_sug7=100&rsv_btype=i&prefixsug=%25E7%2594%25B5%25E8%2584%2591&rsp=0&inputT=2479&rsv_sug4=5979&rsv_jmp=fail"):
    with page.expect_navigation():
        page.click("text=百度一下")
    # assert page.url == "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E7%94%B5%E8%84%91&fenlei=256&rsv_pq=bfc240120006a006&rsv_t=3f12TayQYAbG9C81oGYQPTKnAjQB2wz9BErrW%2B7WymEB0YzPnl8zUfqNMU8&rqlang=cn&rsv_enter=0&rsv_dl=tb&rsv_sug3=7&rsv_sug1=2&rsv_sug7=100&rsv_btype=i&prefixsug=%25E7%2594%25B5%25E8%2584%2591&rsp=0&inputT=2479&rsv_sug4=5979"

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
