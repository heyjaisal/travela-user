import React from "react";
import PropTypes from "prop-types";

const testimonialList = [
	{
		author: {
			fullName: "Akshay Kumar",
			picture: "https://cdn.easyfrontend.com/pictures/users/user2.jpg",
			designation: "Founder / CEO",
		},
		description:
			"This is a factor in the economy of a nation, and the administration takes the major choices.This is a factor of a nation.",
	},
	{
		author: {
			fullName: "Raima Sen",
			picture: "https://cdn.easyfrontend.com/pictures/users/user3.jpg",
			designation: "Business Head",
		},
		description:
			"Assumenda non repellendus distinctio nihil dicta sapiente, quibusdam maiores, illum at, aliquid blanditiis qui.",
	},
	{
		author: {
			fullName: "Arjun Kapur",
			picture: "https://cdn.easyfrontend.com/pictures/users/user27.jpg",
			designation: "UI Design",
		},
		description:
			"When it comes to booking a holiday, we know everyone likes something different - so we've designed our getaways with you in mind.",
	},
];

const TestimonialItem = ({ testimonial }) => (
	<div className="bg-white shadow-xl dark:bg-slate-800 rounded-2xl transition duration-300 h-full p-6">
		<div className="mt-4">
			<p className="opacity-50 mb-6">{testimonial.description}</p>
			<div className="flex items-center">
				<div className="mr-2">
					<img
						src={testimonial.author.picture}
						alt={testimonial.author.fullName}
						className="max-w-full h-auto rounded-full border"
						width="47"
					/>
				</div>
				<div>
					<h4 className="text-xl font-medium">{testimonial.author.fullName}</h4>
					<p className="text-sm">
						<i>{testimonial.author.designation}</i>
					</p>
				</div>
			</div>
		</div>
	</div>
);

TestimonialItem.propTypes = {
	testimonial: PropTypes.object.isRequired,
};

const Testimonial1 = () => {
	return (
		<section className="ezy__testimonial1 light py-2 md:py-2 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white mb-7">
			<div className="container px-4 mx-auto">
				<div className="flex justify-center md:mb-6">
					<div className="sm:max-w-lg text-center">
						<h2 className="text-3xl leading-none md:text-[45px] font-bold mb-4">
							Community Reviews
						</h2>
					</div>
				</div>
				<div className="grid grid-cols-6 gap-6">
					{testimonialList.map((testimonial, i) => (
						<div className="col-span-6 md:col-span-3 lg:col-span-2" key={i}>
							<TestimonialItem testimonial={testimonial} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Testimonial1;
