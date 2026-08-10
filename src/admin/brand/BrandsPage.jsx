import { SimpleEntityListPage } from "../SimpleEntityCrud.jsx"

const brandConfig = {
  label: "Brand",
  labelLower: "brand",
  labelPlural: "Brands",
  labelPluralLower: "brands",
  route: "brands",
  apiPath: "/api/brands",
  listKey: "brands",
  singularKey: "brand",
  hasImage: true,
}

const BrandsPage = () => <SimpleEntityListPage config={brandConfig} />

export default BrandsPage
export { brandConfig }
