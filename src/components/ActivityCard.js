import React from "react";
import { Link } from 'react-router-dom';

const ActivityCard = (props) => {
    return (
        <div className="bg-gray-100 rounded-lg py-6 px-8">

            <h1 className="text-xl font-semibold mb-4">{props.title}</h1>

            <div className="flex items-center mb-1">
                {(props.yesterday > 0) ?
                <svg className="mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                :
                <svg className="mr-1.5 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>}
                <h2><span className="font-medium">{Math.abs(props.yesterday)}% {(props.yesterday > 0) ? "increase " : "decrease "}</span> from yesterday.</h2>
            </div>

            <div className="flex items-center mb-1">
                {(props.lastWeek > 0) ?
                <svg className="mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                :
                <svg className="mr-1.5 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>}
                <h2><span className="font-medium">{Math.abs(props.lastWeek)}% {(props.lastWeek > 0) ? "increase " : "decrease "}</span> from last week.</h2>
            </div>

            <div className="flex items-center mb-1">
                {(props.lastMonth > 0) ?
                <svg className="mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                :
                <svg className="mr-1.5 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>}
                <h2><span className="font-medium">{Math.abs(props.lastMonth)}% {(props.lastMonth > 0) ? "increase " : "decrease "}</span> from last month.</h2>
            </div>

        </div>
    )
}

export default ActivityCard;