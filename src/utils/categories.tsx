export interface iconProps {
  name: string;
  size: number;
  color: string;
}

export interface categoriesProps {
  id: number;
  label: string;
  icon: iconProps;
  color: string;
  supporting_color: string;
}

export const categories: categoriesProps[] = [
  {
    id: 1,
    label: "Padaria",
    icon: {
      name: "Sandwich",
      color: "#B77908",
      size: 16,
    },
    color: "#8A5A00",
    supporting_color: "#FFF2CC",
  },
  {
    id: 2,
    label: "Legume",
    icon: {
      name: "Carrot",
      color: "#25834A",
      size: 16,
    },
    color: "#216E3D",
    supporting_color: "#DDF5E5",
  },
  {
    id: 3,
    label: "Carne",
    icon: {
      name: "Beef",
      color: "#C04469",
      size: 16,
    },
    color: "#A52E53",
    supporting_color: "#FCE4EC",
  },
  {
    id: 4,
    label: "Fruta",
    icon: {
      name: "Apple",
      color: "#D96525",
      size: 16,
    },
    color: "#A94718",
    supporting_color: "#FDE9D9",
  },
  {
    id: 5,
    label: "Bebida",
    icon: {
      name: "Milk",
      color: "#3478C8",
      size: 16,
    },
    color: "#245FA8",
    supporting_color: "#E1EEFF",
  },
  {
    id: 6,
    label: "Mercado",
    icon: {
      name: "ShoppingCart",
      color: "#8B6AC8",
      size: 16,
    },
    color: "#6745A6",
    supporting_color: "#EEE6FF",
  },
];
