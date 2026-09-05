import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, GitBranch, Layers, Award } from 'lucide-react';
import { analyzeProjectQuality } from '../../utils/aiPipelines';
import { useAuth } from '../../context/AuthContext';

export default function ProjectIntelligenceModal({ project, isOpen, onClose }) {
  const { saveProjectAnalysis } = useAuth();
  if (!isOpen || !project) return null;

  const analysis = project.aiAnalysis || analyzeProjectQuality(project);

  const handleSaveAnalysis = () => {
    saveProjectAnalysis(project.id, analysis);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          style={{ background: '#0a1628' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.1))' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Project Intelligence Audit</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    6-Dimension Quality Model
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-md">
                  Project: <strong className="text-white">{project.name}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Mandatory Transparency Disclaimer */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-400 flex-shrink-0" />
              <span>{analysis.disclaimer}</span>
            </div>

            {/* Overall Score */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Overall Technical Rigor Score
                </div>
                <div className="text-3xl font-extrabold text-white mt-0.5">
                  {analysis.overallQuality}%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Stack: {Array.isArray(project.tech) ? project.tech.join(', ') : 'Not specified'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5"
                  >
                    <GitBranch size={13} /> Repository
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-300 hover:text-cyan-200 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-1.5"
                  >
                    <ExternalLink size={13} /> Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* 6 Dimensions Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Evaluated Dimensions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysis.dimensions.map((dim, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/3 border border-white/6">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">{dim.label}</span>
                      <span className="font-bold text-white">{dim.score}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${dim.score}%`,
                          background:
                            dim.score >= 80
                              ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                              : 'linear-gradient(90deg, #3b82f6, #a855f7)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-500/8 border border-emerald-500/20">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Proven Strengths
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/8 border border-amber-500/20">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Actionable Enhancements
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 bg-black/25 flex items-center justify-between flex-shrink-0">
            <span className="text-[11px] text-slate-500">
              Audit stored with project record
            </span>
            <button
              onClick={handleSaveAnalysis}
              className="btn-primary text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer"
            >
              Save Audit to Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
