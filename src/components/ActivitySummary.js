import React from "react";
import { Link } from 'react-router-dom';

const ActivitySummary = () => {
    return ( 
        <div className="bg-indigo-50 rounded-lg py-8 px-10 flex space-x-20 items-center mb-6">
            
            <div>
                <h1 className="text-xl font-semibold pb-4">Overall Score:</h1>
                <h1 className="text-6xl font-semibold">85/100</h1>
            </div>

            <div className="grid grid-cols-2 gap-x-6">
                <Link className="bg-white card-anim py-6 px-8">
                    <h1 className="text-xl font-semibold">James drank water 11 times today.</h1>
                </Link>

                <Link className="bg-white card-anim py-6 px-8">
                    <h1 className="text-xl font-semibold">James took his medicine at 11:03am and 5:06pm today.</h1>
                </Link>
            </div>
        

        </div>
    )
}

export default ActivitySummary;