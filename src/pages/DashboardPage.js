import React from "react";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";

const DashboardPage = () => {
    return (
        <>
            <Navbar/>

            <div className="py-8 px-16">
                <Tabs/>

                <h1 className="text-2xl font-bold">Ambient Activity Report</h1>

                <div className="bg-gray-100 rounded-lg py-4 px-4">

                </div>

            </div>
        </>
    )
}

export default DashboardPage;