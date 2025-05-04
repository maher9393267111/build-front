'use client';
import { useState, useEffect } from 'react';
import { analyzeSEO, suggestKeywords } from '@services/api';
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
  DocumentTextIcon
} from '@heroicons/react/24/solid';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import SeoScoreWidget from '@components/SEO/SeoScoreWidget';
import Icon from '@components/ui/Icon';

const SeoAnalyzer = ({ analysis, pageData, onUpdateSuggestions }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [keywordSuggestions, setKeywordSuggestions] = useState(null);
  const [renderError, setRenderError] = useState(false);

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
    
    // --- Start: Extract content from pageData --- 
    let extractedContent = '';
    if (pageData.blocks && pageData.blocks.length > 0) {
      pageData.blocks.forEach(block => {
        if (block.type === 'content' && block.content?.html) {
          // Strip HTML tags for plain text analysis
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = block.content.html;
          extractedContent += tempDiv.textContent + '\n\n'; 
        } else if (block.content?.description) {
          extractedContent += block.content.description + '\n\n';
        } else if (block.content?.heading) {
          extractedContent += block.content.heading + '\n';
        } 
      });
    } 
    const contentToAnalyze = extractedContent.trim();
    // --- End: Extract content --- 

    try {
      // Pass both pageData and the extracted content
      const response = await analyzeSEO(pageData, contentToAnalyze); 
      console.log('Combined Analysis Response:', response);
      
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
      console.error('Error analyzing SEO:', error);
      toast.error('Failed to analyze SEO data');
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
        industry: 'General' // Could be made customizable
      });
      console.log('Keyword Suggestions Response:', response); // Keep this log for debugging
      if (response && response.success && response.keywords) {
        setKeywordSuggestions(response.keywords); // Store the nested keywords object
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
    <div className="seo-analyzer bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md border-l-4 border-primary-600">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
          <PresentationChartLineIcon className="h-8 w-8 mr-3 text-primary-600" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">SEO Analysis</span>
        </h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* <Button
            text={keywordLoading ? "Loading..." : "Keyword Suggestions"}
            icon="Search"
            onClick={getKeywordSuggestions}
                className="btn-primary bg-gradient-to-r from-primary-600 to-primary-700 border-none shadow-lg hover:shadow-xl transform transition-transform hover:scale-105"
            disabled={keywordLoading}
          /> */}
          <Button
            text={analyzing ? "Analyzing..." : "Analyze SEO"}
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
                          <h3 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">SEO Analysis Summary</h3>
                          <p className="text-sm text-gray-600 mb-5 italic">{analysis.summary || "Here's an overview of your page's SEO performance."}</p>
                          
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
                        Detailed Analysis Breakdown
                      </h3>
                      <div className="space-y-6">
                        {/* Title Analysis */}
                        <div className="p-5 border border-blue-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold text-blue-700 mb-3 border-b pb-2 border-blue-100">
                            Title Analysis <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{analysis.titleScore}%</span>
                          </h4>
                          <p className="text-sm text-gray-700 mb-3">{analysis.titleAnalysis}</p>
                          {analysis.titleSuggestions && analysis.titleSuggestions.length > 0 && (
                            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                              <h5 className="text-sm font-semibold text-blue-800 mb-2">Suggestions:</h5>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
                                {analysis.titleSuggestions.map((suggestion, index) => (
                                  <li key={`title-sugg-${index}`}>{suggestion}</li>
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
                              <h5 className="text-sm font-semibold text-green-800 mb-2">Suggestions:</h5>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
                                {analysis.metaDescriptionSuggestions.map((suggestion, index) => (
                                  <li key={`meta-sugg-${index}`}>{suggestion}</li>
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
                          <h4 className="font-semibold text-blue-700 mb-3 border-b pb-2 border-blue-100">Content Quality Analysis</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
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
                        </div>

                        {/* Keyword Density Analysis */}
                        {analysis.keywordDensity && analysis.keywordDensity.analysis && (
                          <div className="p-5 border border-teal-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="font-semibold text-teal-700 mb-3 border-b pb-2 border-teal-100">Content Keyword Analysis</h4>
                            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg shadow-inner">
                              <p className="text-sm text-teal-800">{analysis.keywordDensity.analysis}</p>
                            </div>
                          </div>
                        )}

                        {/* Suggested Heading Structure */}
                        {analysis.suggestedHeadingStructure && Object.keys(analysis.suggestedHeadingStructure).length > 0 && (
                          <div className="p-5 border border-orange-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="font-semibold text-orange-700 mb-3 border-b pb-2 border-orange-100">Suggested Content Headings</h4>
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg shadow-inner">
                              <ul className="space-y-2">
                                {Object.entries(analysis.suggestedHeadingStructure).map(([tag, content], index) => (
                                  <li key={`heading-sugg-${index}`} className="text-sm flex">
                                    <span className="font-bold uppercase text-orange-700 bg-white px-2 py-1 rounded mr-2 shadow-sm">{tag}:</span>
                                    <span className="text-gray-700">{content}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Content Improvement Suggestions */}
                        {analysis.contentImprovementSuggestions && analysis.contentImprovementSuggestions.length > 0 && (
                          <div className="p-5 border border-red-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="font-semibold text-red-700 mb-3 border-b pb-2 border-red-100">Content Improvement Suggestions</h4>
                            <ul className="space-y-3 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg">
                              {analysis.contentImprovementSuggestions.map((suggestion, index) => (
                                <li key={`content-sugg-${index}`} className="flex items-start">
                                  <div className="bg-white p-1 rounded-full shadow mr-2 flex-shrink-0">
                                    <Icon icon="ArrowRight" className="h-4 w-4 text-red-600" />
                                  </div>
                                  <span className="text-sm text-gray-700">{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Additional Recommendations */}
                        {analysis.additionalRecommendations && analysis.additionalRecommendations.length > 0 && (
                          <div className="p-5 border border-purple-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="font-semibold text-purple-700 mb-3 border-b pb-2 border-purple-100">Additional Recommendations</h4>
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
              <MagnifyingGlassIcon className="h-8 w-8 text-white animate-pulse" />
            </div>
            <h3 className="mt-3 text-xl font-bold text-gray-800 mb-3">No SEO Analysis Available</h3>
            <p className="mt-2 text-sm text-gray-600 mb-6 max-w-lg mx-auto">
              Click the "Analyze SEO" button to perform an analysis on your page content and metadata to improve your search rankings.
            </p>
            <div className="mt-6">
              <Button
                text="Analyze SEO"
                icon="Check"
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
                Keyword Suggestions
              </h3>
              <button 
                onClick={() => setShowKeywords(false)}
                className="text-white hovetext-gray-200 bg-white bg-opacity-20 rounded-full p-1"
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
                  How to Use These Keywords
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Include primary keywords in titles, headings, and main content
                  </li>
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Use secondary keywords in subheadings and throughout the content
                  </li>
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Incorporate long-tail keywords naturally within paragraphs
                  </li>
                  <li className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                    Avoid keyword stuffing, which can negatively impact SEO
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
    </div>
  );
};

export default SeoAnalyzer; 