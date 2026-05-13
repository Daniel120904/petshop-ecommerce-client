import { ChangePasswordForm } from "@/components/ChangePasswordForm/ChangePasswordForm";

type ChangePasswordPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChangePasswordPage({ params }: ChangePasswordPageProps) {
  const { id } = await params;
  const customerId = Number(id);

  return (
    <>
      <ChangePasswordForm customerId={customerId} />
    </>
  );
}