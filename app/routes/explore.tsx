import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useState } from 'react';
import SearchForm from '@/components/shared/SearchForm';
import type { Route } from './+types/explore';
import { useOutletContext } from 'react-router';

const { LngLat } = maplibregl;

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Explore - FeastFind' },
    { name: 'description', content: 'Find feast closest to you!' },
  ];
}

const style: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap Contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

const places = [
  {
    name: 'Manabu',
    latitude: 0.9261549301037288,
    longitude: 104.43826874232784,
    description: 'Lokasi manabu.',
  },
];

export default function Route() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      const { latitude, longitude } = userLocation;

      const map = new maplibregl.Map({
        container: 'map',
        style: style,
        center: [longitude, latitude],
        zoom: 17,
      });

      new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(map);

      new maplibregl.Popup({ offset: 25 })
        .setLngLat([longitude, latitude])
        .setHTML('<h3>Current location.</p>')
        .addTo(map);

      places.map((place) => {
        const { latitude, longitude } = place;

        const placeDistance = new LngLat(longitude, latitude);
        const userDistance = new LngLat(
          userLocation.longitude,
          userLocation.latitude
        );

        const distance = userDistance.distanceTo(placeDistance);

        new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(map);

        new maplibregl.Popup({ offset: 25 })
          .setLngLat([longitude, latitude])
          .setHTML(
            `<p>place: ${place.name}<br>distance: ${distance.toFixed(2)}</p>`
          )
          .addTo(map);
      });

      map.addControl(new maplibregl.NavigationControl());

      return () => map.remove();
    }
  }, [userLocation]);

  const searchFormStatus: boolean = useOutletContext();

  return (
    <div className="flex flex-col gap-4 p-5 mt-16">
      <div className="text-2xl font-medium dark:text-white">Explore Places</div>
      {searchFormStatus && <SearchForm />}
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
}
