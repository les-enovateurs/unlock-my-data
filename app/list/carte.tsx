'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Carte() {
    
    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapsible = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={"bg-[#F9F9F9] p-3 border border-[#707070] text-black md:w-2/3 lg:w-1/3 self-start"}>
            <div className={"flex justify-between rounded-xl mb-5"}>
                <img className={"self-center"} src="https://place-hold.it/80" alt="Logo de l'entreprise"></img>
                <div className={"flex flex-col ml-3 mr-auto"}>
                    <div>
                        <Image
                            src="/images/account.svg"
                            height={30}
                            width={30}
                            alt="DPO"
                            className={"inline"}
                        />
                        <p className={"inline ml-2"}>Test</p>
                    </div>
                    <div>
                        <Image
                            src="/images/data-leak.svg"
                            height={30}
                            width={30}
                            alt="DPO"
                            className={"inline"}
                        />
                        <p className={"inline ml-2"}>XY fuites enregistrées</p>
                    </div>
                    <div>
                        <Image
                            src="/images/danger.svg"
                            height={30}
                            width={30}
                            alt="DPO"
                            className={"inline"}
                        />
                        <p className={"inline ml-2"}>Dernière fuite : il y a 2 ans</p>
                    </div>
                </div>
                <div className="{flex flex-col}">
                    <img className={"self-center"} src="https://place-hold.it/30" alt="Nationalité de l'entreprise"></img>
                    <p>FRA</p>
                </div>
            </div>
            <div className={"flex justify-between"} onClick={toggleCollapsible}>
                <img src="https://place-hold.it/100x50" alt="Score X en protection des données personnelles"></img>
                <p className='self-center'>
                    Voir le détail de la note
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`ml-3 h-6 w-6 inline ${isOpen ? 'transform rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </p>
            </div>
            {isOpen && (
                <div className="p-4">
                    <p>This is the content of the collapsible.</p>
                </div>
            )}
        </div>
    );
}