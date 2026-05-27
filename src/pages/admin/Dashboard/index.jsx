import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Clock, AlertTriangle } from 'lucide-react';
import { dashboardService } from '../../../services/dashboardService';
import { resolveMediaUrl } from '../../../services/media';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    today_revenue: 0,
    new_orders: 0,
    pending_orders: 0,
    low_stock: 0
  });
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.data.stats);
        setChartData(res.data.chart);
        setTopProducts(res.data.top_products);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: chartData.map(d => d.name),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: chartData.map(d => d.doanhThu),
        borderColor: '#16a34a',
        backgroundColor: '#16a34a',
        tension: 0.3,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString('vi-VN') + 'đ';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value / 1000000 + 'M';
          }
        }
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Tổng quan</h1>
        <div className="text-sm text-text-muted bg-white px-3 py-1.5 rounded border border-border shadow-sm">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-muted">Doanh thu hôm nay</p>
              <h3 className="text-2xl font-bold text-text mt-2">{Number(stats.today_revenue).toLocaleString('vi-VN')}đ</h3>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-muted">Đơn hàng mới</p>
              <h3 className="text-2xl font-bold text-text mt-2">{stats.new_orders}</h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingBag size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-muted">Chờ xử lý</p>
              <h3 className="text-2xl font-bold text-text mt-2">{stats.pending_orders}</h3>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-muted">Sắp hết hàng</p>
              <h3 className="text-2xl font-bold text-text mt-2">{stats.low_stock}</h3>
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-bold text-text mb-6">Biểu đồ doanh thu (7 ngày qua)</h2>
          <div className="h-80">
            <Line options={lineChartOptions} data={lineChartData} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-bold text-text mb-6">Sản phẩm bán chạy</h2>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={product.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded transition-colors">
                <span className="font-bold text-gray-400 w-4">{idx + 1}</span>
                <img src={resolveMediaUrl(product.thumbnail)} alt="product" className="w-12 h-12 rounded object-cover border" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-text line-clamp-1" title={product.name}>{product.name}</h4>
                  <p className="text-xs text-text-muted">{product.sold_count} đã bán</p>
                </div>
                <div className="font-semibold text-primary text-sm whitespace-nowrap">
                  {Number(product.price).toLocaleString('vi-VN')}đ
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
