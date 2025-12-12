export interface IProductCardSizeDT {
  imageUrl: string[];
  name: string;
  mrp: number;
  color: string;
  qty: number;
  stock: {
    id: number;
    name: string;
  };
  variant?: {
    id: number;
    name: string;
    mrp: number;
  };

  isShowDelete: boolean;
}
