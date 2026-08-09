import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface CitySearchProps {
  search: string;
  countryCode: string;
  ordering: string;
  onSearch: (v: string) => void;
  onCountry: (v: string) => void;
  onOrdering: (v: string) => void;
}

const COUNTRY_CODES = ["DE", "AT", "CH", "NL", "FR", "IT", "ES", "PL", "CZ", "BE"];

/** The city catalog search/filter/ordering controls. */
export function CitySearch({
  search,
  countryCode,
  ordering,
  onSearch,
  onCountry,
  onOrdering,
}: CitySearchProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-600 dark:text-slate-300">Search by name</span>
        <Input
          type="search"
          placeholder="berlin, münchen, …"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-600 dark:text-slate-300">Country</span>
        <Select
          value={countryCode}
          onChange={(e) => onCountry(e.target.value)}
        >
          <option value="">all</option>
          {COUNTRY_CODES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-600 dark:text-slate-300">Order by</span>
        <Select value={ordering} onChange={(e) => onOrdering(e.target.value)}>
          <option value="name">Name (A–Z)</option>
          <option value="-population">Population (largest first)</option>
          <option value="population">Population (smallest first)</option>
        </Select>
      </label>
    </div>
  );
}