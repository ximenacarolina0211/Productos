import Link from "next/link";
import { Category } from "@/types/category";

type CategoryFilterProps = {
  categories: Category[];
  selectedCategoryId?: string;
};

export default function CategoryFilter({
  categories,
  selectedCategoryId,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/"
        className={`px-4 py-2 text-sm font-semibold transition ${
          !selectedCategoryId
            ? "bg-white text-[#3b0764]"
            : "border border-white/25 text-violet-100 hover:bg-white/10"
        }`}
      >
        Todas
      </Link>

      {categories.map((category) => {
        const isSelected = selectedCategoryId === String(category.id);

        return (
          <Link
            key={category.id}
            href={`/?categoryId=${category.id}`}
            className={`px-4 py-2 text-sm font-semibold transition ${
              isSelected
                ? "bg-[color:var(--accent)] text-white"
                : "border border-white/25 text-violet-100 hover:bg-white/10"
            }`}
          >
            {category.nombre}
          </Link>
        );
      })}
    </div>
  );
}
