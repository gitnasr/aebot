import React, { useState } from "react";

import Router from "next/router";
import {SendOperationStartSignal} from "../libs/api";

function InfoHome({ done, info }) {

  const [IsLoading, setIsLoading] = useState(false);

  const StartOperation = async () => {
    setIsLoading(true);
    const {data,status} = await SendOperationStartSignal(
        info.path,
        info._id
    );
    if (status !== 201) return  setIsLoading(false);
    await Router.push({pathname: "/process", query: {id: data.operation, service: info.service}}, "/");

  }
  return (
    <div
      className="border border-blue-300 shadow rounded-md p-4 max-w-4xl w-full mx-auto mt-5 h-auto space-x-1"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row gap-2 ">
        <img
          src={info.poster}
          alt="بوستر المسلسل"
          className=" bg-transparent h-auto sm:w-48 rounded-md object-fill shadow-md"
        ></img>
        <div className=" mx-auto flex flex-col  w-full ">
          <h1 className="rounded  font-extrabold">{info.title}</h1>
          <div className="mx-auto text-center">
            <h2 className="font-bold" dir="rtl">
              {info.episodes} حلقه
            </h2>
            <p className="h-auto text-sm text-gray-500 mx-auto mr-1">
              {info.story}
            </p>
            <img
                src={info.logo}
                className="w-8 m-4 mx-auto rounded-full"
                alt={"لوجو الموقع"}
            />

          </div>

          {!done && (
              <button
                  disabled={IsLoading}
                  className="w-full btn  text-white bg-green-600 rounded hover:bg-green-700 mt-auto "
                  title="بدء"
                  onClick={StartOperation}
              >
                بدء العملية
              </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InfoHome;
