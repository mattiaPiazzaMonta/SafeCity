import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => (
  <MapContainer center={[45.4642, 9.1900]} zoom={13} style={{ height: '100vh' }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[45.4642, 9.1900]}>
      <Popup>Milano</Popup>
    </Marker>
  </MapContainer>
);

export default Map;