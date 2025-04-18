import React from "react";
import { Link } from "react-router-dom";

const HttpCodes15 = () => {
	return (
		<section className="ezy__httpcodes15 light py-[80px] md:py-[60px] bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative z-[1]">
			<div className="container px-4 mx-auto">
				<div className="grid grid-cols-12 gap-6 px-4 lg:px-12">
					<div className="col-span-12 lg:col-span-6 text-center lg:text-start">
						<div className="flex flex-col justify-center h-full">
							<h1 className="font-bold text-3xl leading-none md:text-[45px] mb-4">
								Oh no! Error 404
							</h1>
							<p className="text-xl opacity-80 mb-6">
								Something went wrong, this page is broken.
							</p>
							<div className="flex justify-center lg:justify-start">
                <Link to={'/'}>
								<button className="bg-blue-600 text-white hover:bg-opacity-90 py-3 px-4 rounded">
									Return to homepage
								</button>
                </Link>
								<button className="py-3 px-6 bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded ml-2">
									Try Again
								</button>
							</div>
						</div>
					</div>
					<div className="col-span-12 lg:col-span-5 lg:col-start-8">
						<img
							src="https://cdn.pixabay.com/photo/2015/10/09/15/11/mountains-979461_1280.jpg"
							alt="destroted home"
							className="rounded-2xl max-w-full h-auto"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HttpCodes15