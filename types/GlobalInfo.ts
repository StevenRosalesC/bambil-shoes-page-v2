/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type */
export interface GlobalDataResponse {
  data: GlobalDataData
  meta: Meta
}

export interface GlobalDataData {
  storeName: string
  id: number
  documentId: string
  whatsappNumber: string
  whatsappDefaultMessage: string
  announcementBanner: string
  instagramUrl: string
  facebookUrl: string
  address: string
  logo: Logo
  email: string
  phone: string
  workingHours: string
  googleMapsUrl: string
  latitude: number
  longitude: number
  favicon: Favicon
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy10
  updatedBy: UpdatedBy10
  locale: string
  localizations: Localization10[]
}

export interface Logo {
  id: number
  documentId: string
  name: string
  alternativeText: string
  caption: string
  focalPoint: string
  width: number
  height: number
  formats: string
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string
  provider: string
  provider_metadata: string
  related: Related[]
  folder: Folder
  folderPath: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy8
  updatedBy: UpdatedBy8
  locale: string
  localizations: Localization8[]
}

export interface Related {
  id: any
  documentId: string
}

export interface Folder {
  id: number
  documentId: string
  name: string
  pathId: number
  parent: Parent
  children: Children[]
  files: File[]
  path: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy7
  updatedBy: UpdatedBy7
  locale: string
  localizations: Localization7[]
}

export interface Parent {
  id: string
  documentId: string
}

export interface Children {
  id: number
  documentId: string
}

export interface File {
  id: any
  documentId: string
  name: string
  alternativeText: string
  caption: string
  focalPoint: string
  width: number
  height: number
  formats: string
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string
  provider: string
  provider_metadata: string
  related: Related2[]
  folder: Folder2
  folderPath: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy
  updatedBy: UpdatedBy6
  locale: string
  localizations: Localization6[]
}

export interface Related2 {
  id: any
  documentId: string
}

export interface Folder2 {
  id: any
  documentId: string
}

export interface CreatedBy {
  id: string
  documentId: string
  firstname: string
  lastname: string
  username: string
  email: string
  resetPasswordToken: string
  resetPasswordTokenExpiresAt: string
  registrationToken: string
  isActive: boolean
  roles: Role[]
  apiTokens: ApiToken2[]
  blocked: boolean
  preferedLanguage: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy6
  updatedBy: UpdatedBy5
  locale: string
  localizations: Localization5[]
}

