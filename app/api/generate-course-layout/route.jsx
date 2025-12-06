// import { courseTable } from '@/config/schema';
// import { currentUser, auth } from '@clerk/nextjs/server';
// import { GoogleGenAI } from '@google/genai';
// import { NextResponse } from 'next/server';
// import { db } from "../../../config/db";
// import axios from 'axios';
// import { eq } from "drizzle-orm";  // <--- you forgot this

// const PROMPT = `Generate Learning Course based on the following details. 
// Make sure to include Course Name, Description, Category, Level, IncludeVideo, NoOfChapters,
// Banner Image Prompt (Modern flat 2D tech-style illustration), 
// Chapter Names, Topics, and Duration — strictly in JSON format.

// Schema:
// {
//   "course": {
//     "name": "string",
//     "description": "string",
//     "category": "string",
//     "level": "string",
//     "includeVideo": "boolean",
//     "noOfChapters": "number",
//     "bannerImagePrompt": "string",
//     "chapters": [
//       {
//         "chapterName": "string",
//         "duration": "string",
//         "topics": ["string"]
//       }
//     ]
//   }
// }

// User Input:`;


// export async function POST(req) {
//   try {
//     const { courseId, ...formData } = await req.json();
//     const user = await currentUser();
//     const userEmail = user?.primaryEmailAddress?.emailAddress;

//     if (!userEmail) {
//       return NextResponse.json({ error: "User email not found" }, { status: 401 });
//     }

//     // 🔥 CHECK USER PLAN
//     const { has } = await auth();
//     const isFree = has({ plan: "free_user" });
//     const isPremium = has({ plan: "premium" });
//     const isPro = has({ plan: "pro_plan" });

//     // 🔥 GET CURRENT MONTH
//     const now = new Date();
//     const currentMonth = now.getMonth();
//     const currentYear = now.getFullYear();

//     // 🔥 FETCH COURSES CREATED THIS MONTH
//     const allUserCourses = await db.select().from(courseTable)
//       .where(eq(courseTable.userEmail, userEmail));

//     const coursesThisMonth = allUserCourses.filter(c => {
//       const created = new Date(c.createdAt);
//       return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
//     });

//     // 🔥 PLAN LIMITS
//     if (isFree && coursesThisMonth.length >= 1) {
//       return NextResponse.json({ resp: "Free plan limit exceeded (1 course/month)" });
//     }

//     if (isPremium && coursesThisMonth.length >= 5) {
//       return NextResponse.json({ resp: "Premium plan limit exceeded (5 courses/month)" });
//     }

//     // Pro Plan = Unlimited → no limit applied

//     // -----------------------------------
//     // ▶ AI GENERATION
//     // -----------------------------------
//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });

//     const model = 'gemini-2.0-flash';

//     const contents = [
//       {
//         role: "user",
//         parts: [{ text: PROMPT + JSON.stringify(formData) }],
//       },
//     ];

//     const response = await ai.models.generateContent({
//       model,
//       contents,
//     });

//     const output = response.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (!output) throw new Error("AI did not return output");

//     const RawJson = output.replace("```json", "").replace("```", "");
//     const JSONResp = JSON.parse(RawJson);

//     // 🔥 Banner Image Generation
//     const ImagePrompt = JSONResp.course?.bannerImagePrompt;
//     const bannerImageUrl = await GenerateImage(ImagePrompt);

//     // 🔥 SAVE TO DATABASE
//     await db.insert(courseTable).values({
//       ...formData,
//       courseJson: JSONResp,
//       userEmail: userEmail,
//       cid: courseId,
//       bannerImageUrl: bannerImageUrl,
//       createdAt: new Date()
//     });

//     return NextResponse.json({ courseId: courseId });

//   } catch (error) {
//     console.error("API ERROR:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// // 🔥 IMAGE GENERATION FUNCTION
// const GenerateImage = async (imagePrompt) => {
//   const BASE_URL = 'https://aigurulab.tech';

//   const result = await axios.post(
//     BASE_URL + '/api/generate-image',
//     {
//       width: 1024,
//       height: 1024,
//       input: imagePrompt,
//       model: 'flux',
//       aspectRatio: "16:9",
//     },
//     {
//       headers: {
//         'x-api-key': process.env.AI_GURU_LAB_API,
//         'Content-Type': 'application/json',
//       },
//     }
//   );

//   return result.data.image;
// };


import { courseTable } from '@/config/schema';
import { currentUser,auth } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import {db} from "../../../config/db"
import axios from 'axios';
import { eq } from 'drizzle-orm';


