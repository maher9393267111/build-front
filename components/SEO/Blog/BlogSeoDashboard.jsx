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
  PencilSquareIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  BookOpenIcon
} from '@heroicons/react/24/solid';
import BlogSeoAnalyzer from './BlogSeoAnalyzer';
import SeoScoreWidget from '../SeoScoreWidget';
import BlogSeoTaskList from './BlogSeoTaskList';

const BlogSeoDashboard = ({ pageData, content, onUpdateSuggestions }) => {
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
        title: 'Optimize blog title',
        description: `Your current title "${pageData.title}" needs improvement.`,
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
        description: `Your meta description ${!pageData.description ? 'is missing' : 'needs improvement'}.`,
        recommendation: analysis.metaDescriptionSuggestions?.[0] || 'Add a compelling meta description that includes your main keywords.',
        priority: !pageData.description ? 'critical' : 'high',
        category: 'meta'
      });
    }
    
    // Content structure tasks
    if (analysis.contentStructureScore < 70) {
      generatedTasks.push({
        id: 'content-1',
        title: 'Enhance content structure',
        description: 'Your blog structure needs improvement for better SEO.',
        recommendation: analysis.contentStructureRecommendations || 'Use proper heading hierarchy (H1, H2, H3) and organize content with clear sections.',
        priority: 'medium',
        category: 'content'
      });
    }
    
    // Content score tasks
    if (analysis.contentScore < 70) {
      generatedTasks.push({
        id: 'content-score-1',
        title: 'Improve content quality',
        description: 'The quality score of your blog content is low.',
        recommendation: analysis.contentImprovementSuggestions?.[0] || 'Refine the text for clarity, depth, and keyword relevance.',
        priority: analysis.contentScore < 50 ? 'high' : 'medium',
        category: 'content'
      });
    }

    // Readability tasks
    if (analysis.readabilityScore < 60) {
      generatedTasks.push({
        id: 'readability-1',
        title: 'Improve content readability',
        description: 'Your blog may be difficult to read.',
        recommendation: 'Simplify sentence structures, use shorter paragraphs, and avoid jargon.',
        priority: 'medium',
        category: 'content'
      });
    }
    
    // Check content length
    if (content && content.length < 300) {
      generatedTasks.push({
        id: 'length-1',
        title: 'Increase content length',
        description: 'Your blog content is too short for optimal SEO.',
        recommendation: `Consider adding more content. Recommended length: ${analysis.recommendedContentLength || 1500}+ words.`,
        priority: 'high',
        category: 'content'
      });
    }
    
    // Keywords tasks
    if (analysis.keywordsScore < 70) {
      generatedTasks.push({
        id: 'keywords-1',
        title: 'Optimize keyword usage',
        description: 'Your blog needs better keyword optimization.',
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
  }, [analysis, pageData, content]);
  
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
    { id: 'guide', label: 'Blog SEO Guide', icon: <BookOpenIcon className="h-4 w-4" /> }
  ];
  
  return (
    <div className="blog-seo-dashboard bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm">
      <div className="mb-6 bg-white p-5 rounded-xl shadow-md border-l-4 border-primary-600">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold mb-4 lg:mb-0 flex items-center">
            <RocketLaunchIcon className="h-8 w-8 mr-3 text-primary-600" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">Blog SEO Dashboard</span>
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
        <BlogSeoAnalyzer analysis={analysis} pageData={pageData} content={content} onUpdateSuggestions={handleAnalysisUpdate} />
      )}
      
      {activeTab === 'tasks' && (
        <BlogSeoTaskList tasks={tasks} />
      )}
      
      {activeTab === 'guide' && (
        <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2 text-indigo-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Blog SEO Best Practices</span>
            </h3>
            
            <div className="space-y-4">
              <Disclosure defaultOpen>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:from-blue-100 hover:to-indigo-100 focus:outline-none shadow-sm border border-blue-200 transition-all duration-200">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        Blog Title Optimization
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-blue-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Make your title engaging and attention-grabbing</li>
                        <li>Include your primary keyword near the beginning of the title</li>
                        <li>Keep it under 60 characters to avoid truncation in search results</li>
                        <li>Use power words that evoke emotion (e.g., "essential," "ultimate," "proven")</li>
                        <li>Consider using numbers in the title (e.g., "7 Ways to..." or "10 Tips for...")</li>
                        <li>Match search intent - informational, navigational, or transactional</li>
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
                        Blog Content Structure
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-green-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-green-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Start with a compelling introduction that hooks the reader</li>
                        <li>Use headings (H2, H3, H4) to organize content in a logical hierarchy</li>
                        <li>Include your target keywords in headings where relevant</li>
                        <li>Use short paragraphs (3-4 sentences) for better readability</li>
                        <li>Include lists, bullet points, and numbered steps where appropriate</li>
                        <li>Add images, infographics, or videos to break up text and improve engagement</li>
                        <li>End with a strong conclusion and call-to-action</li>
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
                        Keyword Optimization for Blogs
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-purple-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Place your primary keyword in the first 100-150 words</li>
                        <li>Include your primary keyword in at least one H2 heading</li>
                        <li>Use secondary keywords and synonyms throughout the content</li>
                        <li>Maintain keyword density between 1-2% (don't overuse keywords)</li>
                        <li>Include LSI (Latent Semantic Indexing) keywords related to your topic</li>
                        <li>Use keywords in image alt text when relevant</li>
                        <li>Optimize the URL to include your main keyword</li>
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
                        Content Length & Quality
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-yellow-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-yellow-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Aim for comprehensive, in-depth content (typically 1,500+ words)</li>
                        <li>Focus on quality and value over word count alone</li>
                        <li>Include data, statistics, and citations to establish credibility</li>
                        <li>Update older content to keep it fresh and relevant</li>
                        <li>Answer common questions your audience might have about the topic</li>
                        <li>Check for spelling and grammar errors</li>
                        <li>Write at a reading level appropriate for your audience (typically 6th-8th grade)</li>
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
                        Internal & External Linking
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-red-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-red-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Include 3-5 internal links to other relevant content on your site</li>
                        <li>Link to 2-3 authoritative external sources to support your claims</li>
                        <li>Use descriptive, keyword-rich anchor text for links</li>
                        <li>Avoid generic anchor text like "click here" or "read more"</li>
                        <li>Ensure all links are working properly</li>
                        <li>Consider adding a "related posts" section at the end of your blog</li>
                        <li>Update older blog posts with links to newer, related content</li>
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
                        Meta Data & Social Sharing
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-cyan-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-cyan-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Write a compelling meta description (145-155 characters) that includes your primary keyword</li>
                        <li>Create a custom meta title if your blog title is too long for search results</li>
                        <li>Include 3-5 relevant meta keywords</li>
                        <li>Add Open Graph tags for better social media sharing</li>
                        <li>Use a high-quality featured image (ideally 1200x630px for social sharing)</li>
                        <li>Add schema markup for rich snippets in search results</li>
                        <li>Set canonical URLs if you have duplicate or similar content</li>
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

export default BlogSeoDashboard; 