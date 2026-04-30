import React from 'react';
import { 
  Users, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Star,
  MoreVertical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// Dummy Data
const statData = {
  totalDoctors: 24,
  consultationsToday: {
    ongoing: 12,
    completed: 35,
    cancelled: 3,
  },
  monthlyRevenue: 'Rp 45.500.000',
  wallet: {
    balance: 'Rp 12.000.000',
    hold: 'Rp 5.000.000',
  }
};

const alerts = [
  { id: 1, type: 'sip', message: '3 Dokter memiliki SIP yang akan segera kadaluarsa (kurang dari 30 hari).', severity: 'danger' },
  { id: 2, type: 'invite', message: '2 Undangan dokter telah kadaluarsa dan belum direspons.', severity: 'warning' },
];

const chartData = [
  { name: 'Sen', total: 40, completed: 32 },
  { name: 'Sel', total: 35, completed: 30 },
  { name: 'Rab', total: 50, completed: 45 },
  { name: 'Kam', total: 45, completed: 38 },
  { name: 'Jum', total: 60, completed: 55 },
  { name: 'Sab', total: 30, completed: 25 },
  { name: 'Min', total: 20, completed: 18 },
];

const latestConsultations = [
  { id: 1, patient: 'Budi Santoso', doctor: 'Dr. Andi Pratama', type: 'Video Call', status: 'Ongoing', time: '10:30' },
  { id: 2, patient: 'Siti Aminah', doctor: 'Dr. Linda Sari', type: 'Chat', status: 'Completed', time: '09:45' },
  { id: 3, patient: 'Joko Widodo', doctor: 'Dr. Andi Pratama', type: 'Video Call', status: 'Completed', time: '09:15' },
  { id: 4, patient: 'Rina Kartika', doctor: 'Dr. Budi Utomo', type: 'Chat', status: 'Cancelled', time: '08:30' },
  { id: 5, patient: 'Agus Setiawan', doctor: 'Dr. Linda Sari', type: 'Video Call', status: 'Completed', time: '08:00' },
];

const topDoctors = [
  { id: 1, name: 'Dr. Andi Pratama', total: 145, rating: 4.9 },
  { id: 2, name: 'Dr. Linda Sari', total: 132, rating: 4.8 },
  { id: 3, name: 'Dr. Budi Utomo', total: 98, rating: 4.7 },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard Faskes</h1>
          <p className="text-sm text-text-muted">Pantau performa fasilitas kesehatan Anda secara real-time.</p>
        </div>
        <div className="flex items-center space-x-3 bg-surface-muted p-2 rounded-card">
          <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </span>
          <span className="text-sm font-medium">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Alert Bar */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`flex items-center p-4 rounded-card ${
              alert.severity === 'danger' 
                ? 'bg-red-50 text-red-700' 
                : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center mr-3 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </span>
            <span className="text-sm font-medium">{alert.message}</span>
            <button className="ml-auto text-xs font-bold uppercase tracking-wider hover:underline">Lihat Detail</button>
          </div>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Dokter */}
        <div className="bg-surface-muted p-4 rounded-card">
          <div className="flex justify-between items-start">
            <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center">
              <Users className="w-5 h-5" />
            </span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="mt-4">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Total Dokter Aktif</p>
            <h3 className="text-3xl font-bold text-text">{statData.totalDoctors}</h3>
            <p className="text-[10px] text-green-600 mt-1 font-medium">+2 bulan ini</p>
          </div>
        </div>

        {/* Konsultasi Hari Ini */}
        <div className="bg-surface-muted p-4 rounded-card">
          <div className="flex justify-between items-start">
            <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </span>
            <div className="flex space-x-1">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Konsultasi Hari Ini</p>
            <div className="flex items-end space-x-2">
              <h3 className="text-3xl font-bold text-text">{statData.consultationsToday.ongoing + statData.consultationsToday.completed + statData.consultationsToday.cancelled}</h3>
              <span className="text-xs text-text-muted mb-1.5">Sesi</span>
            </div>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-[10px] text-text-muted">{statData.consultationsToday.ongoing} Aktif</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[10px] text-text-muted">{statData.consultationsToday.completed} Selesai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pendapatan */}
        <div className="bg-surface-muted p-4 rounded-card">
          <div className="flex justify-between items-start">
            <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </span>
            <MoreVertical className="w-4 h-4 text-text-muted cursor-pointer" />
          </div>
          <div className="mt-4">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Pendapatan Bulan Ini</p>
            <h3 className="text-2xl font-bold text-text">{statData.monthlyRevenue}</h3>
            <p className="text-[10px] text-green-600 mt-1 font-medium">↑ 12% dari bulan lalu</p>
          </div>
        </div>

        {/* Wallet */}
        <div className="bg-surface-muted p-4 rounded-card">
          <div className="flex justify-between items-start">
            <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </span>
            <button className="text-[10px] bg-primary text-text-inverse px-2 py-1 rounded-full font-bold">TARIK</button>
          </div>
          <div className="mt-4">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Saldo Tersedia</p>
            <h3 className="text-2xl font-bold text-text">{statData.wallet.balance}</h3>
            <p className="text-[10px] text-text-muted mt-1">Hold: {statData.wallet.hold}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-surface-muted p-6 rounded-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-text">Grafik Konsultasi (7 Hari Terakhir)</h3>
            <select className="text-xs border-none bg-surface rounded-button px-2 py-1 focus:ring-0">
              <option>Minggu Ini</option>
              <option>Minggu Lalu</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff', opacity: 0.4 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'none', backgroundColor: '#ffffff' }}
                />
                <Bar dataKey="total" fill="#9689e8" radius={[4, 4, 0, 0]} barSize={30} name="Total Sesi" />
                <Bar dataKey="completed" fill="#ede9fb" radius={[4, 4, 0, 0]} barSize={30} name="Selesai" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Doctors */}
        <div className="bg-surface-muted p-6 rounded-card">
          <h3 className="text-base font-semibold text-text mb-6">Top 3 Dokter Bulan Ini</h3>
          <div className="space-y-6">
            {topDoctors.map((doc, index) => (
              <div key={doc.id} className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold">
                    {doc.name.split(' ')[1][0]}
                  </div>
                  <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-semibold text-text">{doc.name}</h4>
                  <div className="flex items-center mt-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-xs font-medium text-text">{doc.rating}</span>
                    <span className="mx-2 text-text-muted text-[10px]">•</span>
                    <span className="text-[10px] text-text-muted">{doc.total} Konsultasi</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-green-600">Terbaik</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 text-xs font-semibold text-primary hover:underline">Lihat Semua Dokter</button>
        </div>
      </div>

      {/* Latest Consultations Table */}
      <div className="bg-surface-muted rounded-card overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-base font-semibold text-text">Konsultasi Terbaru</h3>
          <button className="text-xs text-primary font-semibold hover:underline">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-text-muted text-[10px] uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Nama Pasien</th>
                <th className="px-6 py-3 font-semibold">Dokter</th>
                <th className="px-6 py-3 font-semibold">Jenis</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {latestConsultations.map((item) => (
                <tr key={item.id} className="hover:bg-surface transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-text">{item.patient}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-muted">{item.doctor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-text-muted">{item.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-xs text-text-muted font-medium">{item.time}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
