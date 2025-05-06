'use client';
import { useState, useEffect } from 'react';
import { analyzeBlogSEO, suggestKeywords ,getBlogContentSuggestions } from '@services/api';
import { toast } from 'react-toastify';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  PresentationChartLineIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  BookOpenIcon,
  PencilIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/solid';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import SeoScoreWidget from '../SeoScoreWidget';
import Icon from '@components/ui/Icon';
import http from '@services/api/http';

const BlogSeoAnalyzer = ({ analysis, pageData, content, onUpdateSuggestions }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [keywordSuggestions, setKeywordSuggestions] = useState(null);
  const [showContentSuggestions, setShowContentSuggestions] = useState(false);
  const [contentSuggestionLoading, setContentSuggestionLoading] = useState(false);
  const [contentSuggestions, setContentSuggestions] = useState(null);
  const [renderError, setRenderError] = useState(false);
  
  // Content writing assistance
  const [showBlogOutliner, setShowBlogOutliner] = useState(false);
  const [blogOutlinerLoading, setBlogOutlinerLoading] = useState(false);
  const [blogOutline, setBlogOutline] = useState(null);
  const [outlinerCategory, setOutlinerCategory] = useState('');
  const [outlinerTarget, setOutlinerTarget] = useState('beginner');
  const [outlinerKeywords, setOutlinerKeywords] = useState('');

  // Function to apply SEO suggestions
  const applySuggestion = (type, value, e) => {
    // Prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (onUpdateSuggestions) {
      onUpdateSuggestions({
        applySuggestion: true,
        type: type,
        value: value
      });
      toast.success(`Applied ${type} suggestion successfully!`);
    }
  };

  // Reset render error when analysis changes
  useEffect(() => {
    if (analysis) {
      setRenderError(false);
    }
  }, [analysis]);

  const runAnalysis = async () => {
    if (!pageData) return;
    
    setLoading(true);
    setAnalyzing(true);
    
    try {
      // Pass both pageData and the provided content
      const response = await analyzeBlogSEO(pageData, content); 
      console.log('Blog SEO Analysis Response:', response);
      
      // Enhanced validation to ensure we have a valid response
      if (response && response.success === true) {
        if (onUpdateSuggestions) {
          onUpdateSuggestions(response);
        }
      } else {
        console.error('Invalid SEO analysis response:', response);
        toast.warning('Received incomplete SEO analysis data. Some information may not be displayed.');
      }
    } catch (error) {
      console.error('Error analyzing blog SEO:', error);
      toast.error('Failed to analyze blog SEO data');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };
  
  const getKeywordSuggestions = async () => {
    setKeywordLoading(true);
    try {
      const response = await suggestKeywords({
        title: pageData.title || pageData.metaTitle,
        description: pageData.description,
        metaKeywords: pageData.metaKeywords || '',
        industry: 'Blog', // Specify the industry as Blog
        contentType: 'article'
      });
      
      if (response && response.success && response.keywords) {
        setKeywordSuggestions(response.keywords);
        setShowKeywords(true);
      } else {
        console.error('Unexpected keyword suggestions response format:', response);
        toast.error('Received unexpected format for keyword suggestions');
      }
    } catch (error) {
      console.error('Error getting keyword suggestions:', error);
      toast.error('Failed to get keyword suggestions');
    } finally {
      setKeywordLoading(false);
    }
  };

  const getContentSuggestions = async () => {
    setContentSuggestionLoading(true);
    try {
      // Use the same API but with a specific request for content suggestions
      const response = await analyzeBlogSEO(
        pageData,
        content,
        true // requestContentSuggestions flag
      );
      
      if (response && response.success && response.contentSuggestions) {
        setContentSuggestions(response.contentSuggestions);
        setShowContentSuggestions(true);
      } else {
        console.error('Unexpected content suggestions response format:', response);
        toast.error('Failed to get blog content suggestions');
      }
    } catch (error) {
      console.error('Error getting content suggestions:', error);
      toast.error('Failed to get blog content suggestions');
    } finally {
      setContentSuggestionLoading(false);
    }
  };
  
  // Generate blog outline
  const generateBlogOutline = async () => {
    setBlogOutlinerLoading(true);
    
    try {
      // Prepare parameters for outline generation
      const params = {
        title: pageData.title || pageData.metaTitle,
        category: outlinerCategory || pageData.category,
        keywords: outlinerKeywords || pageData.metaKeywords,
        targetAudience: outlinerTarget,
        existingContent: content || '',
      };
      
      // Request blog outline
      const { data } = await http.post('/generate-blog-outline', params);
      
      if (data && data.success && data.outline) {
        setBlogOutline(data.outline);
        setShowBlogOutliner(true);
      } else {
        throw new Error('Failed to generate blog outline');
      }
    } catch (error) {
      console.error('Error generating blog outline:', error);
      toast.error('Failed to generate blog outline');
    } finally {
      setBlogOutlinerLoading(false);
    }
  };

  // Score to color mapping
  const getScoreColor = (score) => {
    if (!score && score !== 0) return 'text-gray-400'; // Fallback for undefined/null
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-600';
  };

  // Get status icon based on score
  const getStatusIcon = (score) => {
    if (!score && score !== 0) return <InformationCircleIcon className="h-5 w-5 text-gray-400" />; // Fallback for undefined/null
    if (score >= 80) return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
    return <ExclamationCircleIcon className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="blog-seo-analyzer bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md border-l-4 border-primary-600">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
          <BookOpenIcon className="h-8 w-8 mr-3 text-primary-600" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">Blog SEO Analysis</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex space-x-2">
            <Button
              text={keywordLoading ? "Loading..." : "Keyword Ideas"}
              icon="Search"
              onClick={getKeywordSuggestions}
              className="btn-outline-primary border-indigo-500 text-indigo-600 hover:bg-indigo-50"
              disabled={keywordLoading}
            />
            <Button
              text={blogOutlinerLoading ? "Generating..." : "Blog Outliner"}
              icon="FileText"
              onClick={() => setShowBlogOutliner(true)}
            className="btn-primary bg-gradient-to-r from-primary-600 to-primary-700 border-none shadow-lg hover:shadow-xl transform transition-transform hover:scale-105"
              disabled={blogOutlinerLoading}
            />
          </div>
          <Button
            text={analyzing ? "Analyzing..." : "Analyze Blog SEO"}
            icon={analyzing ? "RefreshCw" : "Check"}
            onClick={runAnalysis}
            className="btn-primary bg-gradient-to-r from-primary-600 to-primary-700 border-none shadow-lg hover:shadow-xl transform transition-transform hover:scale-105"
            disabled={analyzing}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60 bg-white rounded-xl shadow-md">
          <div className="loader animate-spin border-4 border-t-4 rounded-full h-16 w-16 border-primary-500 border-t-transparent"></div>
        </div>
      ) : analysis && analysis.seoScore ? (
        <div className="space-y-8">
          {analysis && !renderError && (() => {
            try {
              return (
                <div className="mb-6">
                  <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="mb-6 sm:mb-0 transform hover:scale-105 transition-transform duration-300">
                          <SeoScoreWidget score={analysis.seoScore || 0} size="large" />
                        </div>
                        
                        <div className="flex-grow px-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Blog SEO Summary</h3>
                          <p className="text-sm text-gray-600 mb-5 italic">{analysis.summary || "Here's an overview of your blog's SEO performance."}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {/* Title Score */}
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 transform hover:scale-105 transition-transform">
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.titleScore || 0)}`}>{analysis.titleScore || 0}%</div>
                              <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mt-1">Title</div>
                            </div>
                            
                            {/* Meta Description Score */}
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 transform hover:scale-105 transition-transform">
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.metaDescriptionScore || 0)}`}>{analysis.metaDescriptionScore || 0}%</div>
                              <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mt-1">Description</div>
                            </div>
                            
                            {/* Keywords Score */}
                            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200 transform hover:scale-105 transition-transform">
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.keywordsScore || 0)}`}>{analysis.keywordsScore || 0}%</div>
                              <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mt-1">Keywords</div>
                            </div>
                            
                            {/* Content Structure Score */}
                            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 transform hover:scale-105 transition-transform">
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.contentStructureScore || 0)}`}>{analysis.contentStructureScore || 0}%</div>
                              <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mt-1">Structure</div>
                            </div>

                            {/* Readability Score */}
                            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-sm border border-indigo-200 transform hover:scale-105 transition-transform">
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.readabilityScore || 0)}`}>{analysis.readabilityScore || 0}%</div>
                              <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mt-1">Readability</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            } catch (error) {
              console.error('Error rendering SEO analysis summary:', error);
              setRenderError(true);
              return (
                <Card className="overflow-hidden border-0 shadow-md rounded-xl bg-red-50 p-4">
                  <div className="flex items-center text-red-600 mb-2">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                    <p className="font-medium">Error displaying SEO analysis</p>
                  </div>
                  <p className="text-sm text-gray-600">There was a problem displaying the SEO analysis data. Please try analyzing again.</p>
                </Card>
              );
            }
          })()}
      
          {/* Detailed Analysis Display */}
          {analysis && !renderError && (() => {
            try {
              return (
                <div className="mb-6">
                  <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                        <DocumentTextIcon className="h-6 w-6 mr-2 text-indigo-600" />
                        Blog SEO Analysis Breakdown
                      </h3>
                      <div className="space-y-6">
                        {/* Title Analysis */}
                        <div className="p-5 border border-blue-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold text-blue-700 mb-3 border-b pb-2 border-blue-100">
                            Blog Title Analysis <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{analysis.titleScore}%</span>
                          </h4>
                          <p className="text-sm text-gray-700 mb-3">{analysis.titleAnalysis}</p>
                          {analysis.titleSuggestions && analysis.titleSuggestions.length > 0 && (
                            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                              <h5 className="text-sm font-semibold text-blue-800 mb-2">Title Suggestions:</h5>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
                                {analysis.titleSuggestions.map((suggestion, index) => (
                                  <li key={`title-sugg-${index}`} className="flex items-center justify-between group">
                                    <span className="pr-2">{suggestion}</span>
                                    <button
                                      type="button"
                                      className="text-white bg-blue-400 rounded-full p-1"
                                      onClick={(e) => applySuggestion('title', suggestion, e)}
                                      title="Apply this title"
                                    >
                                      <ArrowRightIcon className="h-4 w-4" />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Meta Description Analysis */}
                        <div className="p-5 border border-green-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold text-green-700 mb-3 border-b pb-2 border-green-100">
                            Meta Description Analysis <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{analysis.metaDescriptionScore}%</span>
                          </h4>
                          <p className="text-sm text-gray-700 mb-3">{analysis.metaDescriptionAnalysis}</p>
                          {analysis.metaDescriptionSuggestions && analysis.metaDescriptionSuggestions.length > 0 && (
                            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                              <h5 className="text-sm font-semibold text-green-800 mb-2">Description Suggestions:</h5>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
                                {analysis.metaDescriptionSuggestions.map((suggestion, index) => (
                                  <li key={`meta-sugg-${index}`} className="flex items-center justify-between group">
                                    <span className="pr-2">{suggestion}</span>
                                    <button
                                      type="button"
                                      className="text-white bg-green-400 rounded-full p-1"
                                      onClick={(e) => applySuggestion('metaDescription', suggestion, e)}
                                      title="Apply this description"
                                    >
                                      <ArrowRightIcon className="h-4 w-4" />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Keywords Analysis */}
                        <div className="p-5 border border-purple-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold text-purple-700 mb-3 border-b pb-2 border-purple-100">
                            Keywords Analysis <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{analysis.keywordsScore}%</span>
                          </h4>
                          <p className="text-sm text-gray-700 mb-3">{analysis.keywordsAnalysis}</p>
                          {analysis.recommendedKeywords && analysis.recommendedKeywords.length > 0 && (
                            <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                              <h5 className="text-sm font-semibold text-purple-800 mb-2">Recommended Keywords:</h5>
                              <div className="flex flex-wrap gap-2">
                                {analysis.recommendedKeywords.map((keyword, index) => (
                                  <span key={`kw-${index}`} className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-3 flex justify-between">
                                <Button
                                  text="Apply All Keywords"
                                  className="btn-sm btn-outline-purple"
                                  icon="Check"
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    applySuggestion('keywords', analysis.recommendedKeywords.join(', '), e);
                                  }}
                                />
                                <Button
                                  text="Get More Keywords"
                                  className="btn-sm btn-outline-purple"
                                  icon="Search"
                                  onClick={getKeywordSuggestions}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* URL Structure Analysis */}
                        <div className="p-5 border border-amber-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold text-amber-700 mb-3 border-b pb-2 border-amber-100">
                            URL Structure Analysis <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">{analysis.urlStructureScore}%</span>
                          </h4>
                          <p className="text-sm text-gray-700">{analysis.urlStructureAnalysis}</p>
                        </div>

                        {/* Content Structure Analysis */}
                        <div className="p-5 border border-indigo-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold text-indigo-700 mb-3 border-b pb-2 border-indigo-100">
                            Content Structure Analysis <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">{analysis.contentStructureScore}%</span>
                          </h4>
                          <p className="text-sm text-gray-700">{analysis.contentStructureRecommendations}</p>
                        </div>

                        {/* Content Quality Analysis */}
                        <div className="p-5 border border-blue-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold text-blue-700 mb-3 border-b pb-2 border-blue-100">Blog Content Quality Analysis</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center shadow-sm border border-blue-200">
                              <div className="text-2xl font-bold text-blue-700 mb-1">{analysis.contentScore || 0}%</div>
                              <div className="text-xs text-blue-600 font-medium">Content Score</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center shadow-sm border border-green-200">
                              <div className="text-2xl font-bold text-green-700 mb-1">{analysis.readabilityScore || 0}%</div>
                              <div className="text-xs text-green-600 font-medium">Readability Score</div>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg text-center shadow-sm border border-indigo-200">
                              <div className="text-2xl font-bold text-indigo-700 mb-1">{analysis.recommendedContentLength || 0}</div>
                              <div className="text-xs text-indigo-600 font-medium">Recommended Words</div>
                            </div>
                          </div>
                          {analysis.contentImprovementSuggestions && analysis.contentImprovementSuggestions.length > 0 && (
                            <div className="mt-2">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-semibold text-gray-700">Content Improvement Suggestions:</h5>
                                {/* <Button
                                  text={contentSuggestionLoading ? "Loading..." : "Get Content Ideas"}
                                  className="btn-sm btn-outline-indigo"
                                  icon="LightBulb"
                                  onClick={getContentSuggestions}
                                  disabled={contentSuggestionLoading}
                                /> */}
                              </div>
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-l-4 border-blue-400">
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 pl-2">
                                  {analysis.contentImprovementSuggestions.map((suggestion, index) => (
                                    <li key={`content-sugg-${index}`}>{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Keyword Density Analysis */}
                        {analysis.keywordDensity && (
                          <div className="p-5 border border-teal-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="font-semibold text-teal-700 mb-3 border-b pb-2 border-teal-100">Blog Keyword Analysis</h4>
                            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg shadow-inner">
                              <p className="text-sm text-teal-800 mb-3">{analysis.keywordDensity.analysis || "Analyzing keyword density in your content..."}</p>
                              
                              {analysis.keywordDensity.keywords && analysis.keywordDensity.keywords.length > 0 && (
                                <div className="mt-3">
                                  <h5 className="text-sm font-semibold text-teal-800 mb-2">Top Keywords in Your Content:</h5>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {analysis.keywordDensity.keywords.map((kw, idx) => (
                                      <div key={`density-${idx}`} className="flex justify-between bg-white p-2 rounded shadow-sm text-xs">
                                        <span className="font-medium text-gray-800">{kw.keyword}</span>
                                        <span className="text-teal-600">{kw.density}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Suggested Heading Structure */}
                        {analysis.suggestedHeadingStructure && analysis.suggestedHeadingStructure.length > 0 && (
                          <div className="p-5 border border-orange-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="font-semibold text-orange-700 mb-3 border-b pb-2 border-orange-100">Suggested Blog Structure</h4>
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg shadow-inner">
                              <p className="text-sm text-orange-800 mb-3">For better readability and SEO, consider structuring your blog with these headings:</p>
                              <ul className="space-y-3">
                                {analysis.suggestedHeadingStructure.map((heading, index) => (
                                  <li key={`heading-sugg-${index}`} className="text-sm flex">
                                    <span className={`font-bold uppercase ${
                                      heading.startsWith('H1:') ? 'text-red-700 bg-red-50' :
                                      heading.startsWith('H2:') ? 'text-orange-700 bg-orange-50' :
                                      heading.startsWith('H3:') ? 'text-yellow-700 bg-yellow-50' :
                                      'text-green-700 bg-green-50'
                                    } px-2 py-1 rounded mr-3 shadow-sm w-12 text-center`}>
                                      {heading.split(':')[0]}
                                    </span>
                                    <span className="text-gray-700 flex-grow">{heading.split(': ')[1]}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Additional Recommendations */}
                        {analysis.additionalRecommendations && analysis.additionalRecommendations.length > 0 && (
                          <div className="p-5 border border-purple-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="font-semibold text-purple-700 mb-3 border-b pb-2 border-purple-100">Additional Blog Recommendations</h4>
                            <ul className="space-y-2 bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg">
                              {analysis.additionalRecommendations.map((rec, index) => (
                                <li key={`add-rec-${index}`} className="flex items-center">
                                  <CheckCircleIcon className="h-4 w-4 text-purple-600 mr-3 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            } catch (error) {
              console.error('Error rendering SEO detailed analysis:', error);
              if (!renderError) setRenderError(true);
              return (
                <Card className="overflow-hidden border-0 shadow-md rounded-xl bg-red-50 p-4">
                  <div className="flex items-center text-red-600 mb-2">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                    <p className="font-medium">Error displaying detailed analysis</p>
                  </div>
                  <p className="text-sm text-gray-600">There was a problem displaying the detailed SEO analysis. Please try analyzing again.</p>
                </Card>
              );
            }
          })()}
        </div>
      ) : (
        <Card className="overflow-hidden border-0 shadow-xl rounded-xl bg-gradient-to-br from-white to-blue-50">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 shadow-lg mb-6">
              <BookOpenIcon className="h-8 w-8 text-white animate-pulse" />
            </div>
            <h3 className="mt-3 text-xl font-bold text-gray-800 mb-3">No Blog SEO Analysis Available</h3>
            <p className="mt-2 text-sm text-gray-600 mb-6 max-w-lg mx-auto">
              Click the "Analyze Blog SEO" button to perform an analysis on your blog content and metadata to improve search rankings and reader engagement.
            </p>
            <div className="mt-6">
              <Button
                text="Analyze Blog SEO"
                icon="ChartBar"
                onClick={runAnalysis}
                className="btn-primary bg-gradient-to-r from-indigo-500 to-purple-600 border-none shadow-lg hover:shadow-xl px-8 py-3 transform transition-transform hover:scale-105"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Keyword Suggestions Modal */}
      {showKeywords && keywordSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto border border-gray-100 animate-fadeIn">
            <div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Blog Keyword Suggestions
              </h3>
              <button 
                onClick={() => setShowKeywords(false)}
                className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                    Primary Keywords
                  </h4>
                  <div className="space-y-3">
                    {keywordSuggestions.primary_keywords?.map((keyword, index) => (
                      <div key={index} className="flex justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                        <span className="text-sm font-medium text-blue-800">{keyword.keyword}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full shadow-sm">
                            {keyword.search_volume}
                          </span>
                          <span className="text-xs px-2 py-1 bg-white text-gray-700 rounded-full shadow-sm border border-gray-200">
                            {keyword.difficulty_score}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="text-md font-semibold text-gray-800 mt-6 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                    Long-tail Keywords
                  </h4>
                  <div className="space-y-3">
                    {keywordSuggestions.long_tail_keywords?.map((keyword, index) => (
                      <div key={index} className="flex justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                        <span className="text-sm font-medium text-green-800">{keyword.keyword}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full shadow-sm">
                            {keyword.search_volume}
                          </span>
                          <span className="text-xs px-2 py-1 bg-white text-gray-700 rounded-full shadow-sm border border-gray-200">
                            {keyword.difficulty_score}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
                    Secondary Keywords
                  </h4>
                  <div className="space-y-3">
                    {keywordSuggestions.secondary_keywords?.map((keyword, index) => (
                      <div key={index} className="flex justify-between bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                        <span className="text-sm font-medium text-amber-800">{keyword.keyword}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full shadow-sm">
                            {keyword.search_volume}
                          </span>
                          <span className="text-xs px-2 py-1 bg-white text-gray-700 rounded-full shadow-sm border border-gray-200">
                            {keyword.difficulty_score}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-5 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-600" />
                  How to Use These Keywords in Your Blog
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Use primary keywords in title, intro paragraph, and headings
                  </li>
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Incorporate secondary keywords naturally throughout the content
                  </li>
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Use long-tail keywords for specific sections and subheadings
                  </li>
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Include keywords in image alt text and meta description
                  </li>
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Keep keyword density between 1-2% for primary keywords
                  </li>
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Keep writing natural for readers, not just for search engines
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button
                  text="Close"
                  className="btn-outline-primary bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 transform transition-transform hover:scale-105"
                  onClick={() => setShowKeywords(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Suggestions Modal */}
      {showContentSuggestions && contentSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto border border-gray-100 animate-fadeIn">
            <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-teal-600 rounded-t-xl flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <PencilIcon className="h-5 w-5 mr-2" />
                Blog Content Enhancement Suggestions
              </h3>
              <button 
                onClick={() => setShowContentSuggestions(false)}
                className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {contentSuggestions.sections && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                    Suggested Sections to Include
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200 shadow-inner">
                    <ul className="space-y-3">
                      {contentSuggestions.sections.map((section, index) => (
                        <li key={`section-${index}`} className="flex items-start">
                          <span className="bg-white text-blue-600 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5 shadow-sm">
                            {index + 1}
                          </span>
                          <div>
                            <span className="text-blue-800 font-medium">{section.title}</span>
                            <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {contentSuggestions.improvements && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                    Content Improvement Ideas
                  </h4>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 shadow-inner">
                    <ul className="space-y-2">
                      {contentSuggestions.improvements.map((item, index) => (
                        <li key={`improve-${index}`} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {contentSuggestions.examples && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
                    Writing Examples & Inspiration
                  </h4>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200 shadow-inner">
                    {contentSuggestions.examples.map((example, index) => (
                      <div key={`example-${index}`} className="mb-4 last:mb-0">
                        <div className="font-medium text-purple-800 mb-1">{example.title}</div>
                        <div className="text-sm text-gray-600 bg-white p-3 rounded border border-purple-100 shadow-sm">
                          {example.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <Button
                  text="Close"
                  className="btn-outline-primary bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 transform transition-transform hover:scale-105"
                  onClick={() => setShowContentSuggestions(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Outliner Modal */}
      {showBlogOutliner && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-gray-100 animate-fadeIn">
            <div className="p-4 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Blog Content Outliner
              </h3>
              <button 
                onClick={() => setShowBlogOutliner(false)}
                className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {!blogOutline && (
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 mb-4 border border-primary-100">
                    <h4 className="font-medium text-primary-800 mb-3">Create SEO-Optimized Blog Outline</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Generate a structured outline for your blog post to improve organization and SEO performance. 
                      This will help you create comprehensive, well-structured content that covers all key aspects of your topic.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Blog Category  
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="e.g., Marketing, Technology, Health"
                          value={pageData?.categoryName || outlinerCategory || ''}
                          onChange={(e) => setOutlinerCategory(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Audience
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={outlinerTarget}
                          onChange={(e) => setOutlinerTarget(e.target.value)}
                        >
                          <option value="beginner">Beginners</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="expert">Experts/Advanced</option>
                          <option value="general">General Audience</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Keywords (comma separated)
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., digital marketing, SEO strategy, content marketing"
                        value={outlinerKeywords || pageData?.metaKeywords || ''}
                        onChange={(e) => setOutlinerKeywords(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        text={blogOutlinerLoading ? "Generating..." : "Generate Blog Outline"}
                        className="btn-primary bg-gradient-to-r from-primary-500 to-primary-600"
                        icon="FileText"
                        onClick={generateBlogOutline}
                        disabled={blogOutlinerLoading || !pageData?.title}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {blogOutlinerLoading && (
                <div className="flex justify-center items-center py-12">
                  <div className="loader animate-spin border-4 border-t-4 rounded-full h-12 w-12 border-primary-500 border-t-transparent"></div>
                  <span className="ml-3 text-primary-600 font-medium">Generating outline...</span>
                </div>
              )}
              
              {blogOutline && (
                <div>
                  <div className="bg-white border border-green-200 rounded-lg shadow-sm p-5 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 border-b border-green-100 pb-2">
                      {blogOutline.title || pageData.title}
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium text-primary-700">Word Count Target: </span>
                      {blogOutline.wordCountTarget || "1000-1500"} words
                      {blogOutline.estimatedReadingTime && (
                        <span className="ml-3 text-gray-500">
                          (~{blogOutline.estimatedReadingTime} min read)
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-primary-700 mb-2">Introduction</h4>
                      <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 text-sm text-gray-700">
                        {blogOutline.introduction || "Create a compelling introduction that hooks the reader and introduces the topic."}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-green-700 mb-2">Main Sections</h4>
                      <div className="space-y-3">
                        {blogOutline.sections && blogOutline.sections.map((section, index) => (
                          <div key={`section-${index}`} className="bg-white border border-primary-100 rounded-lg p-3 shadow-sm">
                            <div className="font-medium text-primary-800 mb-1">{section.heading}</div>
                            <div className="text-sm text-gray-600 mb-2">{section.description}</div>
                            
                            {section.subheadings && section.subheadings.length > 0 && (
                              <div className="pl-4 border-l-2 border-primary-200 mt-2">
                                <div className="text-xs font-medium text-gray-500 mb-1">Subsections:</div>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {section.subheadings.map((subheading, subIndex) => (
                                    <li key={`sub-${index}-${subIndex}`}>{subheading}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {section.keypoints && section.keypoints.length > 0 && (
                              <div className="pl-4 border-l-2 border-blue-200 mt-2">
                                <div className="text-xs font-medium text-gray-500 mb-1">Key Points:</div>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {section.keypoints.map((point, pointIndex) => (
                                    <li key={`point-${index}-${pointIndex}`}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-primary-700 mb-2">Conclusion</h4>
                      <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 text-sm text-gray-700">
                        {blogOutline.conclusion || "Write a compelling conclusion that summarizes key points and includes a clear call-to-action."}
                      </div>
                    </div>
                    
                    {blogOutline.faqs && blogOutline.faqs.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-primary-700 mb-2">FAQs to Include</h4>
                        <div className="space-y-2">
                          {blogOutline.faqs.map((faq, index) => (
                            <div key={`faq-${index}`} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                              <div className="font-medium text-blue-800 mb-1">Q: {faq.question}</div>
                              <div className="text-sm text-gray-600">A: {faq.answer}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {blogOutline.seoTips && blogOutline.seoTips.length > 0 && (
                      <div>
                        <h4 className="font-medium text-primary-700 mb-2">SEO Tips for This Article</h4>
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {blogOutline.seoTips.map((tip, index) => (
                              <li key={`tip-${index}`} className="text-purple-800">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      text="Generate New Outline"
                      className="btn-outline-primary"
                      icon="RefreshCw"
                      onClick={() => setBlogOutline(null)}
                    />
                    <Button
                      text="Close"
                      className="btn-outline-primary"
                      onClick={() => setShowBlogOutliner(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSeoAnalyzer; 