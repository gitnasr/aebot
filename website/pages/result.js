import { AkoamSearch, ArabseedSearch } from "../libs/api";
import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";

import InfoHome from "../components/info.home";
import { PuffLoader } from "react-spinners";
import { TextFile } from "../libs/lib";
import { toast } from "react-toastify";

function Result() {
  const [IsLoading, setIsLoading] = useState(true);
  const [Data, setData] = useState({});

  const router = useRouter();

  useEffect(() => {
    const { id, service } = router.query;

    if (!id || !service) return router.push("/");

    async function ResultFetch() {
      if (service.includes("akoam")) {
        const res = await AkoamSearch(id);
        res.service = "akoam";
        setData(res);
      } else {
        const res = await ArabseedSearch(id);
        res.service = "arabseed";
        setData(res);
      }

      setIsLoading(false);
    }

    ResultFetch();
  }, []);
  if (IsLoading)
    return (
      <div className="flex items-center justify-center min-h-screen m-auto bg-gray-100">
        <PuffLoader color={"#AE36D7"} size={128} />
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen text-center text-gray-900 bg-gray-100 p-7">
      <img
        alt="AEBot - بوت موقع اكوام وعرب سيد وايجي بيست"
        src="/logo.png"
        width={100}
        className="mb-5"
        onClick={() => Router.push("/")}
      />
      <h1 className="text-3xl font-semibold text-green-700 ">
        تمت العمليه بنجاح في {Data.result.time.toFixed(1)} ثانيه
      </h1>

      <div className="flex flex-col ">
        <InfoHome info={Data} done={true} />

        <textarea
          id="links"
          readOnly
          rows={Data.result.direct_links.length}
          className="h-full p-3 my-2 overflow-hidden text-gray-800 border-2 border-green-900 rounded-lg resize-none focus:outline-none"
          value={Data.result.direct_links.join("\n")}
          onClick={() => {
            navigator.clipboard.writeText(Data.result.direct_links.join("\n"));
            toast.success("تم نسخ اللينكات بنجاح");
          }}
        />
        <span className="mb-2 text-sm text-left text-gray-500">
          اضغط علي اللينكات للنسخ
        </span>
        <button
          onClick={() => TextFile(Data.title)}
          className="w-full p-3 text-white bg-blue-800 rounded"
        >
          حفظ اللينكات
        </button>
        <p dir="rtl" className="mt-2 text-sm break-words">
          دلوقتي انت معاك اللينكات المباشره، تقدر بكل سهوله تحطهم علي IDM علي
          الكمبيوتر او ADM للاندوريد بكل سهوله
        </p>
        <code className="my-3 font-mono text-xs uppercase ">
          {Data.operation}
        </code>
      </div>
    </div>
  );
}

export default Result;
