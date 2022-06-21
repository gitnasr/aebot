import Head from "next/head";
import InfoHome from "../components/info.home";
import LoadingHomeShimmer from "../components/loading.home";
import SearchModel from "../components/search.model";
import { isValidSchema } from "../libs/lib";
import { useState } from "react";
import {GetLinkInfo} from "../libs/api";

export default function Home() {
  const [IsEmpty, setIsEmpty] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const [LinkInfo, setLinkInfo] = useState();

  const [showSearchModel, SetShowSearchModel] = useState(false);

  const pasteFromClipboard = async () => {
    const LinkAsText = await navigator?.clipboard.readText();

    if (isValidSchema(LinkAsText)) {
      setLinkInfo()
      setIsEmpty(LinkAsText);
      setIsLoading(true);
      const link_info = await GetLinkInfo(LinkAsText);
      setIsLoading(false);
      setLinkInfo(link_info);

    }

  };
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-10 text-gray-300 bg-gray-900"
      dir="rtl"
    >
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-3 text-center ">
        <div className="flex flex-wrap items-center justify-around max-w-4xl sm:w-full">
          <img
            alt="AEBot - بوت موقع اكوام وعرب سيد وايجي بيست"
            src="/logo.png"
            width={100}
            className="mb-5"
          />
          <input
            disabled={IsLoading}
            type="url"
            className="w-full p-4 text-gray-300 border border-green-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-gray-800 disabled:cursor-not-allowed"
            dir={`${!IsEmpty ? "rtl" : "ltr"}`}
            onChange={(e) => {
              setIsEmpty(e.target.value);
            }}
            onClick={pasteFromClipboard}
            value={IsEmpty}
            placeholder="حط لينك المسلسل من موقع من المواقع المدعومة"
          />
          <div className="w-full">
            <h6
              className="mt-2 text-sm text-left text-gray-400 cursor-pointer"
              onClick={() => SetShowSearchModel(!showSearchModel)}
            >
              استعلام برقم عملية؟
            </h6>
          </div>
        </div>
        {showSearchModel && <SearchModel />}
        {IsLoading && <LoadingHomeShimmer />}
        {LinkInfo && <InfoHome info={LinkInfo} />}
        <div className="items-start mt-4 text-sm font-medium">
          <p>
            هتروح علي الموقع اللي عايزو تاخد لينك المسلسل وتحطه في المكان اللي
            فوق
          </p>
          <p className="cursor-pointer" onClick={() => window.open("https://youtu.be/vPSjksaxoQs","_blank")}>
            لو مش فاهم دوس هنا وشوف الفيديو هيوضحلك ازاي تستخدم الموقع
          </p>
        </div>

        <div className="font-medium flex flex-col gap-4 mt-4 text-sm text-gray-500">
          <p>
            حاليًا المواقع المدعومه هما أكوام الجديد، أكوام القديم، وعرب سيد
            ولو عندك موقع تحب نضيفه، تقدر تكلمني علي <a className={"text-blue-500 hover:underline"} href={"https://twiter.com/c7nasr"} rel={"noreferrer"} target={"_blank"}>.تويتر من هنا</a>
          </p>
          <p
            className="text-gray-500 text-xs"

          >
            كمان في برنامج مخصص لأيجي بيست بيعمل نفس الوظيفه تقدر تحمله <a href={"https://eb.nasrika.com"} className={"text-blue-500 hover:underline"} rel={"noreferrer"} target={"_blank"}>من هنا</a>
          </p>
        </div>
      </main>
    </div>
  );
}
