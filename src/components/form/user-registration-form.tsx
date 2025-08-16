"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { sendUserData } from "@/action/send-user-data"
import { FormSchema } from "@/schema/user-data.schema"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input"
import { useState } from "react"
import { Textarea } from "../ui/textarea"



export function UserRegistrationForm() {

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            lastName: "",
            email: "",
            role: "viewer",
            status: "active",
            password: "",
            image: undefined,
            bio: "",
        },
    })

    const [urls, setUrls] = useState<string[] | null>(null)
    const [nextUrlIndex, setNextUrlIndex] = useState(0)
    const [images, setImages] = useState<File[]>([])

    function onSubmit(data: z.infer<typeof FormSchema>) {
        sendUserData(data, images)
        toast.message("You submitted the following values", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }



    return (
        <Form {...form}>
            <div className="flex gap-10 justify-center items-center">
                {urls && (
                    <div className="flex flex-col items-center">
                        <div className="flex gap-2 my-3">
                            <button
                                onClick={() => {
                                    setNextUrlIndex((index) => (index + 1) % urls.length)
                                }}
                                className={`p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors`}
                            >
                                Next Image
                            </button>
                            <button
                                onClick={() => {
                                    setNextUrlIndex((index) => (index - 1 + urls.length) % urls.length)
                                }}
                                className={`p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors`}
                            >
                                Previous Image
                            </button>
                        </div>
                        <div className="mb-4">
                            <img
                                key={nextUrlIndex}
                                src={urls[nextUrlIndex]}
                                alt={`Profile Preview ${nextUrlIndex + 1}`}
                                className="w-[25rem] rounded-md object-cover"
                            />
                        </div>
                    </div>

                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const files = Array.from(e.target.files)
                                                field.onChange(files[0])
                                                const urls = files.map((file) => URL.createObjectURL(file))
                                                setUrls((prev) => (prev ? [...prev, ...urls] : urls))
                                                setImages((prev) => [...prev, ...files])
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4 place-items-stretch">
                        <FormField
                            rules={{ required: "Name is required" }}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            rules={{ required: "Last name is required" }}
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="grid grid-cols-3 gap-4 place-items-stretch">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field: { onChange, value } }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={onChange} defaultValue={value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                            <SelectItem value="guest">Guest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field: { onChange, value } }: { field: { onChange: (value: string) => void; value: string } }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Select onValueChange={onChange} defaultValue={value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="m@example.com">m@example.com</SelectItem>
                                            <SelectItem value="m@google.com">m@google.com</SelectItem>
                                            <SelectItem value="m@support.com">m@support.com</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Type your message here." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </Form>
    )
}
