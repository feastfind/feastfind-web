export type itemReviewSchema = {
  item: {
    id: string;
    menuItemId: string;
    userId: string;
    comment: string | null;
    rating: number;
    createdAt: string | null;
    updatedAt: string | null;
    menuItem: {
      id: string;
      slug: string;
      name: string;
      price: unknown;
      description: string | null;
      ratingScore: number;
      placeId: string;
      userId: string;
      createdAt: string | null;
      updatedAt: string | null;
      images: {
        id: string;
        url: string;
        menuItemId: string;
        createdAt: string | null;
        updatedAt: string | null;
      }[];
      place: {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        ratingScore: number;
        priceMin: unknown;
        priceMax: unknown;
        cityId: string;
        address: string;
        latitude: number;
        longitude: number;
        userId: string;
        createdAt: string | null;
        updatedAt: string | null;
      };
    };
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      avatarURL: string | null;
      createdAt: string | null;
      updatedAt: string | null;
    };
  };
};
