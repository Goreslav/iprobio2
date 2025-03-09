import { MedusaService } from "@medusajs/framework/utils"
import { MedusaError } from "@medusajs/framework/utils"
import StaticPage from "./models/static-page"

type StaticPageOptions = {
    enabledAdminUI?: boolean
}

type StaticPageType = {
    id: string
    handle: string
    title: string
    type?: string | null
    body?: string | null
    metadata?: Record<string, any> | null
}

class StaticPagesModuleService extends MedusaService({
    StaticPage,
}) {
    protected options_: StaticPageOptions

    constructor({}, options?: StaticPageOptions) {
        super(...arguments)

        this.options_ = options || {
            enabledAdminUI: true,
        }
    }

    async getPages() {
        return await this.listStaticPages()
    }

    async getPageByIdOrHandle(identifier: string) {
        // Najprv skúsime nájsť podľa ID
        try {
            const pageById = await this.retrieveStaticPage(identifier)
            if (pageById) {
                return pageById as StaticPageType
            }
        } catch (error) {
            // Pokračujeme k vyhľadávaniu podľa handle
        }

        // Ak sa nenašlo podľa ID, skúsime handle
        const pages = await this.listStaticPages({
            where: { handle: identifier }
        }) as StaticPageType[]

        const pageByHandle = pages[0]

        if (!pageByHandle) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Page with identifier ${identifier} was not found`
            )
        }

        return pageByHandle
    }

    async addPage(data: {
        handle: string
        title: string
        type?: string
        body?: string
        metadata?: Record<string, any>
    }) {
        const { handle, title, type, body, metadata } = data

        if (!handle || !title) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Adding a page requires a unique handle and a title"
            )
        }

        // Kontrola jedinečnosti handle
        const pages = await this.listStaticPages({
            where: { handle }
        }) as StaticPageType[]

        if (pages.length > 0) {
            throw new MedusaError(
                MedusaError.Types.DUPLICATE_ERROR,
                `A page with handle ${handle} already exists`
            )
        }

        const newPage = await this.createStaticPages({
            handle,
            title,
            type,
            body,
            metadata,
        }) as StaticPageType

        return newPage
    }

    async updatePage(identifier: string, data: {
        handle?: string
        title?: string
        type?: string
        body?: string
        metadata?: Record<string, any>
    }) {
        const existingPage = await this.getPageByIdOrHandle(identifier) as StaticPageType

        if (!existingPage) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Page with identifier ${identifier} was not found`
            )
        }

        // Ak sa mení handle, skontrolujeme jedinečnosť
        if (data.handle && data.handle !== existingPage.handle) {
            const pages = await this.listStaticPages({
                where: { handle: data.handle }
            }) as StaticPageType[]

            if (pages.length > 0) {
                throw new MedusaError(
                    MedusaError.Types.DUPLICATE_ERROR,
                    `A page with handle ${data.handle} already exists`
                )
            }
        }

        // Pre TypeScript vytvoríme update objekt s korektným typom
        const updateData = {
            id: existingPage.id,
            ...data
        }

        const updatedPage = await this.updateStaticPages(updateData) as StaticPageType

        return updatedPage
    }

    async deletePage(identifier: string) {
        const page = await this.getPageByIdOrHandle(identifier) as StaticPageType

        if (!page) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Page with identifier ${identifier} was not found`
            )
        }

        // Pre TypeScript spresnenie typu pre ID
        const pageId = page.id as string
        await this.deleteStaticPages(pageId)
        return { id: pageId }
    }
}

export default StaticPagesModuleService