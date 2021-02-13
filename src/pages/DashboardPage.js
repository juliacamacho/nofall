import React from "react";
import { Link } from 'react-router-dom';

import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs"
import ActivityGraph from '../components/ActivityGraph'
import ActivitySummary from '../components/ActivitySummary'
import ActivityCard from '../components/ActivityCard'
import AssessmentGraph from '../components/AssessmentGraph'

const DashboardPage = () => {
    return (
        <>
            <Navbar/>
            <Tabs />

            <div className="px-16 pb-8">

                <h1 className="text-2xl font-bold mb-6">Ambient Activity Report</h1>
                <ActivitySummary />
                <ActivityGraph title="Time Spent Sitting/Lying Down"/>
                <ActivityGraph title="Frequency of Stand-ups"/>
                <div className="grid grid-cols-3 gap-x-4">
                    <ActivityCard title="Average Walking Speed" yesterday={3} lastWeek={-4} lastMonth={-14} />
                    <ActivityCard title="Average Sitting/Standing Speed" yesterday={3} lastWeek={-4} lastMonth={-14} />
                    <ActivityCard title="Average Time Spent in Room" yesterday={3} lastWeek={-4} lastMonth={-14} />
                </div>

                <h1 className="text-2xl font-bold mt-14 mb-6">Proactive Risk Assessment Results</h1>
                <AssessmentGraph title="Timed Up-and-Go Test"/>
                <AssessmentGraph title="Chair Stand Test"/>

            </div>
        </>
    )
}

export default DashboardPage;