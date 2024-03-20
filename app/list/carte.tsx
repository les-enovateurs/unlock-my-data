'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Carte() {
    
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);


    const toggleDetailsCollapsible = () => {
        setIsDetailsOpen(!isDetailsOpen);
    };

    const toggleActionsCollapsible = () => {
        setIsActionOpen(!isActionOpen);
    };

    return (
        <div className={"bg-[#F9F9F9] p-3 border border-[#707070] text-black w-full md:w-2/3 md:mx-auto lg:w-5/12 self-start shadow-2xl rounded-lg"}>
            <div className={"flex justify-between rounded-xl mb-5"}>
                <img className={"self-center"} width={80} src="https://logo.clearbit.com/facebook.com" alt="Logo de l'entreprise"></img>
                <div className={"flex flex-col ml-3 mr-auto"}>
                    <div>
                        <Image
                            src="/images/data-leak.svg"
                            height={30}
                            width={30}
                            alt="Nombre de vols de données"
                            className={"inline"}
                        />
                        <p className={"inline ml-2"}>XY vols de données</p>
                    </div>
                    <div>
                        <Image
                            src="/images/danger.svg"
                            height={30}
                            width={30}
                            alt=""
                            className={"inline"}
                        />
                        <p className={"inline ml-2"}>Dernier incident : il y a 2 ans</p>
                    </div>
                </div>
                <div className="{flex flex-col}">
                    <Image 
                        className={"self-center"}
                        width={30}
                        height={20}
                        src="/images/Flag_of_France.svg"
                        alt="Nationalité de l'entreprise" 
                    />
                    <p>FRA</p>
                </div>
            </div>
            <div className={"flex justify-between"} onClick={toggleDetailsCollapsible}>
                <Image src="/images/score.png" width={200} height={43} alt="Score X en protection des données personnelles" />
                <p className='self-center'>
                    Voir le détail
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`ml-3 h-6 w-6 inline ${isDetailsOpen ? 'transform rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </p>
            </div>
            {isDetailsOpen && (
                <div className="p-4 grid grid-cols-2 gap-4">
                    <div className='flex'>
                        <Image
                            src="/images/fingerprint.svg"
                            height={30}
                            width={30}
                            alt="DPO"
                            className={"inline"}
                        />
                        <p className={"inline ml-2"}>
                            0 cookie collecté<br/>
                            Aucune donnée stockée
                        </p>
                    </div>
                    <div className='flex'>
                        <Image
                            src="/images/building.svg"
                            height={30}
                            width={30}
                            alt="DPO"
                            className={"inline"}
                        />
                        <p className={"inline ml-2"}>
                            Ne fais pas partie des GAFAM
                        </p>
                    </div>
                    <div className='flex'>
                        <Image
                            src="/images/server.svg"
                            height={30}
                            width={30}
                            alt="DPO"
                            className={"inline"}
                        />
                        <p className={"inline ml-2 my-auto"}>
                            Serveurs en France
                        </p>
                    </div>
                    <div className='flex'>
                        <Image
                            src="/images/form.svg"
                            height={30}
                            width={30}
                            alt="DPO"
                            className={"inline"}
                        />
                        <p className={"inline ml-2"}>
                            Démarches accessibles et faciles pour faire valoir ses droits  
                        </p>
                    </div>
                </div>
            )}

            <div className={"flex justify-end border-t border-[#707070]"} onClick={toggleActionsCollapsible}>
                    <p className='self-center'>
                        Comment agir ?
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`ml-3 h-6 w-6 inline ${isActionOpen ? 'transform rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </p>
                </div>
                {isActionOpen && (
                    <div className="p-4">
                        <div className='flex'>
                            <Image
                                src="/images/account.svg"
                                height={30}
                                width={30}
                                alt="DPO"
                                className={"inline"}
                            />
                            <p className={"inline ml-2"}>
                                Contacter le chargé de protection des données par mail à l&apos;adresse : <br/>
                                <a href="mailto:test@gmail.com" className={'text-blue-600'}>test@gmail.com</a>
                            </p>
                        </div>
                        <hr className='border-none bg-black h-px my-2' />
                        <div className='flex'>
                            <Image
                                src="/images/formulaire-de-contact.svg"
                                height={30}
                                width={30}
                                alt="DPO"
                                className={"inline"}
                            />
                            <p className={"inline ml-2"}>
                                Se rendre à l&apos;adresse suivante pour demander à exercer vos droits : <br/>
                                <a href="test.com/lien-rgpd" className={'text-blue-600'}>test.com/lien-rgpd</a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
    );
}