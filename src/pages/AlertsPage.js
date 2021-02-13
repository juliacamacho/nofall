import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";
import AlertCard from "../components/AlertCard";
import {db} from "../firebase";

const dateStrOpt = {
    weekday: 'long', month: 'long', day: 'numeric',
};

const AlertsPage = () => {
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    useEffect(async () => {
        const snapshot = await db
            .collection("users/gwmg2hLSPUxzx3PKbj5r/logs")
            .orderBy("timestamp", "desc")
            .get();


        if (!snapshot.empty) {
            let alerts = [[]];
            let lastDate = (new Date()).toDateString();
            snapshot.forEach((event) => {
                const alert = event.data();
                const dateStr = alert.timestamp.toDate().toDateString();

                if (dateStr !== lastDate) {
                    lastDate = dateStr;
                    alerts.push([])
                }
                alerts[alerts.length - 1].push(alert);
            });

            setAlerts(alerts);
        }
        setLoading(false);
    }, []);


    return (
        <>
            <Navbar/>
            <Tabs/>
            <div className="px-16 pb-8">

                <div className="space-y-10">
                    {
                        alerts.map((alertGroup) => {
                            const date = alertGroup[0].timestamp.toDate();
                            const dateStr = date.toLocaleDateString('en-US', dateStrOpt);
                            return (
                                <div className="space-y-3" key={dateStr}>
                                    <span className="font-bold text-2xl">{dateStr}</span>
                                    {
                                        alertGroup.map((alert) => {
                                            return (
                                            <AlertCard
                                                key={alert.timestamp.toMillis()}
                                                type={alert.type}
                                                message={alert.message}
                                                timestamp={alert.timestamp.toMillis()}
                                            />
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>


            </div>
        </>
    )
};

export default AlertsPage;