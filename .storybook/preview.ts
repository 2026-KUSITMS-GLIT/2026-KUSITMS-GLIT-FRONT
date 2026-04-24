import type { Preview } from "@storybook/nextjs";
import "@/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        dark: { name: "Dark", value: "#111111" },
        light: { name: "Light", value: "#ffffff" },
      },
    },
    viewport: {
      options: {
        mobile375: {
          name: "Mobile (375px)",
          styles: { width: "375px", height: "812px" },
          type: "mobile",
        },
        mobile430: {
          name: "Mobile (430px)",
          styles: { width: "430px", height: "932px" },
          type: "mobile",
        },
      },
    },
  },
  initialGlobals: {
    viewport: { value: "", isRotated: false },
    backgrounds: { value: "dark" },
  },
};

export default preview;
