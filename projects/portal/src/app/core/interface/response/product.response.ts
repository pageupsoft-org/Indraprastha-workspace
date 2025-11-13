export interface IProductResponseRoot{
    total:number;
    products:IProduct[]
}

export interface IProduct {
  name: string;
  isCustomSize: boolean;
  customSizeName: string;
  color: string[];
  mrp: number;
  gender: string;
  productURL: string[];
  isActive: boolean;
  stockId: number;
  size: string;
  quantity: number;
  id: number;
}
