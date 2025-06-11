import { Card, CardHeader, Image } from "@heroui/react";
import { Link } from "react-router-dom";

export default function CardList({ cardItems }) {
  return (
    <div className="flex justify-center items-center mb-5">
      <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
        {cardItems.map((item) => (
          <Link to={item.route} className="contents" key={item.id}>
            <Card className={`h-[300px] ${item.span}`} isFooterBlurred={item.blur}>
              <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">{item.title}</p>
                <h4
                  className={`font-medium ${
                    item.blur ? "text-white/90 text-xl" : "text-white text-large"
                  }`}
                >
                  {item.subtitle}
                </h4>
              </CardHeader>
              <Image
                removeWrapper
                alt={item.title || "Card image"}
                className={`z-0 w-full h-full object-cover ${
                  item.id === 3 ? "scale-125 -translate-y-6" : ""
                }`}
                src={item.image}
              />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
