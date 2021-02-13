import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';

import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs"
import ActivityGraph from '../components/ActivityGraph'
import ActivitySummary from '../components/ActivitySummary'
import ActivityCard from '../components/ActivityCard'
import AssessmentGraph from '../components/AssessmentGraph'
import {db} from "../firebase";

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const stopListening = db
            .collection("users")
            .doc("gwmg2hLSPUxzx3PKbj5r")
            .onSnapshot(snapshot => {
                console.debug("[DashboardPage.js] data updated");
                if (snapshot.exists) {
                    setUserInfo(snapshot.data());
                    setLoading(false);
                    console.debug(snapshot.data());
                }
                else {
                    console.warn("[DashboardPage.js] no data received");
                }

            });

        return () => {
            stopListening();
        }
    }, [db]);

    return (
        loading
            ?
            <>
                <Navbar/>
                <Tabs/>
            </>
            :
            <>
                <Navbar/>
                <Tabs/>

                <div className="px-16 pb-8">

                    <h1 className="text-2xl font-bold mb-6">Ambient Activity Report</h1>
                    <ActivitySummary userInfo={userInfo}/>
                    <ActivityGraph title="Time Spent Active" type="line"/>
                    <ActivityGraph title="Frequency of Stand-ups" type="bar"/>
                    <div className="grid grid-cols-3 gap-x-4">
                        <ActivityCard title="Average Walking Speed" yesterday={3} lastWeek={-4} lastMonth={-14}/>
                        <ActivityCard title="Average Sitting/Standing Speed" yesterday={3} lastWeek={-4}
                                      lastMonth={-14}/>
                        <ActivityCard title="Average Time Spent in Room" yesterday={3} lastWeek={-4} lastMonth={-14}/>
                    </div>

                    <h1 className="text-2xl font-bold mt-14 mb-6">Proactive Risk Assessment Results</h1>
                    <AssessmentGraph title="Timed Up-and-Go Test"/>
                    <AssessmentGraph title="Chair Stand Test"/>

                </div>
            </>
    )
}

export default DashboardPage;