import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CreateCustomerForm } from "@/components/CreateCustomerForm/CreateCustomerForm";
 
export default function NewCustomerPage() {
  return (
    <>
      <Header title="Criar Cliente" showBack />
      <CreateCustomerForm />
      <Footer />
    </>
  );
}