'use client';

import { useEffect } from 'react';

/**
 * Pre-selects form options from the address, for example
 * /contact?topic=experience or /join-oceania?interest=demo-plot, while the
 * page itself stays static. Only values that exist as options are applied.
 */
export function usePrefillFromQuery(formId: string, mapping: Record<string, string>) {
  useEffect(() => {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement)) return;
    const params = new URLSearchParams(window.location.search);

    for (const [param, fieldName] of Object.entries(mapping)) {
      const value = params.get(param);
      if (!value) continue;
      const controls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(`[name="${fieldName}"]`));
      for (const control of controls) {
        if (control instanceof HTMLSelectElement) {
          if (Array.from(control.options).some((option) => option.value === value)) control.value = value;
        } else if ((control.type === 'checkbox' || control.type === 'radio') && control.value === value) {
          control.checked = true;
        }
      }
    }
    // Mapping is static per form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);
}
