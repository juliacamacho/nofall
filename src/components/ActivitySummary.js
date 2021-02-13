import React from "react";
import { Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ActivitySummary = (props) => {
    return ( 
        <div className="bg-indigo-50 rounded-lg py-8 px-10 flex space-x-20 items-center mb-6">
            
            <div className="w-1/6">
                <h1 className="text-xl font-semibold pb-4">Overall Score:</h1>
                {/* <h1 className="text-6xl font-semibold">{props.userInfo.score}/100</h1> */}
                <CircularProgressbar 
                    value={props.score} 
                    text={`${props.score}%`} 
                    styles={buildStyles({
                        pathColor: '#6366f1',
                        textColor: '#6366f1',
                        trailColor: '#e5e7eb',
                    })}    
                    />
            </div>
            <div className="w-1/2">
                <h1 className="text-xl font-semibold pb-4">Current Action:</h1>
                <h1 className="text-6xl font-semibold">{props.userInfo.status}</h1>
            </div>

            <div className="grid grid-cols-2 gap-x-6">
                <Link className="bg-white card-anim py-6 px-8">
                    <h1 className="text-xl font-semibold">{props.userInfo.first} drank water 11 times today.</h1>
                </Link>

                <Link className="bg-white card-anim py-6 px-8">
                    <h1 className="text-xl font-semibold">{props.userInfo.first} took his medicine at 11:03am and 5:06pm today.</h1>
                </Link>
            </div>
        

        </div>
    )
}

export default ActivitySummary;