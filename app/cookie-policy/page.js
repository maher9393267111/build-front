//no cache
export const revalidate = 0;

import { getCookiePolicy } from '@services/api';
import Layout from '@components/layout/landing/Layout';
import MarkdownRenderer from '@components/ui/MarkdownRenderer';

export async function generateMetadata() {
    try {
        const policy = await getCookiePolicy();
        return {
            title: policy?.seoTitle || 'Cookie Policy',
            description: policy?.seoTitle || 'Our Cookie Policy details.',
        };
    } catch (error) {
        console.error('Failed to fetch cookie policy for metadata:', error);
        return {
            title: 'Cookie Policy',
            description: 'Our Cookie Policy details.',
        };
    }
}

export default async function CookiePolicyPage() {
    const policy = await getCookiePolicy();
    const heroImage = policy?.heroImage?.url || null;

    return (
        <Layout
            headerStyle={1}
            breadcrumbTitle={policy?.seoTitle || "Cookie Policy"}
            breadcrumbSubTitle={policy?.seoTitle || "How we use cookies"}
            breadcrumbAlign={"center"}
            breadcrumbImage={heroImage}
            headerBg={"transparent"}
        >
            <section className="section-padding">
                <div className="container">
                    <div className="prose max-w-none lg:prose-xl">
                        {policy?.description ? (
                            <MarkdownRenderer markdown={policy.description} />
                        ) : (
                            <p>Cookie Policy content is not available at the moment. Please check back later.</p>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
} 