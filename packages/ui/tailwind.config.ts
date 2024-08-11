import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets" | "prefix"> = {
  content: ["./src/**/*.tsx"],
  presets: [sharedConfig],
  prefix: "ui-",
};

export default config;
