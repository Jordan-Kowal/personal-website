import "@/config/dayjs";
import { DEFAULT_THEME } from "./config/daisyui";

export const App = () => {
  return (
    <div
      data-theme={DEFAULT_THEME}
      class="min-w-full prose prose-sm md:prose-base bg-base-100"
    >
      Home
    </div>
  );
};
