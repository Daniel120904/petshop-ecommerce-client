"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { PersonalSection } from "../PersonalSection/PersonalSection";
import { AddressSection } from "../AddressSection/AddressSection";
import { PhoneSection } from "../PhoneSection/PhoneSection";
import { CardSection } from "../CardSection/CardSection";
import styles from "./ProfileView.module.css";

export function ProfileView() {
  const hook = useUserProfile();

  if (hook.loading) return <p className={styles.status}>Carregando perfil...</p>;
  if (hook.error)   return <p className={styles.status}>{hook.error}</p>;
  if (!hook.profile) return null;

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>Meu Perfil</h1>

      <PersonalSection profile={hook.profile} onUpdate={hook.handleUpdateMe} />
      <PhoneSection
        phones={hook.profile.phones}
        onCreate={hook.handleCreatePhone}
        onDelete={hook.handleDeletePhone}
      />
      <AddressSection
        addresses={hook.profile.addresses}
        onCreate={hook.handleCreateAddress}
        onUpdate={hook.handleUpdateAddress}
        onDelete={hook.handleDeleteAddress}
      />
      <CardSection
        cards={hook.profile.cards}
        onCreate={hook.handleCreateCard}
        onDelete={hook.handleDeleteCard}
      />
    </main>
  );
}