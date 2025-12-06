import React, { useState } from "react";
import { Clock, List, Gift } from "lucide-react";

const ChapterTopicList = ({ course }) => {
  const courseLayout = course?.courseJson?.course;
  const [hoveredTopic, setHoveredTopic] = useState(null);

  return (
    <div className="relative">
      <h2 className="font-bold text-3xl mt-10 mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Chapters & Topics
      </h2>

      <div className="flex flex-col items-center justify-center mt-10 gap-16 relative">
        {/* Main timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 z-0"></div>

        {courseLayout?.chapters.map((chapter, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            {/* Chapter Card */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

              <div className="relative border-2 border-white shadow-2xl rounded-2xl bg-gradient-to-br from-primary to-purple-700 text-white px-10 py-8 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-semibold shadow-lg">
                  Chapter {index + 1}
                </div>

                <h2 className="font-bold text-2xl text-center mb-6 mt-2">
                  {chapter.chapterName}
                </h2>

                <div className="flex justify-between gap-10 text-lg mt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Clock className="animate-pulse" />
                    <span>{chapter?.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <List />
                    <span>{chapter?.topics?.length} Topics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical connector line from chapter to topics */}
            <div className="w-1 h-12 bg-gradient-to-b from-primary to-gray-200 animate-pulse"></div>

            {/* Topics */}
            <div className="flex flex-col items-center">
              {chapter?.topics.map((topic, topicIndex) => (
                <div
                  className="flex flex-col items-center relative group"
                  key={topicIndex}
                  onMouseEnter={() => setHoveredTopic(`${index}-${topicIndex}`)}
                  onMouseLeave={() => setHoveredTopic(null)}
                >
                  {/* Top vertical line */}
                  <div className="w-1 h-10 bg-gradient-to-b from-gray-300 to-gray-200"></div>

                  <div className="relative flex items-center gap-8 p-4">
                    {/* Left topic - only shows on even indices */}
                    {topicIndex % 2 === 0 && (
                      <div
                        className={`transition-all duration-500 transform ${
                          hoveredTopic === `${index}-${topicIndex}`
                            ? "scale-110 -translate-x-4"
                            : ""
                        }`}
                      >
                        <div className="relative group/topic">
                          {/* Glow effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl blur opacity-0 group-hover/topic:opacity-30 transition-opacity duration-500"></div>
                          <span className="relative max-w-xs bg-gradient-to-r from-blue-50 to-gray-50 text-gray-800 px-6 py-4 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
                            {topic}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Center number circle */}
                    <div className="relative">
                      {/* Pulsing ring when hovered */}
                      <div
                        className={`absolute inset-0 rounded-full border-4 ${
                          hoveredTopic === `${index}-${topicIndex}`
                            ? "border-blue-400 animate-ping"
                            : "border-transparent"
                        }`}
                      ></div>

                      <h2
                        className={`text-center rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl shadow-2xl transform transition-all duration-500 ${
                          hoveredTopic === `${index}-${topicIndex}`
                            ? "scale-125 rotate-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                            : "bg-gradient-to-br from-gray-100 to-gray-300 text-gray-700"
                        }`}
                      >
                        {topicIndex + 1}
                      </h2>
                    </div>

                    {/* Right topic - only shows on odd indices */}
                    {topicIndex % 2 !== 0 && (
                      <div
                        className={`transition-all duration-500 transform ${
                          hoveredTopic === `${index}-${topicIndex}`
                            ? "scale-110 translate-x-4"
                            : ""
                        }`}
                      >
                        <div className="relative group/topic">
                          {/* Glow effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover/topic:opacity-30 transition-opacity duration-500"></div>
                          <span className="relative max-w-xs bg-gradient-to-r from-purple-50 to-pink-50 text-gray-800 px-6 py-4 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
                            {topic}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom vertical line - except for last topic */}
                  {topicIndex !== chapter?.topics?.length - 1 && (
                    <div className="w-1 h-10 bg-gradient-to-b from-gray-200 to-gray-300"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Connector line to next chapter */}
            {index !== courseLayout?.chapters?.length - 1 && (
              <div className="w-1 h-16 bg-gradient-to-b from-gray-300 via-blue-200 to-gray-300"></div>
            )}
          </div>
        ))}

        {/* Finish Card */}
        {/* Finish Card */}
        <div className="relative group z-10">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

          <div className="relative p-8 border-2 border-white shadow-2xl rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 text-white flex flex-col items-center gap-3 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/30">
            {/* Gift icon inside the card */}
            <Gift className="w-10 h-10 animate-bounce drop-shadow-lg" />

            <h2 className="text-2xl font-bold text-center">Finish</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterTopicList;

// import React from "react";
// import { Gift } from "lucide-react";

// const ChapterTopicList = ({course}) => {
//     const courseLayout = course?.courseJson?.course;
//   return (
//     <div>
//       <h2 className="font-bold text-3xl mt-10">Chapters & Topics</h2>
//       <div className="flex flex-col items-center justify-center mt-10">
//         {courseLayout?.chapters.map((chapter, index) => (
//           <div key={index} className="flex flex-col items-center">
//             <div className="border shadow rounded-xl bg-primary text-white">
//               <h2 className="text-center">Chapter {index + 1}</h2>
//               <h2 className="font-bold text-lg text-center">
//                 {chapter.chapterName}
//               </h2>
//               <h2 className="text-lg flex justify-between gap-16">
//                 <span>Duration: {chapter?.duration}</span>
//                 <span>No. Of Chapters: {chapter?.topics?.length}</span>
//               </h2>
//             </div>

//             <div>
//               {chapter?.topics.map((topic, index) => (
//                 <div className="flex flex-col items-center" key={index}>
//                   <div className="h-10 bg-gray-300 w-1"></div>

//                   <div className="flex items-center gap-5 p-2">
//                     <span
//                       className={`${
//                         index % 2 === 0 ? "bg-green-600 text-transparent" : ""
//                       } max-w-xs`}
//                     >
//                       {topic}
//                     </span>

//                     <h2 className="text-center rounded-xl bg-gray-300 px-6 text-gray-500 p-4">
//                       {index + 1}
//                     </h2>

//                     <span
//                       className={`${
//                         index % 2 !== 0 ? "bg-green-600 text-transparent" : ""
//                       } max-w-xs`}
//                     >
//                       {topic}
//                     </span>
//                   </div>

//                   {index !== chapter?.topics?.length - 1 && (
//                     <div className="h-10 bg-gray-300 w-1"></div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}

//         <div className="p-4 border shadow rounded-xl bg-green-600 text-white">
//           <h2>Finish</h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChapterTopicList;
