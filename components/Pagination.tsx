"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const Pagination = ({
  totalCards,
  cardsPerPage,
  currentPage,
  setCurrentPage,
}: any) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const totalPages = Math.ceil(totalCards.length / cardsPerPage);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setCurrentPage(page);
  }, [searchParams]);

  return (
    <div className="flex flex-col justify-center items-center gap-2 md:flex-row">
      <div>
        <Link href={`?page=${currentPage - 1}`} scroll={false} passHref>
          <button
            disabled={currentPage === 1}
            className={`text-xl py-2 px-4 cursor-pointer font-semibold hover:scale-110 hover:duration-200 ${
              currentPage === 1 && "hidden"
            }`}
          >
            Précédent
          </button>
        </Link>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={`?page=${page}`}
            scroll={false}
            className="w-11 mr-2"
            passHref
          >
            <button
              key={page}
              className={`${
                pathName === "/list" && currentPage === page
                  ? "p-2 w-11 border-2 border-blue/50 bg-blue text-white"
                  : "p-2 w-11 border-2 border-blue/50"
              }`}
            >
              {page}
            </button>
          </Link>
        ))}
      </div>
      <div>
        <Link href={`?page=${currentPage + 1}`} scroll={false} passHref>
          <button
            disabled={currentPage === totalPages}
            className="text-xl py-2 px-4 cursor-pointer font-semibold hover:scale-110 hover:duration-200"
          >
            Suivant
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
