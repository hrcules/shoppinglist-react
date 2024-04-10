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
      color: "var(--yellow)",
      size: 16,
    },
    color: "var(--yellow)",
    supporting_color: "var(--yellow-dark)",
  },
  {
    id: 2,
    label: "Legume",
    icon: {
      name: "Carrot",
      color: "var(--green)",
      size: 16,
    },
    color: "var(--green)",
    supporting_color: "var(--green-dark)",
  },
  {
    id: 3,
    label: "Carne",
    icon: {
      name: "Beef",
      color: "var(--pink)",
      size: 16,
    },
    color: "var(--pink)",
    supporting_color: "var(--pink-dark)",
  },
  {
    id: 4,
    label: "Fruta",
    icon: {
      name: "Apple",
      color: "var(--orange)",
      size: 16,
    },
    color: "var(--orange)",
    supporting_color: "var(--orange-dark)",
  },
  {
    id: 5,
    label: "Bebida",
    icon: {
      name: "Milk",
      color: "var(--blue)",
      size: 16,
    },
    color: "var(--blue)",
    supporting_color: "var(--blue-dark)",
  },
];
