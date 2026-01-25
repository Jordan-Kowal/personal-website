export type Review = {
  id: number;
  name: string;
  comment: string;
  rating: number; // 1-5
  avatar?: string; // URL de l'avatar (optionnel)
};
