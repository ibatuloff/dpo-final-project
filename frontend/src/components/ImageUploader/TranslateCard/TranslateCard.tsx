import { useState, FC } from 'react';
import './TranslateCard.css';

interface TranslateCardProps {
    "sentence": string,
    "translate": string
}

const TranslateCard: FC<TranslateCardProps> = ({ sentence, translate }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = () => setIsOpen(open => !open);

    return (
        <div className="tc-wrapper">
            <div className="tc-header">
                <div className="tc-text">{sentence}</div>
                <button className="tc-btn" onClick={toggle}>
                    {isOpen ? 'Скрыть перевод' : 'Смотреть перевод'}
                </button>
            </div>
            <div className={`tc-body ${isOpen ? 'open' : ''}`}>
                {translate}
            </div>
        </div>
    );
};

export default TranslateCard;
