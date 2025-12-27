"use client";

import React, {useEffect, useState} from "react";
import IconFleche from "@/public/icons/arrow-up-solid.svg";
import Image from "next/image";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="flex  bg-primary  justify-center items-center cursor-pointer rounded-md size-10 bg-blue fixed z-9999 bottom-5 right-6 hover:scale-125 hover:duration-1000"
                >
                    <Image
                        src={IconFleche}
                        className="size-8 rounded-md"
                        alt="flèche vers le haut"
                    />
                </button>
            )}
        </>
    );
}
