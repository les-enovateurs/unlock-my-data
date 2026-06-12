import CatalogContent from "@/components/CatalogContent";
import { buildCatalog } from "@/lib/catalog";

export default function Annuaire() {
    return <CatalogContent lang="en" services={buildCatalog()} />;
}
