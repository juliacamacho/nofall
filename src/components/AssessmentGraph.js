import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import {db} from "../firebase";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


const AssessmentGraph = (props) => {
    const [tupGo, setTupGo] = useState({
        'x': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'y': [0,0,0,0,0,0,0]
    });
    const [chairStand, setChairStand] = useState({
        'x': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'y': [0,0,0,0,0,0,0]
    });

    useEffect(() => {
        const stopListening = db
            .collection("users/gwmg2hLSPUxzx3PKbj5r/logs")
            .doc(props.logId)
            .onSnapshot(snapshot => {
                console.log("new activity data");
                let tupGo = {
                    'x': [],
                    'y': []
                };
                if(snapshot.data().tupGo)
                    snapshot.data().tupGo.forEach((value, idx) => {
                        tupGo.x.push(days[idx])
                        tupGo.y.push(value)
                    });
                if(tupGo.y.length !== 0)
                    setTupGo(tupGo)

                let chair = {
                    'x': [],
                    'y': []
                };
                if(snapshot.data().chairStand)
                    snapshot.data().chairStand.forEach((value, idx) => {
                        chair.x.push(days[idx])
                        chair.y.push(value)
                    });
                if(chair.y.length !== 0)
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
                        range: [0,Math.max(props.boundaries[1], ...tupGo.y)*1.1],
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    shapes: [
                        {
                            type: 'rect',
                            x0: -0.5,
                            y0: Math.max(...props.boundaries),
                            x1: tupGo.x.length,
                            y1: Math.max(...props.boundaries, ...tupGo.y)*1.1,
                            fillcolor: props.boundaries[1] > props.boundaries[0] ? 'green' : 'red',
                            layer: 'below',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'rect',
                            x0: -0.5,
                            y0: props.boundaries[0],
                            x1: tupGo.x.length,
                            y1: props.boundaries[1],
                            fillcolor: 'orange',
                            layer: 'below',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'rect',
                            x0: -0.5,
                            y0: 0,
                            x1: tupGo.x.length,
                            y1: Math.min(...props.boundaries),
                            fillcolor: props.boundaries[1] > props.boundaries[0] ? 'red' : 'green',
                            layer: 'below',
                            opacity: 0.1,
                            line: {width: 0}
                        }
                    ]
                }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
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
                        range: [0,Math.max(props.boundaries[1], ...chairStand.y)*1.1],
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    shapes: [
                        {
                            type: 'rect',
                            x0: -0.5,
                            y0: Math.max(...props.boundaries),
                            x1: chairStand.x.length,
                            y1: Math.max(...props.boundaries, ...chairStand.y)*1.1,
                            fillcolor: props.boundaries[1] > props.boundaries[0] ? 'green' : 'red',
                            layer: 'below',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'rect',
                            x0: -0.5,
                            y0: props.boundaries[0],
                            x1: chairStand.x.length,
                            y1: props.boundaries[1],
                            fillcolor: 'orange',
                            layer: 'below',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'rect',
                            x0: -0.5,
                            y0: 0,
                            x1: chairStand.x.length,
                            y1: Math.min(...props.boundaries),
                            fillcolor: props.boundaries[1] > props.boundaries[0] ? 'red' : 'green',
                            layer: 'below',
                            opacity: 0.1,
                            line: {width: 0}
                        }
                    ]
                }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
            />
            }

        </div>
    )
}

export default AssessmentGraph;