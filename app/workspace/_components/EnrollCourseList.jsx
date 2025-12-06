"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import EnrollCourseCard from './EnrollCourseCard';

function EnrollCourseList() {
    const [enrollCourseList,setEnrollCourseList] = useState([]);

    useEffect(()=>{
        GetEnrollCOurse();
    },[])

    const GetEnrollCOurse = async () =>{
        const result = await axios.get('/api/enroll-course')
        console.log(result.data)
        setEnrollCourseList(result.data)
    }

  return enrollCourseList?.length>0 && (
    <div className='mt-3'>
      <h2 className='font-bold text-3xl'>Continue Learning</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>

        {enrollCourseList.map((item, index) => (
          <EnrollCourseCard 
            key={index}
            course={item.courses}
            enrollCourse={item.enrollCourse}
          />
        ))}

      </div>
    </div>
  )
}

export default EnrollCourseList;


// "use client"
// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import EnrollCourseCard from './EnrollCourseCard';

// function EnrollCourseList() {
//     const [enrollCourseList,setEnrollCourseList] = useState([]);

//     useEffect(()=>{
//         GetEnrollCOurse();
//     },[])

//     const GetEnrollCOurse = async () =>{
//         const result = await axios.get('/api/enroll-course')
//         console.log(result.data)
//         setEnrollCourseList(result.data)
//     }
//   return enrollCourseList?.length>0 &&  (
//     <div className='mt-3'>
//       <h2 className='font-bold text-3xl'>Continue Learning</h2>
//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
//  {enrollCourseList?.map((course, index) => (
//     <EnrollCourseCard 
//       key={index}
//       course={course?.courseTable}
//       enrollCourse={course?.enrollCourseTable}
//     />
// ))}


//         </div>
       
//     </div>
//   )
// }

// export default EnrollCourseList
