import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import ActorForm from "../form/ActorForm";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";

export default function ActorUpload({ visible, onClose }) {
  const [busy, setbusy] = useState(false);
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setbusy(true);
    const { error, actor } = await createActor(data);
    setbusy(false);

    if (error) updateNotification("error", error);
    updateNotification("success", "Actor created successfully.");
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        onSubmit={!busy ? handleSubmit : null}
        title="Create New Actor"
        btnTitle="Create"
        busy={busy}
      />
    </ModalContainer>
  );
}
