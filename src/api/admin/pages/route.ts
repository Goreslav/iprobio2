import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STATIC_PAGES_MODULE } from "../../../modules/static-pages"
import StaticPagesModuleService from "../../../modules/static-pages/service"

// Definícia typu pre očakávané telo požiadavky
type CreatePageBody = {
    handle: string
    title: string
    type?: string
    body?: string
    metadata?: Record<string, any>
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    console.log("Received GET request to /admin/pages");

    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        const pages = await pageService.getPages()
        return res.json({ pages })
    } catch (error) {
        console.error("Error in GET /admin/pages:", error);
        return res.status(500).json({ message: error.message })
    }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    console.log("Received POST request to /admin/pages", req.body);

    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        // Typujeme req.body ako CreatePageBody
        const data = req.body as CreatePageBody

        const newPage = await pageService.addPage(data)

        return res.status(201).json({
            identifier: newPage.handle,
            message: "Page has been created successfully",
        })
    } catch (error) {
        console.error("Error in POST /admin/pages:", error);
        return res.status(400).json({ message: error.message })
    }
}