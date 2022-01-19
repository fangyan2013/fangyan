from playwright.sync_api import Playwright, sync_playwright


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to https://www.baidu.com/
    page.goto("https://www.baidu.com/")

    # Click text=1中方回应阿富汗塔利班成立新政府热
    with page.expect_popup() as popup_info:
        page.click("text=1中方回应阿富汗塔利班成立新政府热")
    page1 = popup_info.value

    # Close page
    page1.close()

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
