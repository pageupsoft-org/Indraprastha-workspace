export interface DashboardResponseRoot {
  total: number
  filter: Filter
  products: Product[]
}

export interface Filter {
  category: Category[]
  color: Color[]
  size: Size[]
  minPrice: number
  maxPrice: number
}

export interface Category {
  id: number
  name: string
  count: number
}

export interface Color {
  id: number
  name: string
  count: number
}

export interface Size {
  id: number
  name: string
  count: number
}

export interface Product {
  id: number
  name: string
  color: string[]
  sizes: string[]
  mrp: number
  gender: string
  isWishList: boolean
  productURL: string[]
}
