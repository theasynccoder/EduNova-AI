// import { courseTable } from '@/config/schema';
// import { currentUser, auth } from '@clerk/nextjs/server';
// import { GoogleGenAI } from '@google/genai';
// import { NextResponse } from 'next/server';
// import { db } from '@/config/db';
// import axios from 'axios';
// import { eq } from 'drizzle-orm';
// import { PLAN_LIMITS, PLAN_KEYS } from '@/config/planLimits';

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

// User Input:
// `;

// export async function POST(req) {
//   try {
//     /* =======================
//        ENV CHECK (IMPORTANT)
//     ======================= */
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error('GEMINI_API_KEY missing');
//     }
//     if (!process.env.AI_GURU_LAB_API) {
//       throw new Error('AI_GURU_LAB_API missing');
//     }

//     /* =======================
//        AUTH CHECK
//     ======================= */
//     const user = await currentUser();
//     if (!user || !user.primaryEmailAddress?.emailAddress) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const userEmail = user.primaryEmailAddress.emailAddress;

//     const { has } = await auth();
//     const hasPremium = has({ plan: 'premium' });
//     const hasPro = has({ plan: 'pro_plan' });

//     let userPlan = 'free_user';
//     if (hasPremium) userPlan = 'premium';
//     if (hasPro) userPlan = 'pro';

//     /* =======================
//        REQUEST BODY
//     ======================= */
//     const body = await req.json();
//     const { courseId, ...formData } = body;

//     /* =======================
//        PLAN LIMIT CHECK
//     ======================= */
//     const existingCourses = await db
//       .select()
//       .from(courseTable)
//       .where(eq(courseTable.userEmail, userEmail));

//     const courseLimit = PLAN_LIMITS[userPlan].course_generation;
//     if (courseLimit !== Infinity && existingCourses.length >= courseLimit) {
//       return NextResponse.json({
//         resp: 'quota_exceeded',
//         message: `${PLAN_KEYS[userPlan].name} plan limit exceeded`,
//         redirect: '/workspace/billing',
//       });
//     }

//     /* =======================
//        GEMINI AI
//     ======================= */
//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });

//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash-lite', // faster & safer on Vercel
//       contents: [
//         {
//           role: 'user',
//           parts: [{ text: PROMPT + JSON.stringify(formData) }],
//         },
//       ],
//     });

//     const rawText =
//       response?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!rawText) {
//       throw new Error('AI returned empty response');
//     }

//     /* =======================
//        SAFE JSON PARSE
//     ======================= */
//     let courseJson;
//     try {
//       const cleaned = rawText.replace(/```json|```/g, '').trim();
//       courseJson = JSON.parse(cleaned);
//     } catch (err) {
//       console.error('JSON PARSE ERROR:', rawText);
//       throw new Error('Invalid JSON from AI');
//     }

//     /* =======================
//        IMAGE GENERATION
//     ======================= */
//     const bannerImagePrompt = courseJson?.course?.bannerImagePrompt;
//     if (!bannerImagePrompt) {
//       throw new Error('Banner image prompt missing');
//     }

//     const bannerImageUrl = await generateImage(bannerImagePrompt);

//     /* =======================
//        SAVE TO DB
//     ======================= */
//     await db.insert(courseTable).values({
//       ...formData,
//       courseJson,
//       userEmail,
//       cid: courseId,
//       bannerImageUrl,
//       createdAt: new Date(),
//     });

//     return NextResponse.json({ courseId });
//   } catch (error) {
//     console.error('🔥 API ERROR:', error);
//     return NextResponse.json(
//       { error: error.message || 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// /* =======================
//    IMAGE GENERATOR (SAFE)
// ======================= */
// async function generateImage(imagePrompt) {
//   try {
//     const result = await axios.post(
//       'https://aigurulab.tech/api/generate-image',
//       {
//         width: 1024,
//         height: 1024,
//         input: imagePrompt,
//         model: 'flux',
//         aspectRatio: '16:9',
//       },
//       {
//         headers: {
//           'x-api-key': process.env.AI_GURU_LAB_API,
//           'Content-Type': 'application/json',
//         },
//         timeout: 8000, // prevent Vercel timeout
//       }
//     );

//     if (!result?.data?.image) {
//       throw new Error('Image API returned no image');
//     }

//     return result.data.image;
//   } catch (err) {
//     console.error('IMAGE API ERROR:', err.response?.data || err.message);
//     throw new Error('Failed to generate banner image');
//   }
// }

import { courseTable } from '@/config/schema';
import { currentUser, auth } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { PLAN_LIMITS, PLAN_KEYS } from '@/config/planLimits';

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

User Input:
`;

export async function POST(req) {
  try {
    /* =======================
       ENV CHECK
    ======================= */
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY missing in .env' },
        { status: 500 }
      );
    }

    /* =======================
       AUTH
    ======================= */
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const { has } = await auth();
    const hasPremium = has({ plan: 'premium' });
    const hasPro = has({ plan: 'pro_plan' });

    let userPlan = 'free_user';
    if (hasPremium) userPlan = 'premium';
    if (hasPro) userPlan = 'pro';

    /* =======================
       BODY
    ======================= */
    const body = await req.json();
    const { courseId, ...formData } = body;

    /* =======================
       PLAN LIMIT
    ======================= */
    const existingCourses = await db
      .select()
      .from(courseTable)
      .where(eq(courseTable.userEmail, userEmail));

    const courseLimit = PLAN_LIMITS[userPlan].course_generation;

    if (courseLimit !== Infinity && existingCourses.length >= courseLimit) {
      return NextResponse.json({
        resp: 'quota_exceeded',
        message: `${PLAN_KEYS[userPlan].name} plan limit exceeded`,
        redirect: '/workspace/billing',
      });
    }

    /* =======================
       GEMINI AI
    ======================= */
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [{ text: PROMPT + JSON.stringify(formData) }],
        },
      ],
    });

    const rawText =
      aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('AI returned empty response');
    }

    /* =======================
       SAFE JSON PARSE
    ======================= */
    let courseJson;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      courseJson = JSON.parse(cleaned);
    } catch (err) {
      console.error('❌ AI RAW RESPONSE:', rawText);
      throw new Error('Invalid JSON returned by AI');
    }

    /* =======================
       IMAGE GENERATION (NON-BLOCKING)
    ======================= */
    let bannerImageUrl = null;

    if (process.env.AI_GURU_LAB_API) {
      try {
        bannerImageUrl = await generateImage(
          courseJson?.course?.bannerImagePrompt
        );
      } catch (imgErr) {
        console.warn('⚠️ Image generation failed, continuing without image');
      }
    } else {
      console.warn('⚠️ AI_GURU_LAB_API missing — skipping image generation');
    }

    /* =======================
       SAVE TO DB
    ======================= */
    await db.insert(courseTable).values({
      ...formData,
      courseJson,
      userEmail,
      cid: courseId,
      bannerImageUrl,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, courseId });
  } catch (error) {
    console.error('🔥 API ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/* =======================
   IMAGE GENERATOR
======================= */
async function generateImage(imagePrompt) {
  if (!imagePrompt) {
    throw new Error('Image prompt missing');
  }

  const res = await axios.post(
    'https://aigurulab.tech/api/generate-image',
    {
      width: 1024,
      height: 576,
      input: imagePrompt,
      model: 'flux',
      aspectRatio: '16:9',
    },
    {
      headers: {
        'x-api-key': process.env.AI_GURU_LAB_API,
        'Content-Type': 'application/json',
      },
      timeout: 8000,
    }
  );

  if (!res?.data?.image) {
    throw new Error('No image returned');
  }

  return res.data.image;
}
