'use client';
import { useState } from 'react';
import Card from '@components/ui/Card';
import LineChart from '@components/dashboard/LineChart';
import { getFormSubmissionStats } from '@services/api';
import { useQuery } from 'react-query';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import PaginationDynamic from '@components/elements/PaginationDynamic';
import { InboxStackIcon, ClockIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const FormSubmissionCharts = ({ initialData }) => {
  const [recentSubmissionsPage, setRecentSubmissionsPage] = useState(1);
  const recentSubmissionsLimit = 3; // Or make this configurable

  const { data: stats, isLoading, error, isFetching } = useQuery(
    ['formSubmissionStats', recentSubmissionsPage, recentSubmissionsLimit],
    () => getFormSubmissionStats({ page: recentSubmissionsPage, limit: recentSubmissionsLimit }),
    {
      initialData: initialData && Object.keys(initialData).length > 0 ? initialData : undefined,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );
  
  const handleRecentSubmissionsPageChange = (page) => {
    setRecentSubmissionsPage(page);
  };

  if (isLoading && !stats) return <div className="text-center py-10">Loading analytics...</div>;
  if (error) return <div className="text-red-500">Error loading analytics: {error.message}</div>;
  
  // Format data for status distribution chart
  const statusDistributionData = {
    labels: stats?.submissionsByStatus?.map(item => item.status.charAt(0).toUpperCase() + item.status.slice(1)) || [],
    datasets: [
      {
        data: stats?.submissionsByStatus?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue for new
          'rgba(16, 185, 129, 0.8)',  // green for processed
          'rgba(107, 114, 128, 0.8)',  // gray for closed
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(107, 114, 128)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Format data for daily trend chart
  const dailyTrendData = {
    labels: stats?.dailyTrend?.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Total',
        data: stats?.dailyTrend?.map(d => d.total) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.1,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'New',
        data: stats?.dailyTrend?.map(d => d.new) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        borderDash: [5, 5],
        yAxisID: 'y1',
      },
      {
        label: 'Processed',
        data: stats?.dailyTrend?.map(d => d.processed) || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
        borderDash: [5, 5],
        yAxisID: 'y1',
      },
      {
        label: 'Closed',
        data: stats?.dailyTrend?.map(d => d.closed) || [],
        borderColor: 'rgb(107, 114, 128)',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        tension: 0.1,
        borderDash: [5, 5],
        yAxisID: 'y1',
      },
    ],
  };
  
  const dailyTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
        }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total Submissions'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'By Status'
        },
        ticks: {
            precision: 0
        }
      },
      x: {
        title: {
            display: true,
            text: 'Date (Last 30 Days)'
        },
        ticks: {
            maxTicksLimit: 15
        }
      }
    },
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '65%',
  };

  const StatCard = ({ title, value, description, icon: Icon, iconColor }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        // Add more colors if needed
    };

    return (
        <Card className="overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
                        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                    </div>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colorClasses[iconColor]} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>
        </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Submissions"
          value={stats?.totalSubmissions || 0}
          description="All time"
          icon={InboxStackIcon}
          iconColor="blue"
        />
        <StatCard
          title="Today's Submissions"
          value={stats?.todaySubmissions || 0}
          description="Last 24 hours"
          icon={ClockIcon}
          iconColor="green"
        />
        <StatCard
          title="Completion Rate"
          value={`${
            stats?.submissionsByStatus?.find(s => s.status === 'closed')?.count && stats?.totalSubmissions > 0
              ? Math.round((stats.submissionsByStatus.find(s => s.status === 'closed').count / stats.totalSubmissions) * 100)
              : 0
          }%`}
          description="Processed vs Total"
          icon={CheckBadgeIcon}
          iconColor="purple"
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Submission Trends (30 Days)">
            <div className="p-4" style={{ height: '400px' }}>
              <LineChart 
                chartData={dailyTrendData} 
                chartOptions={dailyTrendOptions} 
                isLoading={isLoading && !stats} 
              />
            </div>
          </Card>
        </div>
        <div>
          <Card title="Submission Status Distribution">
            <div className="p-4" style={{ height: '400px' }}>
              {(isLoading && !stats) ? <p className="text-center py-10">Loading chart...</p> : stats?.submissionsByStatus?.length > 0 ?
                <Doughnut data={statusDistributionData} options={statusChartOptions} />
                : <p className="text-center py-10">No status data available.</p>
              }
            </div>
          </Card>
        </div>
      </div>
      
      {/* Recent Submissions */}
      <Card title="Recent Submissions">
        {isFetching && !stats?.recentSubmissions?.data?.length ? (
            <p className="text-center py-4">Loading recent submissions...</p>
        ) : error ? (
            <p className="text-center text-red-500 py-4">{error.message}</p>
        ) : stats?.recentSubmissions?.data?.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentSubmissions.data.map(submission => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{submission.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.form.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${submission.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                            submission.status === 'processed' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {stats.recentSubmissions.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <PaginationDynamic
                        currentPage={stats.recentSubmissions.currentPage}
                        totalPages={stats.recentSubmissions.totalPages}
                        onPageChange={handleRecentSubmissionsPageChange}
                    />
                </div>
            )}
          </>
        ) : (
          <p className="text-center py-4">No recent submissions found.</p>
        )}
      </Card>
    </div>
  );
};

export default FormSubmissionCharts; 