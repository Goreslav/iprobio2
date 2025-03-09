import StaticPagesModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const STATIC_PAGES_MODULE = "pageService"

export default Module(STATIC_PAGES_MODULE, {
    service: StaticPagesModuleService,
    loaders: [],
})