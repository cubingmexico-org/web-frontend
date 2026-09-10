const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;

export type MapTileConfig = {
  url: string;
  attribution: string;
  subdomains?: string;
};

export function getMapTileConfig(
  theme: "dark" | "light" | string | undefined,
): MapTileConfig {
  if (theme === "dark") {
    const keyParam = cartoKey ? `?key=${cartoKey}` : "";
    return {
      url: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${keyParam}`,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
    };
  }
  return {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  };
}
