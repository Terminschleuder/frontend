import { PAGE_SIZE_OPTIONS } from "@/config/constants";
import { Select } from "@/components/ui/select";

interface PageSizeSelectProps {
  value: number;
  onChange: (size: number) => void;
}

export function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
      <span>Per page</span>
      <Select
        value={String(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20"
      >
        {PAGE_SIZE_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </Select>
    </label>
  );
}