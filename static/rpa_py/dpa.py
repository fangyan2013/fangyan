from playwright.sync_api import Playwright, sync_playwright


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to http://192.168.3.185/dpa/login
    page.goto("http://192.168.3.185/dpa/login")

    # Click [placeholder="请输入账号"]
    page.click("[placeholder=\"请输入账号\"]")

    # Fill [placeholder="请输入账号"]
    page.fill("[placeholder=\"请输入账号\"]", "fy")

    # Click [placeholder="请输入密码"]
    page.click("[placeholder=\"请输入密码\"]")

    # Fill [placeholder="请输入密码"]
    page.fill("[placeholder=\"请输入密码\"]", "123456")

    # Click button:has-text("登录")
    # with page.expect_navigation(url="http://192.168.3.185/dpa/workflow/workflowList"):
    with page.expect_navigation():
        page.click("button:has-text(\"登录\")")

    # Click text=系统配置
    # with page.expect_navigation(url="http://192.168.3.185/dpa/system/groupPermit"):
    with page.expect_navigation():
        page.click("text=系统配置")

    # Click text=用户管理
    # with page.expect_navigation(url="http://192.168.3.185/dpa/system/userManage"):
    with page.expect_navigation():
        page.click("text=用户管理")

    # Check text=1111 110@qq.com >> input[type="checkbox"]
    page.check("text=1111 110@qq.com >> input[type=\"checkbox\"]")

    # Click button:has-text("删除")
    page.click("button:has-text(\"删除\")")

    # Click :nth-match(button:has-text("确定"), 3)
    page.click(":nth-match(button:has-text(\"确定\"), 3)")

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
