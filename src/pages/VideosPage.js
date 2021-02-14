import React, { useCallback, useRef } from "react";

import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs"
import {backendURL} from "../static"
import Test1 from "../static/029015.mp4"
import Test2 from "../static/928309.mp4"
import VideoPlayer from 'react-video-js-player'
const url = `${backendURL}/video_feed`
const vidSrc1 = Test1
const vidSrc2 = Test2
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

                <h1 className="text-2xl font-bold mb-8">Live Stream</h1>
                {/* videos here */}
                <div className="flex justify-center items-center mb-12">
                    <iframe src={url} width="640" height="640" />
                </div>

                <h1 className="text-2xl font-bold mb-4">Saturday, Februrary 13th</h1>

                <h1 className="text-lg font-bold mb-8">Timed Up-and-Go Test</h1>

                <div className="flex justify-center items-center mb-12">
                    <VideoPlayer src={vidSrc1} />
                </div>

                <h1 className="text-lg font-bold mb-8">Chair Stand Test</h1>
                <div className="flex justify-center items-center mb-12">
                    <VideoPlayer src={vidSrc2} />
                </div>
            </div>
        </>  
    )
}

export default VideosPage;