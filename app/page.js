


import PageContent from "./[slug]/PageContent";
import { getMainPage } from "@services/api";
import Layout from "@components/layout/landing/Layout";

export async function generateMetadata() {
    try {
      const page = await getMainPage();
  
      // Prepare icon data if ogImage exists
      const iconUrl = page.ogImage?.url; 
      const iconsData = iconUrl ? {
          icon: [{ url: iconUrl }], // Use for standard favicon
          apple: [{ url: iconUrl }], // Use for Apple touch icon
        } : undefined;
  
      const metadata = {
        title: page.metaTitle || page.title,
        description: page.description || '',
        keywords: page.metaKeywords || '',
        openGraph: iconUrl ? { // Reuse iconUrl check
          images: [{ url: iconUrl }],
        } : undefined,
        icons: iconsData, // Add the icons property here
      };
  
      // Add canonical URL if available
      if (page.canonicalUrl) {
        metadata.alternates = { canonical: page.canonicalUrl };
      }
  
      // Add robots meta tag if available
      if (page.robots) {
        metadata.robots = page.robots;
      }
  
      return metadata;
    } catch (error) {
      console.error('Error generating metadata:', error);
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.'
      };
    }
  }
  




export default async function Home() {
    let pageData = null;
    
    try {
        // Fetch the main page data
        pageData = await getMainPage();
        
   
    } catch (e) {
        console.error("Error fetching main page:", e);
        // Keep the default metadata on error
    }

    return (
        <>
            {pageData?.structuredData && (
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData.structuredData) }}
                />
            )}
             <Layout headerStyle={1}>
                <PageContent pageData={pageData} />
            </Layout>
        </>
    );
}
