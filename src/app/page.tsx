"use client"

import TattooPreview from "@/components/preview/TattooPreview";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();

  return (
    <>
      <TattooPreview />
      {data?.user.userType}
    </>
  );
}
