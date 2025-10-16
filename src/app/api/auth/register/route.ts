import { RegisterData } from "@/types/auth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const registerData: RegisterData = await req.json();

  // Basic validation
  if (!registerData.email) throw new Error("missing company email");
  if (!registerData.password) throw new Error("missing password");

  console.log("Register data:", registerData);
  console.log("Backend URL:", process.env.NEXT_PUBLIC_URL_GATEWAY);
  console.log("Full backend endpoint:", `${process.env.NEXT_PUBLIC_URL_GATEWAY}/auth/register`);

  try {
    console.log("Making request to backend...");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL_GATEWAY}/auth/register`,
      registerData,
    );

    console.log("Backend response status:", response.status);
    console.log("Backend response status:", response.data);
    console.log("Backend response headers:", response.headers);
    const data = response.data;
    console.log("Backend response data:", data);

    // Return the backend response directly with proper structure
    const result = {
      email: data.user.email,
      userType: data.user.userType,
      accessToken: data.accessToken
    };

    console.log("Returning formatted response:", result);

    return NextResponse.json(result);
  } catch (axiosError) {
    console.error("Axios error details:");
    if (axios.isAxiosError(axiosError)) {
      console.error("Response status:", axiosError.response?.status);
      console.error("Response data:", axiosError.response?.data);
      console.error("Response headers:", axiosError.response?.headers);
      console.error("Request config:", axiosError.config);
    }
    throw axiosError;
  }
}