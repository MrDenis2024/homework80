export interface Category {
  id: number;
  title: string;
  description: string | null;
}

export type CategoryWithoutId = Omit<Category, 'id'>;