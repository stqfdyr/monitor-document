/// <reference types="vite/client" />
declare const __BASE__: string
declare module "virtual:search-index" {
  const index: Record<string, string>
  export default index
}
declare module "virtual:page-dates" {
  const dates: Record<string, string>
  export default dates
}
