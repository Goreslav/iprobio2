import { Table, DropdownMenu, Toaster, toast } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Trash, EyeMini, Spinner } from "@medusajs/icons";
import { useNavigate } from "react-router-dom";
import { useAdminCustomQuery, useAdminCustomDelete } from "medusa-react";

// Definícia typu pre Page
type Page = {
    id: string;
    handle: string;
    title: string;
    type?: string;
    body?: string;
    metadata?: any;
};

export default function StaticPagesTable() {
    const {
        data,
        isLoading: isLoadingPages,
        refetch,
    } = useAdminCustomQuery<any, { pages: Page[] }>(
        "admin/pages",
        ["static-pages-list"]
    );

    if (isLoadingPages) return <Loader />;

    if (!data?.pages || data.pages.length === 0) {
        return (
            <div className="flex justify-center p-8">
                <p className="text-gray-400">No pages found</p>
            </div>
        );
    }

    return (
        <>
            <div className="fixed right-0 top-0 z-9999 p-6 max-w-[484px]">
                <Toaster />
            </div>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className="w-3/7">Title</Table.HeaderCell>
                        <Table.HeaderCell className="w-3/7">Handle</Table.HeaderCell>
                        <Table.HeaderCell className="w-1/7"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data.pages.map((page) => {
                        return (
                            <Table.Row key={page.id} className="cursor-pointer">
                                <Table.Cell>{page.title}</Table.Cell>
                                <Table.Cell>{page.handle}</Table.Cell>
                                <Table.Cell>
                                    <ActionButtons
                                        identifier={page.handle}
                                        id={page.id}
                                        refetch={refetch}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </>
    );
}

function ActionButtons({
                           identifier,
                           id,
                           refetch,
                       }: {
    identifier: string;
    id: string;
    refetch: () => void;
}) {
    const { mutate: deletePage, isLoading: isDeletingPage } = useAdminCustomDelete(
        `admin/pages/${id}`,
        ["static-pages-delete", id]
    );

    const navigate = useNavigate();

    function handleDeletePage() {
        if (confirm("Are you sure you want to delete this page?")) {
            deletePage(undefined, {  // Používame undefined namiesto null
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
                    refetch();
                },
                onError: (err) => {
                    console.log(err);
                    toast.error("Error", {
                        description: "Failed to delete page",
                    });
                },
            });
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <button className="flex items-center justify-center p-1">
                    <EllipsisHorizontal />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                <DropdownMenu.Item className="gap-x-2" onClick={() => navigate(`/static-pages/${id}`)}>
                    <EyeMini className="w-4 h-4" /> View
                </DropdownMenu.Item>
                <DropdownMenu.Item className="gap-x-2" onClick={() => navigate(`/static-pages/${id}/edit`)}>
                    <PencilSquare className="w-4 h-4" /> Edit
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item className="gap-x-2 text-red-500" onClick={handleDeletePage}>
                    {isDeletingPage ? <Spinner className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                    Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
}

function Loader() {
    return (
        <div className="flex justify-center py-8">
            <Spinner className="animate-spin text-gray-500" />
        </div>
    );
}