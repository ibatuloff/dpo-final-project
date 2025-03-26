import React, { useState, ChangeEvent, DragEvent } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import './App.css';

const ImageUploader: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) readFile(file);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) readFile(file);
    };

    const readFile = (file: File) => {
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
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
        </div>
    );
};

export default ImageUploader;
