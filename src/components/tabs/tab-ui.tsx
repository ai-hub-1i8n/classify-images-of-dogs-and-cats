import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs as TabsComponent,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export interface TabProp {
    tabTrigger: string
    tabContent: string | never
    tabHeader: string
    tabDescription: string
    tabChildren: React.ReactNode
}

export const tabContent: TabProp[] = [
    {
        tabTrigger: "account",
        tabContent: "Account",
        tabHeader: "Account",
        tabDescription: "Make changes to your account here. Click save when you're done.",
        tabChildren: (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Make changes to your account here. Click save when you&apos;re
                            done.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="tabs-demo-name">Name</Label>
                            <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="tabs-demo-username">Username</Label>
                            <Input id="tabs-demo-username" defaultValue="@peduarte" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save changes</Button>
                    </CardFooter>
                </Card>
            </>
        ),
    },
    {
        tabTrigger: "password",
        tabContent: "Password",
        tabHeader: "Password",
        tabDescription: "Change your password here. After saving, you'll be logged out.",
        tabChildren: (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password here. After saving, you&apos;ll be logged
                            out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="tabs-demo-current">Current password</Label>
                            <Input id="tabs-demo-current" type="password" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="tabs-demo-new">New password</Label>
                            <Input id="tabs-demo-new" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save password</Button>
                    </CardFooter>
                </Card>
            </>
        ),
    }
]

export interface TabProps {
    tabList?: TabProp[]
    tabHeader?: string[]
}

export function Tab({ tabList = tabContent, tabHeader = ["Account", "Password"] }: TabProps) {
    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <TabsComponent defaultValue="account">
                <TabsList>
                    {tabHeader.map((header) => (
                        <TabsTrigger key={header} value={header.toLowerCase()}>
                            {header}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabList.map((tab) => (
                    <TabsContent key={tab.tabTrigger} value={tab.tabTrigger}>
                        {tab.tabChildren}
                    </TabsContent>
                ))}
            </TabsComponent>
        </div>
    )
}
