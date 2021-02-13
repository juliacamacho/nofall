import React from "react";

const dateStrOpt = {
    weekday: 'long', month: 'long', day: 'numeric',
};

const timeStrOpt = {
    hour: 'numeric', minute: 'numeric'
}

export default function AlertCard({type = 'none', message = "unknown event", timestamp = 0}) {

    let primaryColor = "gray-600";
    let secondaryColor = "gray-100";
    let icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path
                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm2-1.645A3.502 3.502 0 0 0 12 6.5a3.501 3.501 0 0 0-3.433 2.813l1.962.393A1.5 1.5 0 1 1 12 11.5a1 1 0 0 0-1 1V14h2v-.645z"/>
        </svg>
    );


    switch (type) {
        case 'info':
            primaryColor = "blue-600";
            secondaryColor = "blue-100";
            icon = (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path
                        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
                </svg>
            );
            break;

        case 'alert':
            primaryColor = "red-600";
            secondaryColor = "red-100";
            icon = (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path
                        d="M12.866 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.474a1 1 0 0 1-.866-1.5L11.134 3a1 1 0 0 1 1.732 0zM11 16v2h2v-2h-2zm0-7v5h2V9h-2z"/>
                </svg>
            )
            break;

        default:
            console.debug("Unknown type passed into AlertCard");
    }

    const time = new Date(timestamp);

    let timeStr = time.toLocaleDateString('en-US', dateStrOpt) +
        " at " + time.toLocaleTimeString('en-US', timeStrOpt);

    const additionalClasses = `text-${primaryColor} bg-${secondaryColor}`;

    return (
        <div className={"flex card px-5 py-3 space-x-5 fill-current " + additionalClasses}>
            <span className="inline-block">
                {icon}
            </span>
            <div className="inline-block space-y-1">
                <div className="font-bold">{message}</div>
                <div className="text-xs">{timeStr}</div>
            </div>

        </div>
    )
}

