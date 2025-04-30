"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import leaflet-defaulticon-compatibility
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

// Component to automatically update map view when center changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const AddressMap = ({ center, businessName }) => {
  // Default center if none provided (e.g., center of UK)
  const defaultCenter = [54.5, -2.5];
  const mapCenter = center || defaultCenter;
  const mapZoom = center ? 15 : 6; // Zoom in if specific center, otherwise overview

  if (typeof window === 'undefined') {
    // Avoid rendering on the server
    return null;
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={false}
      style={{ height: '300px', width: '100%', borderRadius: '8px', zIndex: 0 }} // zIndex might help rendering issues
    >
      <ChangeView center={mapCenter} zoom={mapZoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center && (
        <Marker position={center}>
          {businessName && <Popup>{businessName}</Popup>}
        </Marker>
      )}
    </MapContainer>
  );
};

export default AddressMap;