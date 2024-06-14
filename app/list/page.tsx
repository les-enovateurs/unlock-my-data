import Carte from "./carte";
import database from "./data.json"; 

export default function List() {
    return (
        <section className="flex flex-col gap-4 my-5 mx-2">
            <h1 className="text-blueTitle font-semibold text-3xl mx-3 lg:mx-10">Liste des entreprises</h1>
            <p className="text-lg">*<span className="font-bold">GAFAM</span>: Géants du web <span className="font-bold">G</span>oogle, <span className="font-bold">A</span>pple, <span className="font-bold">F</span>acebook, <span className="font-bold">A</span>mazon et <span className="font-bold">M</span>icrosoft</p>
            {/* <div className="flex flex-col my-4 gap-4 lg:flex-wrap lg:flex-row lg:justify-center align-center"> */}
                
            {
                database.data.map((obj) => (
                    <Carte key={obj.id} {...obj} />
                ))
            }
            {/* </div> */}
        </section>
    );
}
