import { accessToken, auth } from '@/lib/auth';
import type { Route } from './+types/userMenuItemAdd';
import { Link, redirect, useFetcher, useRevalidator } from 'react-router';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { paths } from '@/schema';
import { ENV } from '@/env';
import MenuItemsCard from '@/components/shared/MenuItemsCard';
import { useRef } from 'react';
// import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import { uploadFile } from '@uploadcare/upload-client';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { TrashIcon } from 'lucide-react';
// import uploadcare from 'uploadcare-widget';

type PlaceBySlugResponse =
  paths['/places/{slug}']['get']['responses'][200]['content']['application/json'];

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Add Menu Item - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const user = await auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const response = await fetch(
    `${ENV.VITE_BACKEND_API_URL}/places/${params.placeSlug}`
  );
  const placeData: PlaceBySlugResponse = await response.json();

  if (response.status !== 200) {
    return { placeData };
  }

  return { placeData };
}

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const data = await request.formData();
  const token = await accessToken.get();

  type NewMenuItemResponse =
    paths['/menu-items']['post']['responses'][201]['content']['application/json'];

  const fileData = data.get('featured-image');

  let imagesUrl: string = '';

  if (fileData) {
    const result = await uploadFile(fileData, {
      publicKey: ENV.VITE_UPLOADCARE_PUBLIC_KEY ?? 'f7e80c7b79e521955634',
      store: 'auto',
    });

    imagesUrl = result.cdnUrl;
  }

  const bodyData = {
    name: data.get('name'),
    description: data.get('description'),
    price: Number(data.get('price')) || 0,
    placeSlug: params.placeSlug,
    images: [
      {
        url: imagesUrl,
      },
    ],
  };

  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/menu-items`, {
    method: 'POST',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });

  if (response.status !== 201) {
    console.log(response);
    return;
  }

  // const newPlace: NewMenuItemResponse = await response.json();

  return redirect(`/account/place/${params.placeSlug}/menu/add#menu-items`);
}

export default function Route({ params, loaderData }: Route.ComponentProps) {
  let fetcher = useFetcher();
  const myRef = useRef<HTMLElement | null>(null);
  const revalidator = useRevalidator();

  const placeName = params.placeSlug.split('-').join(' ');
  const { placeData } = loaderData;

  const deleteMenuItemHandle = async (slug: string): Promise<void> => {
    const token = await accessToken.get();

    await fetch(`${ENV.VITE_BACKEND_API_URL}/menu-items/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    revalidator.revalidate();
  };

  return (
    <div className="flex flex-col gap-4 p-5 mt-16 text-foreground">
      <div className="text-2xl font-medium dark:text-white">Add Menu Item</div>
      <p>
        Add menu item for Place:
        <Link to={`/${params.placeSlug}`} target="_blank">
          <span className="capitalize text-red-500 ml-1">{placeName}</span>
        </Link>
      </p>
      <p className="text-sm underline">
        Or lookup for available menu:{' '}
        <span
          className="text-red-500 cursor-pointer"
          onClick={() => myRef.current?.scrollIntoView()}
        >
          Click here
        </span>
      </p>

      <div className="p-4 bg-slate-100 rounded-lg text-foreground">
        <fetcher.Form method="post" encType="multipart/form-data">
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
              <Label htmlFor="price" className="text-sm text-black">
                Price <span className="text-xs text-red-800">*</span>
              </Label>
              <Input
                type="number"
                name="price"
                id="price"
                min={0}
                required
                placeholder="Min : 0"
                className="placeholder:text-slate-300 placeholder:text-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="featured-image" className="text-sm text-black">
                Menu Image <span className="text-xs text-red-800">*</span>
              </Label>
              <Input
                type="file"
                name="featured-image"
                id="featured-image"
                required
                // placeholder="http://feastfind.com/some-featured-image.jpg"
                className="placeholder:text-slate-300 placeholder:text-xs"
                // multiple
              />
            </div>
            {/* <FileUploaderRegular
              useCloudImageEditor={false}
              sourceList="local, camera"
              classNameUploader="uc-light"
              pubkey={ENV.VITE_UPLOADCARE_PUBLIC_KEY ?? 'f7e80c7b79e521955634'}
            /> */}

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

      <section
        ref={myRef}
        id="menu-items"
        className="text-xl font-medium dark:text-white mt-4"
      >
        Menu Items
      </section>

      <div className="h-96 overflow-scroll p-4 bg-slate-100 rounded-xl text-foreground">
        <ul>
          {placeData.menuItems.length === 0 && (
            <p className="text-sm">No menu items available</p>
          )}
          {placeData.menuItems.map((item, index) => (
            <div className="flex items-center" key={index}>
              <div className="w-1/6 flex gap-4">
                {/* <div className="flex gap-4"> */}
                <Link
                  to={`/account/place/${params.placeSlug}/menu/edit/${item.slug}`}
                  viewTransition
                >
                  <Pencil1Icon className="size-4 text-green-700 dark:text-green-400" />
                </Link>
                <TrashIcon
                  className="size-4 text-red-700 dark:text-red-400 cursor-pointer"
                  onClick={() => deleteMenuItemHandle(item.slug)}
                />
                {/* </div> */}
              </div>

              <div className="w-5/6">
                <MenuItemsCard
                  item={item}
                  isUserExist={true}
                  placeSlug={params.placeSlug}
                />
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
