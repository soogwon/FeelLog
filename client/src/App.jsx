import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Smile, Frown, Coffee, Zap } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function App() {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // 백엔드 주소 (배포 후엔 배포 주소로 변경!)
      const res = await axios.post('http://localhost:4000/api/analyze', { content });
      setAnalysis(res.data.analysis);
    } catch (err) {
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600">FeelLog 🧠</h1>
          <p className="text-gray-500 mt-2">당신의 마음을 데이터로 읽어드립니다.</p>
        </header>

        {/* 입력 섹션 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <textarea
            className="w-full h-40 p-4 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
            placeholder="오늘 어떤 일이 있었나요? 마음껏 적어보세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !content}
            className="w-full mt-4 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-300 transition-all"
          >
            {loading ? "AI가 감정을 분석 중입니다..." : "내 마음 분석하기"}
          </button>
        </div>

        {/* 결과 섹션 (데이터가 있을 때만 노출) */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {/* 감정 차트 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4">감정 분포</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analysis.emotions} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
                      {analysis.emotions.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 요인 및 조언 */}
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h4 className="flex items-center gap-2 font-bold text-orange-700"><Zap size={18}/> 스트레스 요인</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.stress.map((s, i) => <span key={i} className="bg-white px-3 py-1 rounded-full text-xs shadow-sm">{s}<br /></span>)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h4 className="flex items-center gap-2 font-bold text-green-700"><Coffee size={18}/> 회복 요인</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.recovery.map((r, i) => <span key={i} className="bg-white px-3 py-1 rounded-full text-xs shadow-sm">{r}<br /></span>)}
                </div>
              </div>
              <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 italic text-indigo-800">
                "<br></br>{analysis.advice}"
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;