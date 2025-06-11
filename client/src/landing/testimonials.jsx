import React from "react";
import PropTypes from "prop-types";

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

const Testimonials = ({ testimonials }) => {
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
          {testimonials.map((testimonial) => (
            <div className="col-span-6 md:col-span-3 lg:col-span-2" key={testimonial.id}>
              <TestimonialItem testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Testimonials.propTypes = {
  testimonials: PropTypes.array.isRequired,
};

export default Testimonials;
