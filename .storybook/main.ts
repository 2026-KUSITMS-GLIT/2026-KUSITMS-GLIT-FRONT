import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/nextjs",
  staticDirs: ["../public"],
  webpackFinal: async config => {
    if (config.module?.rules) {
      config.module.rules = config.module.rules.map(rule => {
        if (
          rule &&
          typeof rule === "object" &&
          "test" in rule &&
          rule.test instanceof RegExp &&
          rule.test.test(".svg")
        ) {
          return { ...rule, exclude: /\.svg$/i };
        }
        return rule;
      });

      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [{ loader: "@svgr/webpack", options: { dimensions: false } }],
      });
    }

    return config;
  },
};
export default config;
