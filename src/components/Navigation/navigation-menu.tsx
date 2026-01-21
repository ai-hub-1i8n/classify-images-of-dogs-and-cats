"use client"

import * as React from "react"
import Link from "next/link"
import { Cat, DogIcon } from "lucide-react"

import {
    NavigationMenu as NavigationMenuComponent,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "../theme/ModeToggle"


export function NavigationMenu() {
    return (
        <NavigationMenuComponent viewport={false} className="container mx-auto my-4 p-4 rounded-3xl border bg-background flex justify-between items-center shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 md:gap-0 gap-6 w-full">
            <NavigationMenuList className="flex flex-col md:flex-row md:gap-4 gap-6 items-center justify-between w-full max-w-7xl px-4">
                <NavigationMenuItem>
                    {/* LOGO: 🐕 Dogs and Cats 🐱 image classification */}
                    <Link href="/" className="text-2xl font-bold">
                        <div className="flex items-center gap-2">
                            <DogIcon className="w-6 h-6 text-blue-500" />
                            <span>Dogs and Cats</span>
                            <Cat className="w-6 h-6 text-pink-500" />
                        </div>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList className="flex gap-4 items-center justify-between w-full max-w-7xl px-4">
                <NavigationMenuItem>
                    <ModeToggle />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenuComponent>
    )
}
