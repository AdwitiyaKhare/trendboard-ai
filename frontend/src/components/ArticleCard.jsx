import React from "react";
import { format } from "date-fns";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

// Helper to generate very light random color
function randomVeryLightColor() {
  const r = Math.floor(245 + Math.random() * 10);
  const g = Math.floor(245 + Math.random() * 10);
  const b = Math.floor(245 + Math.random() * 10);
  return `rgb(${r},${g},${b})`;
}

export default function ArticleCard({ article }) {
  const gradientStart = randomVeryLightColor();
  const gradientEnd = randomVeryLightColor();

  return (
    <article
      className="rounded-xl shadow-md p-6 cursor-pointer 
                 transform transition-transform duration-300 ease-out
                 hover:-translate-y-1 hover:shadow-lg 
                 flex flex-col justify-between h-full
                 group"
      style={{
        background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
      }}
    >
      {/* Title */}
      <a
        href={article.link || "#"}
        target="_blank"
        rel="noreferrer"
        className="transition-colors duration-300"
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {article.title}
        </h2>
      </a>

      {/* Source & Date */}
      <div className="flex justify-between text-gray-500 text-xs mb-4">
        <span>{article.source}</span>
        <span>
          {article.publishedAt
            ? format(
                new Date(article.publishedAt.seconds * 1000),
                "MMM d, yyyy HH:mm"
              )
            : ""}
        </span>
      </div>

      {/* Summary */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">
        {article.summary || "No summary yet."}
      </p>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Read More Button */}
      <div className="mt-auto">
        <a
          href={article.link || "#"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg
                     hover:bg-blue-600 transition-colors duration-300"
        >
          Read More
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </a>
      </div>
    </article>
  );
}
