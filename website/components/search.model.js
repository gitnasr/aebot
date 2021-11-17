import React, { useState } from "react";

import Router from "next/router";
import { SearchByOperationId } from "../libs/api";
import { toast } from "react-toastify";

function SearchModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState();
  return (
    <div className="container w-full flex justify-center items-center" dir="ltr">
      <div className="relative">
        <div className="absolute top-4 left-3 "> </div>
        <input
          value={id}
          onChange={(e) => setId(e.target.value.trim())}
          type="text"
          className="h-14 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none text-gray-800 border-gray-300 border"
          placeholder="NXXXXXXX"
        />
        <div className="absolute top-2 right-2">
          <button
            disabled={isLoading}
            onClick={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              const isFound = await SearchByOperationId(id);

              if (!isFound) {
                toast.error(
                  "العمليه اللي بتدور عليها الرقم مش صحيح، لو متأكد من الرقم يبقي العمليه لسه مخلصتش جرب كمان حبه"
                );
              } else {
                Router.push(
                  {
                    pathname: "/result",
                    query: { id, service: isFound.service },
                  },
                  "/"
                );
              }
              setIsLoading(false);
            }}
            className="h-10 w-20 text-white rounded-xl bg-purple-500 hover:bg-purple-600"
          >
            استعلم
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchModel;
