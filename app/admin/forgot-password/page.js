import { redirect } from "next/navigation";

export default function ForgotPasswordPage() {
  redirect("/admin/login");
  return null;
}
