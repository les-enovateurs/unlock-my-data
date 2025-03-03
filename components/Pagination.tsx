"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PaginationCards } from "@/app/annuaire/page";

const Pagination = ({
  totalCards,
  cardsPerPage,
  currentPage,
  setCurrentPage,
}: PaginationCards) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const totalPages = Math.ceil(totalCards.length / cardsPerPage);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setCurrentPage(page);
  }, [searchParams]);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Link href="?page=1" scroll={false} key="first" className="mx-1">
          <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:border-primary hover:text-primary transition-colors">
            1
          </button>
        </Link>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots-start" className="mx-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link href={`?page=${i}`} scroll={false} key={i} className="mx-1">
          <button
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all ${
              currentPage === i
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {i}
          </button>
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots-end" className="mx-2 text-gray-400">
            ...
          </span>
        );
      }
      pages.push(
        <Link href={`?page=${totalPages}`} scroll={false} key="last" className="mx-1">
          <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:border-primary hover:text-primary transition-colors">
            {totalPages}
          </button>
        </Link>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 py-8">
      <Link href={`?page=${currentPage - 1}`} scroll={false} className="mx-2">
        <button
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed text-gray-400"
              : "hover:text-primary hover:bg-primary/5"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Précédent</span>
        </button>
      </Link>

      <div className="flex items-center">
        {renderPageNumbers()}
      </div>

      <Link href={`?page=${currentPage + 1}`} scroll={false} className="mx-2">
        <button
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed text-gray-400"
              : "hover:text-primary hover:bg-primary/5"
          }`}
        >
          <span className="hidden sm:inline">Suivant</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Link>
    </nav>
  );
};

export default Pagination;
