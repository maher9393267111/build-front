'use client';
import { useState } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  XMarkIcon,
  BookOpenIcon,
  PencilIcon,
  DocumentTextIcon,
  LightBulbIcon
} from '@heroicons/react/24/solid';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';

const BlogSeoTaskList = ({ tasks = [], onTaskComplete }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showContentTips, setShowContentTips] = useState(false);
  
  const handleTaskToggle = (taskId) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        if (onTaskComplete) {
          onTaskComplete(taskId);
        }
        return [...prev, taskId];
      }
    });
  };
  
  const handleExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };
  
  // Group tasks by category
  const groupedTasks = {
    title: tasks.filter(task => task.category === 'title'),
    meta: tasks.filter(task => task.category === 'meta'),
    keywords: tasks.filter(task => task.category === 'keywords'),
    content: tasks.filter(task => task.category === 'content'),
    structure: tasks.filter(task => task.category === 'structure'),
    other: tasks.filter(task => !['title', 'meta', 'keywords', 'content', 'structure'].includes(task.category))
  };
  
  // Get task priority icon
  const getTaskIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-600" />;
      case 'high':
        return <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <InformationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'low':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Get priority label
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm border border-red-200">Critical</span>;
      case 'high':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 shadow-sm border border-orange-200">High Priority</span>;
      case 'medium':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-sm border border-yellow-200">Medium Priority</span>;
      case 'low':
      default:
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm border border-blue-200">Low Priority</span>;
    }
  };
  
  // Get category icon and color
  const getCategoryInfo = (category) => {
    switch (category) {
      case 'title':
        return { 
          icon: <DocumentTextIcon className="h-5 w-5 text-blue-600" />,
          color: 'blue',
          label: 'Title Optimization'
        };
      case 'meta':
        return { 
          icon: <BookOpenIcon className="h-5 w-5 text-green-600" />,
          color: 'green',
          label: 'Meta Data'
        };
      case 'keywords':
        return { 
          icon: <InformationCircleIcon className="h-5 w-5 text-purple-600" />,
          color: 'purple',
          label: 'Keyword Optimization'
        };
      case 'content':
        return { 
          icon: <PencilIcon className="h-5 w-5 text-orange-600" />,
          color: 'orange',
          label: 'Content Quality'
        };
      case 'structure':
        return { 
          icon: <DocumentTextIcon className="h-5 w-5 text-indigo-600" />,
          color: 'indigo',
          label: 'Content Structure'
        };
      default:
        return { 
          icon: <LightBulbIcon className="h-5 w-5 text-yellow-600" />,
          color: 'yellow',
          label: 'Other Improvements'
        };
    }
  };
  
  // Get group heading styling based on category
  const getGroupHeadingStyle = (category) => {
    const { color } = getCategoryInfo(category);
    return `text-${color}-700 border-b border-${color}-200 pb-2`;
  };
  
  const renderTaskGroup = (tasksArray, category) => {
    if (tasksArray.length === 0) return null;
    
    const { icon, label } = getCategoryInfo(category);
    
    return (
      <div className="mb-6">
        <h3 className={`text-sm font-semibold ${getGroupHeadingStyle(category)} mb-3 flex items-center`}>
          {icon}
          <span className="ml-2">{label} Tasks</span>
        </h3>
        <div className="space-y-3">
          {tasksArray.map(task => (
            <div 
              key={task.id} 
              className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                completedTasks.includes(task.id) 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div 
                className="flex items-start p-4 cursor-pointer"
                onClick={() => handleExpand(task.id)}
              >
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className={`p-1.5 rounded-full ${
                    completedTasks.includes(task.id) 
                      ? 'bg-green-100' 
                      : task.priority === 'critical' ? 'bg-red-100' : 
                        task.priority === 'high' ? 'bg-orange-100' : 
                        task.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {completedTasks.includes(task.id) 
                      ? <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      : getTaskIcon(task.priority)}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      completedTasks.includes(task.id) 
                        ? 'text-green-800 line-through' 
                        : 'text-gray-800'
                    }`}>{task.title}</h4>
                    {getPriorityLabel(task.priority)}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className={`rounded-full p-1 ${expandedTask === task.id ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    {expandedTask === task.id ? (
                      <ChevronUpIcon className={`h-4 w-4 ${expandedTask === task.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    ) : (
                      <ChevronDownIcon className={`h-4 w-4 ${expandedTask === task.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedTask === task.id && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  {task.recommendation && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-l-4 border-blue-400 shadow-sm">
                      <span className="font-medium text-blue-800 text-sm">Recommendation: </span>
                      <span className="text-sm text-gray-700">{task.recommendation}</span>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskToggle(task.id);
                      }}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm transform transition-transform hover:scale-105 ${
                        completedTasks.includes(task.id) 
                          ? 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                      }`}
                    >
                      {completedTasks.includes(task.id) ? (
                        <>
                          <XMarkIcon className="h-3 w-3 mr-1" />
                          Mark Incomplete
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Mark Complete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3"></div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-2 text-indigo-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Blog SEO Improvement Tasks</span>
            </h2>
            <div className="flex items-center">
              <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 mr-3">
                <span className="text-sm text-gray-600 mr-3 font-medium">
                  {completedTasks.length} of {tasks.length} completed
                </span>
                <div className="bg-gray-200 h-3 w-28 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <Button
                text="Content Writing Tips"
                className="btn-outline-primary btn-sm"
                icon="LightBulb"
                onClick={() => setShowContentTips(!showContentTips)}
              />
            </div>
          </div>
          
          {renderTaskGroup(groupedTasks.title, 'title')}
          {renderTaskGroup(groupedTasks.meta, 'meta')}
          {renderTaskGroup(groupedTasks.keywords, 'keywords')}
          {renderTaskGroup(groupedTasks.content, 'content')}
          {renderTaskGroup(groupedTasks.structure, 'structure')}
          {renderTaskGroup(groupedTasks.other, 'other')}
          
          {tasks.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-white to-green-50 rounded-xl border border-green-100 shadow-md">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg mb-4">
                <CheckCircleIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">No Blog SEO issues found</h3>
              <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                Great job! Your blog has no SEO issues to fix. Your content is well-optimized for search engines and readers.
              </p>
            </div>
          )}
          
          {/* Content Writing Tips */}
          {showContentTips && (
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
                  <PencilIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  SEO-Optimized Blog Writing Tips
                </h3>
                <Button
                  text=""
                  className="btn-icon btn-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-0"
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={() => setShowContentTips(false)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center mr-2">1</span>
                    Create a Compelling Title
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-8">
                    <li>Use numbers (e.g., "7 Ways to..." or "10 Tips for...")</li>
                    <li>Include your primary keyword near the beginning</li>
                    <li>Create a sense of urgency or curiosity</li>
                    <li>Keep it under 60 characters for search results</li>
                    <li>Use power words (ultimate, essential, proven, etc.)</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center mr-2">2</span>
                    Craft an Engaging Introduction
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-8">
                    <li>Start with a hook (question, statistic, story)</li>
                    <li>Identify the reader's pain point or challenge</li>
                    <li>Include your primary keyword in first 100 words</li>
                    <li>Briefly explain what the article will cover</li>
                    <li>Create a clear promise or value proposition</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center mr-2">3</span>
                    Optimize Content Structure
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-8">
                    <li>Use proper heading hierarchy (H2, H3, H4)</li>
                    <li>Include keywords in H2 headings</li>
                    <li>Keep paragraphs short (3-4 sentences max)</li>
                    <li>Use bullet points and numbered lists</li>
                    <li>Include descriptive subheadings for scannable content</li>
                    <li>Add transition sentences between sections</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center mr-2">4</span>
                    Enhance Content Quality
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-8">
                    <li>Aim for 1,500+ words for comprehensive posts</li>
                    <li>Include data, statistics, and research to back claims</li>
                    <li>Use examples, case studies, and stories</li>
                    <li>Add visual content (images, infographics, videos)</li>
                    <li>Include expert quotes or opinions</li>
                    <li>Address common questions and objections</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center mr-2">5</span>
                    Strategic Keyword Usage
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-8">
                    <li>Use primary keyword in title, introduction, and conclusion</li>
                    <li>Include LSI keywords and synonyms throughout content</li>
                    <li>Maintain 1-2% keyword density (don't overdo it)</li>
                    <li>Use keywords naturally in image alt text</li>
                    <li>Include long-tail keywords for specific sections</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center mr-2">6</span>
                    Optimize for Readability
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-8">
                    <li>Write at a 6th-8th grade reading level</li>
                    <li>Use short sentences and paragraphs</li>
                    <li>Break up text with headings, lists, and images</li>
                    <li>Use active voice over passive voice</li>
                    <li>Include white space for visual breathing room</li>
                    <li>Format key points with bold or italics</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center mr-2">7</span>
                    Create a Strong Conclusion
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-8">
                    <li>Summarize key points and takeaways</li>
                    <li>Restate your primary keyword</li>
                    <li>Include a clear call-to-action</li>
                    <li>Ask an engaging question to encourage comments</li>
                    <li>Suggest related content or next steps</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center mr-2">8</span>
                    Internal & External Linking
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-8">
                    <li>Include 3-5 internal links to your other content</li>
                    <li>Link to 2-3 authoritative external sources</li>
                    <li>Use descriptive, keyword-rich anchor text</li>
                    <li>Avoid generic anchor text ("click here")</li>
                    <li>Link to relevant, high-quality pages</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BlogSeoTaskList; 