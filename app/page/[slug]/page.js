'use client'
 // deom text page
 import { useState } from 'react';

 const DemoTextPage = () => {
  const [text, setText] = useState('');

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Demo Text Page</h1>
      <p className="text-gray-600">This is a demo text page.</p>
    </div>
  );
};

export default DemoTextPage;

// import PageContent from './PageContent';
// import { getPageBySlug } from '@services/api';

// export async function generateMetadata({ params }) {
//   try {
//     const { slug } = params;
//     const page = await getPageBySlug(slug);

//     // Prepare icon data if ogImage exists
//     const iconUrl = page.ogImage?.url; 
//     const iconsData = iconUrl ? {
//         icon: [{ url: iconUrl }], // Use for standard favicon
//         apple: [{ url: iconUrl }], // Use for Apple touch icon
//       } : undefined;


//     return {
//       title: page.metaTitle || page.title,
//       description: page.description || '',
//       keywords: page.metaKeywords || '',
//       openGraph: iconUrl ? { // Reuse iconUrl check
//         images: [{ url: iconUrl }],
//       } : undefined,
//       icons: iconsData, // Add the icons property here
//     };
//   } catch (error) {
//     console.error('Error generating metadata:', error);
//     return {
//       title: 'Page Not Found',
//       description: 'The requested page could not be found.'
//     };
//   }
// }

// export default async function Page({ params }) {
//   try {
//     const { slug } = params;
//     const pageData = await getPageBySlug(slug);
    
//     return <PageContent pageData={pageData} />;
//   } catch (error) {
//     console.error('Error fetching page data:', error);
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
//         <p className="text-gray-600">The page you are looking for does not exist or has been moved.</p>
//       </div>
//     );
//   }
// } 