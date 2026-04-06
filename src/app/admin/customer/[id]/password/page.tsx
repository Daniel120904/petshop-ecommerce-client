import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { ChangePasswordForm } from "@/components/ChangePasswordForm/ChangePasswordForm";

type ChangePasswordPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChangePasswordPage({ params }: ChangePasswordPageProps) {
  const { id } = await params;
  const customerId = Number(id);

  return (
    <>
      <Header title="Alterar Senha" showBack />
      <ChangePasswordForm customerId={customerId} />
      <Footer />
    </>
  );
}