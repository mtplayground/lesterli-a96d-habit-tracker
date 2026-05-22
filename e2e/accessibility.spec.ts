import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const expectNoAxeViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze()

  expect(results.violations).toEqual([])
}

test('dashboard and delete dialog have no axe violations', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await expectNoAxeViolations(page)

  await page
    .getByLabel('Your habits')
    .getByRole('link', { name: 'New habit' })
    .click()
  await page.getByLabel('Name').fill('Hydrate')
  await page.getByRole('button', { name: 'Create habit' }).click()
  await expect(page.getByRole('heading', { name: 'Hydrate' })).toBeVisible()

  await expectNoAxeViolations(page)

  await page.locator('summary').click()
  await page.getByRole('menuitem', { name: 'Delete' }).click()
  await expect(
    page.getByRole('dialog', { name: 'Delete Hydrate?' }),
  ).toBeVisible()

  await expectNoAxeViolations(page)
})
