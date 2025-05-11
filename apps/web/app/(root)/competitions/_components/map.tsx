"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useTheme } from "next-themes";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  locations: {
    id: string;
    name: string;
    state: string | null;
    latitutude: number | null;
    longitude: number | null;
  }[];
}

const defaults = {
  zoom: 5,
};

export function Map(Map: MapProps) {
  const { zoom = defaults.zoom, posix, locations } = Map;

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
      {locations.map(({ id, name, state, latitutude, longitude }) => (
        <Marker
          key={id}
          position={[
            (latitutude && latitutude / 1000000) || 0,
            (longitude && longitude / 1000000) || 0,
          ]}
        >
          <Popup>
            <b>{name}</b>
            {state && <br />}
            {state}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
