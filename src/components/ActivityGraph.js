import React from "react";
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';

const ActivityGraph = (props) => {
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
                        x: [1, 2, 3],
                        y: [0, 0.5, 1.5],
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'rgb(99, 102, 241)', size: 12},
                    }]}
                layout={{
                    width: 1470, 
                    autosize: true,
                    xaxis: {
                        title: 'Time of Day',
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
                        x: [1, 2, 3],
                        y: [1, 4, 2],
                        type: 'bar',
                        marker: {color: 'rgb(99, 102, 241)'}
                    }]}
                layout={{
                    width: 1470, 
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