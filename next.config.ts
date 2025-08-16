import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // server actions lengt data is four files and user data name, email, lastName, role, status, password, image, bio, website
      bodySizeLimit: "4mb", // Adjust this limit as needed
    }
  }
};

export default nextConfig;
