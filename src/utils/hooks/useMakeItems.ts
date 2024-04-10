import { useContext } from "react";
import { MakeItemsContext } from "../../contexts/makeItems";

export const useMakeItems = () => {
  const context = useContext(MakeItemsContext);
  return context;
};
