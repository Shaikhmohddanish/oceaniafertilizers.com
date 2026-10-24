import type { Product } from '@/content/types';

/** The product's facts as a record: category, packaging, dosage, application. Rows without data are left out. */
export function SpecRecord({ product }: { product: Product }) {
  const rows: [string, React.ReactNode][] = [['Category', product.category.title]];
  if (product.packSizes.length > 0) rows.push(['Packaging', product.packSizes.join(', ')]);
  if (product.dosage.length > 0) {
    rows.push([
      'Dosage',
      <ul key="dosage" className="space-y-1">
        {product.dosage.map((row) => (
          <li key={`${row.value}-${row.method ?? ''}`}>
            <span className="type-numeral font-medium">{row.value}</span>
            {row.basis ? ` ${row.basis}` : ''}
          </li>
        ))}
      </ul>,
    ]);
  }
  const methods = product.applicationMethods.map((method, index) =>
    index === 0 ? method.title : method.title.charAt(0).toLowerCase() + method.title.slice(1),
  );
  if (methods.length > 0) rows.push(['Application', methods.join(' or ')]);
  if (product.suitableCrops.length > 0) rows.push(['Crops', product.suitableCrops.map((crop) => crop.title).join(', ')]);

  return (
    <dl className="border-t border-[color:var(--line-strong)]">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[minmax(0,7.5rem)_1fr] gap-x-6 border-b border-[color:var(--line)] py-4 sm:grid-cols-[minmax(0,9rem)_1fr]"
        >
          <dt className="type-label pt-1 text-ink-500">{label}</dt>
          <dd className="text-ink-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
