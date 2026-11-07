'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Icon } from 'leaflet';
import type { DragEndEvent, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
const MapClickHandler = dynamic(() => import('./MapClickHandler'), { ssr: false });

export type LocationSelection = {
  latitude: number;
  longitude: number;
  addressLine: string;
  city: string;
  province: string;
  country: string;
};

type NominatimAddress = {
  house_number?: string;
  road?: string;
  village?: string;
  suburb?: string;
  city?: string;
  town?: string;
  municipality?: string;
  county?: string;
  state?: string;
  province?: string;
  country?: string;
  postcode?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

type LocationPickerModalProps = {
  initialLocation?: Omit<Partial<LocationSelection>, 'latitude' | 'longitude'> & {
    latitude?: number | null;
    longitude?: number | null;
  };
  onConfirm: (selection: LocationSelection) => void;
  onCancel: () => void;
};

const PHNOM_PENH: [number, number] = [11.5564, 104.9282];

function formatAddressLine(address: NominatimAddress): string {
  const street = [address.house_number, address.road].filter(Boolean).join(' ');
  return [street, address.village, address.suburb].filter(Boolean).join(', ');
}

function getCity(address: NominatimAddress): string {
  return address.city ?? address.town ?? address.municipality ?? address.county ?? '';
}

export default function LocationPickerModal({ initialLocation, onConfirm, onCancel }: LocationPickerModalProps) {
  const initialPosition = useMemo<[number, number]>(
    () => [initialLocation?.latitude ?? PHNOM_PENH[0], initialLocation?.longitude ?? PHNOM_PENH[1]],
    [initialLocation?.latitude, initialLocation?.longitude],
  );
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState<LocationSelection>({
    latitude: initialPosition[0],
    longitude: initialPosition[1],
    addressLine: initialLocation?.addressLine ?? '',
    city: initialLocation?.city ?? '',
    province: initialLocation?.province ?? '',
    country: initialLocation?.country ?? 'Cambodia',
  });
  const [detectedAddress, setDetectedAddress] = useState('Move the marker to detect an address.');
  const [geocoding, setGeocoding] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const markerIcon = useMemo(
    () =>
      new Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41],
      }),
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setGeocoding(true);
      setLocationError('');
      try {
        const params = new URLSearchParams({
          format: 'jsonv2',
          addressdetails: '1',
          zoom: '18',
          lat: position[0].toString(),
          lon: position[1].toString(),
        });
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (response.status === 429) {
          throw new Error('Address lookup is temporarily rate limited. Please try again shortly.');
        }
        if (!response.ok) {
          throw new Error('Unable to look up this location.');
        }
        const result = (await response.json()) as NominatimResponse;
        const resultAddress = result.address ?? {};
        const addressLine = formatAddressLine(resultAddress);
        setDetectedAddress(result.display_name ?? 'Address details were not available.');
        setAddress((current) => ({
          ...current,
          latitude: position[0],
          longitude: position[1],
          addressLine: addressLine || current.addressLine,
          city: getCity(resultAddress) || current.city,
          province: resultAddress.state ?? resultAddress.province ?? current.province,
          country: resultAddress.country ?? current.country,
        }));
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLocationError(error instanceof Error ? error.message : 'Unable to look up this location.');
      } finally {
        setGeocoding(false);
      }
    }, 700);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [position]);

  const selectPosition = (latitude: number, longitude: number) => {
    setPosition([latitude, longitude]);
    setAddress((current) => ({ ...current, latitude, longitude }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }
    setLocationLoading(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        selectPosition(coords.latitude, coords.longitude);
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied. You can select a point on the map instead.'
            : 'Your current location is unavailable. You can select a point on the map instead.',
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const updateAddress = (
    field: keyof Pick<LocationSelection, 'addressLine' | 'city' | 'province' | 'country'>,
    value: string,
  ) => {
    setAddress((current) => ({ ...current, [field]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="location-picker-title" className="text-lg font-bold text-slate-800">
              Select Delivery Location
            </h2>
            <p className="text-xs text-slate-500">Click or drag the marker to choose your delivery point.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-2xl leading-none text-slate-400 hover:text-slate-700"
            aria-label="Close map"
          >
            &times;
          </button>
        </div>

        <div className="relative h-[min(48vh,380px)] min-h-[260px] w-full">
          <MapContainer center={initialPosition as LatLngExpression} zoom={13} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              icon={markerIcon}
              position={position as LatLngExpression}
              draggable
              eventHandlers={{
                dragend: (event: DragEndEvent) => {
                  const marker = event.target as { getLatLng: () => { lat: number; lng: number } };
                  const next = marker.getLatLng();
                  selectPosition(next.lat, next.lng);
                },
              }}
            />
            <MapClickHandler onSelect={selectPosition} />
          </MapContainer>
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locationLoading}
            className="absolute bottom-3 right-3 z-[1000] rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-600 shadow hover:bg-indigo-50 disabled:opacity-60"
          >
            {locationLoading ? 'Detecting location...' : 'Use My Current Location'}
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto p-5">
          <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Detected address</p>
            <p className="mt-1">{geocoding ? 'Looking up address...' : detectedAddress}</p>
          </div>
          {locationError && <p className="text-sm text-rose-600">{locationError}</p>}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(
              [
                ['addressLine', 'Address line'],
                ['city', 'City / District'],
                ['province', 'Province'],
                ['country', 'Country'],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="text-sm font-medium text-slate-600">
                {label}
                <input
                  value={address[field]}
                  onChange={(event) => updateAddress(field, event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-normal text-slate-800 outline-none focus:border-indigo-500"
                />
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(address)}
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
