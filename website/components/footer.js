import React from 'react'

function Footer() {
    return (
        <div className="fixed bottom-0 flex items-center justify-center w-full m-auto bg-gray-900 py-2">
            <div className=" animate-pulse flex flex-col text-center gap-2">
                <h1 className={"text-sm antialiased  text-gray-100"}>Inspired and Created by NASR @ <a href="https://nasrika.com/" target="_blank" referrerPolicy="no-referrer" rel="noreferrer">nasrika.com</a></h1>
                <span className={"text-xs"}>V2.1.0</span>

            </div>
        </div>
    )
}

export default Footer