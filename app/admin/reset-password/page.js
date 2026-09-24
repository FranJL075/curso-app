import ResetPasswordForm from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  return <main className="flex flex-1 items-center justify-center bg-ink"><ResetPasswordForm token={params?.token || ""} /></main>;
}
