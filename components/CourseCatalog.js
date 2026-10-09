"use client";

import { useState } from "react";
import CourseCard from "@/components/CourseCard";

function getStartDateKey(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  if (typeof value !== "string") return null;

  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : null;
}

export default function CourseCatalog({ courses, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [dateOrder, setDateOrder] = useState("asc");
  const categoryNames = ["Todas", ...categories.map((category) => category.name)];
  const visibleCourses = selectedCategory === "Todas"
    ? courses
    : courses.filter((course) => course.category === selectedCategory);
  const sortedCourses = [...visibleCourses].sort((a, b) => {
    const dateA = getStartDateKey(a.start_date);
    const dateB = getStartDateKey(b.start_date);
    if (!dateA) return dateB ? 1 : 0;
    if (!dateB) return -1;

    const dateComparison = dateA.localeCompare(dateB);
    return dateOrder === "asc" ? dateComparison : -dateComparison;
  });

  return (
    <>
      <div className="mb-5 flex items-center justify-end gap-2" aria-label="Ordenar por fecha de inicio">
        <span className="mr-1 text-sm text-ink-soft/70">Ordenar por fecha:</span>
        {[
          { order: "asc", label: "Fecha ascendente: más próxima primero", arrow: "↑" },
          { order: "desc", label: "Fecha descendente: más lejana primero", arrow: "↓" },
        ].map(({ order, label, arrow }) => {
          const isSelected = dateOrder === order;
          return (
            <button
              key={order}
              type="button"
              onClick={() => setDateOrder(order)}
              aria-label={label}
              title={label}
              aria-pressed={isSelected}
              className={`inline-flex h-10 w-10 items-center justify-center border text-xl font-semibold transition-colors ${
                isSelected
                  ? "border-teal bg-teal text-paper"
                  : "border-line bg-paper text-ink-soft hover:border-teal hover:text-teal"
              }`}
            >
              <span aria-hidden="true" className="leading-none">{arrow}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-8 flex flex-wrap gap-3" aria-label="Filtrar capacitaciones por categoría">
        {categoryNames.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={isSelected}
              className={`border px-4 py-3 text-sm font-semibold transition-colors ${
                isSelected
                  ? "border-teal bg-teal text-paper"
                  : "border-line bg-paper text-ink-soft hover:border-teal hover:text-teal"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {visibleCourses.length === 0 ? (
        <p className="border border-line p-8 text-center text-ink-soft/60">
          No hay capacitaciones disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {sortedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
}
