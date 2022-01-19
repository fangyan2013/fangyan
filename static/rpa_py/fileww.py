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
    page.fill("input[name=\"wd\"]", "还珠格格")

    # Press Enter
    # with page.expect_navigation(url="https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E8%BF%98%E7%8F%A0%E6%A0%BC%E6%A0%BC&fenlei=256&rsv_pq=aad1cf7000010515&rsv_t=fdbaUc3hSqKKXevN8MRlOcZLt%2B1p4jKATqWujX4wsdp2FHyLey%2BKUoez7h0&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_sug3=16&rsv_sug1=14&rsv_sug7=100&rsv_sug2=0&rsv_btype=i&prefixsug=%25E8%25BF%2598%25E7%258F%25A0%25E6%25A0%25BC%25E6%25A0%25BC&rsp=5&inputT=5710&rsv_sug4=7069&rsv_jmp=fail"):
    with page.expect_navigation():
        page.press("input[name=\"wd\"]", "Enter")

    # Click text=百度一下
    page.click("text=百度一下")
    # assert page.url == "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&ch=&tn=baidu&bar=&wd=%E8%BF%98%E7%8F%A0%E6%A0%BC%E6%A0%BC&fenlei=256&oq=%E8%BF%98%E7%8F%A0%E6%A0%BC%E6%A0%BC&rsv_pq=88efd97e0009b689&rsv_t=3fb4FpMdGwQj%2FqwooHWY3OabZ7DzGPuy%2FrMiphx38GN438FeubQgvXv20Kk&rqlang=cn"

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
