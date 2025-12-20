// Plan keys and limits
export const PLAN_LIMITS = {
  free_user: {
    companion: 1,
    course_generation: 1,
    quiz_generation: Infinity,
    email_support: false,
  },
  premium: {
    companion: 5,
    course_generation: 5,
    quiz_generation: Infinity,
    email_support: false,
  },
  pro: {
    companion: Infinity,
    course_generation: Infinity,
    quiz_generation: Infinity,
    email_support: true,
  },
};

export const PLAN_KEYS = {
  free_user: {
    name: 'Free',
    key: 'free_user',
    companion: '1_companion',
    course_generation: '1_course_generation',
    quiz_generation: 'unlimited_quiz_generation',
    email_support: 'no_email_support',
  },
  premium: {
    name: 'Premium',
    key: 'premium',
    companion: '5_companion',
    course_generation: '5_course_generation',
    quiz_generation: 'unlimited_quiz_generation',
    email_support: 'no_email_support',
  },
  pro: {
    name: 'Pro',
    key: 'pro',
    companion: 'unlimited_companion',
    course_generation: 'unlimited_course_generation',
    quiz_generation: 'unlimited_quiz_generation',
    email_support: 'full_email_support',
  },
};
