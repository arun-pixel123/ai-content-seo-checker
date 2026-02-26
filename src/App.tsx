import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ChevronRight,
  Info,
  Zap,
  ShieldCheck,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { analyzeContent, type AnalysisResult } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 50) {
      setError('Please enter at least 50 characters for a meaningful analysis.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeContent(text);
      setResult(data);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const charCount = text.length;

  const getLikelihoodColor = (score: number) => {
    if (score < 30) return 'text-emerald-500';
    if (score < 70) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getLikelihoodLabel = (score: number) => {
    if (score < 20) return 'Highly Likely Human';
    if (score < 40) return 'Likely Human';
    if (score < 60) return 'Uncertain / Mixed';
    if (score < 80) return 'Likely AI';
    return 'Highly Likely AI';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">SEO <span className="text-indigo-600">Checker</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1"><Zap size={14} className="text-amber-500" /> AI-Powered</span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1"><Target size={14} className="text-indigo-500" /> SEO Optimized</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText size={16} className="text-indigo-600" />
                Content Editor
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                <span>Words: {wordCount}</span>
                <span>Chars: {charCount}</span>
              </div>
            </div>
            <textarea
              className="w-full h-[400px] p-6 focus:outline-none resize-none text-lg leading-relaxed placeholder:text-gray-300"
              placeholder="Paste your content here (min 50 characters)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim()}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all",
                  isAnalyzing 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Check Content
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {!result && !isAnalyzing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, title: "AI Detection", desc: "Advanced patterns to identify generated text." },
                { icon: BarChart3, title: "SEO Metrics", desc: "Keyword density and readability analysis." },
                { icon: Info, title: "Human Insights", desc: "Suggestions to improve content authenticity." }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <item.icon size={20} className="text-indigo-600 mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-5 space-y-6">
          {isAnalyzing ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[500px]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search size={20} className="text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Processing Content</h3>
                <p className="text-gray-500 text-sm">Our AI is scanning for patterns, keywords, and SEO metrics...</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Main Score Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 text-center border-b border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">AI Likelihood Score</span>
                  <div className={cn("text-6xl font-black mb-2", getLikelihoodColor(result.aiLikelihood))}>
                    {result.aiLikelihood}%
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                    {getLikelihoodLabel(result.aiLikelihood)}
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                  <div className="p-4 text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Readability</span>
                    <span className="text-xl font-bold text-gray-800">{result.readabilityScore}/100</span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Sentiment</span>
                    <span className="text-lg font-bold text-indigo-600 capitalize">{result.sentiment}</span>
                  </div>
                </div>
              </div>

              {/* Keyword Density */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-indigo-600" />
                  Keyword Density
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.keywordDensity} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="word" 
                        type="category" 
                        width={80} 
                        tick={{ fontSize: 12, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        cursor={{ fill: '#F8FAFC' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                        {result.keywordDensity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#4F46E5' : '#818CF8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SEO Suggestions */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  SEO Recommendations
                </h3>
                <ul className="space-y-3">
                  {result.seoSuggestions.map((suggestion, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed group">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <ChevronRight size={12} />
                      </div>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed Analysis */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Info size={16} className="text-indigo-600" />
                  Detailed Analysis
                </h3>
                <div className="prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-strong:text-indigo-600">
                  <Markdown>{result.detailedAnalysis}</Markdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden h-full min-h-[500px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Zap size={24} />
                </div>
                <h2 className="text-3xl font-black leading-tight">
                  Ready to check your content?
                </h2>
                <p className="text-indigo-100 leading-relaxed">
                  Paste your article, blog post, or copy to the left and click "Check Content". 
                  We'll analyze it for AI patterns and provide SEO optimization tips.
                </p>
                <div className="pt-4 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    Real-time AI detection
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    Keyword density mapping
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    Readability scoring
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">SEO AI Checker v1.0</span>
          </div>
          <p className="text-xs text-gray-400">
            Designed for SEO Specialists. Powered by Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
