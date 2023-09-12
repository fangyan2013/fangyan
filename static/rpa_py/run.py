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

    # Click text=筛选
    page.click("text=筛选")

    # Click [placeholder="请输入"]
    page.click("[placeholder=\"请输入\"]")

    # Fill [placeholder="请输入"]
    page.fill("[placeholder=\"请输入\"]", "zdh_test")

    # Click button:has-text("筛选")
    # with page.expect_navigation(url="http://192.168.3.185/dpa/workflow/workflowList?title=zdh_test"):
    with page.expect_navigation():
        page.click("button:has-text(\"筛选\")")

    # Click text=执行 1 / 0 / 1 删除 移交创建权限 >> div
    # with page.expect_navigation(url="http://192.168.3.185/dpa/workflow/edit?modelId=mdccc332&instanceId=d5c28077&execIp=192.168.3.185&status=RUNNING"):
    with page.expect_navigation():
        page.click("text=执行 1 / 0 / 1 删除 移交创建权限 >> div")

    # Go to http://192.168.3.185/dpa/workflow/edit?modelId=mdccc332&instanceId=d5c28077&execIp=192.168.3.185&status=FINISH
    page.goto("http://192.168.3.185/dpa/workflow/edit?modelId=mdccc332&instanceId=d5c28077&execIp=192.168.3.185&status=FINISH")
    import time
    time.sleep(10)
    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
