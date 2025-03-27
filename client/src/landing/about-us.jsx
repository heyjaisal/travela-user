import React from "react";

const ButtonComponent = () => (
	<div className="flex items-center justify-center mt-5">
		<button className="bg-gray-800 text-white dark:bg-white dark:text-black hover:opacity-90 py-2 px-4 rounded-md text-center transition mt-10">
			Follow Us On Instagram
		</button>
	</div>
);

const AboutUs = () => {
	return (
		<section className="ezy__about5 light py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white">
			<div className="container px-4">
				<div className="grid grid-cols-12 justify-center">
					<div className="col-span-12 md:col-span-8 md:col-start-3">
						<h2 className="text-4xl leading-snug md:text-5xl md:leading-snug font-bold mb-2">
							About Us
						</h2>
						<p className="text-xl opacity-80 mb-4">
							We are a sister-owned company that creates skin care with minimal
							ingredients in powerful combinations.
						</p>
						<div>
							<p className="text-base leading-relaxed opacity-70 mb-0">
								We obsess over every single ingredient that we add to our
								products, avoiding anything that is known to be irritating or
								cause for concern, and hone in on unique blends of botanicals
								and clays that are especially effective and truly feel
								incredible to use.
							</p>
							<h4 className="text-2xl font-bold my-6">OUR STORY</h4>
							<p className="text-base leading-relaxed opacity-70 mb-0">
								We're sisters, Zeena and Letisha. We started Brown and Coconut
								as a lifestyle blog in 2013 while living in Boston, MA. We
								shared our journey to living a more conscious and holistic life
								with a special focus on our efforts to heal our acneic skin,
								which didn’t get better with conventional treatment methods. We
								knew the type of skin care products we were looking for but
								couldn’t find them in stores, trying countless products that
								were too expensive and didn’t meet our expectations, leaving us
								disappointed and out of money. Frustrated, but motivated, we
								embarked on the journey to develop our own line of skin care
								products.
							</p>
							<h4 className="text-2xl font-bold my-6">OUR PRODUCTS</h4>
							<p className="text-base leading-relaxed opacity-70 mb-0">
								After identifying the ingredients we found effective in healing
								our skin, we began crafting entirely unique formulas. Countless
								hours of research, cosmetic chemist expertise, trial, and error
								led to the creation of our line of plant-based powerhouse
								products that not only do what they say they do, but that feel
								incredible to use. We’ve come a long way since we made our debut
								at our first-ever local pop-up event in Massachusetts, but what
								has not changed is our love for making luxurious botanical skin
								care that you simply can’t wait to come home to.
							</p>
							<h4 className="text-2xl font-bold my-6">OUR IMPACTY</h4>
							<p className="text-base leading-relaxed opacity-70 mb-0">
								Our products are packaged in glass bottles that can be reused
								and recycled. Orders are shipped in recyclable cardboard boxes
								with recyclable packing paper. Each item is hand-rolled in
								recycled paper wraps to protect the glass during shipment. We
								use paper tape with a starch-based adhesive to seal the boxes.
								To save paper and reduce the need to print, we do not include
								invoices with orders. To offset our shipping emissions, we pay a
								fee for every order which is then donated to forest protection
								initiatives, specifically
								<a href="#!" className="hover:text-blue-600">
									the Acapa - Bajo Mira y Frontera Forest Conservation Project
								</a>
								in Colombia.
							</p>
							<ButtonComponent />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutUs;