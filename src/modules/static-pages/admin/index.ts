import { PluginOptions} from "grapesjs";
import { DocumentText } from "@medusajs/icons"

const staticPagesAdminExtension = {
    name: "Static Pages",
    config: {
        route: {
            path: "/static-pages",
            link: {
                label: "Static Pages",
                icon: DocumentText,
                order: 9
            }
        }
    } as PluginOptions
}

export default staticPagesAdminExtension