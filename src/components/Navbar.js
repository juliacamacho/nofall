import React from "react";

export default function Navbar() {
    return (
        <div className="flex justify-between items-center bg-indigo-500 px-5 py-5">
            <span className="inline-block align-middle text-white text-3xl font-bold">NoFall</span>
            <img src="https://cdn.discordapp.com/avatars/174610463655460865/d3c1a76626bf8b21b227f1309b6c58b2.png"
                 alt="profile picture"
                 className="rounded-full h-10 w-10"/>
        </div>
    )
}

