import React, { useState } from "react";

import Router from "next/router";
import { start_operation } from "../libs/api";

function InfoHome({ done, info }) {

  const [IsLoading, setIsLoading] = useState(false);
  return (
    <div
      className="border border-blue-300 shadow rounded-md p-4 max-w-4xl w-full mx-auto mt-5 h-auto space-x-1"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row space-x-1 ">
        <img
          src={info.poster}
          alt="صوره المسلسل"
          className=" bg-transparent h-auto sm:w-48 rounded-md object-fill shadow-md"
        ></img>
        <div className=" mx-auto h-auto w-full m-auto space-y">
          <h1 className="rounded w-full font-semibold">{info.title}</h1>
          <div className="mx-auto text-center">
            <div className="" dir="rtl">
              {info.episodes} حلقه
            </div>
            <p className="h-auto text-sm text-gray-500 mx-auto mr-1">
              {info.story}
            </p>
            <img
              src={
                info?.service?.includes("akoam") ? "/akoam.jpg" : "arabseed.jpg"
              }
              className="w-8 m-2 mx-auto rounded-full"
            />
            {!done && (
              <button
                disabled={IsLoading}
                className="w-full h-auto p-2 mt-2 mr-2 text-white bg-purple-700 rounded"
                title="START"
                onClick={async () => {
                  setIsLoading(true);
                  const operation_id = await start_operation(
                    `${info.service}/start`,
                    info.id
                  );
                  await Router.push({pathname:"/process",query:{id:operation_id,service:info.service}},"/");
                  setIsLoading(false);
                }}
              >
                START
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoHome;
