"use client"

import { useState } from "react";
import Carte from "./carte";
import database from "./data.json";
import Image from 'next/image';

const dataScores = ["A", "B", "C", "D", "F", "G"]

export default function List() {
    const [isReverseOrder, setIsReverseOrder] = useState(false)

    const toggleOrder = () => {
        setIsReverseOrder(!isReverseOrder)
    }

    const sortedData = database.data
        .filter(data => dataScores.includes(data.score))
        .sort((a, b) => {
            const order = dataScores.indexOf(a.score) - dataScores.indexOf(b.score);
            return isReverseOrder ? -order : order;
        })

    return (
        <section className="my-5 mx-4">
            <h1 className="text-blue font-semibold text-3xl mb-2">Liste des entreprises</h1>
            <p className="text-lg">*<span className="font-bold">GAFAM</span>: Géants du web <span className="font-bold">G</span>oogle, <span className="font-bold">A</span>pple, <span className="font-bold">F</span>acebook, <span className="font-bold">A</span>mazon et <span className="font-bold">M</span>icrosoft</p>
            <p className="text-lg">Barême de note: <span className="text-lime-300 font-bold">A</span> score élevé à <span className="text-red-600 font-bold">G</span> score très mauvais</p>
            <div className="flex items-center gap-4 text-lg">
                Filtrer
                <Image
                    width={20}
                    height={20}
                    src="/images/filter.svg"
                    alt="filtre"></Image>
                <button
                    onClick={toggleOrder}
                    className={`font-semibold px-3 rounded-md ${!isReverseOrder ? "bg-blue text-white" : "border-2 border-blue"}`}>
                    De A à G
                </button>
                <button
                    onClick={toggleOrder}
                    className={`font-semibold px-3 rounded-md ${isReverseOrder ? "bg-blue text-white" : "border-2 border-blue"}`}>
                    De G à A
                </button>
            </div>
            <div className="flex flex-col items-center my-4 gap-4 md:flex-row md:flex-wrap">
                {
                    sortedData
                        .map((obj) => (
                            <Carte key={obj.id} {...obj} />
                        ))
                }
            </div>
        </section>
    );
}
