import { ChangePasswordForm } from "@/components/ChangePasswordForm/ChangePasswordForm";
import { Header } from "@/components/Header/Header";

type ChangePasswordPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChangePasswordPage({ params }: ChangePasswordPageProps) {
  const { id } = await params;
  const customerId = Number(id);

  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <ChangePasswordForm customerId={customerId} />
    </>
  );
}