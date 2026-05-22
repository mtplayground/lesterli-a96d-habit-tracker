import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('creates, exports, clears, imports, and restores a checked habit', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await page
    .getByLabel('Your habits')
    .getByRole('link', { name: 'New habit' })
    .click()
  await page.getByLabel('Name').fill('Hydrate')
  await page.getByLabel('Description').fill('Drink water every day')
  await page.getByRole('button', { name: 'Create habit' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Hydrate' })).toBeVisible()

  await page.getByRole('button', { name: 'Check in today' }).click()

  await expect(
    page.getByRole('button', { name: 'Checked today' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByLabel('Current streak: 1 day')).toBeVisible()

  const checkedCell = page.locator(
    '[data-testid="heatmap-day"][data-checked="true"]',
  )

  await expect(checkedCell).toHaveCount(1)
  await expect(checkedCell).toHaveCSS('fill', 'rgb(40, 112, 92)')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export' }).click()
  const download = await downloadPromise
  const exportPath = testInfo.outputPath('habit-tracker-export.json')

  expect(download.suggestedFilename()).toMatch(
    /^habit-tracker-export-\d{8}\.json$/,
  )
  await download.saveAs(exportPath)

  const exportedState = JSON.parse(await readFile(exportPath, 'utf8')) as {
    checkIns: unknown[]
    habits: { name: string }[]
  }

  expect(exportedState.habits).toEqual([
    expect.objectContaining({ name: 'Hydrate' }),
  ])
  expect(exportedState.checkIns).toHaveLength(1)

  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await expect(
    page.getByRole('heading', { name: 'No habits yet' }),
  ).toBeVisible()

  await page.locator('#habit-import-file').setInputFiles(exportPath)
  await expect(
    page.getByText('Ready to import 1 habits and 1 check-ins.'),
  ).toBeVisible()
  await page.getByLabel('Replace current data').check()
  await page.getByRole('button', { name: 'Apply import' }).click()

  await expect(page.getByRole('heading', { name: 'Hydrate' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Checked today' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByLabel('Current streak: 1 day')).toBeVisible()
})
