import { useState } from "react";

const useEditModal = () => {
  const [editItem, setEditItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (item) => {
    setIsEditModalOpen(true);
    setEditItem(item);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditItem(null);
  };

  return { editItem, isEditModalOpen, openEditModal, setEditItem, closeEditModal };
};

export default useEditModal;
