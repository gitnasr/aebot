import React, { useState } from "react";

import Router from "next/router";
import { SearchByOperationId } from "../libs/api";
import { toast } from "react-toastify";

function SearchModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState();
  return (
    <div className="container flex items-center justify-center w-full" dir="ltr">
      <div className="relative">
        <div className="absolute top-4 left-3 "> </div>
        <input
          value={id}
          onChange={(e) => setId(e.target.value.trim())}
          type="text"
          className="z-0 w-auto pl-10 pr-20 text-gray-800 border border-gray-300 rounded-lg h-14 focus:shadow focus:outline-none"
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
            className="w-20 h-10 text-white bg-purple-500 rounded-xl hover:bg-purple-600"
          >
            استعلم
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchModel;
