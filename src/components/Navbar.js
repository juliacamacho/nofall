import React from "react";
import {Link} from "react-router-dom";
import logo from '../assets/logo.png'
import james from '../assets/profile.jpeg'

export default function Navbar() {
    return (
        <div className="flex justify-between items-center bg-indigo-500 px-10 py-5">
            <img src={logo} alt="logo" className="h-14" />
            <div className="flex items-center space-x-8">
                <h1 className="text-xl font-semibold text-white">Patient: James H., Age 73</h1>
                <Link><img src={james}
                 alt="profile picture"
                 className="rounded-full h-14 w-14"/></Link>
            </div>
        </div>
    )
}

