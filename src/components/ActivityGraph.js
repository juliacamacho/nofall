import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import {db} from "../firebase";
// import d3 from "d3-time-format"

function formatTime(t) {
    return `${t}:00`
}
// const f = d3.timeFormat()

const ActivityGraph = (props) => {

    const [sittingX, setSittingX] = useState([]);
    const [sittingY, setSittingY] = useState([]);
    const [standupsX, setStandupsX] = useState([]);
    const [standupsY, setStandupsY] = useState([]);

    const [goal, setGoal] = useState(10);
    let goalInputRef = React.createRef();

    const handleUpdateGoal = () => {
        console.log(goalInputRef.current.value);
        setGoal(goalInputRef.current.value);
        // also save goal to firestore
        db.collection("users")
            .doc("gwmg2hLSPUxzx3PKbj5r")
            .set({
                goalConfig: {[props.title]: goalInputRef.current.value}
            }, {merge: true});
    }

    useEffect(() => {
        // fetch series data
        const stopListening = db
            .collection("users/gwmg2hLSPUxzx3PKbj5r/logs")
            .doc("h2vVRIIuNyr65vgZCe2Y")
            .onSnapshot(snapshot => {
                console.log("new activity data");
                let timeX = []
                let timeY = []
                snapshot.data().minutely.forEach((value, idx) => {
                    timeY.push((60*idx-value)/3600)
                });
                for (let i=0; i<timeY.length; i++){
                    timeX.push(formatTime(i/60))
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

        // set goals
        if (props.userInfo && props.userInfo.goalConfig && props.userInfo.goalConfig[props.title]) {
            setGoal(props.userInfo.goalConfig[props.title]);
            goalInputRef.current.value = props.userInfo.goalConfig[props.title];
        }

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
                    <span className="text-sm">
                        <label>Goal: </label>
                        <input
                            className="text-gray-600 bg-gray-100 focus:bg-white focus:outline-none text-sm w-12"
                            type="number"
                            defaultValue={goal}
                            ref={goalInputRef}
                            onBlur={handleUpdateGoal}
                        />
                    </span>
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
                    autosize: true,
                    xaxis: {
                        title: 'Time of Day',
                        tickvals: standupsX,
                        titlefont: {
                            family: 'Inter, sans-serif',
                            size: 18,
                            color: 'black',
                    }},
                    yaxis: {
                        title: 'Number of Hours',
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    shapes: [
                        {
                            type: 'rect',
                            x0: 0,
                            y0: goal,
                            x1: sittingX.length,
                            y1: Math.max(goal, ...sittingY)*1.1,
                            fillcolor: 'green',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'line',
                            x0: 0,
                            y0: goal,
                            x1: sittingX.length,
                            y1: goal,
                            line: {
                                color: 'green',
                                width: 1
                            }
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
                        x: standupsX,
                        y: standupsY,
                        type: 'bar',
                        marker: {color: 'rgb(99, 102, 241)'}
                    }]}
                layout={{
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
                    }},
                    shapes: [
                        {
                            type: 'rect',
                            x0: 0,
                            y0: goal,
                            x1: standupsX.length,
                            y1: Math.max(goal, ...standupsY)*1.1,
                            fillcolor: 'green',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'line',
                            x0: 0,
                            y0: goal,
                            x1: standupsX.length,
                            y1: goal,
                            line: {
                                color: 'green',
                                width: 1
                            }
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

export default ActivityGraph;