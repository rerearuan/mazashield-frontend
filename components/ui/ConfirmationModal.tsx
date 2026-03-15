"use client";

import React from "react";
import Modal from "./Modal";
import Button from "../button/Button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "success" | "default";
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    type = "default",
    isLoading = false,
}: ConfirmationModalProps) {

    const confirmButtonVariant = type === "danger" ? "danger" : "primary";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            type={type}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button variant={confirmButtonVariant} onClick={onConfirm} isLoading={isLoading}>
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
                {message}
            </p>
        </Modal>
    );
}
