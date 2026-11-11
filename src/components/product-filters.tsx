import Link from "next/link";

export type ProductFilterValues = {
  brand?: string;
  condition?: string;
  maxPrice?: string;
  sort?: string;
  q?: string;
};

const conditions = [
  { value: "NEW", label: "New" },
  { value: "REFURBISHED", label: "Refurbished" },
  { value: "USED", label: "Second hand" },
  { value: "EX_UK", label: "Ex UK" },
];

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:h-10 sm:w-auto sm:text-sm";

export function ProductFilters({
  action,
  brands,
  values,
}: {
  action: string;
  brands: string[];
  values: ProductFilterValues;
}) {
  const hasFilters = Boolean(
    values.brand || values.condition || values.maxPrice || values.sort,
  );

  return (
    <form
      action={action}
      method="get"
      className="grid grid-cols-2 items-end gap-3 rounded-xl border border-border bg-card p-4 sm:flex sm:flex-wrap"
    >
      {values.q ? <input type="hidden" name="q" value={values.q} /> : null}

      {brands.length > 0 ? (
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">
          Brand
          <select
            name="brand"
            defaultValue={values.brand ?? ""}
            className={fieldClass}
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">
        Condition
        <select
          name="condition"
          defaultValue={values.condition ?? ""}
          className={fieldClass}
        >
          <option value="">Any condition</option>
          {conditions.map((condition) => (
            <option key={condition.value} value={condition.value}>
              {condition.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">
        Max price (KES)
        <input
          type="number"
          name="maxPrice"
          min={0}
          step={100}
          inputMode="numeric"
          defaultValue={values.maxPrice ?? ""}
          placeholder="e.g. 20000"
          className={`${fieldClass} sm:w-36`}
        />
      </label>

      <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">
        Sort
        <select
          name="sort"
          defaultValue={values.sort ?? "newest"}
          className={fieldClass}
        >
          {sorts.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </label>

      <div className="col-span-2 flex items-center gap-2 sm:col-auto">
        <button
          type="submit"
          className="h-11 flex-1 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:h-10 sm:flex-none"
        >
          Apply
        </button>
        {hasFilters ? (
          <Link
            href={values.q ? `${action}?q=${encodeURIComponent(values.q)}` : action}
            className="text-sm text-muted-foreground underline-offset-2 hover:underline"
          >
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  );
}
