import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STATIC_PAGES_MODULE } from "../../../../modules/static-pages"
import StaticPagesModuleService from "../../../../modules/static-pages/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    console.log(`Received GET request to /store/pages/${req.params.id}`);

    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        const page = await pageService.getPageByIdOrHandle(req.params.id)
        return res.json({ page })
    } catch (error) {
        console.error(`Error in GET /store/pages/${req.params.id}:`, error);
        return res.status(404).json({ message: error.message })
    }
}