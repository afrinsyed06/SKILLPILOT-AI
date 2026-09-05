import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, CheckCircle2, Lock, Activity } from 'lucide-react';
import { getSkillTreeData } from '../../services/db';

export default function SkillTree({ userId }) {
  const trees = getSkillTreeData(userId);
  const [selectedTree, setSelectedTree] = useState(trees[0]?.id || 'python_tree');

  const activeTree = trees.find((t) => t.id === selectedTree) || trees[0];

  return (
    <div className="p-6 rounded-3xl bg-[#081222] border border-white/10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <GitBranch size={18} className="text-cyan-400" />
            VISUAL CAREER SKILL TREE
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Node mastery and percentages are dynamically updated from real question attempts.
          </p>
        </div>

        {/* Tree Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          {trees.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTree(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                selectedTree === t.id
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Node Branching */}
      <div className="p-6 rounded-2xl bg-[#040810]/70 border border-white/5 space-y-4 font-mono text-sm">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-base pb-2 border-b border-white/10">
          <span>{activeTree.icon}</span>
          <span>{activeTree.name.toUpperCase()} REPOSITORY</span>
        </div>

        <div className="space-y-3 pt-1">
          {activeTree.nodes.map((node, i) => {
            const isLast = i === activeTree.nodes.length - 1;
            const branchChar = isLast ? '└──' : '├──';
            const hasAccuracy = node.accuracy !== null && node.accuracy !== undefined;

            return (
              <motion.div
                key={node.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/4 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{branchChar}</span>
                  <span className="font-semibold text-slate-200">{node.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  {node.status === 'completed' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 size={13} /> {hasAccuracy ? `${node.accuracy}% Mastered` : '✓ Mastered'}
                    </span>
                  ) : node.status === 'locked' ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">
                      <Lock size={12} /> {hasAccuracy ? `${node.accuracy}%` : 'Locked'}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-300">
                        {node.accuracy}%
                      </span>
                      <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${node.accuracy}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
