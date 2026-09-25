"use client";

import { useState } from "react";
import CourseCard from "@/components/CourseCard";

export default function CourseCatalog({ courses, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const categoryNames = ["Todas", ...categories.map((category) => category.name)];
  const visibleCourses = selectedCategory === "Todas"
    ? courses
    : courses.filter((course) => course.category === selectedCategory);

  return (
    <>
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
          {visibleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
}
