import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import styles from "../styles/pages/Home.module.css";
import {
  Apple,
  Beef,
  Carrot,
  DoorOpen,
  Milk,
  Plus,
  Search,
  ShoppingCart,
  Sandwich,
  X,
} from "lucide-react";
import { generate } from "shortid";
import { categories, categoriesProps, iconProps } from "../utils/categories";
import { units, unitProps } from "../utils/unit";
import toast, { Toaster } from "react-hot-toast";
import { useMakeItems } from "../utils/hooks/useMakeItems";
import { useAuth } from "../utils/hooks/useAuth";
import { FadeLoader } from "react-spinners";
import Item from "../components/Item";
import Pagination from "../components/Pagination";

import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";

type ListFilter = "all" | "pending" | "completed";

function Home() {
  const { items, handleAddingItem, itemsLoading, totalPages } = useMakeItems();
  const { user, signOut } = useAuth();

  const firstName = user?.displayName?.split(" ")[0] || "por aqui";

  const [selectedCategory, setSelectedCategory] =
    useState<categoriesProps | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<unitProps | null>(units[0]);
  const [quantityUnit, setQuantityUnit] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [listFilter, setListFilter] = useState<ListFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setQuantityUnit(0);
      return;
    }

    const number = Number(value);

    if (Number.isFinite(number) && number >= 0) {
      setQuantityUnit(number);
    }
  };

  const resetForm = () => {
    setTitle("");
    setQuantityUnit(1);
    setSelectedCategory(null);
    setSelectedUnit(units[0]);
  };

  const handleIconViewer = (icon: iconProps, size?: number) => {
    const props = {
      size: size ?? icon.size,
      color: icon.color,
      "aria-hidden": true as const,
    };

    switch (icon.name) {
      case "Sandwich":
        return <Sandwich {...props} />;
      case "Carrot":
        return <Carrot {...props} />;
      case "Beef":
        return <Beef {...props} />;
      case "Apple":
        return <Apple {...props} />;
      case "Milk":
        return <Milk {...props} />;
      case "ShoppingCart":
        return <ShoppingCart {...props} />;
      default:
        return null;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      toast.error("Digite o nome do item.");
      return;
    }

    if (quantityUnit <= 0) {
      toast.error("Informe uma quantidade maior que zero.");
      return;
    }

    if (!selectedCategory) {
      toast.error("Selecione uma categoria.");
      return;
    }

    if (!user) {
      toast.error("Entre na sua conta para adicionar itens.");
      return;
    }

    handleAddingItem(
      {
        id: generate(),
        item: cleanTitle,
        quantity: quantityUnit,
        unit: selectedUnit?.complet ?? "",
        category: selectedCategory,
        completed: false,
      },
      user.uid,
    );

    resetForm();
    toast.success("Item adicionado à lista");
  };

  useEffect(() => {
    setSelectedUnit(units[0]);
  }, []);

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch = item.item
          .toLocaleLowerCase("pt-BR")
          .includes(search.trim().toLocaleLowerCase("pt-BR"));

        const matchesStatus =
          listFilter === "all" ||
          (listFilter === "pending" ? !item.completed : item.completed);

        const matchesCategory =
          categoryFilter === "all" || item.category.id === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      }),
    [items, search, listFilter, categoryFilter],
  );

  const pendingCount = items.filter((item) => !item.completed).length;

  const completedCount = items.filter((item) => item.completed).length;

  const completedPercentage =
    items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <main className={styles.homePage}>
      <div className={styles.homeContainer}>
        <header className={styles.homeWelcome}>
          <div className={styles.brandBlock}>
            <div className={styles.brandMark}>
              <ShoppingCart size={22} strokeWidth={2.2} />
            </div>

            <div>
              <p className={styles.eyebrow}>SUA ROTINA, MAIS LEVE</p>
              <h1>
                Lista de compras
                <span className={styles.titleDot}>.</span>
              </h1>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.userPill}>
              <span className={styles.userAvatar}>
                {firstName.charAt(0).toUpperCase()}
              </span>

              <span className={styles.userGreeting}>
                Olá, <strong>{firstName}</strong>
              </span>

              <button
                type="button"
                className={styles.logoutButton}
                onClick={() => signOut()}
                aria-label="Sair da conta"
                title="Sair"
              >
                <DoorOpen size={17} />
              </button>
            </div>
          </div>
        </header>

        <Toaster position="top-center" toastOptions={{ duration: 2600 }} />

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.heroTag}>
              <span className={styles.statusDot} />
              LISTA DA VEZ
            </span>

            <h2>
              O que está faltando
              <br className={styles.desktopBreak} /> em casa?
            </h2>

            <p>Organize suas compras sem esquecer de nada.</p>
          </div>

          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.heroCircle}>
              <ShoppingCart size={58} strokeWidth={1.35} />
            </div>
            <span className={styles.artSpark}>✳</span>
            <span className={styles.artDot} />
          </div>
        </section>

        <section className={styles.addCard} aria-labelledby="add-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>VAMOS ORGANIZAR</p>
              <h2 id="add-heading">Adicionar à lista</h2>
            </div>

            <span className={styles.stepLabel}>
              01 <span>/ 02</span>
            </span>
          </div>

          <form className={styles.addForm} onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <label htmlFor="input_item">Nome do item</label>

              <Input
                type="text"
                id="input_item"
                name="input_item"
                className={styles.formInput}
                placeholder="Ex.: Leite, pão, café..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
            </div>

            <div className={styles.formItem}>
              <label htmlFor="input_quantity">Quantidade</label>

              <div className={styles.quantityControl}>
                <Input
                  type="number"
                  min="0.01"
                  step="any"
                  id="input_quantity"
                  name="input_quantity"
                  className={styles.formInput}
                  value={quantityUnit || ""}
                  onChange={handleQuantityChange}
                />

                <Select
                  value={String(selectedUnit?.id ?? units[0].id)}
                  onValueChange={(value) => {
                    const unit = units.find(
                      (option) => String(option.id) === value,
                    );

                    if (unit) {
                      setSelectedUnit(unit);
                    }
                  }}
                >
                  <SelectTrigger
                    className={`${styles.selectTrigger} ${styles.unitSelectTrigger}`}
                    aria-label="Unidade da quantidade"
                  >
                    <SelectValue placeholder="Un." />
                  </SelectTrigger>

                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={String(unit.id)}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={styles.formItem}>
              <label>Categoria</label>

              <Select
                value={selectedCategory ? String(selectedCategory.id) : ""}
                onValueChange={(value) => {
                  if (value === "none") {
                    setSelectedCategory(null);
                    return;
                  }

                  const category = categories.find(
                    (option) => String(option.id) === value,
                  );

                  setSelectedCategory(category ?? null);
                }}
              >
                <SelectTrigger
                  className={styles.selectTrigger}
                  aria-label="Selecionar categoria"
                >
                  <SelectValue placeholder="Escolher categoria" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      <span className={styles.categoryOption}>
                        {handleIconViewer(category.icon, 17)}
                        <span>{category.label}</span>
                      </span>
                    </SelectItem>
                  ))}

                  <SelectItem value="none">
                    <span className={styles.categoryOption}>
                      <X size={16} />
                      <span>Limpar categoria</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className={styles.addButton}
              style={{
                backgroundColor: "var(--purple)",
                color: "#ffffff",
              }}
            >
              <Plus size={19} />
              <span>Adicionar item</span>
            </Button>
          </form>
        </section>

        <section className={styles.listSection} aria-labelledby="list-heading">
          <div className={styles.listHeader}>
            <div className={styles.listTitleBlock}>
              <p className={styles.eyebrow}>ACOMPANHE SUAS COMPRAS</p>

              <h2 id="list-heading">
                Sua lista
                <span className={styles.countBadge}>{items.length}</span>
              </h2>

              <p className={styles.listSubtitle}>
                Organize seus itens e acompanhe seu progresso.
              </p>
            </div>

            <div className={styles.progressSummary}>
              <div className={styles.progressInfo}>
                <span className={styles.progressLabel}>
                  Progresso da página
                </span>

                <div className={styles.progressNumbers}>
                  <strong>
                    {completedCount}
                    <span> de {items.length}</span>
                  </strong>

                  <span className={styles.progressPercentage}>
                    {completedPercentage}%
                  </span>
                </div>

                <span className={styles.progressRemaining}>
                  {items.length === 0
                    ? "Adicione itens para começar"
                    : pendingCount === 0
                      ? "Todos os itens desta página foram concluídos!"
                      : `${pendingCount} ${pendingCount === 1 ? "item pendente" : "itens pendentes"} nesta página`}
                </span>
              </div>
            </div>
          </div>

          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-label="Progresso dos itens desta página"
            aria-valuenow={completedPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span
              style={{
                width: `${completedPercentage}%`,
              }}
            />
          </div>

          <div className={styles.listToolbar}>
            <label className={styles.searchBox}>
              <Search size={18} />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar item..."
                aria-label="Buscar item na lista"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Limpar busca"
                  onClick={() => setSearch("")}
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <Select
              value={String(categoryFilter)}
              onValueChange={(value) =>
                setCategoryFilter(value === "all" ? "all" : Number(value))
              }
            >
              <SelectTrigger
                className={`${styles.categoryFilter} ${styles.categoryFilterTrigger}`}
                aria-label="Filtrar por categoria"
              >
                <SelectValue placeholder="Todas categorias" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>

                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    <span className={styles.categoryOption}>
                      {handleIconViewer(category.icon, 17)}
                      <span>{category.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div
              className={styles.filterTabs}
              role="group"
              aria-label="Filtrar itens"
            >
              <button
                type="button"
                className={listFilter === "all" ? styles.filterActive : ""}
                onClick={() => setListFilter("all")}
              >
                Todos <span>{items.length}</span>
              </button>

              <button
                type="button"
                className={listFilter === "pending" ? styles.filterActive : ""}
                onClick={() => setListFilter("pending")}
              >
                Pendentes <span>{pendingCount}</span>
              </button>

              <button
                type="button"
                className={
                  listFilter === "completed" ? styles.filterActive : ""
                }
                onClick={() => setListFilter("completed")}
              >
                Feitos <span>{completedCount}</span>
              </button>
            </div>
          </div>

          {totalPages > 1 && (
            <div className={styles.paginationWrap}>
              <Pagination />
            </div>
          )}

          <div className={styles.homeShoppingList}>
            {itemsLoading ? (
              <div className={styles.homeLoading}>
                <FadeLoader
                  height={12}
                  width={4}
                  radius={20}
                  color="var(--purple)"
                />
                <p>Carregando sua lista...</p>
              </div>
            ) : visibleItems.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <ShoppingCart size={25} />
                </div>

                <h3>
                  {search
                    ? "Nenhum item encontrado"
                    : listFilter === "pending"
                      ? "Tudo em dia!"
                      : listFilter === "completed"
                        ? "Nada concluído ainda"
                        : "Sua lista começa aqui"}
                </h3>

                <p>
                  {search
                    ? "Tente buscar por outro nome."
                    : listFilter === "pending"
                      ? "Você concluiu todos os itens desta página."
                      : listFilter === "completed"
                        ? "Marque um item quando terminar de comprar."
                        : "Adicione o primeiro item usando o formulário acima."}
                </p>
              </div>
            ) : (
              visibleItems.map((item) => (
                <Item
                  key={item.id}
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
        </section>

        <footer className={styles.footer}>
          <span>Feito para simplificar sua rotina.</span>
          <span>
            LISTA DE COMPRAS <span className={styles.titleDot}>✳</span>
          </span>
        </footer>
      </div>

      <nav className={styles.mobileNav} aria-label="Navegação rápida">
        <a href="#add-heading" className={styles.mobileNavLink}>
          <Plus size={19} />
          <span>Adicionar</span>
        </a>

        <a href="#list-heading" className={styles.mobileNavLinkActive}>
          <ShoppingCart size={19} />
          <span>Minha lista</span>
        </a>
      </nav>
    </main>
  );
}

export default Home;
