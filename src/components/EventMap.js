import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconRed from 'leaflet/dist/images/marker-icon.png'; // You can replace this with a custom red icon
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom red marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: markerIconRed,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41] // size of the shadow
});

const EventMap = ({ coordinates }) => {
  return (
    <MapContainer
      center={coordinates}
      zoom={13}
      style={{ height: '200px', width: '300px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={coordinates} icon={customMarkerIcon}>
        <Popup>Event Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default EventMap;
