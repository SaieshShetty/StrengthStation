import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Calendar, TrendingUp, Weight, Timer, Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/card';

const ProgressTracker = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('weight');
  
  // Sample data - replace with actual API call
  const progressData = [
    { date: '2024-02-01', weight: 80, reps: 12, distance: 5, duration: 45, calories: 400 },
    { date: '2024-02-02', weight: 81, reps: 15, distance: 6, duration: 50, calories: 450 },
    { date: '2024-02-03', weight: 80.5, reps: 14, distance: 5.5, duration: 48, calories: 420 },
    { date: '2024-02-04', weight: 80.2, reps: 16, distance: 6.2, duration: 55, calories: 480 },
    { date: '2024-02-05', weight: 79.8, reps: 18, distance: 6.5, duration: 60, calories: 500 },
    { date: '2024-02-06', weight: 79.5, reps: 20, distance: 7, duration: 65, calories: 550 },
    { date: '2024-02-07', weight: 79.2, reps: 22, distance: 7.5, duration: 70, calories: 600 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const metrics = {
    weight: { icon: Weight, color: '#0088FE', unit: 'kg' },
    reps: { icon: TrendingUp, color: '#00C49F', unit: 'reps' },
    distance: { icon: Timer, color: '#FFBB28', unit: 'km' },
    duration: { icon: Timer, color: '#FF8042', unit: 'min' },
    calories: { icon: Flame, color: '#8884d8', unit: 'kcal' }
  };

  const calculateProgress = () => {
    const start = progressData[0][selectedMetric];
    const end = progressData[progressData.length - 1][selectedMetric];
    return ((end - start) / start * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Fitness Progress</h1>
          <div className="flex gap-2">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="select select-bordered"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="select select-bordered"
            >
              {Object.keys(metrics).map(metric => (
                <option key={metric} value={metric}>
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current {selectedMetric}
              </CardTitle>
              {React.createElement(metrics[selectedMetric].icon, { 
                className: "h-4 w-4 text-muted-foreground"
              })}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progressData[progressData.length - 1][selectedMetric]}
                {metrics[selectedMetric].unit}
              </div>
              <p className="text-xs text-muted-foreground">
                {calculateProgress()}% from start
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(progressData.reduce((acc, curr) => acc + curr[selectedMetric], 0) / progressData.length).toFixed(1)}
                {metrics[selectedMetric].unit}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Performance</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...progressData.map(d => d[selectedMetric]))}
                {metrics[selectedMetric].unit}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metrics[selectedMetric].color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={metrics[selectedMetric].color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke={metrics[selectedMetric].color}
                    fillOpacity={1}
                    fill="url(#colorMetric)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.keys(metrics).map(metric => ({
                      name: metric,
                      value: progressData.reduce((acc, curr) => acc + curr[metric], 0)
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {Object.keys(metrics).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Date</th>
                    {Object.keys(metrics).map(metric => (
                      <th key={metric} className="text-left p-2">
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {progressData.map((entry, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{entry.date}</td>
                      {Object.keys(metrics).map(metric => (
                        <td key={metric} className="p-2">
                          {entry[metric]} {metrics[metric].unit}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressTracker;