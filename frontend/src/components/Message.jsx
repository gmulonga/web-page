import React, { useEffect } from "react";

function Message({ message, onClose, alertType }) {
    const classValue = `alert alert-dismissible fade show ${alertType}`;

    useEffect(() => {
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={classValue} role="alert">
            {message}
        </div>
    );
}

export default Message;