const PROMPT = `Generate Learning Course based on the following details. 
Make sure to include Course Name, Description, Category, Level, IncludeVideo, NoOfChapters,
Banner Image Prompt (Modern flat 2D tech-style illustration), 
Chapter Names, Topics, and Duration — strictly in JSON format.

Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": ["string"]
      }
    ]
  }
}

User Input:`;


export async function POST(req) {
  try {
    const {courseId,...formData} = await req.json();
    const user = await currentUser();

    const {has} = await auth();
    const hasPremiumAccess = has({plan:'premium'})
     const hasFreeAccess = has({plan:'free_user'})
     const hasProAccess = has({plan:'pro_plan'})

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = 'gemini-2.0-flash';

    const contents = [
      {
        role: "user",
        parts: [
          { text: PROMPT + JSON.stringify(formData) }
        ],
      },
    ];

    // ❌ NO tools
    // ❌ NO thinkingConfig
    // ✔ Clean request

    const result = await db.select().from(courseTable)
      .where(eq(courseTable.userEmail,user?.primaryEmailAddress?.emailAddress))

      if(hasFreeAccess && result?.length>=1){
         return NextResponse.json({resp:'limit exceeded'})
      }

      if(hasPremiumAccess && result?.length>=5){
         return NextResponse.json({resp:'limit exceeded'})
      }

    // if(!hasFreeAccess){
    //   const result = await db.select().from(courseTable)
    //   .where(eq(courseTable.userEmail,user?.primaryEmailAddress?.emailAddress))

    //   if(result?.length>=1){

    //       return NextResponse.json({'resp':'limit exceeded'})
    //   }
    // }

    // if(!hasPremiumAccess){
    //   const result = await db.select().from(courseTable)
    //   .where(eq(courseTable.userEmail,user?.primaryEmailAddress?.emailAddress))

    //   if(result?.length>=5){
    //       return NextResponse.json({'resp':'limit exceeded'})
    //   }
    // }

    

    const response = await ai.models.generateContent({
      model,
      contents,
    });

    const output =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    console.log("AI OUTPUT:", output);

    const RawResp = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    const RawJson = RawResp.replace('```json','').replace('```','');
    const JSONResp = JSON.parse(RawJson);

    const ImagePrompt = JSONResp.course?.bannerImagePrompt;

   
    // generate Image Banner
    const bannerImageUrl = await GenerateImage(ImagePrompt);

    // Save to DB example:
    await db.insert(courseTable).values({
      ...formData,
      courseJson: JSONResp,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      cid:courseId,
      bannerImageUrl:bannerImageUrl
    });

    return NextResponse.json({ courseId:courseId });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


// import { courseTable } from '@/config/schema';
// import { currentUser } from '@clerk/nextjs/server';
// import {
//   GoogleGenAI,
// } from '@google/genai';
// import { NextResponse } from 'next/server';

// const PROMPT=`Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format. Chapter Name, Topic under each chapters, Duration for each chapters etc, in JSON format only.

// Schema:
// {
// "course": {
// "name": "string",
// "description": "string",
// "category": "string",
// "level": "string",
// "includeVideo": "boolean",
// "noOfChapters": "number",
// "bannerImagePrompt": "string",
// "chapters": [
// {
// "chapterName": "string",
// "duration": "string",
// "topics": [
// "string"
// ]
// }
// ]
// }
// }

// , User Input:`

// export async function POST(req){
//     const formData = await req.json();
//     const user =await  currentUser();




//   const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//   });
//   const tools = [
//     {
//       googleSearch: {
//       }
//     },
//   ];
//   const config = {
//     thinkingConfig: {
//       thinkingLevel: 'HIGH',
//     },
//     tools,
//   };
//   const model = 'gemini-2.0-flash';
//   const contents = [
//     {
//       role: 'user',
//       parts: [
//         {
//           text: PROMPT+JSON.stringify(formData),
//         },
//       ],
//     },
//   ];

//   const response = await ai.models.generateContent({
//     model,
//     config,
//     contents,
//   });
//   console.log(response.candidates[0].content.parts[0].text);

//   //Save to Database
//   // const result = await db.insert(courseTable).values({
//   //   ...formData,
//   //   courseJson:response.text(),
//   //   userEmail:user?.primaryEmailAddress?.emailAddresses
//   // })

//   return NextResponse.json(response.text());
// }


const GenerateImage = async (imagePrompt) => {
  const BASE_URL='https://aigurulab.tech';
const result = await axios.post(BASE_URL+'/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: imagePrompt,
            model: 'flux',//'flux'
            aspectRatio:"16:9"//Applicable to Flux model only
        },
        {
            headers: {
                'x-api-key': process?.env?.AI_GURU_LAB_API, // Your API Key
                'Content-Type': 'application/json', // Content Type
            },
        })
console.log(result.data.image) //Output Result: Base 64 Image
return result.data.image
}