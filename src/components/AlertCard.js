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


    switch (type) {
        case 'info':
            primaryColor = "blue-600";
            secondaryColor = "blue-100";

            break;

        case 'alert':
            primaryColor = "red-600";
            secondaryColor = "red-100";
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path
                        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
                </svg>
            </span>
            <div className="inline-block space-y-1">
                <div className="font-bold">{message}</div>
                <div className="text-xs">{timeStr}</div>
            </div>

        </div>
    )
}

