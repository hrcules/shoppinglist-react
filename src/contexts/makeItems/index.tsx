import React, {
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  const itemsRef = useRef<ItemProps[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTaskPerPage] = useState(7);

  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const displayedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / tasksPerPage);

  const updateLocalItems = (nextItems: ItemProps[]) => {
    // Update the ref synchronously so rapid edits build on the latest local state.
    itemsRef.current = nextItems;
    setItems(nextItems);
  };

  const persistItems = (user_id: string, nextItems: ItemProps[]) => {
    if (!user_id) return;

    // Firestore applies this write to its local cache immediately and queues it
    // for synchronization when the device reconnects.
    const taskRef = doc(db, "tasks", user_id);
    void updateDoc(taskRef, { tasks: nextItems }).catch((error) => {
      console.error("Erro ao sincronizar a lista de compras:", error);
      toast.error(
        "Não foi possível sincronizar a lista. Verifique sua conexão e tente novamente."
      );
    });
  };

  const handleAddingItem = (item: ItemProps, user_id: string) => {
    if (!user_id) {
      toast.error("Faça login para alterar sua lista.");
      return;
    }

    const nextItems = [item, ...itemsRef.current];
    updateLocalItems(nextItems);
    persistItems(user_id, nextItems);
  };

  const handleDeleteTask = (user_id: string, task_id: string) => {
    if (!user_id) return;

    const nextItems = itemsRef.current.filter((task) => task.id !== task_id);
    updateLocalItems(nextItems);
    persistItems(user_id, nextItems);
    toast.success("Item deletado com sucesso!");
  };

  const handleToggleTaskCompletion = (user_id: string, task_id: string) => {
    if (!user_id) return;

    const nextItems = itemsRef.current.map((task) =>
      task.id === task_id
        ? { ...task, completed: !task.completed }
        : task
    );

    updateLocalItems(nextItems);
    persistItems(user_id, nextItems);
  };

  useEffect(() => {
    const updateTasksPerPage = () => {
      if (window.innerWidth <= 767) {
        setTaskPerPage(4);
      } else {
        setTaskPerPage(7);
      }
    };

    updateTasksPerPage();
    window.addEventListener("resize", updateTasksPerPage);
    return () => window.removeEventListener("resize", updateTasksPerPage);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadItems = async () => {
      if (!user) {
        updateLocalItems([]);
        setItemsLoading(false);
        return;
      }

      setItemsLoading(true);

      try {
        const taskRef = doc(db, "tasks", user.uid);
        const taskDoc = await getDoc(taskRef);
        const tasksArray = (taskDoc.data()?.tasks || []) as ItemProps[];

        if (!cancelled) {
          updateLocalItems(tasksArray);
        }
      } catch (error) {
        console.error("Erro ao carregar a lista de compras:", error);
        if (!cancelled) {
          toast.error(
            "Não foi possível carregar a lista. Conecte-se à internet para tentar novamente."
          );
        }
      } finally {
        if (!cancelled) setItemsLoading(false);
      }
    };

    void loadItems();

    return () => {
      cancelled = true;
    };
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
        nextPage: () => setCurrentPage((page) => page + 1),
        prevPage: () => setCurrentPage((page) => Math.max(1, page - 1)),
      }}
    >
      {children}
    </MakeItemsContext.Provider>
  );
};

export { MakeItemsContext, MakeItemsProvider };
