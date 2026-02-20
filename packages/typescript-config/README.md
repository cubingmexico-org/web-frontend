# `@workspace/typescript-config`

Shared TypeScript configurations for the monorepo workspace.

## 📦 Available Configurations

This package provides three TypeScript configurations:

### `base.json`

Base configuration for all TypeScript projects in the workspace.

**Features:**

- ✅ Strict mode enabled
- ✅ ES2022 target and lib
- ✅ NodeNext module resolution
- ✅ Declaration and source maps generation
- ✅ Isolated modules
- ✅ ESM interop
- ✅ JSON module resolution
- ✅ Unchecked indexed access prevention
- ✅ Skip lib check for faster builds
- 🎯 DOM and DOM.Iterable libraries included

**Use for:** Base TypeScript libraries and projects

### `nextjs.json`

Extended configuration for Next.js applications.

**Extends:** `base.json`

**Additional Features:**

- ✅ Next.js TypeScript plugin
- ✅ ESNext module format
- ✅ Bundler module resolution
- ✅ JavaScript files allowed
- ✅ JSX preserved (transformed by Next.js)
- ✅ No emit (Next.js handles compilation)

**Use for:** Next.js applications

### `react-library.json`

Configuration for React component libraries.

**Extends:** `base.json`

**Additional Features:**

- ✅ React JSX transform (`react-jsx`)
- ✅ Optimized for React 17+ automatic runtime

**Use for:** React component libraries (e.g., `@workspace/ui`, `@workspace/icons`)

## 🚀 Usage

### Installation

This package is automatically available in the monorepo workspace:

```json
{
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*"
  }
}
```

### In Next.js Applications

Create a `tsconfig.json` file:

```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### In React Libraries

Create a `tsconfig.json` file:

```json
{
  "extends": "@workspace/typescript-config/react-library.json",
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### In Base TypeScript Projects

Create a `tsconfig.json` file:

```json
{
  "extends": "@workspace/typescript-config/base.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## 🔧 Common Customizations

### Adding Path Aliases

```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  }
}
```

### Customizing Output Directory

```json
{
  "extends": "@workspace/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Adding Custom Type Definitions

```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "compilerOptions": {
    "types": ["node", "jest"]
  }
}
```

## 📋 Compiler Options Explained

### Base Configuration

| Option                     | Value                               | Description                                      |
| -------------------------- | ----------------------------------- | ------------------------------------------------ |
| `strict`                   | `true`                              | Enable all strict type checking options          |
| `target`                   | `ES2022`                            | Specify ECMAScript target version                |
| `module`                   | `NodeNext`                          | Use Node.js ESM module system                    |
| `moduleResolution`         | `NodeNext`                          | Use Node.js module resolution                    |
| `lib`                      | `["es2022", "DOM", "DOM.Iterable"]` | Include ES2022 and DOM APIs                      |
| `esModuleInterop`          | `true`                              | Enable CommonJS/ESM interop                      |
| `skipLibCheck`             | `true`                              | Skip type checking of declaration files          |
| `resolveJsonModule`        | `true`                              | Allow importing JSON files                       |
| `isolatedModules`          | `true`                              | Ensure each file can be transpiled independently |
| `noUncheckedIndexedAccess` | `true`                              | Add undefined to unchecked indexed access        |
| `declaration`              | `true`                              | Generate .d.ts files                             |
| `declarationMap`           | `true`                              | Generate source maps for declaration files       |

### Next.js Specific

| Option             | Value                  | Description                             |
| ------------------ | ---------------------- | --------------------------------------- |
| `plugins`          | `[{ "name": "next" }]` | Enable Next.js TypeScript plugin        |
| `module`           | `ESNext`               | Use latest ESM syntax                   |
| `moduleResolution` | `Bundler`              | Use bundler-style module resolution     |
| `allowJs`          | `true`                 | Allow JavaScript files                  |
| `jsx`              | `preserve`             | Keep JSX for Next.js to transform       |
| `noEmit`           | `true`                 | Don't emit files (Next.js handles this) |

### React Library Specific

| Option | Value       | Description                         |
| ------ | ----------- | ----------------------------------- |
| `jsx`  | `react-jsx` | Use React 17+ automatic JSX runtime |

## 🎯 Best Practices

1. **Always extend from a base config** - Don't duplicate configuration
2. **Use path aliases consistently** - Define them in your tsconfig.json
3. **Keep includes/excludes minimal** - Only specify what's necessary
4. **Enable strict mode** - Catch more errors at compile time
5. **Use separate configs for build and lint** - Create `tsconfig.lint.json` if needed

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [Next.js TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
