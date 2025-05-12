'use client';
import { useState, useEffect } from 'react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import { Disclosure } from '@headlessui/react';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ClipboardDocumentListIcon,
  KeyIcon,
  RocketLaunchIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon, 
  CogIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  GlobeAltIcon
} from '@heroicons/react/24/solid';
import SiteSeoAnalyzer from './SiteSeoAnalyzer';
import SeoScoreWidget from '../SeoScoreWidget';
import SiteSeoTaskList from './SiteSeoTaskList';

const SiteSeoDashboard = ({ siteData, pageData, onUpdateSuggestions }) => {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [analysis, setAnalysis] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  // Process analysis into tasks
  useEffect(() => {
    if (!analysis) return;
    
    const generatedTasks = [];
    
    // Title tasks
    if (analysis.titleScore < 70) {
      generatedTasks.push({
        id: 'title-1',
        title: 'Optimize site title',
        description: `Your current title "${siteData.title}" needs improvement.`,
        recommendation: analysis.titleSuggestions?.[0] || 'Make your title more descriptive and include important keywords.',
        priority: analysis.titleScore < 50 ? 'high' : 'medium',
        category: 'title'
      });
    }
    
    // Meta description tasks
    if (analysis.metaDescriptionScore < 70) {
      generatedTasks.push({
        id: 'meta-1',
        title: 'Improve meta description',
        description: `Your meta description ${!siteData.metaDescription ? 'is missing' : 'needs improvement'}.`,
        recommendation: analysis.metaDescriptionSuggestions?.[0] || 'Add a compelling meta description that includes your main keywords.',
        priority: !siteData.metaDescription ? 'critical' : 'high',
        category: 'meta'
      });
    }
    
    // Navigation tasks
    if (analysis.navigationScore < 70) {
      generatedTasks.push({
        id: 'nav-1',
        title: 'Improve navigation structure',
        description: 'Your navigation needs optimization for better user experience and SEO.',
        recommendation: analysis.navigationAnalysis || 'Create a logical, well-structured navigation with descriptive labels.',
        priority: analysis.navigationScore < 50 ? 'high' : 'medium',
        category: 'navigation'
      });
    }

    // Keywords tasks
    if (analysis.keywordsScore < 70) {
      generatedTasks.push({
        id: 'keywords-1',
        title: 'Optimize keyword usage',
        description: 'Your site needs better keyword optimization.',
        recommendation: analysis.keywordsAnalysis || 'Include your target keywords in title, headings, and throughout content.',
        priority: 'high',
        category: 'keywords'
      });
    }
    
    // Add additional recommendations as tasks
    if (analysis.additionalRecommendations?.length > 0) {
      analysis.additionalRecommendations.forEach((recommendation, index) => {
        generatedTasks.push({
          id: `additional-${index + 1}`,
          title: `Additional improvement ${index + 1}`,
          description: recommendation,
          priority: 'low',
          category: 'other'
        });
      });
    }
    
    setTasks(generatedTasks);
  }, [analysis, siteData]);
  
  // Update analysis when it comes from the analyzer
  const handleAnalysisUpdate = (data) => {
    // If it's a suggestion to be applied
    if (data?.applySuggestion) {
      if (onUpdateSuggestions) {
        // Make a copy to avoid modifying the original
        const suggestionData = { ...data };
        
        // Make sure we don't trigger unnecessary form submissions
        if (typeof suggestionData.preventDefault === 'function') {
          suggestionData.preventDefault();
        }
        
        onUpdateSuggestions(suggestionData);
      }
      return;
    }
    
    // Normal analysis update
    setAnalysis(data?.analysis);
    if (onUpdateSuggestions) {
      onUpdateSuggestions(data);
    }
  };
  
  const tabs = [
    { id: 'analyzer', label: 'SEO Analyzer', icon: <MagnifyingGlassIcon className="h-4 w-4" /> },
    { id: 'tasks', label: 'Improvement Tasks', icon: <ClipboardDocumentListIcon className="h-4 w-4" /> },
    { id: 'guide', label: 'SEO Best Practices', icon: <DocumentTextIcon className="h-4 w-4" /> }
  ];
  
  return (
    <div className="site-seo-dashboard bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm">
      <div className="mb-6 bg-white p-5 rounded-xl shadow-md border-l-4 border-primary-600">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold mb-4 lg:mb-0 flex items-center">
            <RocketLaunchIcon className="h-8 w-8 mr-3 text-primary-600" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">Site SEO Dashboard</span>
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                text={tab.label}
                icon={tab.icon}
                className={`btn-sm ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-lg hover:shadow-xl transform transition-transform hover:scale-105' 
                  : 'btn-outline-gray text-gray-700 transform transition-transform hover:scale-105'}`}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      {activeTab === 'analyzer' && (
        <SiteSeoAnalyzer analysis={analysis} siteData={siteData} pageData={pageData} onUpdateSuggestions={handleAnalysisUpdate} />
      )}
      
      {activeTab === 'tasks' && (
        <SiteSeoTaskList tasks={tasks} />
      )}
      
      {activeTab === 'guide' && (
        <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2 text-indigo-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Site SEO Best Practices</span>
            </h3>
            
            <div className="space-y-4">
              <Disclosure defaultOpen>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:from-blue-100 hover:to-indigo-100 focus:outline-none shadow-sm border border-blue-200 transition-all duration-200">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        Site Title & Meta Tags
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-blue-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Create a unique, descriptive title that includes your primary keyword</li>
                        <li>Keep the title under 60 characters to avoid truncation in search results</li>
                        <li>Write a compelling meta description (145-160 characters) that includes relevant keywords</li>
                        <li>Include relevant meta keywords that represent your site's main topics</li>
                        <li>Use a unique, descriptive meta title for each page on your site</li>
                        <li>Ensure title tags follow a consistent pattern (e.g., Page Name | Site Name)</li>
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gradient-to-r from-green-50 to-teal-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:from-green-100 hover:to-teal-100 focus:outline-none shadow-sm border border-green-200 transition-all duration-200">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                        Site Structure & Information Architecture
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-green-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-green-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Organize content in a logical hierarchy (no more than 3 clicks from homepage)</li>
                        <li>Use descriptive, keyword-rich URLs that follow a consistent pattern</li>
                        <li>Create a clear navigation structure with descriptive labels</li>
                        <li>Include a comprehensive HTML sitemap for users and an XML sitemap for search engines</li>
                        <li>Implement breadcrumb navigation to help users and search engines understand the site structure</li>
                        <li>Group related content into categories or sections with proper internal linking</li>
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:from-purple-100 hover:to-violet-100 focus:outline-none shadow-sm border border-purple-200 transition-all duration-200">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                        Content Optimization
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-purple-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Create high-quality, original content that addresses user needs</li>
                        <li>Include target keywords naturally in headings, content, and image alt text</li>
                        <li>Use proper heading hierarchy (H1, H2, H3) for content structure</li>
                        <li>Ensure content is easy to read with short paragraphs and bulleted lists</li>
                        <li>Include internal links to related content on your site</li>
                        <li>Keep content updated and relevant with regular reviews</li>
                        <li>Add schema markup for rich snippets in search results</li>
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:from-yellow-100 hover:to-amber-100 focus:outline-none shadow-sm border border-yellow-200 transition-all duration-200">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                        Technical SEO
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-yellow-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-yellow-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Ensure site is mobile-friendly with responsive design</li>
                        <li>Optimize page loading speed (under 3 seconds)</li>
                        <li>Secure your site with HTTPS encryption</li>
                        <li>Implement proper redirects for changed or moved pages</li>
                        <li>Fix broken links and crawl errors</li>
                        <li>Use canonical tags to avoid duplicate content issues</li>
                        <li>Create a well-structured robots.txt file and XML sitemap</li>
                        <li>Optimize images with descriptive filenames and alt text</li>
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gradient-to-r from-red-50 to-rose-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:from-red-100 hover:to-rose-100 focus:outline-none shadow-sm border border-red-200 transition-all duration-200">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                        User Experience (UX)
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-red-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-red-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Design a clean, intuitive interface that's easy to navigate</li>
                        <li>Ensure site works well on all devices with responsive design</li>
                        <li>Optimize for Core Web Vitals (LCP, FID, CLS)</li>
                        <li>Minimize pop-ups and interstitials that disrupt user experience</li>
                        <li>Make sure text is readable with sufficient contrast</li>
                        <li>Use clear calls-to-action (CTAs) to guide users</li>
                        <li>Ensure site is accessible to users with disabilities (WCAG compliance)</li>
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:from-cyan-100 hover:to-blue-100 focus:outline-none shadow-sm border border-cyan-200 transition-all duration-200">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-cyan-600 rounded-full mr-2"></span>
                        Monitoring & Measurement
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-cyan-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-cyan-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Set up Google Analytics and Google Search Console to track performance</li>
                        <li>Monitor key SEO metrics (organic traffic, rankings, bounce rate)</li>
                        <li>Regularly check for crawl errors and fix issues promptly</li>
                        <li>Track page loading speed and Core Web Vitals</li>
                        <li>Analyze user behavior to identify improvement opportunities</li>
                        <li>Perform regular SEO audits to identify and fix issues</li>
                        <li>Set up alerts for sudden drops in traffic or rankings</li>
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SiteSeoDashboard;