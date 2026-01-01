import type { Content, ContentType } from '@/types/content';

export const mockContent: Content[] = [
  {
    id: "1",
    type: "HOME_SCREEN" as ContentType,
    title: "Welcome to MoodyMe",
    content: "Welcome back to MoodyMe! Track your daily mood, discover patterns, and gain valuable insights into your emotional well-being. Start by logging your mood today and build a comprehensive history of your emotional state. Your journey to better mental health starts here!",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "2",
    type: "SPLASH_SCREEN" as ContentType,
    title: "MoodyMe - Track Your Emotions",
    content: "Discover patterns in your emotional well-being with our comprehensive mood tracking app. Start your journey today!",
    isActive: true,
    createdAt: "2023-01-16T00:00:00Z",
    updatedAt: "2023-01-16T00:00:00Z",
  },
  {
    id: "3",
    type: "ABOUT_US" as ContentType,
    title: "About MoodyMe",
    content: "MoodyMe is a comprehensive mood tracking application designed to help users understand and improve their emotional well-being. Our mission is to provide tools that make mental health monitoring accessible and insightful.",
    isActive: true,
    createdAt: "2023-01-17T00:00:00Z",
    updatedAt: "2023-01-17T00:00:00Z",
  },
];

export const defaultHomeScreenContent = "Welcome back to MoodyMe! Track your daily mood, discover patterns, and gain valuable insights into your emotional well-being. Start by logging your mood today and build a comprehensive history of your emotional state. Your journey to better mental health starts here!";