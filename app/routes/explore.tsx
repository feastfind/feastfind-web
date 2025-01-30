import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/explore';
import { Banknote } from 'lucide-react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { paths } from '@/schema';
import type { itemPlaceSchema } from '@/schema/schema';
import { ENV } from '@/env';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { formatRupiah } from '@/lib/utils';

const accessToken = ENV.VITE_MAPBOX_ACCESS_TOKEN;

type PlacesResponse =
  paths['/places']['get']['responses'][200]['content']['application/json'];

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Explore Places - FeastFind' },
    { name: 'description', content: 'Find some feasts that closest to you!' },
  ];
}

export async function clientLoader() {
  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/places?limit=100`);
  const placesJSON: PlacesResponse = await response.json();

  return { placesJSON: placesJSON };
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { placesJSON } = loaderData;
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [currentPlace, setCurrentPlace] = useState<itemPlaceSchema | null>(
    null
  );

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
          console.error('Error get user location: ', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser');

      setUserLocation({
        latitude: 0.9261549301037288,
        longitude: 104.43826874232784,
      });
    }
    return () => {
      setUserLocation(null);
    };
  }, []);

  return (
    <div className="relative overflow-hidden max-w-[500px] h-[calc(100vh-8rem)]">
      <div className="fixed top-16 bottom-16 left-0 right-0 max-w-[500px] mx-auto">
        {userLocation && (
          <Map
            mapboxAccessToken={accessToken}
            initialViewState={{
              longitude: userLocation?.longitude,
              latitude: userLocation?.latitude,
              zoom: 5,
            }}
            style={{ maxWidth: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <Marker
              longitude={userLocation?.longitude}
              latitude={userLocation?.latitude}
              color="red"
            />
            {placesJSON.map((place) => (
              <Marker
                key={place.id}
                longitude={place?.longitude}
                latitude={place?.latitude}
                onClick={() => {
                  setOpenDrawer(true);
                  setCurrentPlace({ place });
                }}
                anchor="center"
              >
                <div className="flex flex-col items-center">
                  <img
                    src="/map-pin.svg"
                    alt="Map Pin"
                    width={30}
                    height={30}
                  />
                  <p className="text-xs p-0.5 rounded bg-white border max-w-28 text-center">
                    {place.name}
                  </p>
                </div>
              </Marker>
            ))}
            <NavigationControl />
          </Map>
        )}
      </div>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="max-w-[500px] mx-auto">
          <DrawerHeader className="hidden">
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="mx-auto w-full max-w-sm">
            <div className="p-4 pb-0 flex">
              {currentPlace?.place && (
                <>
                  <div className="w-32 h-full bg-gray-50">
                    <img
                      alt="menu item"
                      src={`${currentPlace?.place?.images[0]}-/resize/300/`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-4">
                    <Label className="text-md text-amber-800 dark:text-yellow-500 cursor-pointer font-bold">
                      {currentPlace?.place.name}
                    </Label>
                    <div className="flex items-center gap-1 dark:text-slate-300">
                      {currentPlace?.place.ratingScore}
                      <StarFilledIcon className="text-amber-600 dark:text-yellow-500" />
                    </div>
                    <div className="flex items-center gap-2 font-light text-xs text-emerald-800 dark:text-cyan-300">
                      <Banknote />
                      <Label>{`${formatRupiah(
                        parseInt(String(currentPlace?.place?.priceMin))
                      )}-${formatRupiah(
                        parseInt(String(currentPlace?.place?.priceMax))
                      )}`}</Label>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DrawerFooter>
              {currentPlace?.place && (
                <Button className="bg-red-900" asChild>
                  <Link to={`/${currentPlace?.place?.slug}`} viewTransition>
                    See details
                  </Link>
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
