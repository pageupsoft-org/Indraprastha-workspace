import { EDescriptionType } from "../../enum/discriptionType.enum"

export interface IRProductDetailRoot {
  id: number
  name: string
  categoryIds: number[]
  categories: categories[]
  collectionId:number;
  collectionName:string;
  isCustomSize: boolean
  customSizeName: string
  color: string[]
  mrp: number
  gender: string
  productURL: string[]
  isActive: boolean
  variants: Variant[]
  stocks: Stock2[]
  descriptions: Description[]
}

export interface categories {
  id: number
  name: string
}

export interface Variant {
  id: number
  productId: number
  name: string
  description: string
  mrp: number
  variantURL: string
  stocks: Stock
}

export interface Stock {
  id: number
  productId: number
  variantId: number
  quantity: number
  reservedQuantity: number
  size: string
}

export interface Stock2 {
  id: number
  productId: number
  variantId: number
  quantity: number
  reservedQuantity: number
  size: string
}

export interface Description {
  id: number
  productId: number
  header: string
  descriptionType: EDescriptionType
  description: string
  shortDescription: string
}
