"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const Pagination = ({
  totalCards,
  cardsPerPage,
  currentPage,
  setCurrentPage,
}: any) => {

  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCards.length / cardsPerPage);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(page);
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center gap-2">
      <Link href={`?page=${currentPage - 1}`} scroll={false} passHref>
        <button
          disabled={currentPage === 1}
          className="py-2 px-4 cursor-pointer"
        >
          Précédent
        </button>
      </Link>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link key={page} href={`?page=${page}`} scroll={false} passHref>
          <button
            key={page}
            className={currentPage === page ? "active:bg-red-700" : ""}
          >
            {page}
          </button>
        </Link>
      ))}
      <Link href={`?page=${currentPage + 1}`} scroll={false} passHref>
        <button disabled={currentPage === totalPages}>Suivant</button>
      </Link>
    </div>
  );
};

export default Pagination;
