import React, {useEffect, useState} from "react";


import {PuffLoader} from "react-spinners";
import {useRouter} from "next/router";
import {FaCheckCircle} from "@react-icons/all-files/fa/FaCheckCircle";
import {MdArrowBack} from "@react-icons/all-files/md/MdArrowBack";
import {SearchByOperationId} from "../libs/api";

function Processing(props) {
    const [IsLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [currentState, setCurrentState] = useState({status:"جاري جلب التحديثات"});

    async function InquireByOperation(OperationId) {
        const {status, data} = await SearchByOperationId(OperationId)


        if (status === 200 || status === 204){
            setCurrentState(data)
        }
        if (data.isSuccess){
           await router.push({ pathname: "/result", query: { id:data.operation   }, },"/")

        }
    }



    useEffect(() => {
        const {id} = router.query;
        const IntervalId = setInterval(InquireByOperation, 2000,id);

        setIsLoading(false)

        return () => clearInterval(IntervalId);
    }, []);

    if (IsLoading) return (<div className="flex items-center justify-center min-h-screen m-auto bg-gray-900">
            <PuffLoader color={"#AE36D7"} size={128}/>
        </div>);
    return (<div
            className="relative flex flex-col items-center justify-center w-full min-h-screen text-center text-gray-900 bg-gray-900">
      <span className={"bg-blue-600 text-white rounded-full cursor-pointer absolute top-5 left-5 sm:left-1/4"}
            onClick={() => router.push("/")}>
          <MdArrowBack size={48}/>
      </span>

            <span className={"flex flex-col items-center gap-4 bg-transparent text-green-500 rounded-full"}>
                                    <FaCheckCircle size={64}/>

               <h1 className="text-xl font-semibold text-gray-300 ">
                        تم بدء العمليه بنجاح ورقمها
               </h1>

            </span>


            <div className="w-full my-7">
                <code className="my-3 text-4xl font-extrabold text-green-600 uppercase sm:text-3xl">
                    {router.query.id}
                </code>
                <div className="my-3 ">
                    <h1 className={"text-info text-4xl"}>{currentState.status}</h1>
                </div>

                <p className="max-w-md p-2 mx-auto my-2 font-medium text-center text-warning">
                    ممكن تسيب الصفحه بس احتفظ برقم العمليه عشان تعرف توصل
                    للعمليه لما تخلص عن طريق الذهاب للصفحه الرئيسئه وتدوس علي استعلام برقم العملية
                </p>
                <small className="text-xs text-gray-400">
                    المتوسط حوالي 15 ثانيه اكتر او اقل علي حسب الضغط علي المصدر
                </small>
            </div>
        </div>);
}

export default Processing;
