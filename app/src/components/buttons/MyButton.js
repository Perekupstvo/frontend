import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

export const MyButton = ({...props}) => {
    const [isHovered, setIsHovered] = useState(false);

    const shadowColor = props.shadowColor;
    let _style = {
        ...{
            boxShadow: shadowColor ? (isHovered ? `0 0 8px ${shadowColor}` : `0 0 4px ${shadowColor}`) : '',
            transition: 'box-shadow 0.2s ease-in-out',
        },
        ...props.style,
    };

    return (
        <Button {...props}
            style={_style}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
        >
            {props.children}
        </Button>
    );
};