import React, { useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

type ConfirmDeleteDialogProps = {
  resourceName: string;
  onDelete: () => Promise<void>;
  children: (props: { showDialog: () => void }) => React.ReactNode;
};

export default function ConfirmDeleteDialog({
  resourceName,
  onDelete,
  children,
}: ConfirmDeleteDialogProps) {
  const toast = useRef<Toast>(null);

  const showDialog = () => {
    confirmDialog({
      group: "delete-universal",
      message: `Voulez-vous supprimer ce ${resourceName} définitivement ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: async () => {
        await onDelete();
        toast.current?.show({
          severity: "success",
          summary: "Supprimé",
          detail: `${resourceName} supprimé avec succès`,
          life: 3000,
        });
      },
      reject: () => {
        toast.current?.show({
          severity: "info",
          summary: "Annulé",
          detail: `Suppression du ${resourceName} annulée`,
          life: 3000,
        });
      },
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog
        group="delete-universal"
        content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
            {/* Cercle rouge avec icône poubelle */}
            <div className="border-circle bg-red-500 inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
              <i className="pi pi-trash text-5xl text-white"></i>
            </div>
            {/* Header */}
            <span
              className="font-bold text-2xl block mb-2 mt-4"
              ref={headerRef as any}
            >
              {message.header}
            </span>
            {/* Message */}
            <p className="mb-0 text-center" ref={contentRef as any}>
              {message.message}
            </p>
            {/* Boutons */}
            <div
              className="flex align-items-center gap-2 mt-4"
              ref={footerRef as any}
            >
              <Button
                label="Supprimer"
                severity="danger"
                className="w-8rem"
                onClick={(event) => {
                  hide(event);
                  onDelete();
                }}
              />
              <Button
                label="Annuler"
                outlined
                className="w-8rem"
                onClick={(event) => {
                  hide(event);
                  toast.current?.show({
                    severity: "info",
                    summary: "Annulé",
                    detail: `Suppression du ${resourceName} annulée`,
                    life: 3000,
                  });
                }}
              />
            </div>
          </div>
        )}
      />
      {children({ showDialog })}
    </>
  );
}
