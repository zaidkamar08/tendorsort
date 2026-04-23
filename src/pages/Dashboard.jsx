import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, FileBarChart, Filter } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { mockBidders, mockTender } from '../data/mockData'

const VerdictBadge = ({ verdict }) => {
  const cfg = {
    eligible: { cls: 'verdict-eligible', icon: <CheckCircle2 size={13} />, label: 'Eligible' },
    rejected: { cls: 'verdict-rejected', icon: <XCircle size={13} />, label: 'Not Eligible' },
    review: { cls: 'verdict-review', icon: <AlertTriangle size={13} />, label: 'Manual Review' },
  }[verdict]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

const CriteriaBadge = ({ status }) => {
  if (status === 'pass') return <span className="text-green-600 text-xs font-medium flex items-center gap-1"><CheckCircle2 size={13} />Pass</span>
  if (status === 'fail') return <span className="text-red-600 text-xs font-medium flex items-center gap-1"><XCircle size={13} />Fail</span>
  return <span className="text-amber-600 text-xs font-medium flex items-center gap-1"><AlertTriangle size={13} />Review</span>
}

const ConfidenceBar = ({ value }) => {
  const color = value >= 80 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs text-slate-500">{value}%</span>
    </div>
  )
}

// Custom donut label in center
const DonutCenter = ({ cx, cy, eligible, total }) => (
  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
    <tspan x={cx} dy="-8" fontSize="22" fontWeight="700" fill="#0D1B2A">{total}</tspan>
    <tspan x={cx} dy="20" fontSize="11" fill="#64748b">Bidders</tspan>
  </text>
)

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2 text-xs">
        <p className="font-medium text-navy">{payload[0].name}</p>
        <p className="text-slate-500">{payload[0].value} bidder{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')

  const eligible = mockBidders.filter(b => b.verdict === 'eligible').length
  const rejected = mockBidders.filter(b => b.verdict === 'rejected').length
  const review = mockBidders.filter(b => b.verdict === 'review').length
  const total = mockBidders.length

  const donutData = [
    { name: 'Eligible', value: eligible },
    { name: 'Not Eligible', value: rejected },
    { name: 'Manual Review', value: review },
  ]
  const COLORS = ['#10b981', '#ef4444', '#f59e0b']

  const filtered = filter === 'all' ? mockBidders : mockBidders.filter(b => b.verdict === filter)
  const criteriaKeys = Object.keys(mockBidders[0].criteria)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 animate-fade-up">
        <div>
          <p className="text-[#0D9488] text-xs font-medium tracking-widest uppercase mb-1">Evaluation Results</p>
          <h1 className="font-display text-2xl font-700 text-navy">{mockTender.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{mockTender.department} · Deadline: {mockTender.deadline}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/review" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-DEFAULT text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors">
            <AlertTriangle size={15} />
            Review Queue ({review})
          </Link>
          <Link to="/report" className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
            <FileBarChart size={15} />
            Export Report
          </Link>
        </div>
      </div>

      {/* Top row — Donut + stat cards */}
      <div className="grid md:grid-cols-4 gap-5 mb-8 animate-fade-up delay-100">

        {/* Donut chart card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Verdict Breakdown</p>
          <p className="text-sm font-medium text-navy mb-3">{total} bidders evaluated</p>
          <div className="flex items-center gap-4">
            <div style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-3 flex-1">
              {donutData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                    <span className="text-sm text-slate-600">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl font-700 text-navy">{d.value}</span>
                    <span className="text-xs text-slate-400">({Math.round(d.value / total * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: 'Total Bidders', value: total, color: 'bg-[#0D1B2A]', text: 'text-white', sub: 'Submissions received' },
            { label: 'Eligible', value: eligible, color: 'bg-green-500', text: 'text-white', sub: 'All criteria matched' },
            { label: 'Not Eligible', value: rejected, color: 'bg-red-500', text: 'text-white', sub: 'At least 1 criterion failed' },
            { label: 'Manual Review', value: review, color: 'bg-amber-400', text: 'text-amber-900', sub: 'Low confidence detected' },
          ].map((s, i) => (
            <div key={i} className={`${s.color} rounded-2xl p-5 flex flex-col justify-between animate-fade-up`} style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              <div className={`font-display text-4xl font-700 ${s.text}`}>{s.value}</div>
              <div>
                <div className={`font-medium text-sm ${s.text}`}>{s.label}</div>
                <div className={`text-xs mt-0.5 ${s.text} opacity-60`}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Criteria chips */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5 animate-fade-up delay-200">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Extracted Eligibility Criteria</p>
        <div className="flex flex-wrap gap-2">
          {mockTender.criteria.map(c => (
            <span key={c.id} className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 text-navy px-3 py-1.5 rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full ${c.type === 'Financial' ? 'bg-blue-400' : c.type === 'Technical' ? 'bg-teal-DEFAULT' : 'bg-purple-400'}`} />
              {c.label}
              {c.mandatory && <span className="text-red-400 font-bold">*</span>}
            </span>
          ))}
          <span className="text-xs text-slate-400 self-center ml-1">* Mandatory</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4 animate-fade-up delay-300">
        <Filter size={14} className="text-slate-400" />
        <span className="text-sm text-slate-500 mr-1">Filter:</span>
        {[['all', 'All'], ['eligible', 'Eligible'], ['rejected', 'Not Eligible'], ['review', 'Needs Review']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === val ? 'bg-[#0D9488] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-fade-up delay-400">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3.5 w-48">Bidder</th>
                {mockTender.criteria.map(c => (
                  <th key={c.id} className="text-left text-xs font-medium text-slate-500 px-4 py-3.5 hidden md:table-cell">{c.label}</th>
                ))}
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3.5">Confidence</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3.5">Verdict</th>
                <th className="px-4 py-3.5 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <>
                  <tr
                    key={b.id}
                    className={`border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${expanded === b.id ? 'bg-slate-50' : ''}`}
                    onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-sm text-navy">{b.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{b.submittedAt}</div>
                    </td>
                    {criteriaKeys.map(k => (
                      <td key={k} className="px-4 py-4 hidden md:table-cell">
                        <CriteriaBadge status={b.criteria[k].status} />
                      </td>
                    ))}
                    <td className="px-4 py-4"><ConfidenceBar value={b.overallConfidence} /></td>
                    <td className="px-4 py-4"><VerdictBadge verdict={b.verdict} /></td>
                    <td className="px-4 py-4">
                      {expanded === b.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </td>
                  </tr>
                  {expanded === b.id && (
                    <tr key={`${b.id}-detail`}>
                      <td colSpan={criteriaKeys.length + 4} className="px-5 pb-5 bg-slate-50">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                          {criteriaKeys.map(k => {
                            const c = b.criteria[k]
                            const crit = mockTender.criteria.find(x => x.id === k)
                            return (
                              <div key={k} className={`rounded-xl p-4 border text-sm ${c.status === 'pass' ? 'bg-green-50 border-green-100' : c.status === 'fail' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                                <div className="font-medium text-navy mb-1">{crit?.label}</div>
                                <div className="text-slate-500 text-xs mb-2">Required: {crit?.requirement}</div>
                                <div className="font-medium text-sm mb-1">Found: <span className="text-navy">{c.value}</span></div>
                                <div className="text-xs text-slate-400">📄 {c.doc}{c.page ? `, p.${c.page}` : ''}</div>
                                <div className="mt-2"><ConfidenceBar value={c.confidence} /></div>
                              </div>
                            )
                          })}
                        </div>
                        {b.verdict === 'review' && (
                          <div className="mt-3">
                            <Link to="/review" className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium">
                              Open in Review Panel →
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
