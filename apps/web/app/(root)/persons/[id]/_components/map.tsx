"use client";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  type GeoJSONProps,
} from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useTheme } from "next-themes";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  statesData: GeoJSONProps["data"];
}

const defaults = {
  zoom: 5,
};

export function Map(Map: MapProps) {
  const { zoom = defaults.zoom, posix, statesData } = Map;

  const { theme } = useTheme();

  const tileLayerUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={tileLayerUrl}
      />
      {statesData && <GeoJSON data={statesData} />}
    </MapContainer>
  );
}
