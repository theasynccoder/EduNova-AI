"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddNewCourseDialog from "./AddNewCourseDialog";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import CourseCard from "./CourseCard";

function CourseList() {
  const [courseList, setCourseList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      GetCourseList();
    }
  }, [user]);

  const GetCourseList = async () => {
    try {
      const result = await axios.get("/api/courses");
      console.log(result.data);
      setCourseList(result.data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-bold text-xl">Course List</h2>

      {courseList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-7 text-center gap-4">
          
          <Image
            src="/online-education.png"
            alt="education"
            width={250}
            height={250}
          />

          <h2 className="my-2 text-xl font-bold">
            Looks like you haven't created any course
          </h2>

          <AddNewCourseDialog>
            <Button>+ Create your first course</Button>
          </AddNewCourseDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
          {courseList.map((course, index) => (
            <CourseCard course={course} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
