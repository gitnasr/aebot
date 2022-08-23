import React, {useState} from "react";

import Router from "next/router";
import {MdSearch} from "@react-icons/all-files/md/MdSearch";

function SearchModel() {
	const [id, setId] = useState();

	const Search = async () => {
		return Router.push(
			{
				pathname: "/result",
				query: {id},
			},
			"/"
		);

	}
	return (
		<div className="flex flex-wrap items-center justify-around w-full sm:max-w-4xl" dir="ltr">
			<div className="relative w-full mt-4 shadow-xl">
				<input
					value={id}
					onChange={(e) => setId(e.target.value.trim())}
					type="text"
					className="w-full px-10 text-gray-500 bg-gray-900 border border-gray-600 rounded-lg h-14 focus:shadow focus:outline-none"
					placeholder="NXXXXXXX"
				/>
				<div className="absolute bottom-0 rounded-full right-2 top-4">
					<button
						type={"button"}
						onClick={Search}

						className="font-bold text-white bg-transparent rounded-lg  disabled:cursor-not-allowed"
					>
						<MdSearch size={28}/>
					</button>
				</div>
			</div>
		</div>
	);
}

export default SearchModel;