import { FaUsers, FaShoppingCart, FaStore } from "react-icons/fa";

export const ListeTypeApp = {
  rs: {
    name: "Réseaux sociaux",
    url: "reseaux-sociaux",
    file: "socialNetworks",
    icon: FaUsers,
  },
  ecommerce: {
    name: "E-commerce",
    url: "ecommerce",
    file: "ecommerce",
    icon: FaShoppingCart,
  },
  ecommerceChinois: {
    name: "E-commerce Chinois",
    url: "ecommerce-chinois",
    icon: FaStore,
    file: "ecommerce-chinois",
  },
};

export default ListeTypeApp;
