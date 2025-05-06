import { useState, FC } from 'react';
import { FiCopy, FiChevronDown } from 'react-icons/fi';
import './TranslateCard.css';

interface TranslateCardProps {
    sentence: string;
    translate: string;
}

const TranslateCard: FC<TranslateCardProps> = ({ sentence, translate }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = () => setIsOpen(open => !open);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log("Скопировано");
        });
    };

    return (
        <div className="tc-wrapper">
            <div className="tc-header">
                <div className="tc-text">
                    {sentence}
                    <FiCopy
                        className="copy-icon"
                        onClick={() => copyToClipboard(sentence)}
                        title="Скопировать"
                    />
                </div>
                <button className={`tc-toggle ${isOpen ? 'rotated' : ''}`} onClick={toggle}>
                    <FiChevronDown size={20} />
                </button>
            </div>
            <div className={`tc-body ${isOpen ? 'open' : ''}`}>
                {translate}
                <FiCopy
                    className="copy-icon"
                    onClick={() => copyToClipboard(translate)}
                    title="Скопировать"
                />
            </div>
        </div>
    );
};

export default TranslateCard;
