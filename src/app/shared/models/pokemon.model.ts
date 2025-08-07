export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  spriteUrl: string;
  types: { typeName: string }[];
}
