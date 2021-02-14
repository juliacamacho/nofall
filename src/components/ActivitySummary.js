import React from "react";
import {Link} from 'react-router-dom';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import medicine from '../assets/med.png'
import water from '../assets/water.png'

const ActivitySummary = (props) => {
    return (
        <div
            className="bg-indigo-50 rounded-lg py-8 px-10 flex flex-wrap space-x-0 space-y-12 xl:space-x-20 xl:space-x-0 justify-around items-center mb-6">

            <div className="block inline-block w-full xl:w-5/12 flex space-x-20 justify-around items-center">
                <div className="block inline-block w-60">
                    <h1 className="text-xl font-semibold pb-4">Overall Progress:</h1>
                    {/* <h1 className="text-6xl font-semibold">{props.userInfo.score}/100</h1> */}
                    <CircularProgressbar
                        value={props.score}
                        text={`${props.score.toFixed(1)}%`}
                        styles={buildStyles({
                            pathColor: '#6366f1',
                            textColor: '#6366f1',
                            trailColor: '#e5e7eb',
                        })}
                    />
                </div>
                <div className="block inline-block w-80">
                    <h1 className="text-xl font-semibold pb-4">Current Action:</h1>
                    <h1 className="text-6xl font-semibold">{props.userInfo.status}</h1>
                </div>
            </div>

            <div className="block inline-block w-full xl:w-5/12 grid grid-cols-2 gap-x-6">
                <Link className="bg-white card-anim py-6 px-8 flex items-center space-x-4">
                    <img src={water} className="rounded-full h-14 w-14" />
                    <h1 className="text-xl font-semibold">{props.userInfo.first} drank water {props.userInfo.water} times today.</h1>
                </Link>

                <Link className="bg-white card-anim py-6 px-8 flex items-center space-x-4">
                    <img src={medicine} className="rounded-full h-16 w-16"/>
                    <h1 className="text-xl font-semibold">{props.userInfo.first} took his medicine at 11:03am and 5:06pm today.</h1>
                </Link>
            </div>


        </div>
    )
}

export default ActivitySummary;