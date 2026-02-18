import React from 'react';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <div
            className={`glass rounded-2xl ${hover ? 'hover:-translate-y-1' : ''} transition-all duration-300 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
