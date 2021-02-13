import React, { useCallback, useRef } from "react";

import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs"
import {backendURL} from "../static"
// import VideoPlayer from 'react-video-js-player'
const url = `${backendURL}/video_feed`

const VideosPage = () => {

    const webcamRef = React.useRef(null);

    const capture = React.useCallback(
        () => {
          const imageSrc = fetch(url);
        },
        [webcamRef]
    );

    return (
        <>
            <Navbar/>
            <Tabs />

            <div className="px-16 pb-8">

                <h1 className="text-2xl font-bold mb-8">Friday, Februrary 12th</h1>
                {/* videos here */}
                <div className="flex justify-center items-center">
                    <iframe src={url} width="720" height="500" />
                </div>
            </div>
        </>  
    )
}

export default VideosPage;