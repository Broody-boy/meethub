import { AuthGuard } from "@/guards/AuthGuard";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}