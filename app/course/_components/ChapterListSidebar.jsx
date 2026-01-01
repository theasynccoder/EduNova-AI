// import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
// import React from "react";
// import { useContext } from 'react';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { CheckCircle } from 'lucide-react';

// const ChapterListSidebar = ({ courseInfo }) => {
//   const course = courseInfo?.courses;
//   const enrollCourse = courseInfo?.enrollCourse;
//   const courseContent = courseInfo?.courses?.courseContent;
//    const {selectedChapterIndex,setSelectedChapterIndex} = useContext(SelectedChapterIndexContext)
//   const maxHeight = (Array.isArray(courseContent) ? courseContent.length : 0) * 120;
//   let completedChapter = enrollCourse?.completedChapters ?? [];

//   return (
//     <div className="w-200 h-full bg-secondary p-5  rounded-xl shadow-md overflow-y-auto"
//       style={{ maxHeight }} >
//       <h2 className="my-3 font-bold text-xl">Chapters ({courseContent?.length})</h2>
//       <Accordion type="single" collapsible>
//         {courseContent?.map((chapter, index) => (
//           <AccordionItem value={chapter?.courseData?.chapterName} key={index}
//           onClick={()=>setSelectedChapterIndex(index)}>
//             <AccordionTrigger className={`text-lg font-medium px-5 mt-5 ${completedChapter.includes(index)?'bg-green-100 text-green-950':''}`}>
             
//               {index + 1}.{chapter?.courseData?.chapterName}
//             </AccordionTrigger>
//             <AccordionContent asChild>
//               <div className="">
//                 {chapter?.courseData?.topics.map((topic, index_) => (
//                   <h2 key={index_} className={`p-3  my-1 rounded-lg ${completedChapter.includes(index)?'bg-green-50 text-green-950':'bg-white'}`}>{topic?.topic}</h2>
//                 ))}
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//     </div>
//   );
// };

// export default ChapterListSidebar;

import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import React, { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle } from 'lucide-react';

const ChapterListSidebar = ({ courseInfo }) => {
  const courseContent = courseInfo?.courses?.courseContent || [];
  const enrollCourse = courseInfo?.enrollCourse;
  const completedChapter = enrollCourse?.completedChapters ?? [];

  const { selectedChapterIndex, setSelectedChapterIndex } =
    useContext(SelectedChapterIndexContext);

  return (
    <div className="w-200 h-full bg-secondary p-5 shadow-md overflow-y-auto">
      <h2 className="sticky top-0 bg-secondary py-3 font-bold text-xl z-10">
        Chapters ({courseContent.length})
      </h2>

      <Accordion type="single" collapsible>
        {courseContent.map((chapter, index) => (
          <AccordionItem
            key={index}
            value={chapter?.courseData?.chapterName}
            onClick={() => setSelectedChapterIndex(index)}
          >
            <AccordionTrigger
              className={`text-lg font-medium px-5 mt-3 ${
                completedChapter.includes(index)
                  ? 'bg-green-100 text-green-950'
                  : ''
              }`}
            >
              {index + 1}. {chapter?.courseData?.chapterName}
            </AccordionTrigger>

            <AccordionContent>
              <div>
                {chapter?.courseData?.topics.map((topic, i) => (
                  <h2
                    key={i}
                    className={`p-3 my-1 rounded-lg ${
                      completedChapter.includes(index)
                        ? 'bg-green-50 text-green-950'
                        : 'bg-white'
                    }`}
                  >
                    {topic?.topic}
                  </h2>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <button
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200"
        onClick={() => window.location.href = '/workspace'}
      >
        Go to Workspace
      </button>
    </div>
  );
};

export default ChapterListSidebar;
