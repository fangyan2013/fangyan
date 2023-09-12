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
    page.fill("input[name=\"wd\"]", "sb70")

    # Click text=百度一下
    page.click("text=百度一下")
    # assert page.url == "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=sb70&fenlei=256&rsv_pq=98b94e520002d040&rsv_t=3abd%2FiI1DzjJQ3%2Fqk7Jca6E0m0ORERMeZ7P1bEEBiseGE7gIJ8rcgiQqJMQ&rqlang=cn&rsv_enter=0&rsv_dl=tb&rsv_sug3=5&rsv_sug1=4&rsv_sug7=100&rsv_btype=i&prefixsug=sb70&rsp=0&inputT=4640&rsv_sug4=7827"

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
