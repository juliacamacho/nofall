import React from "react";

import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs"

const VideosPage = () => {
    return (
        <>
            <Navbar/>
            <Tabs />

            <div className="px-16 pb-8">

                <h1 className="text-2xl font-bold mb-8">Friday, Februrary 12th</h1>
                {/* videos here */}

            </div>
        </>  
    )
}

export default VideosPage;