import { useState, ChangeEvent, DragEvent } from 'react';
import { sendToServer } from './uploadService';

type TranslationResult = {
    "sentence": string,
    "translate": string
};

export const useImageUploader = () => {
    const [image, setImage] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TranslationResult | null>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) readFile(uploadedFile);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) readFile(droppedFile);
    };

    const readFile = (file: File) => {
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
            sendToServer(file, setResult, setLoading);
        };
        reader.readAsDataURL(file);
    };

    return {
        image,
        result,
        loading,
        dragActive,
        setDragActive,
        handleImageUpload,
        handleDrop
    };
};
