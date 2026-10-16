import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/pages/Home.module.css";
import {
  Apple, Beef, Check, ChevronDown, ChevronUp, Carrot, DoorOpen,
  Milk, Moon, Plus, Search, ShoppingCart, Sun, Sandwich, X
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

type ListFilter = "all" | "pending" | "completed";

function Home() {
  const { items, handleAddingItem, itemsLoading, totalPages } = useMakeItems();
  const { user, signOut } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "por aqui";
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const unitRef = useRef<HTMLDivElement | null>(null);

  const [unitOptionIsOpen, setUnitOptionIsOpen] = useState(false);
  const [categoryOptionIsOpen, setCategoryOptionIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<categoriesProps | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<unitProps | null>(null);
  const [quantityUnit, setQuantityUnit] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [listFilter, setListFilter] = useState<ListFilter>("all");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return localStorage.getItem("shopping-list-theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("shopping-list-theme", theme); } catch { /* storage may be unavailable */ }
  }, [theme]);

  const handleUnitSelect = (unit: unitProps) => {
    setSelectedUnit(unit.id === selectedUnit?.id ? units[0] : unit);
    setUnitOptionIsOpen(false);
  };

  const handleCategorySelect = (category: categoriesProps) => {
    setSelectedCategory(category.id === selectedCategory?.id ? null : category);
    setCategoryOptionIsOpen(false);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") { setQuantityUnit(0); return; }
    const number = Number(value);
    if (Number.isFinite(number) && number >= 0) setQuantityUnit(number);
  };

  const resetForm = () => {
    setTitle("");
    setQuantityUnit(1);
    setSelectedCategory(null);
    setSelectedUnit(units[0]);
  };

  const handleIconViewer = (icon: iconProps, size?: number) => {
    const props = { size: size ?? icon.size, color: icon.color, "aria-hidden": true as const };
    switch (icon.name) {
      case "Sandwich": return <Sandwich {...props} />;
      case "Carrot": return <Carrot {...props} />;
      case "Beef": return <Beef {...props} />;
      case "Apple": return <Apple {...props} />;
      case "Milk": return <Milk {...props} />;
      case "ShoppingCart": return <ShoppingCart {...props} />;
      default: return null;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) { toast.error("Digite o nome do item."); return; }
    if (quantityUnit <= 0) { toast.error("Informe uma quantidade maior que zero."); return; }
    if (!selectedCategory) { toast.error("Selecione uma categoria."); return; }
    if (!user) { toast.error("Entre na sua conta para adicionar itens."); return; }

    handleAddingItem({
      id: generate(),
      item: cleanTitle,
      quantity: quantityUnit,
      unit: selectedUnit?.complet ?? "",
      category: selectedCategory,
      completed: false,
    }, user.uid);
    resetForm();
    toast.success("Item adicionado à lista");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (categoryRef.current && !categoryRef.current.contains(target)) setCategoryOptionIsOpen(false);
      if (unitRef.current && !unitRef.current.contains(target)) setUnitOptionIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { setSelectedUnit(units[0]); }, []);

  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesSearch = item.item.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR"));
    const matchesStatus = listFilter === "all" || (listFilter === "pending" ? !item.completed : item.completed);
    return matchesSearch && matchesStatus;
  }), [items, search, listFilter]);

  const pendingCount = items.filter((item) => !item.completed).length;
  const completedCount = items.filter((item) => item.completed).length;

  return (
    <main className={styles.homePage}>
      <div className={styles.homeContainer}>
        <header className={styles.homeWelcome}>
          <div className={styles.brandBlock}>
            <div className={styles.brandMark}><ShoppingCart size={22} strokeWidth={2.2} /></div>
            <div>
              <p className={styles.eyebrow}>SUA ROTINA, MAIS LEVE</p>
              <h1>Lista de compras<span className={styles.titleDot}>.</span></h1>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button type="button" className={styles.iconButton} aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"} title="Alternar tema" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className={styles.userPill}>
              <span className={styles.userAvatar}>{firstName.charAt(0).toUpperCase()}</span>
              <span className={styles.userGreeting}>Olá, <strong>{firstName}</strong></span>
              <button type="button" className={styles.logoutButton} onClick={() => signOut()} aria-label="Sair da conta" title="Sair"><DoorOpen size={17} /></button>
            </div>
          </div>
        </header>

        <Toaster position="top-center" toastOptions={{ duration: 2600 }} />

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.heroTag}><span className={styles.statusDot} /> LISTA DA VEZ</span>
            <h2>O que está faltando<br className={styles.desktopBreak} /> em casa?</h2>
            <p>Organize suas compras sem esquecer de nada.</p>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.heroCircle}><ShoppingCart size={58} strokeWidth={1.35} /></div>
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
            <span className={styles.stepLabel}>01 <span>/ 02</span></span>
          </div>
          <form className={styles.addForm} onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <label htmlFor="input_item">Nome do item</label>
              <input type="text" id="input_item" name="input_item" placeholder="Ex.: Leite, pão, café..." value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
            </div>
            <div className={styles.formItem}>
              <label htmlFor="input_quantity">Quantidade</label>
              <div className={styles.quantityControl}>
                <input type="number" min="0.01" step="any" id="input_quantity" name="input_quantity" value={quantityUnit || ""} onChange={handleQuantityChange} />
                <div className={styles.dropdown} ref={unitRef}>
                  <button type="button" className={styles.dropdownTrigger} aria-expanded={unitOptionIsOpen} onClick={() => setUnitOptionIsOpen(!unitOptionIsOpen)}>
                    {selectedUnit?.label ?? "Un."}{unitOptionIsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {unitOptionIsOpen && <div className={styles.dropdownMenu}>{units.map((unit) => <button type="button" key={unit.id} className={styles.dropdownOption} onClick={() => handleUnitSelect(unit)}>{unit.label}{selectedUnit?.id === unit.id && <Check size={15} />}</button>)}</div>}
                </div>
              </div>
            </div>
            <div className={styles.formItem}>
              <label>Categoria</label>
              <div className={styles.dropdown} ref={categoryRef}>
                <button type="button" className={styles.dropdownTrigger} aria-expanded={categoryOptionIsOpen} onClick={() => setCategoryOptionIsOpen(!categoryOptionIsOpen)}>
                  <span className={styles.categoryTrigger}>{selectedCategory ? handleIconViewer(selectedCategory.icon, 17) : <ShoppingCart size={17} />} {selectedCategory?.label ?? "Escolher categoria"}</span>
                  {categoryOptionIsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {categoryOptionIsOpen && <div className={styles.dropdownMenu}>{categories.map((category) => <button type="button" key={category.id} className={styles.dropdownOption} onClick={() => handleCategorySelect(category)}><span className={styles.categoryTrigger}>{handleIconViewer(category.icon, 17)} {category.label}</span>{selectedCategory?.id === category.id && <Check size={15} />}</button>)}</div>}
              </div>
            </div>
            <button type="submit" className={styles.addButton}><Plus size={19} /> <span>Adicionar item</span></button>
          </form>
        </section>

        <section className={styles.listSection} aria-labelledby="list-heading">
          <div className={styles.listHeader}>
            <div>
              <p className={styles.eyebrow}>ACOMPANHE SUAS COMPRAS</p>
              <h2 id="list-heading">Sua lista <span className={styles.countBadge}>{items.length}</span></h2>
            </div>
            <div className={styles.progressText}><span>{completedCount} de {items.length}</span><small>concluídos nesta página</small></div>
          </div>
          <div className={styles.progressTrack}><span style={{ width: items.length ? `${(completedCount / items.length) * 100}%` : "0%" }} /></div>
          <div className={styles.listToolbar}>
            <label className={styles.searchBox}>
              <Search size={18} />
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar item..." aria-label="Buscar item na lista" />
              {search && <button type="button" aria-label="Limpar busca" onClick={() => setSearch("")}><X size={16} /></button>}
            </label>
            <div className={styles.filterTabs} role="group" aria-label="Filtrar itens">
              <button type="button" className={listFilter === "all" ? styles.filterActive : ""} onClick={() => setListFilter("all")}>Todos <span>{items.length}</span></button>
              <button type="button" className={listFilter === "pending" ? styles.filterActive : ""} onClick={() => setListFilter("pending")}>Pendentes <span>{pendingCount}</span></button>
              <button type="button" className={listFilter === "completed" ? styles.filterActive : ""} onClick={() => setListFilter("completed")}>Feitos <span>{completedCount}</span></button>
            </div>
          </div>

          {totalPages > 1 && <div className={styles.paginationWrap}><Pagination /></div>}
          <div className={styles.homeShoppingList}>
            {itemsLoading ? <div className={styles.homeLoading}><FadeLoader height={12} width={4} radius={20} color="var(--purple)" /><p>Carregando sua lista...</p></div>
            : visibleItems.length === 0 ? <div className={styles.emptyState}><div className={styles.emptyIcon}><ShoppingCart size={25} /></div><h3>{search ? "Nenhum item encontrado" : listFilter === "pending" ? "Tudo em dia!" : listFilter === "completed" ? "Nada concluído ainda" : "Sua lista começa aqui"}</h3><p>{search ? "Tente buscar por outro nome." : listFilter === "pending" ? "Você concluiu todos os itens desta página." : listFilter === "completed" ? "Marque um item quando terminar de comprar." : "Adicione o primeiro item usando o formulário acima."}</p></div>
            : visibleItems.map((item) => <Item key={item.id} id={item.id} category={item.category} item={item.item} quantity={item.quantity} unit={item.unit} completed={item.completed} />)}
          </div>
        </section>

        <footer className={styles.footer}><span>Feito para simplificar sua rotina.</span><span>LISTA DE COMPRAS <span className={styles.titleDot}>✳</span></span></footer>
      </div>
      <nav className={styles.mobileNav} aria-label="Navegação rápida">
        <a href="#add-heading" className={styles.mobileNavLink}><Plus size={19} /><span>Adicionar</span></a>
        <a href="#list-heading" className={styles.mobileNavLinkActive}><ShoppingCart size={19} /><span>Minha lista</span></a>
        <button type="button" className={styles.mobileNavLink} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}<span>Tema</span></button>
      </nav>
    </main>
  );
}

export default Home;
