import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { ROUTES } from './helpers';

test.describe('automated accessibility checks (WCAG 2.2 A and AA rules)', () => {
  for (const route of [...ROUTES, '/does-not-exist']) {
    test(route, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      // Sections far below the fold skip rendering until scrolled to, which hides them from
      // axe's colour sampling. Render everything so contrast is checked as a visitor sees it.
      await page.addStyleTag({ content: '.render-later { content-visibility: visible !important; }' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const summary = results.violations.map(
        (violation) => `${violation.id} (${violation.impact}): ${violation.nodes.map((node) => node.target.join(' ')).slice(0, 3).join(' | ')}`,
      );
      expect(summary).toEqual([]);
    });
  }
});
