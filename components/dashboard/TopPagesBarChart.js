'use client';
import Card from '@components/ui/Card';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TopPagesBarChart = ({ data, isLoading, title = "Top Visited Pages (Chart)" }) => {
    if (isLoading) {
        return (
            <Card title={title}>
                <p className="text-center py-10">Loading chart data...</p>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card title={title}>
                <p className="text-center py-10">No page view data available for chart.</p>
            </Card>
        );
    }

    const chartData = {
        labels: data.map(page => page.path.length > 25 ? `${page.path.substring(0, 22)}...` : page.path),
        datasets: [
            {
                label: 'Views',
                data: data.map(page => page.views),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y', // Horizontal bar chart for better readability of page paths
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const originalLabel = data[context.dataIndex]?.path || context.label;
                        return `${originalLabel}: ${context.raw} views`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Views'
                }
            },
            y: {
                ticks: {
                    // autoSkip: false, // Consider if labels overlap too much
                }
            }
        },
    };

    return (
        <Card title={title}>
            <div style={{ height: '400px' }}>
                <Bar options={options} data={chartData} />
            </div>
        </Card>
    );
};

export default TopPagesBarChart; 