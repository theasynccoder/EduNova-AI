import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import React from "react";
import { useContext } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle } from 'lucide-react';

const ChapterListSidebar = ({ courseInfo }) => {
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
   const {selectedChapterIndex,setSelectedChapterIndex} = useContext(SelectedChapterIndexContext)
  const maxHeight = (Array.isArray(courseContent) ? courseContent.length : 0) * 80;
  let completedChapter = enrollCourse?.completedChapters ?? [];

  return (
    <div className="w-200 bg-secondary p-5 overflow-y-auto rounded-xl shadow-md"
      style={{ maxHeight }} >
      <h2 className="my-3 font-bold text-xl">Chapters ({courseContent?.length})</h2>
      <Accordion type="single" collapsible>
        {courseContent?.map((chapter, index) => (
          <AccordionItem value={chapter?.courseData?.chapterName} key={index}
          onClick={()=>setSelectedChapterIndex(index)}>
            <AccordionTrigger className={`text-lg font-medium px-5 mt-5 ${completedChapter.includes(index)?'bg-green-100 text-green-950':''}`}>
             
              {index + 1}.{chapter?.courseData?.chapterName}
            </AccordionTrigger>
            <AccordionContent asChild>
              <div className="">
                {chapter?.courseData?.topics.map((topic, index_) => (
                  <h2 key={index_} className={`p-3  my-1 rounded-lg ${completedChapter.includes(index)?'bg-green-50 text-green-950':'bg-white'}`}>{topic?.topic}</h2>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ChapterListSidebar;
