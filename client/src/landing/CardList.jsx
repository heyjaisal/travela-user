import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function CardList({ cardItems = [] }) {
  const navigate = useNavigate();

  if (cardItems.length < 5) {
    return (
      <p className="text-gray-500 text-center py-10">
        Insufficient cards.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-6">
      
      <div className="grid grid-cols-12 gap-4">
        {cardItems.slice(0, 3).map((card) => (
          <Card
            key={card._id}
            isFooterBlurred={card.blur}
            className={`h-[300px] ${card.span || "col-span-12 sm:col-span-4"} cursor-pointer`}
            onClick={() => navigate(card.route)}
          >
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">
                {card.title}
              </p>
              <h4 className="text-white font-medium text-large">
                {card.subtitle}
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src={card.image}
            />
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-12 grid-cols-1 gap-4">
        {cardItems.slice(3, 5).map((card) => (
          <Card
            key={card._id}
            isFooterBlurred={card.blur}
            className={`h-[300px] ${card.span} cursor-pointer`}
            onClick={() => navigate(card.route)}
          >
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">
                {card.title}
              </p>
              <h4 className="text-white font-medium text-large">
                {card.subtitle}
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src={card.image}
            />
            {card.blur && (
              <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t border-white/10 justify-between">
                <div>
                  <p className="text-white text-tiny">Available soon.</p>
                  <p className="text-white text-tiny">Get notified.</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="full"
                  size="sm"
                >
                  Learn More
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
