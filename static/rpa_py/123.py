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
    page.fill("input[name=\"wd\"]", "小红本")

    # Click text=百度一下
    # with page.expect_navigation(url="https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E5%B0%8F%E7%BA%A2%E6%9C%AC&fenlei=256&rsv_pq=b82b82a700094d2f&rsv_t=12e7hNgPAqpU%2FjXtjSfvIv2ma7Vk5DiejWTVyqLnPdrbpPKOWGHMCqFUZT4&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_sug3=15&rsv_sug1=16&rsv_sug7=100&rsv_btype=i&prefixsug=%25E5%25B0%258F%25E7%25BA%25A2%25E6%259C%25AC&rsp=0&inputT=7900&rsv_sug4=9561&rsv_jmp=fail"):
    with page.expect_navigation():
        page.click("text=百度一下")
    # assert page.url == "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E5%B0%8F%E7%BA%A2%E6%9C%AC&fenlei=256&rsv_pq=b82b82a700094d2f&rsv_t=12e7hNgPAqpU%2FjXtjSfvIv2ma7Vk5DiejWTVyqLnPdrbpPKOWGHMCqFUZT4&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_sug3=15&rsv_sug1=16&rsv_sug7=100&rsv_btype=i&prefixsug=%25E5%25B0%258F%25E7%25BA%25A2%25E6%259C%25AC&rsp=0&inputT=7900&rsv_sug4=9561"

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
