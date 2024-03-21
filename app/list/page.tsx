import Carte from "./carte";

export default function List() {
    return (
        <section className="my-5">
            <h1 className={"heading-1 text-3xl mx-10"}>Liste des entreprises</h1>

            <div className={"flex flex-col my-4 gap-4 lg:flex-wrap lg:flex-row lg:justify-center align-center"}>
                <Carte></Carte>
                <Carte></Carte>
                <Carte></Carte>
                <Carte></Carte>
            </div>
        </section>
    );
}
