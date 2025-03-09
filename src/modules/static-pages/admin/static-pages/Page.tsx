import { Container, Heading, Button, Toaster } from "@medusajs/ui";
import { PlusMini, DocumentText } from "@medusajs/icons";
import StaticPagesTable from "../components/Table";
import { Link } from "react-router-dom";

export default function StaticPage() {
    return (
        <div>
            <div className="fixed right-0 top-0 z-9999 p-6 max-w-[484px]">
                <Toaster />
            </div>

            <Container>
                <header className="px-xlarge py-large flex justify-between items-center">
                    <Heading level="h2" className="font-semibold">
                        Static Pages
                    </Heading>
                    <Link to="/static-pages/new">
                        <Button variant="transparent" className="border border-gray-200">
                            <PlusMini /> New page
                        </Button>
                    </Link>
                </header>
                <main>
                    <StaticPagesTable />
                </main>
            </Container>
        </div>
    );
}