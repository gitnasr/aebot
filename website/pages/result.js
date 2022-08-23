import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import InfoHome from "../components/info.home";
import {PuffLoader} from "react-spinners";
import toast from "react-hot-toast";
import {MdArrowBack} from "@react-icons/all-files/md/MdArrowBack";
import {FaCheckCircle} from "@react-icons/all-files/fa/FaCheckCircle";
import {FaTimesCircle} from "@react-icons/all-files/fa/FaTimesCircle";
import {TextFile} from "../libs";
import {SearchByOperationId} from "../libs/api";

const Result = ({id})  => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [Data, setData] = useState({});
    const InquireByOperation = async () => {
        const {status, data} = await SearchByOperationId(id)


        if (status === 200) {
            setData(data)
             setIsLoading(false)

        } else {
              router.push("/404")
        }
    }
    useEffect(() => {
        async function fetchData() {
          await  InquireByOperation()
        }
        fetchData();
        return () => {
            setData(null)
            setIsLoading(true)
        }
    } , [])

    if (isLoading){
        return (
            <div className="flex items-center justify-center min-h-screen m-auto bg-gray-900">
                <PuffLoader color={"#AE36D7"} size={128}/>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col items-center justify-center w-full min-h-screen text-center text-gray-300 bg-gray-900 p-7 relative pt-24">
            <span className={"bg-blue-600 text-white rounded-full cursor-pointer absolute top-5 left-5 sm:left-1/4"}
               onClick={() => router.push("/")}>
                <MdArrowBack size={48}/>
            </span>
            <div className={"m-auto"}>
            <span className={"flex flex-col items-center gap-4 bg-transparent  rounded-full"}>
                {!Data.isError ? <FaCheckCircle size={64} className={"text-green-600"}/> :
                    <FaTimesCircle size={64} className={"text-red-700"}/>}
                {!Data.isError ? <h1 className="text-3xl font-semibold text-gray-100 ">
                    تمت العمليه بنجاح في {Data.result?.time.toFixed(1)} ثانيه
                </h1> : <div>
                    <h1 className="text-3xl font-semibold text-gray-100 ">فشلت العملية مع الاسف</h1>
                    <p>{Data.status}</p>
                </div>}
            </span>

                {!Data.isError &&
                    <div className="flex flex-col ">
                        <InfoHome info={Data} done={true}/>

                        <textarea
                            id="links"
                            readOnly
                            rows={Data.result.direct_links.length}
                            className="max-h-40 p-3 my-2 overflow-hidden text-gray-100 border-2 border-green-600 rounded-lg resize-none focus:outline-none bg-gray-800 cursor-pointer"
                            value={Data.result.direct_links.join("\n")}
                            onClick={() => {
                                navigator.clipboard.writeText(Data?.result.direct_links.join("\n"));
                                toast.success("تم نسخ اللينكات بنجاح", {position: "bottom-center"});
                            }}
                        />
                        <span className="mb-2 text-sm text-left text-gray-500">
                              اضغط علي اللينكات للنسخ
                        </span>
                        <button
                            onClick={() => TextFile(Data.title)}
                            className="w-full p-3 text-white bg-blue-700 rounded hover:bg-blue-800"
                        >
                            حفظ اللينكات
                        </button>
                        <p dir="rtl" className="mt-2 text-sm break-words">
                            دلوقتي انت معاك اللينكات المباشره، تقدر بكل سهوله تحطهم علي IDM علي
                            الكمبيوتر او ADM للاندوريد بكل سهوله
                        </p>
                        <code className="my-3 font-mono text-xs uppercase ">
                            {id}
                        </code>
                    </div>}
            </div>
        </div>
    );
}
export function getServerSideProps(context) {
    const {id} = context.query;
    if (!id) return {redirect: {
            destination: "/",
            permanent: false,
        }};
    return {
        props: {
            id: context.query.id
        },
    }
}
export default Result;