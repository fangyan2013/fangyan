from playwright.sync_api import Playwright, sync_playwright


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to http://192.168.3.184/dpa/login
    page.goto("http://192.168.3.184/dpa/login")

    # Click [placeholder="请输入账号"]
    page.click("[placeholder=\"请输入账号\"]")

    # Fill [placeholder="请输入账号"]
    page.fill("[placeholder=\"请输入账号\"]", "fy")

    # Click img[alt="右边背景图"]
    page.click("img[alt=\"右边背景图\"]")

    # Click [placeholder="请输入密码"]
    page.click("[placeholder=\"请输入密码\"]")

    # Fill [placeholder="请输入密码"]
    page.fill("[placeholder=\"请输入密码\"]", "click")

    # Click button:has-text("登录")
    page.click("button:has-text(\"登录\")")

    # Triple click [placeholder="请输入密码"]
    page.click("[placeholder=\"请输入密码\"]", click_count=3)

    # Fill [placeholder="请输入密码"]
    page.fill("[placeholder=\"请输入密码\"]", "123456")

    # Click button:has-text("登录")
    page.click("button:has-text(\"登录\")")

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
