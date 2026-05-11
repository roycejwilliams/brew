"use client";
import { useUserStore } from "@/stores/useUserStore";
import { useGetUser } from "@/hooks/useUser";
import { useEffect } from "react";

//uses the id passed in loginForm.tsx
//to fetch the full user
//hydrates with everything
//id unlocked the whole record
export default function AuthHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useUserStore();
  const { isLoading, data: userData } = useGetUser(user?.id as string);

  //watches the userData
  useEffect(() => {
    if (userData?.data.data) {
      setUser(userData.data.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  if (user?.id && isLoading) {
    return null; // let the splash handle the loading UX
  }

  return <>{children}</>;
}
