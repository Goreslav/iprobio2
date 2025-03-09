import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Heading, Toaster, DropdownMenu, toast } from "@medusajs/ui";
import { ArrowLeft, EllipsisHorizontal, Trash, PencilSquare } from "@medusajs/icons";
import { useAdminCustomQuery, useAdminCustomDelete} from "medusa-react";
import Loader from "../../components/Loader";

// Definícia typu pre Page
type Page = {
    id: string;
    handle: string;
    title: string;
    type?: string;
    body?: string;
    metadata?: any;
};

export default function ViewPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading } = useAdminCustomQuery<any, { page: Page }>(
        `/admin/pages/${id}`,
        ["static-page", id]
    );

    const { mutate: deletePage, isLoading: isDeletingPage } = useAdminCustomDelete(
        `/admin/pages/${id}`,
        ["static-page-delete", id]
    );

    function handleDeletePage() {
        deletePage(undefined, {
            onSuccess: (response) => {
                let message = "Page deleted successfully";

                // Opatrne pristupovať k odpovedi
                if (response && typeof response === 'object') {
                    if ('response' in response) {
                        const respData = (response.response as any)?.body || {};
                        message = respData.message || message;
                    } else {
                        message = (response as any).message || message;
                    }
                }

                toast.success("Success", {
                    description: message,
                });
                navigate("/static-pages");
            }
        });
    }
    if (!data || isLoading) return <Loader />;

    if (!data.page) return navigate("/static-pages");

    return (
        <div>
            <div className="fixed right-0 top-0 z-9999 p-6 max-w-[484px]">
                <Toaster />
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', margin: '15px' }}>
                <Link to={"/static-pages"} className="gap-x-2 flex flex-center"><ArrowLeft /> Back to Static Pages</Link>
            </div>

            {!isLoading && <Container>
                <header className="px-xlarge pb-2 flex justify-between items-center">
                    <Heading level="h2" className="font-semibold">
                        {data.page.title}
                    </Heading>
                    <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                            <button>
                                <EllipsisHorizontal/>
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content>
                            <DropdownMenu.Item className="gap-x-2" onClick={() => navigate(`/static-pages/${id}/edit`)}><PencilSquare/> Edit</DropdownMenu.Item>

                            <DropdownMenu.Separator/>
                            <DropdownMenu.Item className="gap-x-2 text-red-500" onClick={handleDeletePage}><Trash/>Delete</DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu>
                </header>
                <hr/>
                <div dangerouslySetInnerHTML={{__html: data.page.body || ""}}/>
            </Container>}
        </div>
    );
}