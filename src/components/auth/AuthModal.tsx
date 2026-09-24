import React from "react";
import { LoginPage } from "./LoginPage";
import { UserRole } from "../../types";

interface AuthModalProps {
  isOpen?: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccessNavigate: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  defaultRole = "student",
  onSuccessNavigate,
}) => {
  return (
    <LoginPage
      defaultRole={defaultRole}
      onBackToHome={onClose}
      onSuccessNavigate={onSuccessNavigate}
    />
  );
};
