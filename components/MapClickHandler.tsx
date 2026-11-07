'use client';

import { useMapEvents } from 'react-leaflet';

type MapClickHandlerProps = {
  onSelect: (latitude: number, longitude: number) => void;
};

export default function MapClickHandler({ onSelect }: MapClickHandlerProps) {
  useMapEvents({
    click: (event) => onSelect(event.latlng.lat, event.latlng.lng),
  });
  return null;
}
