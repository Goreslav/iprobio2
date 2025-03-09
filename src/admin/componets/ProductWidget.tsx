import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container } from "./Container.tsx"
import { Header } from "./Header.tsx"

const ProductWidget = () => {
    return (
        <Container>
            <Header title="Product Widget" />
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "product.details.before",
})

export default ProductWidget