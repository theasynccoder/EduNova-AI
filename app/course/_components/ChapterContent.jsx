// "use client";

// import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
// import React, { useContext, useEffect, useRef } from "react";
// import YouTube from "react-youtube";
// import { motion } from "framer-motion";
// import gsap from "gsap";

// const ChapterContent = ({ courseInfo }) => {
//   const courseContent = courseInfo?.courses?.courseContent;
//   const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);

//   const chapterName =
//     courseContent?.[selectedChapterIndex]?.courseData?.chapterName;

//   const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideos;
//   const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;

//   const wrapperRef = useRef(null);

//   // GSAP fade + slide animation
//   useEffect(() => {
//     gsap.from(wrapperRef.current, {
//       opacity: 0,
//       y: 40,
//       duration: 0.6,
//       ease: "power3.out",
//     });
//   }, [selectedChapterIndex]);

//   return (
//     <motion.div
//       ref={wrapperRef}
//       className="p-10"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* Chapter Header */}
//       <motion.h2
//         className="font-bold text-3xl mb-4 flex items-center gap-3"
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.1, duration: 0.4 }}
//       >
//         {selectedChapterIndex + 1}.{" "}
//         {chapterName ? chapterName : "Select a chapter"}
//       </motion.h2>

//       {/* Related Videos */}
//       <h2 className="my-3 font-bold text-xl flex items-center gap-2">
//         Related Videos 🎥
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {videoData?.slice(0, 2).map((video, index) => (
//           <motion.div
//             key={index}
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ delay: index * 0.15, duration: 0.4 }}
//             className="rounded-xl overflow-hidden shadow-lg border border-gray-300"
//           >
//             <YouTube
//               videoId={video.videoId}
//               opts={{
//                 height: "250",
//                 width: "100%",
//               }}
//             />
//             <p className="p-3 text-sm font-medium">{video.title}</p>
//           </motion.div>
//         ))}
//       </div>

//       {/* Topics Section */}
//       <div className="mt-7">
//         {topics && topics.length > 0 ? (
//           topics.map((topic, index) => (
//             <motion.div
//               key={index}
//               className="mt-10 p-6 bg-secondary rounded-2xl shadow-lg"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 + index * 0.15, duration: 0.4 }}
//             >
//               <h2 className="font-bold text-2xl text-primary mb-3">
//                 {index + 1}. {topic?.topic}
//               </h2>

//               <div
//                 className="leading-8 text-lg"
//                 dangerouslySetInnerHTML={{ __html: topic?.content }}
//               />
//             </motion.div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-lg">No topics available</p>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default ChapterContent;

import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import { useParams } from "next/navigation";
import React, { useContext, useState } from "react";
import YouTube from "react-youtube";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle, Cross, Loader2Icon, X } from "lucide-react";
import axios from "axios";


const ChapterContent = ({ courseInfo, refreshData }) => {
  const { courseId } = useParams();
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectedChapterIndexContext
  );
  const chapterName =
    courseContent?.[selectedChapterIndex]?.courseData?.chapterName;

  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideos;
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;
  let completedChapter = enrollCourse?.completedChapters ?? [];

  const [loading,setLoading] = useState(false);
  const markChapterCompleted = async () => {
    setLoading(true)
    const updated = [...completedChapter, selectedChapterIndex];

    const result = await axios.put("/api/enroll-course", {
      courseId,
      completedChapter: updated,
    });

    refreshData();
    toast.success("Chapter Marked Completed !!");
    setLoading(false)
  };

  const markIncompleteChapter = async () => {
    setLoading(true);
    const updated = completedChapter.filter((c) => c !== selectedChapterIndex);

    const result = await axios.put("/api/enroll-course", {
      courseId,
      completedChapter: updated,
    });

    refreshData();
    toast.success("Chapter Marked Incompleted");
    setLoading(false)
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">
          {selectedChapterIndex + 1}.{" "}
          {chapterName ? chapterName : "Select a chapter"}
        </h2>
        {!completedChapter?.includes(selectedChapterIndex) ? (
          <Button
            onClick={() => markChapterCompleted()}
            className="cursor-pointer"
            disabled={loading}
          >{loading?<Loader2Icon className="animate-spin"/>:<CheckCircle />}
            
            Mark as Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={markIncompleteChapter}
            className="flex items-center gap-2"
            disabled={loading}
          >
            {loading?<Loader2Icon className="animate-spin"/>:
            <X className="w-5 h-5" />}
            Mark Incomplete
          </Button>
        )}
      </div>
      <h2 className="my-2 font-bold text-lg">Related Videos 📻</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {videoData?.slice(0, 2).map((video, index) => (
          <div key={index}>
            <YouTube
              videoId={video.videoId}
              opts={{
                height: "250",
                width: "400",
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-7">
        {topics && topics.length > 0 ? (
          topics.map((topic, index) => (
            <div key={index} className="mt-10 p-5 bg-secondary rounded-2xl ">
              <h2 className="font-bold text-2xl text-primary">
                {index + 1}. {topic?.topic}
              </h2>

              <div
                dangerouslySetInnerHTML={{ __html: topic?.content }}
                style={{ lineHeight: "2.5" }}
              ></div>
            </div>
          ))
        ) : (
          <p>No topics available</p>
        )}
      </div>
    </div>
  );
};

export default ChapterContent;
