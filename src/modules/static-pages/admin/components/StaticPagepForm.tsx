import { useState } from "react";
import {
    useForm,
    SubmitHandler,
    UseFormRegister,
    FieldErrorsImpl,
    RegisterOptions
} from "react-hook-form";
import { Label, Input, Button, Toaster, toast, Textarea } from "@medusajs/ui";
import { Spinner } from "@medusajs/icons";
// Používame len useAdminCustomPost
import { useAdminCustomPost } from "medusa-react";
import { Link, useNavigate, useParams } from "react-router-dom";

// Definícia typu pre Page
type Page = {
    id: string;
    handle: string;
    title: string;
    type?: string;
    body?: string;
    metadata?: any;
};

type Inputs = {
    title: string;
    handle: string;
    metadata?: string;
    type: string;
    body: string;
};

type FormInput = {
    name: keyof Inputs;
    label: string;
    placeholder?: string;
    required?: boolean;
};

const formInputs: FormInput[] = [
    {
        name: "title",
        label: "Title",
        placeholder: "Winter Jacket",
        required: true,
    },
    {
        name: "type",
        label: "Type",
        placeholder: "homepage",
        required: true,
    },
    {
        name: "handle",
        label: "Handle",
        placeholder: "winter-jacket",
        required: true,
    },
    {
        name: "metadata",
        label: "Metadata",
        placeholder: "100% cotton",
        required: false,
    },
    {
        name: "body",
        label: "Body",
        placeholder: "Description ...",
        required: true,
    }
];

export default function StaticPageForm({
                                           type,
                                           defaultValues,
                                       }: {
    type: "create" | "update";
    defaultValues?: Page;
}) {
    const { id } = useParams();
    const navigate = useNavigate();

    // Pre metódu PUT musíme použiť alternatívu, keďže useAdminCustomPut nie je dostupné
    const { mutate, isLoading } = useAdminCustomPost(
        type === "create" ? "admin/pages" : `admin/pages/${id}`,
        ["static-pages"]
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            handle: defaultValues?.handle ?? "",
            title: defaultValues?.title ?? "",
            metadata: defaultValues?.metadata ?? "",
            type: defaultValues?.type ?? "",
            body: defaultValues?.body ?? "",
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);

        // Pridáme _method pre simuláciu PUT
        const payload = type === "update" ? { ...data, _method: "PUT" } : data;

        mutate(
            payload,
            {
                onSuccess: (result) => {
                    // Potrebujeme opatrnejšie pristupovať k odpovedi
                    let identifier = id;
                    let message = "Operation completed successfully";

                    // Ak je výsledok objekt, skúsime získať potrebné hodnoty
                    if (result && typeof result === 'object') {
                        // Pokúsime sa získať message a identifier z rôznych možných miest
                        if ('response' in result) {
                            const respData = (result.response as any)?.body || {};
                            identifier = respData.identifier || identifier;
                            message = respData.message || message;
                        } else {
                            identifier = (result as any).identifier || identifier;
                            message = (result as any).message || message;
                        }
                    }

                    toast.success("Success", {
                        description: message,
                    });
                    navigate(`/static-pages/${identifier}`);
                },
            }
        );
    };

    return (
        <>
            <div className="fixed right-0 top-0 z-9999 p-6 max-w-[484px]">
                <Toaster />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
                {formInputs.map(({ name, label, placeholder, required }) => (
                    <FormInput
                        key={name}
                        name={name}
                        label={label}
                        placeholder={placeholder || ""}
                        register={register}
                        required={required}
                        errors={errors}
                    />
                ))}
                <div className="flex justify-end gap-x-4">
                    <Link to="/static-pages">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit">
                        {isLoading && <Spinner className="animate-spin" />} Save
                    </Button>
                </div>
            </form>
        </>
    );
}

// Upravená funkcia FormInput bez generika
function FormInput({
                       name,
                       label,
                       register,
                       errors,
                       required,
                       placeholder,
                   }: {
    name: keyof Inputs;
    label: string;
    register: UseFormRegister<Inputs>;
    errors?: Partial<FieldErrorsImpl<Inputs>>;
    required?: boolean;
    placeholder: string;
}) {
    const registerOptions = required ? { required: "This field is required" } : {};

    return (
        <div>
            <Label size="small" weight="plus">
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>
            {name === "body" ? (
                <Textarea
                    placeholder={placeholder}
                    className="mt-1 min-h-[600px]"
                    {...register(name, registerOptions)}
                    aria-invalid={!!errors?.[name]}
                />
            ) : (
                <Input
                    placeholder={placeholder}
                    className="mt-1"
                    {...register(name, registerOptions)}
                    aria-invalid={!!errors?.[name]}
                />
            )}

            {errors?.[name] && (
                <span className="text-xs text-red-500">{errors[name]?.message as string}</span>
            )}
        </div>
    );
}