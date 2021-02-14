import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import {db} from "../firebase";
// import d3 from "d3-time-format"

const timeVals = [
    "0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
]

function formatTime(t) {
    return `${t}:00`
}
// const f = d3.timeFormat()

const ActivityGraph = (props) => {

    const [xAxisData, setXAxisData] = useState([]);
    const [yAxisData, setYAxisData] = useState([]);

    const [goal, setGoal] = useState(10);
    const [score, setScore] = useState(0);
    let goalInputRef = React.createRef();

    const handleUpdateGoal = () => {
        const localGoal = Math.min(Math.max(goalInputRef.current.value, 0), 99);
        goalInputRef.current.value = localGoal; // set it back in case of out of bounds
        setGoal(localGoal);

        updateScore(xAxisData, yAxisData, localGoal);

        // also save goal to firestore
        db.collection("users")
            .doc("gwmg2hLSPUxzx3PKbj5r")
            .set({
                goalConfig: {[props.title]: localGoal}
            }, {merge: true});
    }

    const updateScore = (xAxisData, yAxisData, goal) => {
        let localScore;
        if (props.type === 'line') {
            if (goal == 0)
                localScore = 100;
            else
                localScore = (yAxisData[yAxisData.length - 1]) / goal * 100;
            props.updateScore(localScore, "active");
        }
        else {
            let passed = 0
            let sum = 0;
            yAxisData.forEach((value) => {
                sum += value;
            })
            localScore = sum / (xAxisData.length * goal) * 100;
            props.updateScore(localScore, "stand");
        }

        setScore(localScore);
    }

    useEffect(() => {
        // set goals
        let localGoal = goal;
        if (props.userInfo && props.userInfo.goalConfig && props.userInfo.goalConfig[props.title]) {
            localGoal = props.userInfo.goalConfig[props.title]; // fetch goal from userInfo
            setGoal(localGoal); // set state var
            goalInputRef.current.value = localGoal; // set input field value
        }

        // fetch series data
        const stopListening = db
            .collection("users/gwmg2hLSPUxzx3PKbj5r/logs")
            .doc(props.logId)
            .onSnapshot(snapshot => {
                console.log("new activity data");
                if (props.type === 'line') {
                    let timeX = []
                    let timeY = []
                    snapshot.data().minutely.forEach((value, idx) => {
                        timeY.push((60*idx-value)/3600)
                    });
                    for (let i=0; i<timeY.length; i++){
                        timeX.push(formatTime(i/60))
                    }
                    setXAxisData(timeX);
                    setYAxisData(timeY);

                    updateScore(timeX, timeY, localGoal);
                }
                else {
                    let timeX = []
                    let timeY = []
                    snapshot.data().standFreq.forEach((value, idx) => {
                        timeX.push(formatTime(idx))
                        timeY.push(value)
                    });
                    setXAxisData(timeX);
                    setYAxisData(timeY);

                    updateScore(timeX, timeY, localGoal);
                }
            })

        return () => {
            stopListening();
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
                            className="text-gray-600 bg-gray-100 focus:bg-white focus:outline-none text-sm w-8"
                            type="number"
                            defaultValue={goal}
                            min="0"
                            max="99"
                            ref={goalInputRef}
                            onBlur={handleUpdateGoal}
                        />
                        <label>Progress: {score.toFixed(1)}%</label>
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
                        x: xAxisData,
                        y: yAxisData,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'rgb(99, 102, 241)', size: 4},
                    }]}
                layout={{
                    autosize: true,
                    xaxis: {
                        title: 'Time of Day',
                        tickvals: timeVals,
                        titlefont: {
                            family: 'Inter, sans-serif',
                            size: 18,
                            color: 'black',
                    }},
                    yaxis: {
                        title: 'Number of Hours',
                        range: [0,Math.max(goal, ...yAxisData)*1.1],
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    annotations: [{
                        x: 540,
                        y: 0.6,
                        xref: 'x',
                        yref: 'y',
                        text: 'Test Finished',
                        showarrow: true,
                        arrowhead: 7,
                        ax: 0,
                        ay: -40,
                        font: {
                            size: 14,
                            color: '#ffffff'
                        },
                        bgcolor: '#3b82f6',
                    },
                    {
                        x: 960,
                        y: 1.45,
                        xref: 'x',
                        yref: 'y',
                        text: 'Exercise Started',
                        showarrow: true,
                        arrowhead: 7,
                        ax: 0,
                        ay: -40,
                        font: {
                            size: 14,
                            color: '#ffffff'
                        },
                        bgcolor: '#3b82f6',
                    },
                    {
                        x: 1200,
                        y: 3,
                        xref: 'x',
                        yref: 'y',
                        text: 'Fall',
                        showarrow: true,
                        arrowhead: 7,
                        ax: 0,
                        ay: -40,
                        font: {
                            size: 14,
                            color: '#ffffff'
                        },
                        bgcolor: '#ef4444',
                    },
                    {
                        x: 1260,
                        y: 3,
                        xref: 'x',
                        yref: 'y',
                        text: 'Recovery',
                        showarrow: true,
                        arrowhead: 7,
                        ax: 0,
                        ay: -40,
                        font: {
                            size: 14,
                            color: '#ffffff'
                        },
                        bgcolor: '#22c55e',
                    }
                    ],
                    shapes: [
                        {
                            type: 'rect',
                            x0: 0,
                            y0: goal,
                            x1: xAxisData.length,
                            y1: Math.max(goal, ...yAxisData)*1.1,
                            fillcolor: 'green',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'line',
                            x0: 0,
                            y0: goal,
                            x1: xAxisData.length,
                            y1: goal,
                            line: {
                                color: 'green',
                                width: 0.5
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
                        x: xAxisData,
                        y: yAxisData,
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
                        range: [0,Math.max(goal, ...yAxisData)*1.1],
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    shapes: [
                        {
                            type: 'rect',
                            x0: -0.5,
                            y0: goal,
                            x1: xAxisData.length,
                            y1: Math.max(goal, ...yAxisData)*1.1,
                            fillcolor: 'green',
                            layer: 'below',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'line',
                            x0: -0.5,
                            y0: goal,
                            x1: xAxisData.length,
                            y1: goal,
                            layer: 'below',
                            line: {
                                color: 'green',
                                width: 0.5
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