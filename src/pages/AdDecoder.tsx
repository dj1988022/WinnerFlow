
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, Zap, FileText, Target, Video, Wand2, X, Copy, Check } from 'lucide-react';
import { analyzeAdImage, generateViralScript } from '../services/gemini';

export default function AdDecoder() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isGeneratingScripts, setIsGeneratingScripts] = useState(false);
  const [scripts, setScripts] = useState<any>(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        // Remove data:image/png;base64, prefix for API
        const base64Data = base64String.split(',')[1];
        analyzeImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Data: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setScripts(null);
    try {
      const data = await analyzeAdImage(base64Data);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateScripts = async () => {
    if (!result) return;
    setIsGeneratingScripts(true);
    setShowScriptModal(true);
    try {
      const data = await generateViralScript(result);
      setScripts(data);
    } catch (error) {
      console.error("Script generation failed", error);
    } finally {
      setIsGeneratingScripts(false);
    }
  };

  const handleCopyScript = (script: any, index: number) => {
    const text = script.script.map((s: any) => `[${s.time}] ${s.visual}\nAudio: ${s.audio}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedScriptIndex(index);
    setTimeout(() => setCopiedScriptIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Ad Decoding Engine</h1>
        <p className="text-zinc-400">Upload a competitor's ad creative. AI will reverse-engineer their winning formula.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Upload Area */}
        <div className="space-y-6">
          <motion.div 
            className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all h-[400px] ${
              image ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800/30 cursor-pointer'
            }`}
            onClick={() => !image && fileInputRef.current?.click()}
            whileHover={!image ? { scale: 1.01 } : {}}
          >
            {image ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                <img src={image} alt="Uploaded Ad" className="max-h-full max-w-full object-contain" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setResult(null);
                    setScripts(null);
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-zinc-200">Drop your ad creative here</h3>
                  <p className="text-sm text-zinc-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
                </div>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Browse Files
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </motion.div>

          {/* Analysis Status */}
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4"
            >
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
              <div className="flex-1">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden w-full">
                  <motion.div 
                    className="h-full bg-emerald-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-xs text-zinc-400 mt-2 font-mono">DECODING VISUAL HOOKS...</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Results Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Score Card */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                    <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">Hook Score</div>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-white">{result.hookScore}</span>
                      <span className="text-sm text-zinc-400 mb-1">/ 100</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                    <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">Hook Type</div>
                    <div className="text-xl font-bold text-emerald-400">{result.hookType}</div>
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-zinc-100 font-medium mb-3">
                      <Target className="w-4 h-4 text-emerald-500" />
                      Emotional Triggers
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.emotionalTriggers?.map((trigger: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs border border-zinc-700">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-zinc-100 font-medium mb-3">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      Copywriting Analysis
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {result.copywritingAnalysis}
                    </p>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-zinc-100 font-medium mb-4">
                      <Video className="w-4 h-4 text-emerald-500" />
                      Script Structure Timeline
                    </h3>
                    <div className="relative pl-4 border-l border-zinc-800 space-y-6">
                      {result.scriptStructure?.map((segment: any, i: number) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-600 group-hover:border-emerald-500 transition-colors"></div>
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                            <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded self-start shrink-0">
                              {segment.timestamp}
                            </span>
                            <div>
                              <h4 className="text-sm font-medium text-zinc-200">{segment.segment}</h4>
                              <p className="text-xs text-zinc-400 mt-1">{segment.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-zinc-100 font-medium mb-3">
                      <Zap className="w-4 h-4 text-emerald-500" />
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {result.improvementSuggestions?.map((suggestion: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <CheckCircle className="w-4 h-4 text-emerald-500/50 mt-0.5 shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={handleGenerateScripts}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group"
                  >
                    <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Remix This Ad (Generate Scripts)
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 border border-zinc-800/50 rounded-2xl bg-zinc-900/20 p-10 text-center">
                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Upload an image to see the AI breakdown.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Script Generation Modal */}
      <AnimatePresence>
        {showScriptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#09090b] border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Wand2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Viral Script Generator</h2>
                    <p className="text-sm text-zinc-400">AI-generated variations based on your winning ad.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowScriptModal(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[#09090b]">
                {isGeneratingScripts ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-zinc-400 animate-pulse">Crafting viral hooks & scripts...</p>
                  </div>
                ) : scripts ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {scripts.variations?.map((script: any, index: number) => (
                      <div key={index} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 flex flex-col h-full hover:border-zinc-700 transition-colors group">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded">
                              {script.type}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                              <Zap className="w-3 h-3" />
                              Viral Score: <span className="text-white font-bold">{script.estimatedViralScore}</span>
                            </div>
                          </div>
                          <h3 className="text-sm font-medium text-zinc-200 italic">"{script.hook}"</h3>
                        </div>

                        <div className="flex-1 space-y-4 mb-6">
                          {script.script.map((scene: any, i: number) => (
                            <div key={i} className="text-xs space-y-1 border-l-2 border-zinc-800 pl-3 py-1">
                              <div className="flex justify-between text-zinc-500 font-mono text-[10px]">
                                <span>{scene.time}</span>
                                <span>SCENE {i + 1}</span>
                              </div>
                              <p className="text-zinc-300 font-medium">{scene.visual}</p>
                              <p className="text-zinc-400 italic">" {scene.audio} "</p>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => handleCopyScript(script, index)}
                          className="w-full mt-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {copiedScriptIndex === index ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy Script
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-zinc-500">Failed to generate scripts. Please try again.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
