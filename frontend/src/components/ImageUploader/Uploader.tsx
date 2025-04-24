import React from 'react';
import { useImageUploader } from './useImageUploader';
import PreviewImage from './PreviewImage';
import Logo from "../../assets/Logo.svg";
import TranslateCard from './TranslateCard/TranslateCard';

export default function ImageUploader() {
    const {
        image, result, loading, dragActive,
        setDragActive, handleImageUpload, handleDrop
    } = useImageUploader();

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => setDragActive(false);

    return (
        <div className="uploader-wrapper">
            <img src={Logo} alt="Логотип" className="upload-logo" />
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
            <div className="output-section">
                {!loading && image && <PreviewImage image={image} />}
                {result && (
                    <TranslateCard
                        sentence={result.sentence}
                        translate={result.translate}
                    />
                )}
            </div>
        </div>
    );
}
