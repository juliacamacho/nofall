import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import {db} from "../firebase";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


const AssessmentGraph = (props) => {
    const [tupGo, setTupGo] = useState({
        'x': [],
        'y': []
    });
    const [chairStand, setChairStand] = useState({
        'x': [],
        'y': []
    });
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
        // set goals
        if (props.userInfo && props.userInfo.goalConfig && props.userInfo.goalConfig[props.title]) {
            setGoal(props.userInfo.goalConfig[props.title]);
            goalInputRef.current.value = props.userInfo.goalConfig[props.title];
        }

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
                            x1: tupGo.x.length,
                            y1: 100,
                            fillcolor: 'green',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'line',
                            x0: -0.5,
                            y0: goal,
                            x1: tupGo.x.length,
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
                            x1: chairStand.x.length,
                            y1: 100,
                            fillcolor: 'green',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'line',
                            x0: -0.5,
                            y0: goal,
                            x1: chairStand.x.length,
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

export default AssessmentGraph;