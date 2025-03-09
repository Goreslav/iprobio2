import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STATIC_PAGES_MODULE } from "../../index"
import StaticPagesModuleService from "../../service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        const pages = await pageService.getPages()
        return res.json({ pages })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const pageService: StaticPagesModuleService = req.scope.resolve(STATIC_PAGES_MODULE)

    try {
        const data = req.body as {
            handle: string
            title: string
            type?: string
            body?: string
            metadata?: Record<string, any>
        }

        const newPage = await pageService.addPage(data)
        return res.status(201).json({
            identifier: newPage.handle,
            message: "Page has been created successfully",
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export default {
    GET,
    POST
}