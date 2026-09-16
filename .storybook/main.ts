import ts from "typescript";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      /** Preserve the declared React name instead of deriving it from an index.tsx directory. */
      componentNameResolver: (symbol) => {
        const value = symbol.valueDeclaration;
        const declaration = value && (ts.isArrowFunction(value) || ts.isFunctionExpression(value))
          ? value.parent
          : value;
        if (declaration && (ts.isFunctionDeclaration(declaration) || ts.isClassDeclaration(declaration) || ts.isVariableDeclaration(declaration))) {
          const name = declaration.name;
          if (name && ts.isIdentifier(name) && /^[A-Z]/.test(name.text)) return name.text;
        }
        if (declaration && ts.isExportAssignment(declaration) && ts.isIdentifier(declaration.expression)) {
          const name = declaration.expression.text;
          if (/^[A-Z]/.test(name)) return name;
        }
        return undefined;
      },
    },
  },
};
export default config;
