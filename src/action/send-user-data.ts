"use server";
import { FormSchema } from "@/schema/user-data.schema";
import z from "zod";

export async function sendUserData(
  data: z.infer<typeof FormSchema>,
  images: File[]
) {
  console.log("Server-side function called with data:", data);
  console.log("Images received:", images);
  try {

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("lastName", data.lastName);
    formData.append("role", data.role);
    formData.append("status", data.status);
    formData.append("password", data.password);
    formData.append("image", data.image);
    formData.append("bio", data.bio as string);
    formData.append("website", data.website as string);
    images.forEach((image) => formData.append("images", image));

    const response = await fetch(process.env.WEBHOOK_URL as string, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}