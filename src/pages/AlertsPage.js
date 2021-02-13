import React from "react";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";
import AlertCard from "../components/AlertCard";

const AlertsPage = () => {
    return (
        <>
            <Navbar/>
            <div className="py-8 px-16">
                <Tabs/>
                <div className="space-y-3">
                    <AlertCard
                        type='info'
                        message="James has met the sitting/lying down time goal for the day!"
                        timestamp={1613195383000}
                    />
                    <AlertCard
                        type='alert'
                        message="James appears to have fallen down!"
                        timestamp={1613195383000}
                    />
                    <AlertCard
                        type='info'
                        message="James has finished exercising!"
                        timestamp={1613105953000}
                    />
                    <AlertCard
                        type='info'
                        message="James has started exercising!"
                        timestamp={1613105643000}
                    />
                    <AlertCard
                        type='info'
                        message="James has exceeded the sitting/lying down time goal for the day!"
                        timestamp={1613195383000}
                    />
                </div>


            </div>
        </>
    )
};

export default AlertsPage;