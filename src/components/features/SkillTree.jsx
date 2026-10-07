import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, CheckCircle2, Lock, Activity } from 'lucide-react';
import { getSkillTreeData } from '../../services/db';

export default function SkillTree({ userId }) {
  const trees = getSkillTreeData(userId);
  const [selectedTree, setSelectedTree] = useState(trees[0]?.id || 'python_tree');

  const activeTree = trees.find((t) => t.id === selectedTree) || trees[0];

  return (
    <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <GitBranch size={18} className="text-blue-600" />
            VISUAL CAREER SKILL TREE
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Node mastery and percentages are dynamically updated from real question attempts.
          </p>
        </div>

        {/* Tree Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-blue-50/80 border border-blue-200">
          {trees.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTree(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                selectedTree === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Node Branching */}
      <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4 font-mono text-sm">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-base pb-2 border-b border-slate-200">
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
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{branchChar}</span>
                  <span className="font-semibold text-slate-800">{node.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  {node.status === 'completed' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 size={13} /> {hasAccuracy ? `${node.accuracy}% Mastered` : '✓ Mastered'}
                    </span>
                  ) : node.status === 'locked' ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                      <Lock size={12} /> {hasAccuracy ? `${node.accuracy}%` : 'Locked'}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700">
                        {node.accuracy}%
                      </span>
                      <div className="w-20 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
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
