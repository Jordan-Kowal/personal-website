import {
  Briefcase,
  Github,
  Home,
  Linkedin,
  Mail,
  MessageSquare,
  Wrench,
  Youtube,
} from "lucide-solid";
import type { Component } from "solid-js";
import { createEffect, createSignal, For, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";
import { SOCIALS } from "../../config/socials";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: Component<{ size: number }>;
};

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "#home", icon: Home },
  { id: "skills", label: "Skills", href: "#skills", icon: Wrench },
  { id: "projects", label: "Projects", href: "#projects", icon: Briefcase },
  { id: "github", label: "GitHub", href: "#github", icon: Github },
  { id: "reviews", label: "Reviews", href: "#reviews", icon: MessageSquare },
  { id: "contact", label: "Contact", href: "#contact", icon: Mail },
];

type SocialLinkProps = {
  href: string;
  icon: Component<{ size: number }>;
};

const SocialLink: Component<SocialLinkProps> = (props) => (
  <a
    href={props.href}
    target="_blank"
    rel="noopener noreferrer"
    class="no-underline rounded-full p-1.5 text-base-content/70 hover:text-base-content hover:bg-base-200 transition-all duration-200"
  >
    <Dynamic component={props.icon} size={16} />
  </a>
);

export const Navbar = () => {
  const [activeSection, setActiveSection] = createSignal<string>("home");
  const [isSticky, setIsSticky] = createSignal(false);

  createEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      setIsSticky(scrollY > heroHeight);

      const sections = navItems.map((item) => ({
        id: item.id,
        element: item.id === "home" ? null : document.getElementById(item.id),
      }));

      if (scrollY < heroHeight * 0.5) {
        setActiveSection("home");
        return;
      }

      let currentSection = "home";
      let minDistance = Infinity;

      for (const { id, element } of sections) {
        if (id === "home") continue;
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top);

        if (rect.top <= window.innerHeight * 0.3 && rect.bottom > 0) {
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = id;
          }
        }
      }

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
    handleScroll();

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
      <div class="flex justify-center">
        <div
          class={`flex items-center gap-1 rounded-full px-4 py-2 transition-all duration-300 ${
            isSticky()
              ? "bg-base-100/95 backdrop-blur-sm shadow-xl"
              : "bg-transparent shadow-md"
          }`}
        >
          {/* Name */}
          <span class="max-w-0 sm:max-w-40 overflow-hidden opacity-0 sm:opacity-100 transition-all duration-300 pr-0 sm:pr-3 text-sm font-bold text-base-content whitespace-nowrap">
            Jordan Kowal
          </span>

          {/* Nav items */}
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
                  class={`no-underline flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
                    isActive()
                      ? "text-primary bg-primary/10"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                  }`}
                >
                  <span class="sm:hidden">
                    <item.icon size={16} />
                  </span>
                  <span class="hidden sm:inline">{item.label}</span>
                </a>
              );
            }}
          </For>

          {/* Social links */}
          <div class="flex items-center gap-1 max-w-0 sm:max-w-40 overflow-hidden opacity-0 sm:opacity-100 transition-all duration-300 pl-0 sm:pl-3">
            <SocialLink href={SOCIALS.github} icon={Github} />
            <SocialLink href={SOCIALS.linkedin} icon={Linkedin} />
            <SocialLink href={SOCIALS.youtube} icon={Youtube} />
          </div>
        </div>
      </div>
    </nav>
  );
};
