import { useParams, useNavigate } from "react-router-dom";
import { Container, Heading } from "@medusajs/ui";
import StaticPageForm from "../../../components/StaticPagepForm";
import { useAdminCustomQuery } from "medusa-react";
import Loader from "../../../components/Loader";

// Definícia typu pre Page
type Page = {
    id: string;
    handle: string;
    title: string;
    type?: string;
    body?: string;
    metadata?: any;
};

export default function UpdatePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading } = useAdminCustomQuery<any, { page: Page }>(
        `/admin/pages/${id}`,
        ["static-page", id]
    );

    if (!data || isLoading) return <Loader />;

    if (!data.page) return navigate("/static-pages");

    return (
        <div>
            <Container>
                <header className="py-large">
                    <Heading level="h2" className="font-semibold">
                        Update Page
                    </Heading>
                </header>
                <StaticPageForm type="update" defaultValues={data?.page} />
            </Container>
        </div>
    );
}