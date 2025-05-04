'use client';
import { useState, useEffect } from 'react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
// import Tab from '@components/ui/Tab';
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
  ArrowPathIcon,
  ChevronDownIcon,
  DocumentTextIcon
} from '@heroicons/react/24/solid';
import SeoAnalyzer from './SeoAnalyzer';
import SeoScoreWidget from './SeoScoreWidget';
import SeoTaskList from './SeoTaskList';

const SeoDashboard = ({ pageData, onUpdateSuggestions }) => {
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
        title: 'Optimize page title',
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
        description: 'Your page structure needs improvement for better SEO.',
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
        description: 'The quality score of your content is low.',
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
        description: 'Your content may be difficult to read.',
        recommendation: 'Simplify sentence structures, use shorter paragraphs, and avoid jargon.',
        priority: 'medium',
        category: 'content'
      });
    }
    
    // H1 heading task
    if (!pageData.blocks?.some(block => block.type === 'hero')) {
      generatedTasks.push({
        id: 'h1-1',
        title: 'Add H1 heading',
        description: 'Your page is missing a main (H1) heading.',
        recommendation: 'Add a hero block with a clear H1 heading that includes your main keyword.',
        priority: 'critical',
        category: 'content'
      });
    }
    
    // Keywords tasks
    if (analysis.keywordsScore < 70) {
      generatedTasks.push({
        id: 'keywords-1',
        title: 'Optimize keyword usage',
        description: 'Your page needs better keyword optimization.',
        recommendation: analysis.keywordsAnalysis || 'Include your target keywords in title, headings, and throughout content.',
        priority: 'high',
        category: 'keywords'
      });
    }
    
    // URL structure task
    if (analysis.urlStructureScore < 70) {
      generatedTasks.push({
        id: 'url-1',
        title: 'Improve URL structure',
        description: 'Your URL structure could be optimized for SEO.',
        recommendation: analysis.urlStructureAnalysis || 'Make your URL shorter, more descriptive, and include main keywords.',
        priority: 'medium',
        category: 'url'
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
  }, [analysis, pageData]);
  
  // Update analysis when it comes from the analyzer
  const handleAnalysisUpdate = (data) => {
    setAnalysis(data?.analysis);
    if (onUpdateSuggestions) {
      onUpdateSuggestions(data);
    }
  };
  
  const tabs = [
    { id: 'analyzer', label: 'SEO Analyzer', icon: <MagnifyingGlassIcon className="h-4 w-4" /> },
    { id: 'tasks', label: 'Improvement Tasks', icon: <ClipboardDocumentListIcon className="h-4 w-4" /> },
    // { id: 'content', label: 'Content Optimizer', icon: <DocumentTextIcon className="h-4 w-4" /> },
    // { id: 'keywords', label: 'Keyword Research', icon: <KeyIcon className="h-4 w-4" /> },
    { id: 'guide', label: 'SEO Guide', icon: <InformationCircleIcon className="h-4 w-4" /> }
  ];
  
  return (
    <div className="seo-dashboard bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm">
      <div className="mb-6 bg-white p-5 rounded-xl shadow-md border-l-4 border-primary-600">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold mb-4 lg:mb-0 flex items-center">
            <RocketLaunchIcon className="h-8 w-8 mr-3 text-primary-600" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">SEO Dashboard</span>
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
        <SeoAnalyzer analysis={analysis} pageData={pageData} onUpdateSuggestions={handleAnalysisUpdate} />
      )}
      
      {activeTab === 'tasks' && (
        <SeoTaskList tasks={tasks} />
      )}
      
      {activeTab === 'guide' && (
        <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2 text-indigo-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">SEO Best Practices Guide</span>
            </h3>
            
            <div className="space-y-4">
              <Disclosure defaultOpen>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:from-blue-100 hover:to-indigo-100 focus:outline-none shadow-sm border border-blue-200 transition-all duration-200">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        Page Title Optimization
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-blue-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Keep your title under 60 characters to ensure it displays properly in search results</li>
                        <li>Include your primary keyword near the beginning of the title</li>
                        <li>Make your title compelling and descriptive of the page content</li>
                        <li>Each page should have a unique title that accurately represents its content</li>
                        <li>Consider including your brand name at the end of the title</li>
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
                        Meta Description Best Practices
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-green-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-green-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Keep meta descriptions between 120-155 characters</li>
                        <li>Include your primary and secondary keywords naturally</li>
                        <li>Write a compelling description that encourages clicks</li>
                        <li>Each page should have a unique meta description</li>
                        <li>Include a call-to-action when appropriate</li>
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
                        Content Structure Guidelines
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-purple-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Use a single H1 heading that includes your primary keyword</li>
                        <li>Structure content with H2 and H3 subheadings that include secondary keywords</li>
                        <li>Keep paragraphs short and focused (3-4 sentences maximum)</li>
                        <li>Include bullet points or numbered lists for easier readability</li>
                        <li>Aim for at least 300 words of content for standard pages</li>
                        <li>Use images with descriptive alt text that includes keywords when relevant</li>
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
                        Keyword Optimization Tips
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-yellow-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-yellow-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Include your primary keyword in the title, H1 heading, meta description, and URL</li>
                        <li>Use secondary keywords naturally throughout your content</li>
                        <li>Maintain a keyword density of 1-2% for your primary keyword</li>
                        <li>Use semantic variations and related terms to improve topical relevance</li>
                        <li>Avoid keyword stuffing, which can hurt your SEO rankings</li>
                        <li>Focus on user intent rather than just keyword density</li>
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
                        URL Structure Best Practices
                      </span>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-red-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pt-4 pb-5 text-sm text-gray-600 bg-white border border-t-0 border-red-100 rounded-b-lg shadow-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Keep URLs short and descriptive (under 60 characters if possible)</li>
                        <li>Include your primary keyword in the URL</li>
                        <li>Use hyphens to separate words in URLs, not underscores</li>
                        <li>Avoid using parameters, session IDs, or unnecessary numbers in URLs</li>
                        <li>Use a logical directory structure for your site</li>
                        <li>Consider using canonical tags if you have duplicate content</li>
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

export default SeoDashboard; 