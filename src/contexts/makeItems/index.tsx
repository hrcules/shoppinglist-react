import React, { createContext, useEffect, useState } from "react";
import { categoriesProps } from "../../utils/categories";
import { db } from "../../services/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../utils/hooks/useAuth";
import toast from "react-hot-toast";

export type ItemProps = {
  item: string;
  quantity: number;
  unit: string;
  category: categoriesProps;
};

export type MakeItemsProps = {
  items: ItemProps[];
  handleAddingItem: (item: ItemProps, user_id: string) => void;
};

const MakeItemsContext = createContext<MakeItemsProps>({} as MakeItemsProps);

const MakeItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const { user } = useAuth();

  const handleAddingItem = async (item: ItemProps, user_id: string) => {
    try {
      const taskRef = doc(db, "tasks", user_id);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const tasksArray: [ItemProps] = taskDoc.data().tasks;
        tasksArray.push(item);
        console.log(tasksArray);

        await updateDoc(taskRef, { tasks: tasksArray });

        setItems(tasksArray);

        console.log("Tarefa adicionada com sucesso!");
      } else {
        console.error("Documento não encontrado para o usuário.");
      }
    } catch (error) {
      console.error("Erro ao adicionar a tarefa:", error);
    }
  };

  useEffect(() => {
    const handleExistingItems = async () => {
      if (user) {
        const taskRef = doc(db, "tasks", user.uid);
        const taskDoc = await getDoc(taskRef);

        const tasksArray: [ItemProps] = taskDoc.data()?.tasks;

        setItems(tasksArray);
      } else {
        toast.error("não foi possível carregar as tasks");
      }
    };

    handleExistingItems();
  }, []);

  return (
    <MakeItemsContext.Provider value={{ items, handleAddingItem }}>
      {children}
    </MakeItemsContext.Provider>
  );
};

export { MakeItemsContext, MakeItemsProvider };
