import { Container, Heading } from "@medusajs/ui";
import StaticPageForm from "../../components/StaticPagepForm";

export default function CreatePage() {
    return (
        <Container>
            <header className="py-large">
                <Heading level="h2" className="font-semibold">
                    Create Page
                </Heading>
            </header>
            <StaticPageForm type="create" />
        </Container>
    );
}