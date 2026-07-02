import  { useState, useEffect } from 'react';
import { Shield, Fuel, DollarSign, Users, CheckCircle, Heart, Trash2, ArrowRight, RotateCcw, Scale } from 'lucide-react';
import type { Car, RecommendationResponse, QuestionnaireData } from './types';
export default function App() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    maxBudget: 60000,
    preferredFuel: 'Any',
    minSeating: 5,
    priority: 'safety'
  });
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [shortlist, setShortlist] = useState<Car[]>([]);
  const [compareList, setCompareList] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => { fetchShortlist(); }, []);

  const fetchShortlist = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/shortlist');
      if (res.ok) setShortlist(await res.json());
    } catch (err) { console.error("Shortlist fetch failed", err); }
  };

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setRecommendations(await res.json());
        setStep(4);
      }
    } catch (err) { console.error("Matching engine offline", err); }
    setLoading(false);
  };

  const toggleShortlist = async (carId: number) => {
    const isShortlisted = shortlist.some(c => c.id === carId);
    try {
      if (isShortlisted) {
        await fetch(`http://localhost:8080/api/shortlist/${carId}`, { method: 'DELETE' });
      } else {
        await fetch('http://localhost:8080/api/shortlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ carId })
        });
      }
      fetchShortlist();
    } catch (err) { console.error("Shortlist operation failed", err); }
  };

  const toggleCompare = (car: Car) => {
    if (compareList.some(c => c.id === car.id)) {
      setCompareList(compareList.filter(c => c.id !== car.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, car]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <header className="flex justify-between items-center mb-12 border-b border-slate-700/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            DriveMatch AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">Transform choice paralysis into absolute buying confidence.</p>
        </div>
        {shortlist.length > 0 && (
          <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-full text-pink-400 text-sm font-semibold">
            <Heart size={16} className="fill-pink-500" /> {shortlist.length} Shortlisted
          </div>
        )}
      </header>

      {step < 4 && (
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Step {step} of 3</span>

          {step === 1 && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-2">What is your maximum target budget?</h2>
              <p className="text-slate-400 text-sm mb-6">We'll filter out anything above this threshold immediately.</p>
              <div className="flex items-center gap-4 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <DollarSign className="text-emerald-400" />
                <input
                  type="range" min="20000" max="80000" step="2500"
                  value={formData.maxBudget}
                  onChange={(e) => setFormData({...formData, maxBudget: parseInt(e.target.value)})}
                  className="w-full accent-blue-500"
                />
                <span className="font-mono text-lg font-bold w-24 text-right">${formData.maxBudget.toLocaleString()}</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-6">Select your lifestyle preferences</h2>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Preferred Fuel Infrastructure</label>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {['Any', 'EV', 'Hybrid', 'Gasoline'].map(fuel => (
                  <button
                    key={fuel} type="button" onClick={() => setFormData({...formData, preferredFuel: fuel})}
                    className={`py-3 rounded-xl border text-xs font-medium transition-all ${formData.preferredFuel === fuel ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                  >
                    {fuel}
                  </button>
                ))}
              </div>

              <label className="block text-sm font-semibold text-slate-300 mb-2">Minimum Seating Requirements</label>
              <div className="flex gap-4 items-center bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <Users className="text-indigo-400" />
                <input
                  type="number" min="2" max="8"
                  value={formData.minSeating}
                  onChange={(e) => setFormData({...formData, minSeating: parseInt(e.target.value) || 2})}
                  className="bg-transparent border-b border-slate-600 focus:border-blue-500 outline-none text-center font-bold text-lg w-16"
                />
                <span className="text-slate-400 text-sm">passengers capacity</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-2">What matters most to you?</h2>
              <p className="text-slate-400 text-sm mb-6">This sets the core mathematical weight inside our AI matching engine.</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'safety' as const, label: 'Safety & Family Protection', icon: Shield, desc: 'Prioritizes maximum baseline crash and safety ratings.' },
                  { id: 'mileage' as const, label: 'Maximum Range & Fuel Efficiency', icon: Fuel, desc: 'Prioritizes highway mpg and hybrid/electric range optimization.' },
                  { id: 'budget' as const, label: 'Financial Value & Savings', icon: DollarSign, desc: 'Prioritizes vehicles leaving the largest headroom under budget.' }
                ].map(prio => (
                  <button
                    key={prio.id} type="button" onClick={() => setFormData({...formData, priority: prio.id})}
                    className={`flex items-start text-left p-4 rounded-xl border transition-all ${formData.priority === prio.id ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                  >
                    <prio.icon className="mt-1 mr-4 shrink-0 text-indigo-400" size={20} />
                    <div>
                      <h4 className="font-bold text-white">{prio.label}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{prio.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700/50">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="text-sm font-medium text-slate-400 hover:text-white">
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg">
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleRecommend} disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50">
                {loading ? 'Analyzing...' : 'Generate Matches'}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tight">Your Custom AI Recommendations</h3>
              <button type="button" onClick={() => { setStep(1); setCompareList([]); }} className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <RotateCcw size={12} /> Retake Quiz
              </button>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-slate-400">No matching cars found for your criteria. Try raising your budget limit.</p>
              </div>
            ) : recommendations.map(({ car, matchScore, reasoning, sentimentSummary }) => {
              const isShortlisted = shortlist.some(s => s.id === car.id);
              const isComparing = compareList.some(c => c.id === car.id);

              return (
                <div key={car.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative transition-all hover:border-white/20">
                  <div className="absolute top-6 right-6">
                    <span className="text-2xl font-black font-mono tracking-tighter text-blue-400">
                      {matchScore}% <span className="text-xs font-bold text-slate-400 uppercase">Match</span>
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white">{car.brand} <span className="text-slate-400 font-medium">{car.model}</span></h4>
                  <div className="flex gap-4 mt-2 text-xs font-mono text-indigo-300 font-bold uppercase">
                    <span>{car.fuelType}</span> • <span>{car.seating} Seats</span> • <span>${car.price.toLocaleString()}</span>
                  </div>

                  <div className="mt-4 bg-slate-900/40 border border-slate-800 rounded-xl p-3 text-sm text-slate-300">
                    <span className="font-semibold text-blue-400">AI Logic: </span>{reasoning}
                  </div>

                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 px-1">
                    <CheckCircle size={12} className="text-emerald-400 shrink-0" /> <span className="italic">"{sentimentSummary}"</span>
                  </div>

                  <div className="flex gap-3 mt-5 pt-4 border-t border-slate-800">
                    <button
                      type="button" onClick={() => toggleShortlist(car.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all border ${isShortlisted ? 'bg-pink-500/20 border-pink-500/40 text-pink-400' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                    >
                      <Heart size={14} className={isShortlisted ? "fill-pink-500 text-pink-500" : ""} />
                      {isShortlisted ? 'Shortlisted' : 'Save to Shortlist'}
                    </button>
                    <button
                      type="button" onClick={() => toggleCompare(car)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all border ${isComparing ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                    >
                      <Scale size={14} />
                      {isComparing ? 'Added to Compare' : 'Compare Specs'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
              <h3 className="text-md font-bold mb-4 flex items-center gap-2"><Scale size={18} className="text-blue-400" /> Specs Matrix ({compareList.length}/3)</h3>
              {compareList.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Select up to 3 vehicles to review metrics side-by-side.</p>
              ) : (
                <div className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-4 gap-1 border-b border-slate-700 pb-2 text-slate-400 font-sans font-bold">
                    <span>Model</span><span>Price</span><span>MPG</span><span>Safety</span>
                  </div>
                  {compareList.map(c => (
                    <div key={c.id} className="grid grid-cols-4 gap-1 items-center border-b border-slate-800/60 pb-2">
                      <span className="font-sans font-bold text-white truncate">{c.model}</span>
                      <span className="text-emerald-400">${c.price.toLocaleString()}</span>
                      <span className="text-indigo-300">{c.mileage}</span>
                      <span className="text-amber-400">{c.safetyRating}★</span>
                    </div>
                  ))}
                  <button type="button" onClick={() => setCompareList([])} className="w-full text-center mt-2 text-slate-400 hover:text-white text-[10px] uppercase font-bold">
                    Clear Matrix
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
              <h3 className="text-md font-bold mb-4 flex items-center gap-2"><Heart size={18} className="text-pink-500" /> Saved Shortlist</h3>
              {shortlist.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No vehicles explicitly saved to your shortlist yet.</p>
              ) : (
                <div className="space-y-2">
                  {shortlist.map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-slate-900/40 border border-slate-800 p-3 rounded-xl">
                      <div>
                        <h5 className="text-sm font-bold">{c.brand} {c.model}</h5>
                        <p className="text-xs text-emerald-400 font-mono mt-0.5">${c.price.toLocaleString()}</p>
                      </div>
                      <button type="button" onClick={() => toggleShortlist(c.id)} className="text-slate-500 hover:text-red-400 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}