import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function RadarScoresChart({ data }) {
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
                type: 'radar',
                data: {
                    labels: data.map(item => item.category),
                    datasets: [{
                        label: 'Performance Score',
                        data: data.map(item => item.score),
                        backgroundColor: 'rgba(147, 51, 234, 0.2)',
                        borderColor: 'rgba(147, 51, 234, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(147, 51, 234, 1)',
                        pointRadius: 5,
                        pointHoverRadius: 7,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
                            angleLines: {
                                color: 'rgba(0, 0, 0, 0.1)',
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
                                        `Score: ${context.parsed.r}`,
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
        <div className="w-full h-64 flex items-center justify-center">
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
