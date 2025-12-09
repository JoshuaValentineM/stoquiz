import React, { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import type { Candle } from '../types'

interface CandlestickChartProps {
  data: Candle[]
  width?: number
  height?: number
  symbol?: string
}

export function CandlestickChart({
  data,
  width = 800,
  height = 400,
  symbol = 'Stock'
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return

    // Clean up any existing chart
    if (chartRef.current) {
      console.log('🗑️ Removing existing chart')
      chartRef.current.remove()
      chartRef.current = null
    }

    // Small delay to ensure container is rendered and has proper dimensions
    const initializeChart = () => {
      if (!chartContainerRef.current) return

      // Clear any existing content
      chartContainerRef.current.innerHTML = ''

      // Get the actual container width
      const containerWidth = chartContainerRef.current.clientWidth || width

      console.log('📊 Initializing chart with container width:', containerWidth)

      // Create chart with responsive dimensions
      const chart = createChart(chartContainerRef.current, {
        width: containerWidth,
        height,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        crosshair: {
          mode: 1,
        },
        timeScale: {
          borderColor: '#cccccc',
        },
        rightPriceScale: {
          borderColor: '#cccccc',
        },
      })

      // Add candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#10b981',
        wickDownColor: '#ef4444',
        wickUpColor: '#10b981',
      })

      // Set data
      candlestickSeries.setData(data)

      // Fit content
      chart.timeScale().fitContent()

      // Store chart reference
      chartRef.current = chart

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          const containerWidth = chartContainerRef.current.clientWidth
          console.log('📊 Resizing chart to width:', containerWidth)
          chartRef.current.applyOptions({ width: containerWidth })
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (chartRef.current) {
          chartRef.current.remove()
          chartRef.current = null
        }
      }
    }

    // Small delay to ensure container dimensions are correct
    const timer = setTimeout(initializeChart, 100)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [data, width, height, symbol])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No chart data available</p>
      </div>
    )
  }

  return (
    <div className="chart-container w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {symbol} - {data.length} days
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
            <span>Up</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-sm mr-2"></div>
            <span>Down</span>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" style={{ minHeight: `${height}px` }} />
    </div>
  )
}