// 'use client';

// import { AdminLayout } from '@/components/admin-layout';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { useState } from 'react';

// export default function PrivacyPage() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [privacyText, setPrivacyText] = useState(
//     `Privacy Policy for MoodyMe

// Last Updated: November 2024

// 1. Introduction
// MoodyMe ("we", "our", or "us") operates the MoodyMe application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service.

// 2. Information Collection and Use
// We collect several different types of information for various purposes:
// - Personal Data: Name, email address, phone number
// - Usage Data: Access times, pages viewed, interactions with the application
// - Mood Data: Your mood entries and associated metadata

// 3. Security of Data
// The security of your data is important to us but remember that no method of transmission over the Internet is 100% secure.

// 4. Contact Us
// If you have any questions about this Privacy Policy, please contact us at privacy@moodyme.com`
//   );

//   const [settings, setSettings] = useState({
//     dataCollection: true,
//     analyticsEnabled: true,
//     thirdPartySharing: false,
//     marketingEmails: false,
//   });

//   const handleSave = () => {
//     console.log('Saving privacy policy');
//     setIsEditing(false);
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
//             <p className="text-muted-foreground">Manage your privacy policy and data settings</p>
//           </div>
//           <Button onClick={() => setIsEditing(!isEditing)}>
//             {isEditing ? 'Cancel' : 'Edit'}
//           </Button>
//         </div>

//         {/* Privacy Policy Content */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Privacy Policy Document</CardTitle>
//             <CardDescription>Your application's privacy policy text</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {isEditing ? (
//               <>
//                 <Textarea
//                   value={privacyText}
//                   onChange={(e) => setPrivacyText(e.target.value)}
//                   className="min-h-[400px] font-mono text-sm"
//                 />
//                 <div className="flex gap-2 justify-end">
//                   <Button variant="outline" onClick={() => setIsEditing(false)}>
//                     Cancel
//                   </Button>
//                   <Button onClick={handleSave}>Save Policy</Button>
//                 </div>
//               </>
//             ) : (
//               <div className="prose prose-sm max-w-none dark:prose-invert">
//                 <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs whitespace-pre-wrap">
//                   {privacyText}
//                 </pre>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Privacy Settings */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Privacy Settings</CardTitle>
//             <CardDescription>Configure how user data is handled</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-base">Data Collection</Label>
//                 <p className="text-sm text-muted-foreground">Allow collection of usage data</p>
//               </div>
//               <Switch
//                 checked={settings.dataCollection}
//                 onCheckedChange={(checked) =>
//                   setSettings({ ...settings, dataCollection: checked })
//                 }
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-base">Analytics Enabled</Label>
//                 <p className="text-sm text-muted-foreground">Enable Google Analytics tracking</p>
//               </div>
//               <Switch
//                 checked={settings.analyticsEnabled}
//                 onCheckedChange={(checked) =>
//                   setSettings({ ...settings, analyticsEnabled: checked })
//                 }
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-base">Third-Party Sharing</Label>
//                 <p className="text-sm text-muted-foreground">Share data with third-party services</p>
//               </div>
//               <Switch
//                 checked={settings.thirdPartySharing}
//                 onCheckedChange={(checked) =>
//                   setSettings({ ...settings, thirdPartySharing: checked })
//                 }
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-base">Marketing Emails</Label>
//                 <p className="text-sm text-muted-foreground">Send promotional emails to users</p>
//               </div>
//               <Switch
//                 checked={settings.marketingEmails}
//                 onCheckedChange={(checked) =>
//                   setSettings({ ...settings, marketingEmails: checked })
//                 }
//               />
//             </div>

//             <Button className="w-full mt-4">Save Settings</Button>
//           </CardContent>
//         </Card>
//       </div>
//     </AdminLayout>
//   );
// }
'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function AboutPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(
    'Welcome to MoodyMe! We are a platform dedicated to helping you track and understand your mood patterns. Our mission is to provide you with insights into your emotional well-being and help you lead a healthier, more balanced life.'
  );

  const handleSave = () => {
    // TODO: Save to database
    console.log('Saving about text:', aboutText);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground">Manage your application's privacy page content</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {/* About Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>About MoodyMe</CardTitle>
            <CardDescription>Your application description and mission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Enter about text..."
                  className="min-h-[200px]"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground leading-relaxed">{aboutText}</p>
            )}
          </CardContent>
        </Card>

        {/* Stats Section */}
        {/* <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Founded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2024</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </AdminLayout>
  );
}

