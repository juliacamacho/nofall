import React from "react";
import {NavLink} from "react-router-dom";

export default function Tabs() {

    return (
        <div className="mb-8 py-2">
            <div className="px-16 py-6 flex space-x-10 text-gray-400 no-underline font-bold text-3xl">
                <NavLink
                    to={`/`}
                    className="hover:text-gray-600 "
                    activeClassName="text-black"
                >Dashboard
                </NavLink>
                <NavLink
                    to={`/videos`}
                    className="hover:text-gray-300 "
                    activeClassName="text-black"
                >Video Streams
                </NavLink>
                <NavLink
                    to={`/alerts`}
                    className="hover:text-gray-300 "
                    activeClassName="text-black"
                >Alerts
                </NavLink>
            </div>
            <hr className="border-1 border-gray-300"/>
        </div>
    )
}

