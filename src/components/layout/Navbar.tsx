import { createEffect, createSignal, For, onCleanup } from "solid-js";

type NavItem = {
  id: string;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "github", label: "GitHub", href: "#github" },
  { id: "reviews", label: "Reviews", href: "#reviews" },
];

export const Navbar = () => {
  const [activeSection, setActiveSection] = createSignal<string>("home");
  const [isSticky, setIsSticky] = createSignal(false);

  // Détecter la section active au scroll
  createEffect(() => {
    const handleScroll = () => {
      // Vérifier si on a scrollé assez pour rendre la navbar sticky
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      setIsSticky(scrollY > heroHeight * 0.8);

      // Trouver la section actuellement visible
      const sections = navItems.map((item) => {
        if (item.id === "home") {
          return { id: item.id, element: null };
        }
        const element = document.getElementById(item.id);
        return { id: item.id, element };
      });

      // Si on est en haut de la page, activer "home"
      if (scrollY < heroHeight * 0.5) {
        setActiveSection("home");
        return;
      }

      // Trouver la section la plus proche du haut de la fenêtre
      let currentSection = "home";
      let minDistance = Infinity;

      for (const { id, element } of sections) {
        if (id === "home") continue;
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top);

        // Si la section est visible dans le viewport (top entre 0 et viewport height)
        if (rect.top <= window.innerHeight * 0.3 && rect.bottom > 0) {
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = id;
          }
        }
      }

      // Si aucune section n'est trouvée mais qu'on a scrollé, prendre la dernière
      if (currentSection === "home" && scrollY > heroHeight) {
        const lastSection = sections
          .filter((s) => s.element)
          .reverse()
          .find((s) => {
            const rect = s.element!.getBoundingClientRect();
            return rect.top < window.innerHeight;
          });
        if (lastSection) {
          currentSection = lastSection.id;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Appel initial

    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
    });
  });

  const scrollToSection = (href: string) => {
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      // Offset pour la navbar sticky (hauteur navbar + marge top + padding)
      const offset = isSticky() ? 100 : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      class={`sticky z-50 w-full transition-all duration-300 ${
        isSticky() ? "top-4" : "top-0"
      }`}
    >
      <div class="mx-auto w-full max-w-[1024px] px-4">
        <div
          class={`flex items-center justify-center gap-6 rounded-2xl py-4 transition-all duration-300 ${
            isSticky()
              ? "bg-base-100/95 backdrop-blur-sm shadow-xl"
              : "bg-transparent"
          }`}
        >
          <For each={navItems}>
            {(item: NavItem) => {
              const isActive = () => activeSection() === item.id;
              return (
                <a
                  href={item.href}
                  onclick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  class={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActive()
                      ? "text-primary bg-primary/10"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                  }`}
                >
                  {item.label}
                </a>
              );
            }}
          </For>
        </div>
      </div>
    </nav>
  );
};
