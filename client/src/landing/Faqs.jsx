import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";

const FaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(faq.isActive || false);

  const toggleFaq = () => setIsOpen(!isOpen);

  return (
    <div className={`${isOpen && "active"} rounded-lg`}>
      <button
        className="btn p-4 lg:p-6 w-full text-start flex justify-between items-center cursor-pointer"
        onClick={toggleFaq}
      >
        <span>{faq.question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
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

const Faqs = ({ faqList }) => {
  return (
    <section className="ezy__faq10 light py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white">
      <div className="container px-10 md:px-8 lg:px-28">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8 mb-12">
            <h2 className="font-bold text-[25px] md:text-[45px] leading-none mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg opacity-70">
              Assumenda non repellendus distinctio nihil dicta sapiente, quibusdam maiores.
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
            {faqList.map((faq) => (
              <FaqItem faq={faq} key={faq.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

Faqs.propTypes = {
  faqList: PropTypes.array.isRequired,
};

export default Faqs;
