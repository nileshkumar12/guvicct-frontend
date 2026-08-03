import { SimpleEntityFormPage } from "./SimpleEntityCrud.jsx"
import { categoryConfig } from "./CategoriesPage.jsx"

const AddCategoryPage = () => <SimpleEntityFormPage config={categoryConfig} mode="add" />

export default AddCategoryPage
