from playwright.sync_api import Playwright, sync_playwright


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to https://www.baidu.com/?tn=62095104_33_oem_dg
    page.goto("https://www.baidu.com/?tn=62095104_33_oem_dg")

    # Click input[name="wd"]
    page.click("input[name=\"wd\"]")

    # Fill input[name="wd"]
    page.fill("input[name=\"wd\"]", "dpa")

    # Click input[name="wd"]
    page.click("input[name=\"wd\"]")

    # Click text=百度一下
    page.click("text=百度一下")
    # assert page.url == "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=62095104_33_oem_dg&wd=dpa&fenlei=256&rsv_pq=8775906000017419&rsv_t=0eb9GOSt3NAYeAJskla6t%2BmC9Y4qztCdqSa0yZG9a%2BXCgH8lfOCJAbQGwQAhQMbCyxE6Ovx%2BE6QT&rqlang=cn&rsv_enter=0&rsv_dl=tb&rsv_sug3=6&rsv_sug1=5&rsv_sug7=100&rsv_btype=i&rsv_sug4=9755"

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
