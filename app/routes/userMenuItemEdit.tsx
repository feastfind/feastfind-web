import { accessToken, auth } from '@/lib/auth';
import type { Route } from './+types/userMenuItemEdit';
import {
  redirect,
  useFetcher,
  useNavigate,
  useRevalidator,
} from 'react-router';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { paths } from '@/schema';
import { ENV } from '@/env';
import { useState } from 'react';
import { uploadFile } from '@uploadcare/upload-client';
import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';
import { CrossCircledIcon } from '@radix-ui/react-icons';

type MenuItemBySlugResponse =
  paths['/menu-items/{slug}']['get']['responses'][200]['content']['application/json'];

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Edit Menu Item - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const user = await auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const response = await fetch(
    `${ENV.VITE_BACKEND_API_URL}/menu-items/${params.menuItemSlug}`
  );
  const menuItemData: MenuItemBySlugResponse = await response.json();

  if (response.status !== 200) {
    return { menuItemData };
  }

  return { menuItemData };
}

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const data = await request.formData();
  const token = await accessToken.get();

  type EditedMenuItemResponse =
    paths['/menu-items/{slug}']['patch']['responses'][200]['content']['application/json'];

  const imageData = data.get('featured-image');

  let imageUrl: string | null = null;

  if (imageData instanceof File) {
    if (imageData.name !== '') {
      const result = await uploadFile(imageData, {
        publicKey: ENV.VITE_UPLOADCARE_PUBLIC_KEY ?? 'f7e80c7b79e521955634',
        store: 'auto',
      });

      imageUrl = result.cdnUrl;
    } else {
      imageUrl = null;
    }
  }

  const bodyData = {
    name: data.get('name'),
    description: data.get('description'),
    price: Number(data.get('price')) || 0,
    placeSlug: params.placeSlug,
    images: imageUrl ? [{ url: imageUrl }] : undefined,
  };

  const response = await fetch(
    `${ENV.VITE_BACKEND_API_URL}/menu-items/${params.menuItemSlug}`,
    {
      method: 'PATCH',
      body: JSON.stringify(bodyData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
  );

  if (response.status !== 200) {
    const result = await response.json();
    console.log(result);
    const editedPlace = result;
    return { editedPlace };
  }

  const editedPlace: EditedMenuItemResponse = await response.json();
  return redirect(`/account/place/${params.placeSlug}/menu/add#menu-items`);
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { menuItemData } = loaderData;
  let fetcher = useFetcher();
  let navigate = useNavigate();
  const revalidator = useRevalidator();

  let busy = fetcher.state !== 'idle';

  const [images, setImages] = useState(menuItemData.images);
  const [willDeletedImagesId, setWillDeletedImagesId] = useState<string[]>();

  async function handleDeleteMenuItemImage(
    imageId: string,
    menuItemId: string,
    imageUrl: string
  ) {
    const regex = /(?:https?:\/\/)?(?:www\.)?[^\/]+(?:\/(.*))?/;
    const matchUuid = imageUrl.match(regex);

    if (matchUuid) {
      const imagesId = willDeletedImagesId;
      imagesId?.push(String(matchUuid));
      setWillDeletedImagesId(imagesId);

      const newImages = images.filter((image) => image.url !== imageUrl);
      setImages(newImages);
    }
    try {
      const token = await accessToken.get();

      const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
        publicKey: ENV.VITE_UPLOADCARE_PUBLIC_KEY,
        secretKey: ENV.VITE_UPLOADCARE_SECRET_KEY,
      });

      const regex = /(?:https?:\/\/)?(?:www\.)?[^\/]+(?:\/(.*))?/;
      const matchUuid = imageUrl.match(regex);

      if (matchUuid) {
        const result = await deleteFile(
          {
            uuid: `${matchUuid[1]}`,
          },
          { authSchema: uploadcareSimpleAuthSchema }
        );

        if (result.datetimeRemoved) {
          await fetch(
            `${ENV.VITE_BACKEND_API_URL}/menu-item-images/${menuItemId}/${imageId}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
            }
          );
        }
        revalidator.revalidate();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleBackButton() {
    navigate(-1);
  }

  return (
    <div className="flex flex-col gap-4 p-5 mt-16 text-foreground">
      <div className="flex gap-2 items-center">
        <Button onClick={handleBackButton}>Back</Button>
        <div className="text-2xl font-medium dark:text-white">
          Edit Menu Item
        </div>
      </div>

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
                defaultValue={menuItemData.name}
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
                defaultValue={menuItemData.description ?? ''}
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
                defaultValue={menuItemData.price}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="current-image" className="text-sm text-black">
                Current Image
              </Label>
              <p className="text-xs text-red-500 mb-4">
                ⚠️ if you press cross icon, it will remove and you can't undo
                this action
              </p>
              {images.length === 0 && (
                <p className="text-xs text-red-500">No images available.</p>
              )}
              <ul className="flex gap-2 flex-wrap">
                {images.map((image, index) => (
                  <li className="w-1/5 flex" key={index}>
                    <div className="flex ">
                      <img
                        src={image.url}
                        key={index}
                        className="rounded-lg object-cover"
                        id="current-image"
                      />
                      <CrossCircledIcon
                        className="absolute cursor-pointer size-5 hover:text-red-500 bg-white dark:bg-black rounded-full transition-all"
                        onClick={() =>
                          handleDeleteMenuItemImage(
                            image.id,
                            menuItemData.id,
                            image.url
                          )
                        }
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="featured-image" className="text-sm text-black">
                Add Menu Image (optional)
              </Label>
              <Input
                type="file"
                name="featured-image"
                id="featured-image"
                className="placeholder:text-slate-300 placeholder:text-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                name="submit"
                id="submit"
                className="dark:bg-slate-300 bg-green-800"
              >
                {busy ? 'Saving...' : 'Update'}
              </Button>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
