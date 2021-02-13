import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import {db} from "../firebase";

function formatTime(t) {
    return `${t}:00`
}

const ActivityGraph = (props) => {

    const [sittingX, setSittingX] = useState([]);
    const [sittingY, setSittingY] = useState([]);
    const [standupsX, setStandupsX] = useState([]);
    const [standupsY, setStandupsY] = useState([]);

    useEffect(() => {
        const stopListening = db
            .collection("users/gwmg2hLSPUxzx3PKbj5r/logs")
            .doc("h2vVRIIuNyr65vgZCe2Y")
            .onSnapshot(snapshot => {
                console.log("new activity data");
                let timeX = []
                let timeY = []
                snapshot.data().minutely.forEach((value) => {
                    timeY.push(value/3600)
                });
                for (let i=1; i<=timeY.length; i++){
                    timeX.push(i/60)
                }
                setSittingX(timeX);
                setSittingY(timeY);

                timeX = []
                timeY = []
                snapshot.data().standFreq.forEach((value, idx) => {
                    timeX.push(formatTime(idx))
                    timeY.push(value)
                });
                setStandupsX(timeX);
                setStandupsY(timeY);
            })

        return () => {
            stopListening();
            console.log("done");
        }

    }, [db]);

    return (
        <div className="bg-gray-100 rounded-lg py-8 px-10 mb-6">

            <div className="flex justify-between items-center mb-6">

                <div className="flex space-x-4 items-baseline">
                    <h1 className="text-xl font-semibold">{props.title}</h1>
                    <Link className="text-gray-600 hover:text-indigo-500 text-sm">Edit Goal</Link>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="text-lg font-semibold text-indigo-500 hover:text-indigo-400 focus:outline-none">Year</button>
                    <button className="text-lg font-semibold text-indigo-500 hover:text-indigo-400 focus:outline-none">Month</button>
                    <button className="text-lg font-semibold text-indigo-500 hover:text-indigo-400 focus:outline-none">Week</button>
                    <button className="bg-indigo-500 rounded-lg py-1 px-4 text-lg font-semibold text-white focus:outline-none">Day</button>
                </div>

            </div>
            
            {(props.type == "line") ? 
            <Plot 
                data={[
                    {
                        x: sittingX,
                        y: sittingY,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'rgb(99, 102, 241)', size: 4},
                    }]}
                layout={{
                    width: 1300, 
                    autosize: true,
                    xaxis: {
                        title: 'Number of Hours',
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    yaxis: {
                        title: 'Number of Hours',
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }}
                }}
            />
            :
            <Plot 
                data={[
                    {
                        x: standupsX,
                        y: standupsY,
                        type: 'bar',
                        marker: {color: 'rgb(99, 102, 241)'}
                    }]}
                layout={{
                    width: 1300, 
                    autosize: true,
                    xaxis: {
                        title: 'Time of Day',
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    yaxis: {
                        title: 'Number of Stand-ups',
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }}
                }}
            />
            }

        </div>
    )
}

export default ActivityGraph;