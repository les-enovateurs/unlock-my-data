import { Data } from "@/app/list-app/page";
import React from "react";

export default function ListSitefound({
  sitesfound,
  getPageForSite,
  currentPage,
  setCurrentPage,
  cardRefs,
  setNameSite,
  setSitesFound,
  setErrorMessage,
}: any) {
  return (
    <>
      {sitesfound.length > 0 && (
        <ul className="bg-white rounded-lg mt-2 w-2/6">
          {sitesfound.map((site: Data) => {
            const matchedSitePage = getPageForSite(site.id);
            return (
              <li
                key={site.id}
                tabIndex={0}
                className="flex items-center px-4 py-2 text-xl rounded-lg font-semibold hover:bg-blue hover:text-white cursor-pointer"
                onClick={() => {
                  if (matchedSitePage !== currentPage) {
                    setCurrentPage(matchedSitePage);
                  }

                  setTimeout(() => {
                    if (cardRefs.current[site.id]) {
                      cardRefs.current[site.id]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                      setNameSite("");
                      setSitesFound([]);
                      setErrorMessage(false);
                    }
                  }, 300);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    if (matchedSitePage !== currentPage) {
                      setCurrentPage(matchedSitePage);
                    }

                    setTimeout(() => {
                      if (cardRefs.current[site.id]) {
                        cardRefs.current[site.id]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        setNameSite("");
                        setSitesFound([]);
                        setErrorMessage(false);
                      }
                    }, 300);
                  }
                }}
              >
                {site.name}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