export interface Role {
  id: number
  documentId: string
  name: string
  code: string
  description: string
  users: User[]
  permissions: Permission[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy5
  updatedBy: UpdatedBy4
  locale: string
  localizations: Localization4[]
}

export interface User {
  id: any
  documentId: string
}

export interface Permission {
  id: any
  documentId: string
  action: string
  actionParameters: string
  subject: string
  properties: Properties
  conditions: string
  role: Role2
  apiToken: ApiToken
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy4
  updatedBy: UpdatedBy3
  locale: string
  localizations: Localization3[]
}

export interface Properties {}

export interface Role2 {
  id: any
  documentId: string
}

export interface ApiToken {
  id: any
  documentId: string
  name: string
  description: string
  kind: string
  type: string
  accessKey: string
  encryptedKey: string
  lastUsedAt: string
  permissions: Permission2[]
  adminPermissions: AdminPermission[]
  adminUserOwner: AdminUserOwner
  expiresAt: string
  lifespan: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy3
  updatedBy: UpdatedBy2
  locale: string
  localizations: Localization2[]
}

export interface Permission2 {
  id: any
  documentId: string
  action: string
  token: Token
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy2
  updatedBy: UpdatedBy
  locale: string
  localizations: Localization[]
}

export interface Token {
  id: any
  documentId: string
}

export interface CreatedBy2 {
  id: any
  documentId: string
}

export interface UpdatedBy {
  id: any
  documentId: string
}

export interface Localization {
  id: any
  documentId: string
}

export interface AdminPermission {
  id: any
  documentId: string
}

export interface AdminUserOwner {
  id: any
  documentId: string
}

export interface CreatedBy3 {
  id: any
  documentId: string
}

export interface UpdatedBy2 {
  id: any
  documentId: string
}

export interface Localization2 {
  id: any
  documentId: string
}

export interface CreatedBy4 {
  id: any
  documentId: string
}

export interface UpdatedBy3 {
  id: any
  documentId: string
}

export interface Localization3 {
  id: any
  documentId: string
}

export interface CreatedBy5 {
  id: any
  documentId: string
}

export interface UpdatedBy4 {
  id: any
  documentId: string
}

export interface Localization4 {
  id: any
  documentId: string
}

export interface ApiToken2 {
  id: any
  documentId: string
}

export interface CreatedBy6 {
  id: any
  documentId: string
}

export interface UpdatedBy5 {
  id: string
  documentId: string
}

export interface Localization5 {
  id: any
  documentId: string
}

export interface UpdatedBy6 {
  id: string
  documentId: string
}

export interface Localization6 {
  id: any
  documentId: string
}

export interface CreatedBy7 {
  id: string
  documentId: string
}

export interface UpdatedBy7 {
  id: number
  documentId: string
}

export interface Localization7 {
  id: number
  documentId: string
}

export interface CreatedBy8 {
  id: string
  documentId: string
}

export interface UpdatedBy8 {
  id: number
  documentId: string
}

export interface Localization8 {
  id: number
  documentId: string
}

export interface Favicon {
  id: string
  documentId: string
  name: string
  alternativeText: string
  caption: string
  focalPoint: string
  width: number
  height: number
  formats: string
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string
  provider: string
  provider_metadata: string
  related: Related3[]
  folder: Folder3
  folderPath: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy9
  updatedBy: UpdatedBy9
  locale: string
  localizations: Localization9[]
}

export interface Related3 {
  id: number
  documentId: string
}

export interface Folder3 {
  id: string
  documentId: string
}

export interface CreatedBy9 {
  id: number
  documentId: string
}

export interface UpdatedBy9 {
  id: string
  documentId: string
}

export interface Localization9 {
  id: number
  documentId: string
}

export interface CreatedBy10 {
  id: number
  documentId: string
}

export interface UpdatedBy10 {
  id: string
  documentId: string
}

export interface Localization10 {
  id: any
  documentId: string
  storeName: string
  whatsappNumber: string
  whatsappDefaultMessage: string
  announcementBanner: string
  instagramUrl: string
  facebookUrl: string
  address: string
  logo: Logo2
  email: string
  phone: string
  workingHours: string
  googleMapsUrl: string
  latitude: number
  longitude: number
  favicon: Favicon2
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy13
  updatedBy: UpdatedBy13
  locale: string
  localizations: Localization13[]
}

export interface Logo2 {
  id: string
  documentId: string
  name: string
  alternativeText: string
  caption: string
  focalPoint: string
  width: number
  height: number
  formats: string
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string
  provider: string
  provider_metadata: string
  related: Related4[]
  folder: Folder4
  folderPath: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy11
  updatedBy: UpdatedBy11
  locale: string
  localizations: Localization11[]
}

export interface Related4 {
  id: any
  documentId: string
}

export interface Folder4 {
  id: string
  documentId: string
}

export interface CreatedBy11 {
  id: any
  documentId: string
}

export interface UpdatedBy11 {
  id: any
  documentId: string
}

export interface Localization11 {
  id: any
  documentId: string
}

export interface Favicon2 {
  id: any
  documentId: string
  name: string
  alternativeText: string
  caption: string
  focalPoint: string
  width: number
  height: number
  formats: string
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string
  provider: string
  provider_metadata: string
  related: Related5[]
  folder: Folder5
  folderPath: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  createdBy: CreatedBy12
  updatedBy: UpdatedBy12
  locale: string
  localizations: Localization12[]
}

export interface Related5 {
  id: any
  documentId: string
}

export interface Folder5 {
  id: any
  documentId: string
}

export interface CreatedBy12 {
  id: any
  documentId: string
}

export interface UpdatedBy12 {
  id: number
  documentId: string
}

export interface Localization12 {
  id: any
  documentId: string
}

export interface CreatedBy13 {
  id: any
  documentId: string
}

export interface UpdatedBy13 {
  id: string
  documentId: string
}

export interface Localization13 {
  id: any
  documentId: string
}

export interface Meta {}
