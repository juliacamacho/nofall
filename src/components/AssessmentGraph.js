import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import {db} from "../firebase";
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AssessmentGraph = (props) => {
    const [tupGo, setTupGo] = useState({
        'x': [],
        'y': []
    });
    const [chairStand, setChairStand] = useState({
        'x': [],
        'y': []
    });
    useEffect(() => {
        const stopListening = db
            .collection("users/gwmg2hLSPUxzx3PKbj5r/logs")
            .doc("h2vVRIIuNyr65vgZCe2Y")
            .onSnapshot(snapshot => {
                console.log("new activity data");
                let tupGo = {
                    'x': [],
                    'y': []
                };
                snapshot.data().tupGo.forEach((value, idx) => {
                    tupGo.x.push(days[idx])
                    tupGo.y.push(value)
                });
                setTupGo(tupGo)

                let chair = {
                    'x': [],
                    'y': []
                };
                snapshot.data().chairStand.forEach((value, idx) => {
                    chair.x.push(days[idx])
                    chair.y.push(value)
                });
                setChairStand(chair)
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
                    <button className="text-lg font-semibold text-indigo-500 hover:text-indigo-400">Year</button>
                    <button className="text-lg font-semibold text-indigo-500 hover:text-indigo-400">Month</button>
                    <button className="bg-indigo-500 rounded-lg py-1 px-4 text-lg font-semibold text-white">Week</button>
                </div>

            </div>
            {
                props.title === "Timed Up-and-Go Test" ?
            <Plot 
                data={[
                    {
                        x: tupGo.x,
                        y: tupGo.y,
                        type: 'bar',
                        marker: {color: 'rgb(99, 102, 241)'}
                    }]}
                layout={{
                    width: 1470, 
                    autosize: true,
                    xaxis: {
                        title: 'Weekday',
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    yaxis: {
                        title: 'Average Score',
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
                        x: chairStand.x,
                        y: chairStand.y,
                        type: 'bar',
                        marker: {color: 'rgb(99, 102, 241)'}
                    }]}
                layout={{
                    width: 1470, 
                    autosize: true,
                    xaxis: {
                        title: 'Weekday',
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    yaxis: {
                        title: 'Average Score',
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

export default AssessmentGraph;