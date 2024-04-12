import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "../styles/pages/Home.module.css";
import {
  ChevronDown,
  Check,
  Plus,
  ChevronUp,
  DoorOpen,
  Sandwich,
  Carrot,
  Beef,
  Apple,
  Milk,
  ShoppingCart,
} from "lucide-react";

import { generate } from "shortid";

import { categories, categoriesProps, iconProps } from "../utils/categories";
import { units, unitProps } from "../utils/unit";
import toast, { Toaster } from "react-hot-toast";
import { useMakeItems } from "../utils/hooks/useMakeItems";
import Item from "../components/Item";
import { useAuth } from "../utils/hooks/useAuth";

import { FadeLoader } from "react-spinners";

function Home() {
  const { items, handleAddingItem, itemsLoading } = useMakeItems();
  const { user, signOut } = useAuth();

  const categoryRef = useRef<HTMLDivElement | null>(null);
  const unitRef = useRef<HTMLDivElement | null>(null);

  const [itemFocused, setItemFocused] = useState(false);
  const [quantityFocused, setQuantityFocused] = useState(false);

  const [unitOptionIsOpen, setUnitOptionIsOpen] = useState(false);
  const [categoryOptionIsOpen, setCategoryOptionIsOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<categoriesProps | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<unitProps | null>(null);

  const [quantityUnit, setQuantityUnit] = useState<number>(1);
  const [title, setTitle] = useState("");

  const handleUnitSelect = (unit: unitProps) => {
    if (unit.id === selectedUnit?.id) {
      setSelectedUnit(units[0]);
      setUnitOptionIsOpen(false);
      return;
    }
    setSelectedUnit(unit);
    setUnitOptionIsOpen(false);
  };

  const handleCategorySelect = (category: categoriesProps) => {
    if (category.id === selectedCategory?.id) {
      setSelectedCategory(null);
      setCategoryOptionIsOpen(false);
      return;
    }
    setSelectedCategory(category);
    setCategoryOptionIsOpen(false);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Verificar se o valor inserido é um número
    if (!isNaN(Number(inputValue))) {
      setQuantityUnit(Number(inputValue)); // Convertendo para número
    }
    // Se não for um número, você pode optar por não fazer nada ou fornecer uma mensagem de erro ao usuário
  };

  const handleCleaningForm = () => {
    setTitle("");
    setQuantityUnit(1);
    setSelectedCategory(null);
    setSelectedUnit(units[0]);
  };

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) {
      toast.error("É necessário preencher o campo item");
      return;
    }

    if (quantityUnit === 0) {
      toast.error("É necessário colocar uma quantidade");
      return;
    }

    if (selectedCategory === null) {
      toast.error("É necessário selecionar uma categoria");
      return;
    }

    handleAddingItem(
      {
        id: generate(),
        item: title,
        quantity: quantityUnit,
        unit: selectedUnit ? selectedUnit?.complet : "",
        category: selectedCategory,
        completed: false,
      },
      user ? user.uid : ""
    );
    handleCleaningForm();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryOptionIsOpen(false);
      }
      if (unitRef.current && !unitRef.current.contains(event.target as Node)) {
        setUnitOptionIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryRef, unitRef]);

  useEffect(() => {
    setSelectedUnit(units[0]);
  }, []);

  return (
    <div className={styles.homePage}>
      <div className={styles.homeContainer}>
        <div className={styles.homeWelcome}>
          <h1>Lista de Compras</h1>

          <div className={styles.homeUser}>
            <p className={styles.homeUserName}>
              olá, <span>{user?.displayName}</span>{" "}
            </p>
            <p className={styles.homeUserExit} onClick={() => signOut()}>
              Logout <DoorOpen color="var(--orange)" size={20} />
            </p>
          </div>
        </div>

        <Toaster position="top-center" />

        <div className={styles.homeContent}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.formItem}>
              <label
                htmlFor="input_item"
                style={{
                  color: itemFocused
                    ? "var(--purple-light)"
                    : "var(--gray-200)",
                }}
              >
                Item
              </label>
              <input
                type="text"
                id="input_item"
                name="input_item"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setItemFocused(true)}
                onBlur={() => setItemFocused(false)}
              />
            </div>
            <div className={`${styles.formItem} ${styles.formUnit}`}>
              <label
                htmlFor="input_quantity"
                style={{
                  color:
                    unitOptionIsOpen || quantityFocused
                      ? "var(--purple)"
                      : "var(--gray-200)",
                }}
              >
                Quantidade
              </label>
              <div className={`${styles.formUnitContent}`}>
                <input
                  type="text"
                  id="input_quantity"
                  name="input_quantity"
                  value={quantityUnit}
                  onChange={handleQuantityChange}
                  onFocus={() => setQuantityFocused(true)}
                  onBlur={() => setQuantityFocused(false)}
                />
                <div
                  className={styles.formUnitSelect}
                  onClick={() => setUnitOptionIsOpen(!unitOptionIsOpen)}
                >
                  <div
                    className={styles.formUnitApresentation}
                    style={{
                      borderColor:
                        unitOptionIsOpen === true ? " var(--purple)" : "",
                    }}
                  >
                    <p>{selectedUnit ? selectedUnit.label : "UN."}</p>
                    {unitOptionIsOpen === false ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronUp size={18} color="var(--purple)" />
                    )}
                  </div>
                  <div
                    className={styles.formUnitSelection}
                    style={{
                      display: unitOptionIsOpen === false ? "none" : "initial",
                    }}
                    ref={unitRef}
                  >
                    {units.map((unit) => (
                      <div
                        className={styles.formUnitOption}
                        key={unit.id}
                        onClick={() => handleUnitSelect(unit)}
                      >
                        <p>{unit.label}</p>

                        {selectedUnit && selectedUnit.id === unit.id && (
                          <Check color="var(--purple-light)" size={12} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.formItem} ${styles.formCategory}`}>
              <label
                htmlFor="input_quantity"
                style={{
                  color: categoryOptionIsOpen
                    ? "var(--purple)"
                    : "var(--gray-200)",
                }}
              >
                Categoria
              </label>
              <div className={styles.formCategoryContent}>
                <div
                  className={styles.formCategorySelect}
                  onClick={() => setCategoryOptionIsOpen(!categoryOptionIsOpen)}
                >
                  <div
                    className={styles.formCategoryApresentation}
                    style={{
                      borderColor:
                        categoryOptionIsOpen === true ? " var(--purple)" : "",
                    }}
                  >
                    <p>
                      {selectedCategory ? selectedCategory.label : "Selecione"}{" "}
                    </p>
                    {categoryOptionIsOpen === false ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronUp size={18} color="var(--purple)" />
                    )}
                  </div>
                  <div
                    className={styles.formCategorySelection}
                    style={{
                      display: categoryOptionIsOpen ? "initial" : "none",
                    }}
                    ref={categoryRef}
                  >
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={styles.formCategoryOption}
                        onClick={() => handleCategorySelect(category)}
                      >
                        <div className={styles.CategoryOptionText}>
                          {handleIconViewer(category.icon)}
                          <p>{category.label}</p>
                        </div>
                        {selectedCategory &&
                          selectedCategory.id === category.id && (
                            <Check color="var(--purple-light)" size={12} />
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className={styles.formButton}>
              <Plus />
            </button>
          </form>

          <div className={styles.homeShoppingList}>
            {itemsLoading ? (
              <div className={styles.homeLoading}>
                <FadeLoader
                  height={15}
                  width={5}
                  radius={30}
                  color="var(--purple)"
                />
              </div>
            ) : items.length === 0 ? (
              <div className={styles.homeLoading}>
                <p>adicione items para sua lista. 😊</p>
              </div>
            ) : (
              items.map((item, index) => (
                <Item
                  key={index}
                  id={item.id}
                  category={item.category}
                  item={item.item}
                  quantity={item.quantity}
                  unit={item.unit}
                  completed={item.completed}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
