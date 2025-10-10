import React from 'react';
import cn from 'classnames';


export type TButton = {
    variant?: string;
    isHover?: boolean;
    className?: string;
    text?: string;
    onClick: (a: any) => void;
    isDisabled?: boolean;
}

const Button: React.FC<TButton> = (props: TButton) => {
    const {
        variant = 'main',
        isHover = false,
        className,
        text = '',
        onClick = () => { },
        isDisabled = false,
    } = props;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
            e.preventDefault();
            e.stopPropagation(); 
            return;
        }
        onClick(e);
    };

    return (<button
        className={cn('button', `button-${variant}`, className, { 'hover': isHover, 'disabled': isDisabled })}
        onClick={handleClick}
        disabled={isDisabled}
    >
        {text}
    </button>);
}

export default Button;