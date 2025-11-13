export interface IRWishlistRoot {
  total: number
  products: Product[]
}

export interface Product {
  name: string
  isCustomSize: boolean
  customSizeName: string
  color: string[]
  mrp: number
  gender: string
  productURL: string[]
  isActive: boolean
  stockId: number
  size: string
  quantity: number
  id: number,
  icon: string
}
