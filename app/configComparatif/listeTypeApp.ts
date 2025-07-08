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
  ecommerceAsiatique: {
    name: "E-commerce asiatique",
    url: "ecommerce-asiatique",
    icon: FaStore,
    file: "ecommerce-asiatique",
  },
};

export default ListeTypeApp;
