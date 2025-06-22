import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";
import { Link } from "react-router-dom";

export default function CardList({ cardItems }) {
  return (
    <div className="flex justify-center items-center mb-5">
      <div className="max-w-[900px] gap-2 grid grid-cols-12 px-8">
        {cardItems.map((item) => (
          <div key={item._id} className={`${item.span}`}>
            <Link to={item.route}>
              <Card className="h-[300px]" isFooterBlurred={item.blur}>
                <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                  <p className="text-tiny text-white/60 uppercase font-bold">{item.title.trim()}</p>
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
                    item._id === "68316dbd92f2064c9b3516c9" ? "scale-125 -translate-y-6" : ""
                  }`}
                  src={item.image}
                />

                {item.blur && (
                  <CardFooter
                    className={`absolute ${
                      item._id === "68316dbd92f2064c9b3516ca"
                        ? "bg-white/30 border-t-1 border-zinc-100/50"
                        : "bg-black/40 border-t-1 border-default-600 dark:border-default-100"
                    } bottom-0 z-10 justify-between`}
                  >
                    <div>
                      <p className="text-tiny text-white/60">
                        {item.footerTitle || "Available soon."}
                      </p>
                      <p className="text-tiny text-white/60">
                        {item.footerSubtitle || "Get notified."}
                      </p>
                    </div>
                    <Button
                      className="text-tiny"
                      color="primary"
                      radius="full"
                      size="sm"
                    >
                      {item.footerButton || "Notify Me"}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
