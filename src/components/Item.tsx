import { useEffect, useRef, useState } from "react";
import { EllipsisVertical, ShoppingCart, Trash } from "lucide-react";

import styles from "../styles/components/Item.component.module.css";
import { ItemProps } from "../contexts/makeItems";

import { Sandwich, Carrot, Beef, Apple, Milk } from "lucide-react";
import { iconProps } from "../utils/categories";
import { useMakeItems } from "../utils/hooks/useMakeItems";
import { useAuth } from "../utils/hooks/useAuth";
import toast from "react-hot-toast";

function Item({ id, item, category, quantity, unit, completed }: ItemProps) {
  const [isEditOptionsOpen, setIsEditOptionsOpen] = useState(false);
  const { user } = useAuth();
  const { handleDeleteTask, handleToggleTaskCompletion } = useMakeItems();

  const editRef = useRef<HTMLDivElement | null>(null);

  const handleIconViewer = (icon: iconProps) => {
    if (icon.name === "Sandwich") {
      return <Sandwich size={icon.size} color={icon.color} />;
    } else if (icon.name === "Carrot") {
      return <Carrot size={icon.size} color={icon.color} />;
    } else if (icon.name === "Beef") {
      return <Beef size={icon.size} color={icon.color} />;
    } else if (icon.name === "Apple") {
      return <Apple size={icon.size} color={icon.color} />;
    } else if (icon.name === "Milk") {
      return <Milk size={icon.size} color={icon.color} />;
    } else if (icon.name === "ShoppingCart") {
      return <ShoppingCart size={icon.size} color={icon.color} />;
    }
  };

  const handleCheckboxChange = () => {
    if (!user) {
      return toast.error("Não foi possível atualizar o item.");
    }
    handleToggleTaskCompletion(user?.uid, id);
  };

  const handleDelete = async () => {
    if (!user) {
      return toast.error("Não é possível deletar o item.");
    }

    handleDeleteTask(user?.uid, id);
    setIsEditOptionsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        setIsEditOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editRef]);

  return (
    <div
      className={`${styles.itemContainer} ${
        completed ? styles.itemContainerChecked : ""
      }`}
    >
      <div className={styles.itemLeft}>
        <input
          type="checkbox"
          checked={completed}
          onChange={handleCheckboxChange}
        />
        <div className={styles.itemLeftText}>
          <p
            className={`${styles.itemTitle} ${
              completed ? styles.titleIsChecked : ""
            }`}
          >
            {item}
          </p>
          <p
            className={`${styles.itemDescription} ${
              completed ? styles.isChecked : ""
            }`}
          >
            {quantity} {unit}
          </p>
        </div>
      </div>
      <div className={styles.itemRight}>
        <div
          className={`${styles.ItemCategory} ${
            completed ? styles.isChecked : ""
          }`}
          style={{
            backgroundColor: category.supporting_color,
          }}
        >
          {handleIconViewer(category.icon)}
          <p
            style={{
              color: category.color,
            }}
          >
            {category.label}
          </p>
        </div>

        <div title="Editar">
          <EllipsisVertical
            size={16}
            color="var(--purple-light)"
            style={{
              cursor: "pointer",
            }}
            onClick={() => setIsEditOptionsOpen(!isEditOptionsOpen)}
          />
        </div>

        {isEditOptionsOpen && (
          <div className={styles.itemEditOpitionContainer} ref={editRef}>
            {/* Adicionar essa funcionalidade mais pra frente. */}
            {/* <div className={styles.itemEditOption}>
              <Pencil size={18} color="var(--gray-200)" />
              <p>Editar</p>
            </div> */}
            <div
              className={styles.itemEditOption}
              onClick={() => handleDelete()}
            >
              <Trash size={18} color="var(--orange)" />
              <p
                style={{
                  color: "var(--orange)",
                }}
              >
                Deletar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Item;
