import { UserRegistrationForm } from "@/components/form/user-registration-form";
import { Card } from "@/components/ui/card";



export default function Home() {
  return (
    <div className="font-sans w-full flex flex-col items-center justify-items-center p-8 gap-5">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to n8n Forms!</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          This is a starter template for building forms with n8n and Next.js.
        </p>
      </Card>
      <Card className="p-8 w-fit mx-auto">
        <h2 className="text-2xl font-semibold mb-4">User Registration Form</h2>
        <UserRegistrationForm />
      </Card>
    </div>
  );
}
