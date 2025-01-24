import { Socials } from "@/components/features/Socials";
import { Logo, Space } from "@/components/ui";
import { memo } from "react";
import { PresentationText } from "./PresentationText";

export const WelcomeBanner: React.FC = memo(() => (
  <div className="relative overflow-hidden w-full h-screen">
    <video
      autoPlay
      muted
      loop
      className="absolute z-0 top-0 left-0 overflow-hidden h-screen w-screen object-cover opacity-30 grayscale"
    >
      <source src="videos/background-presentation.mp4" type="video/mp4" />
    </video>
    <Space
      className="relative overflow-hidden w-full h-screen items-center !justify-between p-default"
      block
      vertical
      size={20}
    >
      <Logo height={80} />
      <PresentationText />
      <Socials />
    </Space>
  </div>
));
