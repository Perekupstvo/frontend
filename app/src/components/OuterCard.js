import React from "react";
import { Card } from "react-bootstrap";


export const OuterCard = ({...props}) => {
    return (
        <Card {...props}
            style={{
                margin: 'auto',
                padding: "20px",
                border: '1px solid #ddd', 
                borderRadius: '10px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                ...props.selfStyle
            }}
        >
            {props.children}
        </Card>
    );
};