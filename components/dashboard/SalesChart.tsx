"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { TrendingUp } from "lucide-react";

interface SalesChartProps {
  data: { month: string; amount: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.month),
        datasets: [
          {
            label: "فروش (تومان)",
            data: data.map((item) => item.amount),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y === null ? 0 : context.parsed.y;
                return new Intl.NumberFormat("fa-IR", {
                  style: "currency",
                  currency: "IRR",
                  maximumFractionDigits: 0,
                }).format(value);
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                if (typeof value === "number" && value >= 1000000) {
                  return (value / 1000000).toFixed(0) + "M";
                }
                return value.toLocaleString("fa-IR");
              },
              font: {
                size: 11,
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            نمودار فروش ماهانه
          </h3>
          <p className="text-sm text-gray-500">۱۲ ماه اخیر</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">روند صعودی</span>
        </div>
      </div>
      <div className="h-80">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
