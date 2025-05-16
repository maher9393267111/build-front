'use client'
import Card from '@components/ui/Card'
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
)

const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            display: true,
        },
    },
    scales: {
        x: {
            grid: {
                display: true,
                drawBorder: true,
            },
        },
        y: {
            grid: {
                display: true,
                drawBorder: true,
            },
            beginAtZero: true,
        },
    },
}

export default function LineChart({ chartData, chartOptions, title = "Chart", isLoading }) {
    if (isLoading) {
        return (
            <Card title={title}>
                <p className="text-center py-10">Loading chart data...</p>
            </Card>
        );
    }

    if (!chartData || !chartData.datasets || chartData.datasets.length === 0 || chartData.datasets.every(ds => ds.data.length === 0)) {
        return (
            <Card title={title}>
                <p className="text-center py-10">No data available for the chart.</p>
            </Card>
        );
    }

    const optionsToUse = { ...defaultOptions, ...chartOptions };

    return (
        <>
            <Card title={title}>
                <div style={{ height: '350px' }}> {/* Ensure consistent height */}
                    <Line options={optionsToUse} data={chartData} />
                </div>
            </Card>
        </>
    )
}
