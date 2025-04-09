import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";

const faqList = [
	{
		isActive: true,
		question: "What is Easy Frontend?",
		answer:
			"When it comes to booking a holiday, we know everyone likes something different - so we've designed our getaways with you in mind. When it comes to booking a holiday, we know everyone likes something different.",
	},
	{
		isActive: false,
		question: "Who is Easy Frontend for?",
		answer:
			"When it comes to booking a holiday, we know everyone likes something different - so we've designed our getaways with you in mind. When it comes to booking a holiday, we know everyone likes something different.",
	},
	{
		isActive: false,
		question: "How does Easy Frontend work?",
		answer:
			"When it comes to booking a holiday, we know everyone likes something different - so we've designed our getaways with you in mind. When it comes to booking a holiday, we know everyone likes something different.",
	},
	{
		isActive: false,
		question: "How often does your team upload resources?",
		answer:
			"When it comes to booking a holiday, we know everyone likes something different - so we've designed our getaways with you in mind. When it comes to booking a holiday, we know everyone likes something different.",
	},
	{
		isActive: false,
		question: "Can I get a refund if I cancel my subscription?",
		answer:
			"When it comes to booking a holiday, we know everyone likes something different - so we've designed our getaways with you in mind. When it comes to booking a holiday, we know everyone likes something different.",
	},
	{
		isActive: false,
		question: "Can I use Easy Frontend designs in my portfolio?",
		answer:
			"When it comes to booking a holiday, we know everyone likes something different - so we've designed our getaways with you in mind. When it comes to booking a holiday, we know everyone likes something different.",
	},
	{
		isActive: false,
		question: "Can I buy Easy Frontend extended license?",
		answer:
			"When it comes to booking a holiday, we know everyone likes something different - so we've designed our getaways with you in mind. When it comes to booking a holiday, we know everyone likes something different.",
	},
];

const FaqItem = ({ faq }) => {
	const [isOpen, setIsOpen] = useState(faq.isActive || false);

	const toggleFaq = () => setIsOpen(!isOpen);

	return (
		<div className={`${isOpen && "active"} rounded-lg`}>
			<a
				href="#!"
				className="btn p-4 lg:p-6 w-full text-start flex justify-between items-center cursor-pointer"
				onClick={toggleFaq}
			>
				<span>{faq.question}</span>
				{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
			</a>
			<div
				className={`${
					isOpen ? "block" : "hidden"
				} p-4 lg:p-6 bg-white shadow dark:shadow-none dark:bg-[#1E2735] rounded-xl`}
			>
				<p className="opacity-50">{faq.answer}</p>
			</div>
		</div>
	);
};

FaqItem.propTypes = {
	faq: PropTypes.object.isRequired,
};

const Faq10 = () => {
	return (
		<section className="ezy__faq10 light py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white">
			<div className="container px-10 md:px-8 lg:px-28">
				<div className="grid grid-cols-12">
					<div className="col-span-12 lg:col-span-8 mb-12">
						<h2 className="font-bold text-[25px] md:text-[45px] leading-none mb-6">
							Frequently Asked Questions
						</h2>
						<p className="text-lg opacity-70">
							Assumenda non repellendus distinctio nihil dicta sapiente,
							quibusdam maiores, illum at, aliquid blanditiis eligendi
							qui.Assumenda non repellendus distinctio nihil dicta sapiente,
							quibusdam maiores.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-12 gap-6 justify-between">
					<div className="col-span-12 md:col-span-4 mb-6 md:mb-0">
						<div
							className="bg-center bg-no-repeat bg-cover min-h-[150px] w-full rounded-2xl h-full"
							style={{
								backgroundImage:
									"url(https://plus.unsplash.com/premium_photo-1661842720585-153c38403045?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
							}}
						></div>
					</div>
					<div className="col-span-12 md:col-span-8 lg:pl-12">
						{faqList.map((faq, i) => (
							<FaqItem faq={faq} key={i} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Faq10;