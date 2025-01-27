import { redirect, useFetcher } from 'react-router';
import { Input } from '@/components/ui/input';
import type { Route } from '../+types/root';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { paths } from '@/schema';
import { ENV } from '@/env';
import { accessToken, auth } from '@/lib/auth';

export async function clientLoader() {
  const user = await auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const data = await request.formData();
  const token = await accessToken.get();

  type NewPlaceResponse =
    paths['/places']['post']['responses'][201]['content']['application/json'];

  const bodyData = {
    name: data.get('name'),
    description: data.get('description'),
    priceMin: Number(data.get('priceMin')) || 0,
    priceMax: Number(data.get('priceMax')) || 0,
    city: data.get('city'),
    address: data.get('address'),
    latitude: Number(data.get('latitude')) || 0,
    longitude: Number(data.get('longitude')) || 0,
  };

  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/places`, {
    method: 'POST',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });

  if (response.status !== 201) {
    return;
  }

  const newPlace: NewPlaceResponse = await response.json();

  return redirect('/account/place');
}

export default function Route() {
  let fetcher = useFetcher();

  return (
    <div className="flex flex-col gap-4 p-5 mt-16">
      <div className="text-2xl font-medium dark:text-white">Add Place</div>

      <div className="p-4 bg-slate-100 rounded-lg text-foreground">
        <fetcher.Form method="post">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm text-black">
                Name <span className="text-xs text-red-800">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Place name"
                className="placeholder:text-slate-300 placeholder:text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-sm text-black">
                Description <span className="text-xs text-red-800">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                className="text-xs placeholder:text-slate-300 placeholder:text-xs"
                required
                placeholder="Describe the Place"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="priceMin" className="text-sm text-black">
                Minimum Price <span className="text-xs text-red-800">*</span>
              </Label>
              <Input
                type="number"
                name="priceMin"
                id="priceMin"
                min={0}
                required
                placeholder="Min : 0"
                className="placeholder:text-slate-300 placeholder:text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="priceMax" className="text-sm text-black">
                Maximum Price <span className="text-xs text-red-800">*</span>
              </Label>
              <Input
                type="number"
                name="priceMax"
                id="priceMax"
                min={0}
                required
                placeholder="Must be greater than or equal to Minimum Price"
                className="placeholder:text-slate-300 placeholder:text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="city" className="text-sm text-black">
                City <span className="text-xs text-red-800">*</span>
              </Label>
              <Input
                type="text"
                name="city"
                id="city"
                required
                placeholder="Where is this Place?"
                className="placeholder:text-slate-300 placeholder:text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="address" className="text-sm text-black">
                Address <span className="text-xs text-red-800">*</span>
              </Label>
              <Input
                type="text"
                name="address"
                id="address"
                required
                placeholder="Fill it with full address"
                className="placeholder:text-slate-300 placeholder:text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="latitude" className="text-sm text-black">
                Latitude
              </Label>
              <Input
                type="text"
                name="latitude"
                id="latitude"
                required
                placeholder="ex: -6.166695544720899"
                className="placeholder:text-slate-300 placeholder:text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="longitude" className="text-sm text-black">
                Longitude
              </Label>
              <Input
                type="text"
                name="longitude"
                id="longitude"
                required
                placeholder="ex: 106.8248268651233"
                className="placeholder:text-slate-300 placeholder:text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                name="submit"
                id="submit"
                className="dark:bg-slate-300"
              >
                Submit
              </Button>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
