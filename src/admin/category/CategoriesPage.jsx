import { SimpleEntityListPage } from "../SimpleEntityCrud.jsx"

const categoryConfig = {
  label: "Category",
  labelLower: "category",
  labelPlural: "Categories",
  labelPluralLower: "categories",
  route: "categories",
  apiPath: "/api/categories",
  listKey: "categories",
  singularKey: "category",
  hasImage: true,
}

const CategoriesPage = () => <SimpleEntityListPage config={categoryConfig} />

export default CategoriesPage
export { categoryConfig }
