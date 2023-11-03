import React, { ReactNode } from 'react';

interface PropsCard {
    icon?: ReactNode;
    body?: {
        content?: ReactNode;
        color?: string;
    };
    desc?: ReactNode | string;
    footer?: {
        content?: ReactNode | string;
        color?: string;
    };
    style?: {
        class?: string;
        border?: string;
        height?: string;
        width?: string;
        backgroundColor?: string;
    };
}

const CardMini: React.FC<PropsCard> = ({ icon, body, desc, footer, style }) => {
    const { border, height, width, backgroundColor } = style || {};
    const cardClass =
        'border border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark';
    const borderRadius = border ? `rounded-${border}` : 'rounded-lg border';
    const background = backgroundColor ? `bg-${backgroundColor}` : 'bg-white';
    const Height = height ? `h-${height}` : 'h-11.5';
    const Width = width ? `w-${width}` : 'w-11.5';
    const BodyColor = body?.color ? body?.color : 'text-black';
    const FooterColor = footer?.color ? footer?.color : 'text-meta-3';
    return (
        <div className={`${borderRadius} ${background} ${cardClass}`}>
            <div
                className={`flex ${Height} ${Width} items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4`}
            >
                {icon}
            </div>
            <div className="mt-4 flex items-end justify-between">
                <div>
                    <h4
                        className={`text-title-md font-bold dark:text-white ${BodyColor}`}
                    >
                        {body?.content}
                    </h4>
                    <span className="text-sm font-medium">{desc}</span>
                </div>

                <span
                    className={`flex items-center gap-1 text-sm font-medium ${FooterColor}`}
                >
                    {footer?.content}
                </span>
            </div>
        </div>
    );
};

export default CardMini;
