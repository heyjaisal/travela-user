import React, { useRef, useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';

const BlogPostEditor = () => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (editorRef.current && !editor) {
      const editorInstance = new EditorJS({
        holder: editorRef.current,
        tools: {
          header: Header,
          list: List,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByUrl: (url) => {
                  return new Promise((resolve) => {
                    resolve({
                      success: 1,
                      file: {
                        url,
                      },
                    });
                  });
                },
              },
            },
          },
        },
        data: {
          time: new Date().getTime(),
          blocks: [
            {
              type: 'header',
              data: {
                text: 'Blog Post Title',
                level: 1,
              },
            },
            {
              type: 'paragraph',
              data: {
                text: 'Write your blog content here...',
              },
            },
          ],
        },
      });

      setEditor(editorInstance);
    }
  }, [editor]);

  const handleSave = async () => {
    if (editor) {
      const savedData = await editor.save();
      console.log(savedData); // you can send this data to the backend or save it locally
    }
  };

  return (
    <div>
      <div id="editorjs" ref={editorRef}></div>
      <button onClick={handleSave}>Save Post</button>
    </div>
  );
};

export default BlogPostEditor;
