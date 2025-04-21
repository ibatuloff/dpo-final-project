import React, { useState, ChangeEvent, DragEvent } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import './App.css';

const ImageUploader: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

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

    const readFile = (selectedFile: File) => {
        setLoading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
            sendToServer(selectedFile); // сразу отправляем на сервер
        };

        reader.readAsDataURL(selectedFile);
    };


    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const sendToServer = async (fileToSend: File) => {
        const formData = new FormData();
        formData.append("file", fileToSend, fileToSend.name);

        setResult(null);

        try {
            const response = await fetch("/api/analyze_image", {
                method: "POST",
                body: formData
            })
            console.log(response)

            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

            const data = await response.json();
            setResult(data.description || "Ответ получен, но без описания.");
        } catch (err) {
            console.error("Ошибка при отправке:", err);
            setResult("Ошибка при отправке на сервер.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="uploader-wrapper">
            <FiUploadCloud size={48} color="#3b82f6" className="upload-icon" />
            <h1 className="uploader-title">Загрузка изображения</h1>

            <div
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <label className="upload-button">
                    Выбрать файл
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            {loading && <div className="loader" />}

            {!loading && image && (
                <div>
                    <img src={image} alt="Uploaded" className="preview-image" />
                </div>
            )}

            {result && (
                <div className="result-box">
                    <strong>Ответ нейросети:</strong>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
