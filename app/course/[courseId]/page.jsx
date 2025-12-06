"use client"

import React, { useState } from 'react'
import AppHeader from '../../workspace/_components/AppHeader'
import ChapterListSidebar from '../_components/ChapterListSidebar'
import ChapterContent from '../_components/ChapterContent'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from "axios"
const Course = () => {
  const {courseId} = useParams();
  const [courseInfo,setCourseInfo] = useState();
   useEffect(()=>{
        GetEnrollCourseById();
    },[])

    const GetEnrollCourseById = async () =>{
        const result = await axios.get('/api/enroll-course?courseId='+courseId)
        console.log(result.data)
        setCourseInfo(result.data)
    }
  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className='flex gap-10'>
        <ChapterListSidebar courseInfo={courseInfo}/>
        <ChapterContent courseInfo={courseInfo} refreshData={()=>GetEnrollCourseById()}  />
      </div>
    </div>
  )
}

export default Course

