import Carte from "./carte";
import database from "./data.json"; 

export default function List() {
    return (
        <section className="my-5">
            <h1 className={"heading-1 text-3xl mx-3 lg:mx-10"}>Liste des entreprises</h1>
            <div className={"flex flex-col my-4 gap-4 lg:flex-wrap lg:flex-row lg:justify-center align-center"}>
                
            {
                database.data.map((obj) => (
                    <Carte key={obj.id} {...obj} />
                ))
            }
            </div>
        </section>
    );
}
