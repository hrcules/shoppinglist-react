import React, { createContext, useEffect, useState } from "react";
import { categoriesProps } from "../../utils/categories";
import { db } from "../../services/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../utils/hooks/useAuth";
import toast from "react-hot-toast";

export type ItemProps = {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  category: categoriesProps;
  completed: boolean;
};

export type MakeItemsProps = {
  items: ItemProps[];
  itemsLoading: boolean;
  handleAddingItem: (item: ItemProps, user_id: string) => void;
  handleDeleteTask: (user_id: string, task_id: string) => void;
  handleToggleTaskCompletion: (user_id: string, task_id: string) => void;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
};

const MakeItemsContext = createContext<MakeItemsProps>({} as MakeItemsProps);

const MakeItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<ItemProps[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [tasksPerPage, setTaskPerPage] = useState(7);

  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;

  const displayedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / tasksPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleAddingItem = async (item: ItemProps, user_id: string) => {
    try {
      const taskRef = doc(db, "tasks", user_id);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const tasksArray: [ItemProps] = taskDoc.data().tasks;
        tasksArray.unshift(item); // Adiciona a nova tarefa como a primeira da lista

        await updateDoc(taskRef, { tasks: tasksArray });

        setItems(tasksArray);
      } else {
        console.error("Documento não encontrado para o usuário.");
      }
    } catch (error) {
      console.error("Erro ao adicionar a tarefa:", error);
    }
  };

  const handleDeleteTask = async (user_id: string, task_id: string) => {
    const taskRef = doc(db, "tasks", user_id);
    const taskDoc = await getDoc(taskRef);

    if (taskDoc.exists()) {
      const tasksArray = taskDoc.data().tasks || [];
      const novaListaTarefas = tasksArray.filter(
        (task: ItemProps) => task.id !== task_id
      );

      await updateDoc(taskRef, { tasks: novaListaTarefas });
      setItems(novaListaTarefas);
      toast.success("Item deletado com sucesso!");
    } else {
      console.error("Documento não encontrado para o usuário.");
    }
  };

  const handleToggleTaskCompletion = async (
    user_id: string,
    task_id: string
  ) => {
    try {
      const taskRef = doc(db, "tasks", user_id);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const tasksArray: ItemProps[] = taskDoc.data().tasks || [];
        const updatedTasks = tasksArray.map((task) => {
          if (task.id === task_id) {
            return {
              ...task,
              completed: !task.completed, // Alterna entre true e false
            };
          }
          return task;
        });

        await updateDoc(taskRef, { tasks: updatedTasks });
        setItems(updatedTasks);
        console.log("Tarefa atualizada com sucesso!");
      } else {
        console.error("Documento não encontrado para o usuário.");
      }
    } catch (error) {
      console.error("Erro ao atualizar a tarefa:", error);
    }
  };

  // Atualiza a quantidade de tarefas por página ao carregar a página ou redimensionar a janela
  useEffect(() => {
    const updateTasksPerPage = () => {
      if (window.innerWidth <= 767) {
        setTaskPerPage(4); // Por exemplo, 15 tarefas por página para telas maiores que 1200px
      } else {
        setTaskPerPage(7); // Quantidade padrão de tarefas por página
      }
    };
    window.addEventListener("resize", updateTasksPerPage);
    return () => window.removeEventListener("resize", updateTasksPerPage);
  }, []);

  useEffect(() => {
    setItemsLoading(true);

    const handleExistingItems = async () => {
      if (!user) {
        toast.error("Não foi possível carregar as tasks.");
        return;
      }

      const taskRef = doc(db, "tasks", user.uid);
      const taskDoc = await getDoc(taskRef);

      const tasksArray: [ItemProps] = taskDoc.data()?.tasks || [];

      setItems(tasksArray);
      setItemsLoading(false);
    };

    if (user) {
      handleExistingItems();
    }
  }, [user]);

  return (
    <MakeItemsContext.Provider
      value={{
        items: displayedItems,
        handleAddingItem,
        itemsLoading,
        handleDeleteTask,
        handleToggleTaskCompletion,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
      }}
    >
      {children}
    </MakeItemsContext.Provider>
  );
};

export { MakeItemsContext, MakeItemsProvider };
