import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function CategoryScoresChart({ data }) {
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
                type: 'bar',
                data: {
                    labels: data.map(item => item.category),
                    datasets: [{
                        label: 'Score',
                        data: data.map(item => item.score),
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
                        borderRadius: 8,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const dataItem = data[context.dataIndex];
                                    return [
                                        `Score: ${context.parsed.y}`,
                                        `Weight: ${dataItem.weight}%`,
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
        <div className="w-full h-64">
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
