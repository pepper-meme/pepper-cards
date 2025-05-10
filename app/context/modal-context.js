"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Modal } from "@/components/modal";

const ModalContext = createContext(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalBg, setIsModalBg] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [title, setTitle] = useState(null);

  const openModal = useCallback(({ content, title, isModalBg }) => {
    setModalContent(content || null);
    setIsModalOpen(true);
    setIsModalBg(isModalBg || false);
    if (title !== undefined) setTitle(title);
  }, []);

  const updateModal = useCallback(
    ({ content, title, isModalBg }) => {
      if (isModalOpen) {
        setModalContent(content || modalContent);
        setIsModalBg(isModalBg || false);
        if (title !== undefined) setTitle(title);
      }
    },
    [isModalOpen, modalContent],
  );

  const closeModal = useCallback(() => {
    setModalContent(null);
    setIsModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        modalContent,
        openModal,
        updateModal,
        closeModal,
        title,
        isModalBg,
      }}
    >
      {children}
      {!!modalContent && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={title}
          isModalBg={isModalBg}
        >
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};
