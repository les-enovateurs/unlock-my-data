import Carte from "./carte";

export default function List() {
    return (
        <>
            <h1 className={"heading-1 text-3xl"}>Liste des entreprises</h1>

            <div className={"flex flex-col lg:flex-row md:gap-4"}>

                <Carte></Carte>
                <Carte></Carte>
                <Carte></Carte>


            </div>
        </>
    );
}
