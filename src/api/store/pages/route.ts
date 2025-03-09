import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STATIC_PAGES_MODULE } from "../../../modules/static-pages"
import StaticPagesModuleService from "../../../modules/static-pages/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    console.log("Received GET request to /store/pages");

    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        const pages = await pageService.getPages()
        return res.json({ pages })
    } catch (error) {
        console.error("Error in GET /store/pages:", error);
        return res.status(500).json({ message: error.message })
    }
}