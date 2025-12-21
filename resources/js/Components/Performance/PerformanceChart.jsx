import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function PerformanceChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy existing chart
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Create new chart
            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.map(item => item.category),
                    datasets: [{
                        label: 'Weight Distribution',
                        data: data.map(item => item.weight),
                        backgroundColor: [
                            'rgba(147, 51, 234, 0.8)',  // Purple
                            'rgba(236, 72, 153, 0.8)',  // Pink
                            'rgba(59, 130, 246, 0.8)',  // Blue
                            'rgba(16, 185, 129, 0.8)',  // Green
                            'rgba(245, 158, 11, 0.8)',  // Yellow
                            'rgba(239, 68, 68, 0.8)',   // Red
                        ],
                        borderColor: [
                            'rgba(147, 51, 234, 1)',
                            'rgba(236, 72, 153, 1)',
                            'rgba(59, 130, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(239, 68, 68, 1)',
                        ],
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const dataItem = data[context.dataIndex];
                                    return [
                                        `${label}: ${value}%`,
                                        `Score: ${dataItem.score}`,
                                        `Contribution: ${dataItem.weighted_score.toFixed(2)}`
                                    ];
                                }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return (
        <div className="w-full h-64 flex items-center justify-center">
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
