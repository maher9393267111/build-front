//no cache
export const revalidate = 0;

import PageContent from "../components/PageContent";
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
      
      // Optimize title - make it shorter (under 60 chars ideal for SEO)
      let title = page.metaTitle || page.title || "Let's Build ";
      // If title is too long, truncate it
      if (title.length > 60) {
        title = title.substring(0, 57) + "...";
      }
      
      // Optimize description - make it shorter (under 160 chars ideal for SEO)
      let description = page.description || "Looking for reliable builders in South Wales? Let’s Build specialises in home extensions, renovations, and new builds with quality workmanship and local trust.";
      if (description.length > 160) {
        description = description.substring(0, 157) + "...";
      }
  
      const metadata = {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://letsbuildsw.co.uk'),
        title: title,
        description: description,
        keywords: page.metaKeywords || 'home extensions south wales, home renovations south wales, new builds south wales, house builders south wales, home construction south wales',
        openGraph: iconUrl ? {
          images: [{ url: iconUrl }],
          title: title,
          description: description.substring(0, 160), // Ensure OG description is also truncated
        } : undefined,
        icons: iconsData,
      };
  
      // Add canonical URL if available
      if (page.canonicalUrl) {
        metadata.alternates = { canonical: page.canonicalUrl || 'https://letsbuildsw.co.uk' };
      }
  
      // Add robots meta tag if available
      if (page.robots) {
        metadata.robots = page.robots;
      }
  
      return metadata;
    } catch (error) {
      console.error('Error generating metadata:', error);
      return {
        title: "Let's Build - Heating & AC Specialists in South Wales",
        description: "Expert boiler installation, heat pumps, and air conditioning services across South Wales. Quality work & free quotes."
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
