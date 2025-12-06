import React, { useState } from 'react';
import axios from "axios";
import { Book, Clock, PlayCircle, Settings, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

const CourseInfo = ({ course,viewCourse }) => {
  const courseLayout = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const GenerateCourseContent = async () => {
    setLoading(true);

    try {
      const result = await axios.post('/api/generate-course-content', {
        course: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
        
      });

      console.log("AI Response:", result.data);
      setLoading(false);
      router.replace('/workspace')
      toast.success('Course Generated Successfully')
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Server Side Error. Try Again!")
    }

    setLoading(false);
  };

  const chapters = course?.courseJson?.course?.chapters || [];

// Convert "4 hours" → 4
const getHours = (str) => {
  if (!str) return 0;
  return parseFloat(str);
};

// Sum all durations
const totalDuration = chapters
  .reduce((acc, chapter) => acc + getHours(chapter.duration), 0)
  .toFixed(1);


  return (
    <div className='md:flex gap-5 justify-between p-5 rounded-2xl shadow'>
      <div className='flex flex-col gap-3'>
        <h2 className='font-bold text-3xl'>{courseLayout?.name}</h2>
        <p className='line-clamp-2 text-gray-500'>{courseLayout?.description}</p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
            <Clock className='text-blue-500' />
            <section>
              <h2 className='font-bold'>Duration</h2>
              <h2>{totalDuration} Hours</h2>
            </section>
          </div>

          <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
            <Book className='text-green-500' />
            <section>
              <h2 className='font-bold'>Chapters</h2>
              <h2>{course?.noOfChapters}</h2>
            </section>
          </div>

          <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
            <TrendingUp className='text-red-500' />
            <section>
              <h2 className='font-bold'>Difficulty Level</h2>
              <h2>{course?.level}</h2>
            </section>
          </div>
        </div>
{
  !viewCourse?<Button
          className="max-w-sm"
          onClick={GenerateCourseContent}
          disabled={loading}
        >
          <Settings />
          {loading ? "Generating..." : "Generate Content"}
        </Button>:<Link href={'/course/'+course?.cid}><Button><PlayCircle />Continue Learning</Button></Link>
}
        
      </div>

      {course?.bannerImageUrl ? (
        <Image
          src={course.bannerImageUrl}
          alt="banner Image"
          width={400}
          height={400}
          className="w-full mt-5 md:mt-0 object-cover h-[240px] rounded-2xl"
        />
      ) : (
        <div className="w-full mt-5 md:mt-0 h-[240px] rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">
          No Banner Image
        </div>
      )}
    </div>
  );
};

export default CourseInfo;


// import React from 'react'
// import {Book,Clock, Settings, TrendingUp} from 'lucide-react'
// import Image from 'next/image';
// import { Button } from "@/components/ui/button";


// const CourseInfo = ({course}) => {
//     const courseLayout = course?.courseJson?.course;
//   return (
//     <div className='md:flex gap-5 justify-between p-5 rounded-2xl shadow'>
//       <div className='flex flex-col gap-3'>
//         <h2 className='font-bold text-3xl'>{courseLayout?.name}</h2>
//         <p className='line-clamp-2 text-gray-500'>{courseLayout?.description}</p>
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
//             <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
//                 <Clock className='text-blue-500' />
//                 <section>
//                     <h2 className='font-bold'>Duration</h2>
//                     <h2>2 Hours</h2>
//                 </section>
//             </div>
//             <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
//                 <Book className='text-green-500' />
//                 <section>
//                     <h2 className='font-bold'>Chapters</h2>
//                     <h2>2 Hours</h2>
//                 </section>
//             </div>
//             <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
//                 <TrendingUp className='text-red-500' />
//                 <section>
//                     <h2 className='font-bold'>Difficulty Level</h2>
//                     <h2>{course?.level}</h2>
//                 </section>
//             </div>
//         </div>
//         <Button className={'max-w-sm'}> <Settings/>Generate Content</Button>
//       </div>
//       <Image src={course?.bannerImageUrl} alt={'banner Image'} width={400} height={400} className='w-full mt-5 md:mt-0 object-cover aspect-auto h-[240px] rounded-2xl'/>
//     </div>
//   )
// }

// export default CourseInfo
