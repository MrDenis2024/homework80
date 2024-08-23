export interface Category {
  id: number;
  title: string;
  description: string | null;
}

export type CategoryWithoutId = Omit<Category, 'id'>;

export interface Location {
  id: number;
  title: string;
  description: string | null;
}

export type LocationWithoutId = Omit<Location, 'id'>;

export interface Item {
  id: number;
  category_id: number;
  location_id: number;
  name: string;
  description: string | null;
  image: string | null;
  date_added: string;
}

export type ItemWithoutId = Omit<Item, 'id' | 'date_added'>;