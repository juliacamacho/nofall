import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';

import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs"
import ActivityGraph from '../components/ActivityGraph'
import ActivitySummary from '../components/ActivitySummary'
import ActivityCard from '../components/ActivityCard'
import AssessmentGraph from '../components/AssessmentGraph'
import {db} from "../firebase";

// const logId = "C1pEhyGu7iflHabRs3Qm" // live
// const logId = "LYFQJFgzO0vsij7DBXqy" // sample
const logId = "h2vVRIIuNyr65vgZCe2Y" // day


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

    const [overallScore, setOverallScore] = useState(0);
    let activeScore = 0;
    let standScore = 0;

    const updateScore = (value, type) => {
        let score = 0;
        if (type == "active") {
            activeScore = value;
        }
        else if (type == "stand") {
            standScore = value;
        }
        else {
            console.log("undefined type passed")
        }
        score = (activeScore + standScore)/2;
        setOverallScore(score);
    }

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
                    <ActivitySummary userInfo={userInfo} score={overallScore}/>
                    <ActivityGraph title="Time Spent Active" type="line" logId={logId} userInfo={userInfo} updateScore={updateScore} />
                    <ActivityGraph title="Frequency of Stand-ups" type="bar" logId={logId} userInfo={userInfo} updateScore={updateScore} />
                    <div className="grid grid-cols-3 gap-x-4">
                        <ActivityCard title="Average Walking Speed" yesterday={3} lastWeek={-4} lastMonth={-14}/>
                        <ActivityCard title="Average Sitting/Standing Speed" yesterday={3} lastWeek={-4}
                                      lastMonth={-14}/>
                        <ActivityCard title="Average Time Spent in Room" yesterday={3} lastWeek={-4} lastMonth={-14}/>
                    </div>

                    <h1 className="text-2xl font-bold mt-14 mb-6">Proactive Risk Assessment Results</h1>
                    <AssessmentGraph title="Timed Up-and-Go Test" logId={logId} boundaries={[24, 12]} />
                    <AssessmentGraph title="Chair Stand Test" logId={logId} boundaries={[5, 13]} />

                </div>
            </>
    )
}

export default DashboardPage;