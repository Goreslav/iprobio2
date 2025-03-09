import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STATIC_PAGES_MODULE } from "../../../../modules/static-pages"
import StaticPagesModuleService from "../../../../modules/static-pages/service"

type UpdatePageBody = {
    handle?: string
    title?: string
    type?: string
    body?: string
    metadata?: Record<string, any>
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    console.log(`Received GET request to /admin/pages/${req.params.id}`);

    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        const page = await pageService.getPageByIdOrHandle(req.params.id)
        return res.json({ page })
    } catch (error) {
        console.error(`Error in GET /admin/pages/${req.params.id}:`, error);
        return res.status(404).json({ message: error.message })
    }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
    console.log(`Received PUT request to /admin/pages/${req.params.id}`, req.body);

    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        // Typujeme req.body ako UpdatePageBody
        const data = req.body as UpdatePageBody

        const updatedPage = await pageService.updatePage(req.params.id, data)

        // Bezpečne pristupujeme k handle
        const identifier = data.handle || req.params.id

        return res.json({
            identifier,
            message: "Page has been updated successfully",
        })
    } catch (error) {
        console.error(`Error in PUT /admin/pages/${req.params.id}:`, error);
        return res.status(404).json({ message: error.message })
    }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    console.log(`Received DELETE request to /admin/pages/${req.params.id}`);

    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        await pageService.deletePage(req.params.id)
        return res.json({
            message: "Page has been deleted successfully",
        })
    } catch (error) {
        console.error(`Error in DELETE /admin/pages/${req.params.id}:`, error);
        return res.status(404).json({ message: error.message })
    }
}