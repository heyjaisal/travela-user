import React from "react";

const RenderContent = ({ content }) => {
  if (!Array.isArray(content) || content.length === 0) {
    return <div className="text-center text-gray-500">No content available.</div>;
  }
  const { blocks } = content[0];

  if (!blocks || !Array.isArray(blocks)) {
    return <div className="text-center text-gray-500">No content available.</div>;
  }

  return (
    <div>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={index} className="mb-4">
                {block.data.text}
              </p>
            );
          case "header":
            return (
              <h2 key={index} className={`text-${block.data.level === 1 ? "2xl" : "xl"} font-bold mb-4`}>
                {block.data.text}
              </h2>
            );
          case "list":
            return (
              <ul key={index} className="list-disc list-inside mb-4">
                {block.data.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <div key={index} className="my-4">
                <img src={block.data.file.url} alt={block.data.caption} className="w-full rounded-lg" />
                {block.data.caption && (
                  <p className="text-center text-gray-600 mt-2">{block.data.caption}</p>
                )}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default RenderContent;