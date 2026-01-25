import { ContentContainer } from "@/components/layout";

export function HeroBanner() {
  return (
    <div class="relative h-screen w-full overflow-hidden">
      {/* Première couleur - environ 90% de l'écran */}
      <div class="absolute inset-0 bg-base-100" />

      {/* Texte WELCOME - derrière l'image */}
      <ContentContainer class="relative z-10 h-full not-prose">
        <div class="flex h-full items-start justify-center pt-8">
          <h1 class="text-[15rem] font-bold leading-none">WELCOME</h1>
        </div>
      </ContentContainer>

      {/* Blocs de contenu devant l'image */}
      <ContentContainer class="absolute left-1/2 top-1/2 z-25 -translate-x-1/2 -translate-y-1/2">
        <div class="flex justify-between">
          {/* Bloc gauche - Texte */}
          <div class="text-lg font-semibold">My name is Jordan Koval</div>

          {/* Bloc droit - Vidéo YouTube */}
          <div>
            <iframe
              width="280"
              height="158"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              class="h-[158px] w-[280px] max-w-full rounded-xl"
            />
          </div>
        </div>
      </ContentContainer>

      {/* Image - devant le background et le texte mais derrière le SVG */}
      <div
        class="absolute bottom-0 left-1/2 z-20 -translate-x-1/2"
        style={{ width: "min(1024px, 100%)" }}
      >
        <div class="flex justify-center">
          <img
            src="/images/me_1.png"
            alt=""
            class="h-[80vh] w-auto object-contain"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* SVG pour créer la deuxième couleur avec séparation courbée */}
      <svg
        aria-hidden="true"
        class="absolute inset-0 z-30 h-full w-full text-base-300"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ "pointer-events": "none" }}
      >
        {/* Path courbé: commence à 81vh à gauche, finit à 97vh à droite */}
        {/* Utilisation d'une courbe de Bézier cubique avec arrondi convexe de ~15 degrés */}
        <path
          d="M 0,80 C 20,88 60,95 100,97 L 100,100 L 0,100 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
