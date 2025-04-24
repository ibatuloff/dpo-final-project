interface PreviewImageProps {
    image: string;
}

export default function PreviewImage({ image }: PreviewImageProps) {
    return (
        <div>
            <img src={image} alt="Uploaded" className="preview-image" />
        </div>
    );
}
