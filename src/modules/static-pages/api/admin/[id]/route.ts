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

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        const data = req.body as {
            handle?: string
            title?: string
            type?: string
            body?: string
            metadata?: Record<string, any>
        }

        await pageService.updatePage(req.params.id, data)
        return res.json({
            identifier: data.handle || req.params.id,
            message: "Page has been updated successfully",
        })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        await pageService.deletePage(req.params.id)
        return res.json({
            message: "Page has been deleted successfully",
        })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

export default {
    GET,
    PUT,
    DELETE
}