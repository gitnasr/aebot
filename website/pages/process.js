import React from "react";


import {PuffLoader} from "react-spinners";
import {useRouter} from "next/router";
import {FaCheckCircle} from "@react-icons/all-files/fa/FaCheckCircle";
import {MdArrowBack} from "@react-icons/all-files/md/MdArrowBack";
import {useSearchByOperationId} from "../hooks/search";

const Processing = ({id}) => {
	const router = useRouter();

	const {data, isError} = useSearchByOperationId(`/search/${id}`, {refreshInterval: 1000})
	if (!data) return <div className="flex items-center justify-center min-h-screen m-auto bg-gray-900"><PuffLoader
		color={"#AE36D7"} size={128}/></div>
	if (isError) return <div>Error</div>
	if (data && data.isSuccess) {
		router.push({pathname: "/result", query: {id: data.operation}}, "/")
	}


	return (<div
		className="relative flex flex-col items-center justify-center w-full min-h-screen text-center text-gray-900 bg-gray-900">
      <span className={"bg-blue-600 text-white rounded-full cursor-pointer absolute top-5 left-5 sm:left-1/4"}
            onClick={() => router.push("/")}>
          <MdArrowBack size={48}/>
      </span>

		<span className={"flex flex-col items-center gap-4 bg-transparent text-green-500 rounded-full"}><FaCheckCircle size={64}/>
               <h1 className="text-xl font-semibold text-gray-300 ">
                        تم بدء العمليه بنجاح ورقمها
               </h1>
            </span>


		<div className="w-full my-7">
			<code className="my-3 text-4xl font-extrabold text-green-600 uppercase sm:text-3xl">
				{id}
			</code>
			<div className="my-3 ">
				<h1 className={"text-info text-4xl"}>{data.status}</h1>
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

export async function getServerSideProps(context) {
	const {id} = context.query;
	if (!id) return {
		redirect: {
			destination: "/",
			permanent: false,
		}
	};
	return {
		props: {
			id: context.query.id
		},
	}
}

export default Processing;