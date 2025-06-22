import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";
import { Link } from "react-router-dom";

export default function CardList({ cardItems }) {
  return (
    <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
      {cardItems.map((item) => (
        <div key={item._id} className={item.span}>
          <Link to={item.route || "#"}>
            <Card isFooterBlurred className="w-full h-[300px]">
              <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  {item.title}
                </p>
                <h4 className="font-medium text-white text-large">
                  {item.subtitle}
                </h4>
              </CardHeader>

              <Image
                removeWrapper
                alt={item.title}
                className={`z-0 w-full h-full object-cover ${
                  item._id === "68316dbd92f2064c9b3516ca" ? "scale-125 -translate-y-6" : ""
                }`}
                src={item.image}
              />

              <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 justify-between">
                <div className="flex flex-col">
                  <p className="text-tiny text-white/60">Explore More</p>
                  <p className="text-tiny text-white/60">Discover what’s trending</p>
                </div>
                <Button radius="full" size="sm" color="primary">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}
