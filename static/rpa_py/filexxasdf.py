from playwright.sync_api import Playwright, sync_playwright


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to https://www.baidu.com/
    page.goto("https://www.baidu.com/")

    # Click text=过半学生可解开游戏防沉迷系统
    with page.expect_popup() as popup_info:
        page.click("text=过半学生可解开游戏防沉迷系统")
    page1 = popup_info.value

    # Click text=文库
    page1.click("text=文库")
    # assert page1.url == "https://wenku.baidu.com/search?lm=0&od=0&ie=utf-8&word=%E8%BF%87%E5%8D%8A%E5%AD%A6%E7%94%9F%E5%8F%AF%E8%A7%A3%E5%BC%80%E6%B8%B8%E6%88%8F%E9%98%B2%E6%B2%89%E8%BF%B7%E7%B3%BB%E7%BB%9F"

    # Close page
    page1.close()

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()
    print('1234')

with sync_playwright() as playwright:
    run(playwright)
