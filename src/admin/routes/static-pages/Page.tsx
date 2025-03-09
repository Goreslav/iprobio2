import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { Container } from "../../componets/Container.tsx"
import { SingleColumnLayout } from "../../layouts/SingleColumn.tsx"
import { Header } from "../../componets/Header.tsx"

const CustomPage = () => {
    return (
        <SingleColumnLayout>
            <Container>
                <Header title="Custom Page" />
            </Container>
        </SingleColumnLayout>
    )
}

export const config = defineRouteConfig({
    label: "Custom",
    icon: ChatBubbleLeftRight,
})

export default CustomPage