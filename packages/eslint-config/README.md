# `@workspace/eslint-config`

Shared ESLint configurations for the monorepo workspace.

## 📦 Available Configurations

This package provides three ESLint configurations:

### `base.js`

Base configuration for all TypeScript projects in the workspace.

**Includes:**
- ESLint recommended rules
- TypeScript ESLint recommended rules
- Prettier compatibility (eslint-config-prettier)
- Turbo plugin for monorepo environment variables
- All errors converted to warnings (eslint-plugin-only-warn)

**Use for:** TypeScript libraries and non-React projects

### `next.js`

Extended configuration for Next.js applications.

**Includes:**
- All base configuration rules
- React recommended rules
- React Hooks rules
- Next.js plugin with recommended and Core Web Vitals rules
- Service worker and browser globals
- Automatic React version detection

**Use for:** Next.js applications

### `react-internal.js`

Configuration for internal React libraries and components.

**Includes:**
- All base configuration rules
- React recommended rules
- React Hooks rules
- Service worker and browser globals
- Automatic React version detection

**Use for:** React component libraries (e.g., `@workspace/ui`)

## 🚀 Usage

### Installation

This package is automatically available in the monorepo workspace:

```json
{
  "devDependencies": {
    "@workspace/eslint-config": "workspace:*"
  }
}
```

### In Next.js Applications

Create an `eslint.config.js` file:

```javascript
import { nextJsConfig } from "@workspace/eslint-config/next.js"

export default [
  ...nextJsConfig,
  {
    // Add custom rules here
  }
]
```

### In React Libraries

Create an `eslint.config.js` file:

```javascript
import { config } from "@workspace/eslint-config/react-internal.js"

export default [
  ...config,
  {
    // Add custom rules here
  }
]
```

### In Base TypeScript Projects

Create an `eslint.config.js` file:

```javascript
import { config } from "@workspace/eslint-config/base.js"

export default [
  ...config,
  {
    // Add custom rules here
  }
]
```

## 🔧 Common Customizations

### Adding File Ignores

```javascript
import { nextJsConfig } from "@workspace/eslint-config/next.js"

export default [
  ...nextJsConfig,
  {
    ignores: ["build/**", "dist/**", ".next/**"]
  }
]
```

### Overriding Rules

```javascript
import { nextJsConfig } from "@workspace/eslint-config/next.js"

export default [
  ...nextJsConfig,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "turbo/no-undeclared-env-vars": "off"
    }
  }
]
```

## 📋 Included Plugins

- **@eslint/js** - ESLint core rules
- **typescript-eslint** - TypeScript-specific linting
- **eslint-config-prettier** - Disables ESLint rules that conflict with Prettier
- **eslint-plugin-turbo** - Turborepo-specific rules
- **eslint-plugin-only-warn** - Converts all errors to warnings
- **eslint-plugin-react** - React-specific linting (Next.js and React configs)
- **eslint-plugin-react-hooks** - React Hooks rules (Next.js and React configs)
- **@next/eslint-plugin-next** - Next.js-specific linting (Next.js config only)

## 🎯 Key Rules

### All Configurations

- ✅ ESLint recommended rules enabled
- ✅ TypeScript recommended rules enabled
- ✅ Prettier conflicts disabled
- ⚠️ All errors converted to warnings
- ⚠️ Turbo undeclared environment variables warning

### Next.js & React Configurations

- ✅ React recommended rules enabled
- ✅ React Hooks rules enforced
- ❌ `react/react-in-jsx-scope` disabled (not needed with new JSX transform)
- ❌ `react/prop-types` disabled (using TypeScript instead)

### Next.js Configuration Only

- ✅ Next.js recommended rules enabled
- ✅ Core Web Vitals rules enabled

## 📚 Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [Turborepo ESLint](https://turbo.build/repo/docs/guides/tools/eslint)
