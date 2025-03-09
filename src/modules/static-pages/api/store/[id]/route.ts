import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STATIC_PAGES_MODULE } from "../../../index"
import StaticPagesModuleService from "../../../service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        const page = await pageService.getPageByIdOrHandle(req.params.id)
        return res.json({ page })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

export default {
    GET
}