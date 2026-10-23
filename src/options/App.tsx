import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'production' | 'staging' | 'dev' | 'local'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md font-bold text-base">
              LM
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                LayerMark
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Dashboard
                </span>
              </h1>
              <p className="text-xs text-slate-500">Quản lý nhãn dán nhận diện môi trường & website</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>
            <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition">
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo Tag mới</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên tag, domain, path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-medium">
            {(['all', 'production', 'staging', 'dev', 'local'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  activeTab === tab
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab === 'all' ? 'Tất cả' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Empty / Intro State */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <Layers className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Sẵn sàng tạo nhãn dán môi trường đầu tiên
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              LayerMark giúp bạn phân biệt rõ ràng giữa Production, Staging, Dev và Localhost bằng các badge thông minh, tùy biến cao và hoạt động 100% offline.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button className="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Tạo Tag mẫu (Presets)</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
