import React, { useState, useEffect } from 'react';

const ResponsiveContainer = props => {

    const height = useWindowSize();

    const {offset = 136} = props;
    const heightToUse = {
        height: (height) ? height - offset : 500
    };

    const className = `overlay_position scrollbar${props.className ? ' '+props.className : ''}`

    return (
        <div className={className} style={{ ...heightToUse, ...props.style }}>
            {props.children}
        </div>
    );

};

const useWindowSize = () => {
    const isClient = typeof window === "object";
    
    const getHeight = () => isClient ? window.innerHeight : undefined;

    const getWidth = () => isClient ? window.innerWidth : undefined;

    const [windowHeight, setWindowHeight] = useState(getHeight);

    useEffect(() => {
        if(!isClient) return false;

        const handleResize = () => {
            setWindowHeight(getHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowHeight;
};

export default ResponsiveContainer;