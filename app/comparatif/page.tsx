import Link from "next/link";
import ListeTypeApp from "../configComparatif/listeTypeApp";
import {FaArrowRight } from "react-icons/fa";

export default function ComparatifList() {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-2xl lg:text-4xl font-bold leading-tight text-center lg:text-left">
                🔒 Explore & compare : qui protège vraiment vos données&nbsp;?
            </h1>
            <div className="py-8 bg-white">
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
                    <div className="flex-1 flex flex-col items-center bg-pink-100 rounded-2xl p-5 shadow hover:scale-105 transition">
                        <span className="text-4xl mb-2">🔓</span>
                        <h3 className="text-lg font-bold mb-1 text-pink-700">Permissions</h3>
                        <p className="text-sm text-gray-600 text-center">Qui fouille dans votre téléphone&nbsp;?</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center bg-green-100 rounded-2xl p-5 shadow hover:scale-105 transition">
                        <span className="text-4xl mb-2">👍</span>
                        <h3 className="text-lg font-bold mb-1 text-green-700">+ Respect</h3>
                        <p className="text-sm text-gray-600 text-center">Les applis qui font les choses bien&nbsp;!</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center bg-red-100 rounded-2xl p-5 shadow hover:scale-105 transition">
                        <span className="text-4xl mb-2">👎</span>
                        <h3 className="text-lg font-bold mb-1 text-red-700">- Privacy</h3>
                        <p className="text-sm text-gray-600 text-center">Celles à éviter pour votre vie privée.</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center bg-yellow-100 rounded-2xl p-5 shadow hover:scale-105 transition">
                        <span className="text-4xl mb-2">🕵️‍♂️</span>
                        <h3 className="text-lg font-bold mb-1 text-yellow-700">Trackers</h3>
                        <p className="text-sm text-gray-600 text-center">Qui vous espionne vraiment&nbsp;?</p>
                    </div>
                </div>
            </div>

            <h2 className="text-4xl font-bold text-center mb-8 ">
                Choisissez un comparatif
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                {Object.entries(ListeTypeApp).map(([key, app]) => {
                    const Icon = app.icon;
                    return (
                        <Link
                            key={key}
                            href={`/comparatif/${app.url}`}
                            className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition group"
                        >
                            <Icon className="text-5xl mb-4 " />
                            <h2 className="text-2xl font-bold mb-2">
                                {app.name}
                            </h2>
                            <span className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:underline">
                Découvrir <FaArrowRight />
              </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}