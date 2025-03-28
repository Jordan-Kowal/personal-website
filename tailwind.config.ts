import { theme } from "./src/styles";

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        primary: theme.colors.primary,
        info: theme.colors.info,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
        text: theme.colors.text,
        bg: theme.colors.bg,
        "bg-dark": theme.colors.bgDark,
        "bg-darker": theme.colors.bgDarker,
        "bg-light": theme.colors.bgLight,
      },
      spacing: {
        default: theme.layout.layoutPadding,
        header: theme.layout.headerHeight,
        footer: theme.layout.footerHeight,
        sider: theme.layout.siderWidth,
        layout: theme.layout.layoutMaxWidth,
      },
      borderRadius: {
        default: theme.others.borderRadius,
      },
      boxShadow: {
        default: theme.others.boxShadow,
        secondary: theme.others.boxShadowSecondary,
      },
      height: {
        header: theme.layout.headerHeight,
      },
      backgroundImage: {
        "project-card": "url('/images/project-card-background.svg')",
      },
    },
  },
  plugins: [],
};
