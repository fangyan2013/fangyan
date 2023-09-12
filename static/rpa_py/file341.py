from playwright.sync_api import Playwright, sync_playwright


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to https://www.baidu.com/
    page.goto("https://www.baidu.com/")

    # Click text=超9.69亿人完成新冠疫苗全程接种
    with page.expect_popup() as popup_info:
        page.click("text=超9.69亿人完成新冠疫苗全程接种")
    page1 = popup_info.value

    # Click em:has-text("超9.69亿人完成新冠疫苗全程接种")
    with page1.expect_popup() as popup_info:
        page1.click("em:has-text(\"超9.69亿人完成新冠疫苗全程接种\")")
    page2 = popup_info.value

    # Click text=作者最新文章
    page2.click("text=作者最新文章")

    # Click text=专家学者共话“一带一路”理论与实践发展
    with page2.expect_popup() as popup_info:
        page2.click("text=专家学者共话“一带一路”理论与实践发展")
    page3 = popup_info.value

    # Close page
    page3.close()

    # Close page
    page2.close()

    # Close page
    page1.close()

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
