import { model } from "@medusajs/framework/utils"

const StaticPage = model.define("static_page", {
    id: model.id().primaryKey(),
    handle: model.text().unique(),
    title: model.text(),
    type: model.text().nullable(),
    body: model.text().nullable(),
    metadata: model.json().nullable(),
})

export default StaticPage