'use client';

import Image from 'next/image';
import { useState } from 'react';
import logoLeak from '/public/images/data-leak.svg';
import logoDanger from '/public/images/danger.svg';
import drapeauFra from '/public/images/Flag_of_France.svg';
import logoEmpreinte from '/public/images/fingerprint.svg';
import logoEntreprise from '/public/images/building.svg';
import logoServer from '/public/images/server.svg';
import logoForm from '/public/images/form.svg';
import logoAccount from '/public/images/account.svg';
import logoContactForm from '/public/images/formulaire-de-contact.svg';

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
                <Image className={"self-center"} width={80} height={80} src="https://logo.clearbit.com/facebook.com" alt="Logo de l'entreprise"></Image>
                <div className={"flex flex-col ml-3 mr-auto"}>
                    <div>
                        <Image
                            src={logoLeak}
                            height={30}
                            width={30}
                            alt="Nombre de vols de données"
                            className={"inline"}
                        />
                        <p className={"inline ml-2"}>XY vols de données</p>
                    </div>
                    <div>
                        <Image
                            src={logoDanger}
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
                        src={drapeauFra}
                        alt="Nationalité de l'entreprise" 
                    />
                    <p>FRA</p>
                </div>
            </div>
            <div className={"flex justify-between my-2"} onClick={toggleDetailsCollapsible}>
                <div>
                    <p className='inline'>Score : </p>
                    <p className='inline bg-green-600 px-2 text-2xl font-bold rounded-full'>A</p>
                </div>
                
                <p className='self-center cursor-pointer'>
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
                            src={logoEmpreinte}
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
                            src={logoEntreprise}
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
                            src={logoServer}
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
                            src={logoForm}
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
                    <p className='self-center cursor-pointer'>
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
                                src={logoAccount}
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
                                src={logoContactForm}
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