import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  redirect("/admin/login");
  return null;
}
