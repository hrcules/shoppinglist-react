import { useState } from "react";
import { EllipsisVertical } from "lucide-react";

import styles from "../styles/components/Item.component.module.css";
import { ItemProps } from "../contexts/makeItems";

import { Sandwich, Carrot, Beef, Apple, Milk } from "lucide-react";
import { iconProps } from "../utils/categories";

function Item({ item, category, quantity, unit }: ItemProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleIconViewer = (icon: iconProps) => {
    if (!icon) {
      <></>;
    } else if (icon.name === "Sandwich") {
      return <Sandwich size={icon.size} color={icon.color} />;
    } else if (icon.name === "Carrot") {
      return <Carrot size={icon.size} color={icon.color} />;
    } else if (icon.name === "Beef") {
      return <Beef size={icon.size} color={icon.color} />;
    } else if (icon.name === "Apple") {
      return <Apple size={icon.size} color={icon.color} />;
    } else if (icon.name === "Milk") {
      return <Milk size={icon.size} color={icon.color} />;
    }
  };

  return (
    <div
      className={`${styles.itemContainer} ${
        isChecked ? styles.itemContainerChecked : ""
      }`}
    >
      <div className={styles.itemLeft}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <div className={styles.itemLeftText}>
          <p
            className={`${styles.itemTitle} ${
              isChecked ? styles.titleIsChecked : ""
            }`}
          >
            {item}
          </p>
          <p
            className={`${styles.itemDescription} ${
              isChecked ? styles.isChecked : ""
            }`}
          >
            {quantity} {unit}
          </p>
        </div>
      </div>
      <div className={styles.itemRight}>
        <div
          className={`${styles.ItemCategory} ${
            isChecked ? styles.isChecked : ""
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

        <EllipsisVertical
          size={16}
          color="var(--purple-light)"
          style={{
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}

export default Item;
