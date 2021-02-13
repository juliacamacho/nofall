import React from "react";
import { Link } from 'react-router-dom';

const ActivityGraph = (props) => {
    return (
        <div className="bg-gray-100 rounded-lg py-8 px-10 mb-6">

            <div className="flex justify-between items-center">

                <div className="flex space-x-4 items-baseline">
                    <h1 className="text-xl font-semibold">{props.title}</h1>
                    <Link className="text-gray-600 hover:text-indigo-500 text-sm">Edit Goal</Link>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="text-lg font-semibold text-indigo-500 hover:text-indigo-400">Year</button>
                    <button className="text-lg font-semibold text-indigo-500 hover:text-indigo-400">Month</button>
                    <button className="text-lg font-semibold text-indigo-500 hover:text-indigo-400">Week</button>
                    <button className="bg-indigo-500 rounded-lg py-1 px-4 text-lg font-semibold text-white">Day</button>
                </div>

            </div>
            
            {/* graph here */}

        </div>
    )
}

export default ActivityGraph;