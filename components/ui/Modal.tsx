"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../button/Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    type?: "default" | "danger" | "success" | "warning";
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
    type = "default",
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    const typeHeaderClasses = {
        default: "text-gray-900",
        danger: "text-red-600",
        success: "text-green-600",
        warning: "text-yellow-600",
    };

    return createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 transition-all">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-2xl overflow-hidden w-full ${sizeClasses[size]} animate-in fade-in zoom-in duration-300`}>
                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <h2 className={`text-2xl font-black tracking-tight ${typeHeaderClasses[type]}`}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100/50 text-gray-400 hover:bg-gray-200/50 hover:text-gray-900 transition-all font-bold text-xl"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 pt-2 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-8 pt-4 border-t border-gray-100 flex gap-4 justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
