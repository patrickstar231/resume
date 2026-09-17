import { test, expect } from '@playwright/test';

test('desktop hydrates, switches themes, and keeps the first-screen actions visible', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-enhanced', 'true');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans');
  const button = page.getByRole('link', { name: '看项目', exact: true }).first();
  const box = await button.boundingBox(); expect(box.y + box.height).toBeLessThan(900);
  await page.getByRole('button', { name: '设置', exact: true }).click();
  await page.getByLabel('外观', { exact: true }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  await page.locator('#behind').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('#behind img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  await page.locator('#intro').scrollIntoViewIfNeeded();
  await page.screenshot({ path: '.verification/home-dark.png', fullPage: true });
  await page.screenshot({ path: '.verification/home-hero-dark.png' });
  await page.getByRole('button', { name: '设置', exact: true }).click();
  await page.getByLabel('外观', { exact: true }).selectOption('light');
  await page.getByRole('button', { name: '关闭', exact: true }).press('Escape');
  await expect(page.getByRole('button', { name: '设置', exact: true })).toBeFocused();
  await page.screenshot({ path: '.verification/home-light.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('the stage engine dollies the camera, advances the timecode and clears the header blackout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-at-top', 'true');
  const clock = page.locator('.timecode b');
  await expect(clock).toHaveText('00:00:00:00');
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.locator('html').evaluate(el => Number(el.style.getPropertyValue('--camz')))).toBeGreaterThan(0);
  await expect.poll(() => page.locator('html').evaluate(el => Number(el.style.getPropertyValue('--hp')))).toBeGreaterThan(0);
  await expect(clock).not.toHaveText('00:00:00:00');
  await expect(page.locator('html')).not.toHaveAttribute('data-at-top', 'true');
  await expect.poll(() => page.locator('html').evaluate(() => [...document.querySelectorAll('[data-depth]')].some(node => node.style.getPropertyValue('--drift') !== ''))).toBe(true);
  await expect(page.locator('.cue-rail li.is-active')).toContainText('精选项目');
  await expect(page.locator('[data-focus]').first()).toHaveClass(/in-focus/);
});

test('mobile layouts fit and the menu traps focus and closes with Escape', async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 }); await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-enhanced', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const button = page.getByRole('link', { name: '看项目', exact: true }).first(); const box = await button.boundingBox(); expect(box.y + box.height).toBeLessThan(844);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: '菜单', exact: true }).click();
  await expect(page.locator('.menu-dialog')).toBeVisible();
  for (let i = 0; i < 9; i++) await page.keyboard.press('Tab');
  expect(await page.locator('.menu-dialog').evaluate(dialog => dialog.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '菜单', exact: true })).toBeFocused();
  await page.screenshot({ path: '.verification/home-mobile.png', fullPage: true });
  await page.screenshot({ path: '.verification/home-mobile-hero.png' });
});

test('reduced motion and touch keep photographs static, desktop parallax moves and cleans up', async ({ page, browser }) => {
  await page.goto('/');
  const drift = page.locator('.photo[data-motion-kind="crew"] .photo-inner');
  await drift.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const el = document.querySelector('.photo[data-motion-kind="crew"] .photo-inner');
    return el && el.style.transform !== '';
  });
  const before = await drift.getAttribute('style');
  await page.mouse.wheel(0, 420);
  await expect.poll(() => drift.getAttribute('style')).not.toBe(before);
  await page.getByRole('button', { name: '设置', exact: true }).click();
  await page.getByLabel('动态效果', { exact: true }).selectOption('reduce');
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  await expect.poll(() => drift.evaluate(el => el.style.transform)).toBe('');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-enhanced', 'true');
  expect(await page.locator('.photo[data-motion-kind="crew"] .photo-inner').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  const touch = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 1024, height: 768 } });
  const tablet = await touch.newPage(); await tablet.goto('http://127.0.0.1:4173/');
  await expect(tablet.locator('html')).toHaveAttribute('data-enhanced', 'true');
  expect(await tablet.locator('.photo[data-motion-kind="crew"] .photo-inner').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  await touch.close();
});

test('case and resume language links preserve the page, history works, and missing paths stay 404', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/projects/porsche-992/');
  await page.screenshot({ path: '.verification/case.png', fullPage: true });
  await expect(page.locator('.case-hero img')).toHaveAttribute('alt', /保时捷/);
  await expect(page.locator('.case-facts')).toContainText('newsroom.porsche.com');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/projects\/porsche-992\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Porsche 992 launch project');
  await page.goBack(); await expect(page).toHaveURL(/\/projects\/porsche-992\/$/);
  await page.goto('/resume/');
  await expect(page.locator('.experience-item')).toHaveCount(8);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.resume-toolbar')).toBeHidden();
  await page.pdf({ path: '.verification/resume-zh.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await page.goto('/en/resume/');
  await page.pdf({ path: '.verification/resume-en.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  const response = await page.goto('/missing-page/'); expect(response.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('这一页不存在。');
  expect(errors).toEqual([]);
});

test('without JavaScript, content, native details, language navigation and contact remain usable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4173/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('.fallback-menu summary').click();
  await expect(page.locator('.fallback-menu nav')).toBeVisible();
  await page.locator('.fallback-menu summary').click();
  await page.locator('.earlier-experience summary').click();
  await expect(page.locator('.earlier-experience')).toHaveAttribute('open', '');
  await expect(page.locator('.earlier-experience')).toContainText('深圳中青旅国际会议展览有限公司');
  await expect(page.locator('a[href="mailto:patrick_pan410@hotmail.com"]')).toBeVisible();
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/en/');
  await context.close();
});

test('storage, clipboard and image failures have usable fallbacks', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('blocked') }; Storage.prototype.setItem = () => { throw new Error('blocked') }; Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } }); });
  const page = await context.newPage();
  await page.route('**/images/work-crew-*', route => route.abort());
  await page.goto('http://127.0.0.1:4173/');
  await page.locator('.photo[data-motion-kind="crew"]').scrollIntoViewIfNeeded();
  await expect(page.locator('.photo[data-motion-kind="crew"]')).toContainText('照片暂时无法显示。');
  await page.getByRole('button', { name: '复制邮箱', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('请选中邮箱');
  await expect(page.locator('a[href="mailto:patrick_pan410@hotmail.com"]')).toBeVisible();
  await context.close();
});
