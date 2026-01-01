/**
 * Script to initialize the content collection with default documents
 * Run this once to set up your content collection structure
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const defaultContentData = [
  {
    docName: 'home_screen',
    type: 'HOME_SCREEN',
    title: 'Welcome to MoodyMe',
    content: 'Welcome back to MoodyMe! Track your daily mood, discover patterns, and gain valuable insights into your emotional well-being. Start by logging your mood today and build a comprehensive history of your emotional state. Your journey to better mental health starts here!',
    isActive: true,
  },
  {
    docName: 'splash_screen',
    type: 'SPLASH_SCREEN',
    title: 'MoodyMe - Track Your Emotions',
    content: 'Discover patterns in your emotional well-being with our comprehensive mood tracking app. Start your journey today!',
    isActive: true,
  },
  {
    docName: 'signup_message',
    type: 'SIGNUP_MESSAGE',
    title: 'Join MoodyMe Today',
    content: 'Create your account to start tracking your moods and building better emotional awareness. Your mental health journey begins with a single step.',
    isActive: true,
  },
  {
    docName: 'login_message',
    type: 'LOGIN_MESSAGE',
    title: 'Welcome Back',
    content: 'Continue your mood tracking journey. Log in to access your personal dashboard and track your emotional patterns.',
    isActive: true,
  },
  {
    docName: 'about_us',
    type: 'ABOUT_US',
    title: 'About MoodyMe',
    content: 'MoodyMe is a comprehensive mood tracking application designed to help users understand and improve their emotional well-being. Our mission is to provide tools that make mental health monitoring accessible and insightful.',
    isActive: true,
  },
  {
    docName: 'help_support',
    type: 'HELP_SUPPORT',
    title: 'Help & Support',
    content: 'Need help with MoodyMe? Our support team is here to assist you. Contact us at support@moodyme.com or check out our FAQ section for common questions.',
    isActive: true,
  },
  {
    docName: 'privacy_policy',
    type: 'PRIVACY_POLICY',
    title: 'Privacy Policy',
    content: 'Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information when you use MoodyMe.',
    isActive: true,
  },
];

async function initializeContentCollection() {
  try {
    console.log('🚀 Initializing content collection...');

    for (const contentItem of defaultContentData) {
      const docRef = db.collection('content').doc(contentItem.docName);
      
      // Check if document already exists
      const doc = await docRef.get();
      
      if (doc.exists) {
        console.log(`📄 Document '${contentItem.docName}' already exists, skipping...`);
        continue;
      }

      // Generate auto ID for the id field inside the document
      const autoId = db.collection('content').doc().id;

      // Create new document with fixed doc name but auto-generated id field
      await docRef.set({
        id: autoId, // Auto-generated ID inside the document
        type: contentItem.type,
        title: contentItem.title,
        content: contentItem.content,
        isActive: contentItem.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ Created document: ${contentItem.docName} (id: ${autoId})`);
    }

    console.log('🎉 Content collection initialization complete!');
    console.log('');
    console.log('📋 Created documents:');
    defaultContentData.forEach(item => {
      console.log(`   - ${item.docName} (${item.type})`);
    });

  } catch (error) {
    console.error('❌ Error initializing content collection:', error);
  } finally {
    process.exit();
  }
}

initializeContentCollection();