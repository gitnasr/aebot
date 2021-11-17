import React, { useEffect, useState } from "react";

import { AkoamSearch } from "../libs/api";
import { CircularProgressbar } from "react-circular-progressbar";
import { PuffLoader } from "react-spinners";
import Router from "next/router";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSocket } from "../libs/socket";

function Processing(props) {
  const [IsLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const socket = useSocket("https://aemedia.herokuapp.com/");

  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    const { id, service } = router.query;

    if (!id || !service) return router.push("/");
  }, []);

  useEffect(() => {
    const { id, service } = router.query;

    if (socket) {
      setIsLoading(false);
      socket.on("Started", (e) => console.log(e));
      if (service === "akoam/old") {
        socket.on("Progress", (e) => {
          if (e.id === id) {
            setCurrentState(e.p);
          }
        });
      } else {
        socket.on("phase", (e) => {
          if (e.id === id) {
            setCurrentState(e.status);
          }
        });
      }

      socket.on("Done", (e) => {
        if (e.id === id) {
          Router.push(
            { pathname: "/result", query: { id, service: service } },
            "/"
          );

          
        }

      });


      socket.on("ERROR", (e) => {
        if (e.id === id) {
          Router.push(
            { pathname: "/"},
            "/"
          );
          toast.error("في حاجه غلط حصلت في العمليه، حاولنا نحلها لكن مقدرناش المره دي ، جرب تاني احنا اسفين")
        }
      });


  }
  }, [socket]);

  if (IsLoading)
    return (
      <div className="flex items-center justify-center min-h-screen m-auto bg-gray-100">
        <PuffLoader color={"#AE36D7"} size={128} />
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen space-y-2 text-center text-gray-900 bg-gray-100">
      <img
        alt="AEBot - بوت موقع اكوام وعرب سيد وايجي بيست"
        src="/logo.png"
        width={100}
        className="mb-5"
        onClick={() => router.push("/")}
      />
      <h1 className="text-xl font-semibold text-green-700 ">
        تم بدء العمليه بنجاح ورقمها
      </h1>

      <div className="w-3/4 my-7">
        <code className="my-3 text-4xl font-bold break-words sm:text-6xl">
          {router.query.id}
        </code>
        {router.query.service === "akoam/old" ? (
          <div className="w-3/4 m-auto mt-4 sm:w-48">
            <CircularProgressbar
              value={currentState}
              text={`${currentState}%`}
            />{" "}
          </div>
        ) : (
          <div className="my-3 font-bold text-green-900">
            <h1>{currentState}</h1>
          </div>
        )}

        <p className="my-2 text-lg font-semibold text-center cursor-pointer">
          لو العمليه طولت ممكن تسيب الصفحه بس احتفظ برقم العمليه عشان تعرف توصل
          للعمليه لما تخلص من اللينك ده
        </p>
        <p className="text-gray-400">
          المتوسط حوالي 15 ثانيه اكتر او اقل علي حسب الضغط
        </p>
      </div>
    </div>
  );
}

export default Processing;
