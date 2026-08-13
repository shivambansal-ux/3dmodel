import React from 'react';
import { BuildingData } from '../types';
import { ZONES } from '../data/cityData';
import { X, Sun, ShieldCheck, Zap, Layers, Navigation, Activity, Cpu } from 'lucide-react';

interface BuildingModalProps {
  building: BuildingData | null;
  onClose: () => void;
  onEnterRoadView: (zoneId: string) => void;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({ building, onClose, onEnterRoadView }) => {
  if (!building) return null;

  const zone = ZONES.find(z => z.id === building.zoneId);

  return (
    <div className="absolute top-16 right-4 sm:right-6 w-[92vw] sm:w-[420px] max-h-[85vh] bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl text-white p-5 overflow-y-auto z-40 transition-all duration-300 animate-in fade-in slide-in-from-right-5">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 mb-1">
            {zone?.name || building.zoneId.toUpperCase()}
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-100">{building.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{building.architecturalStyle}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          title="Close Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-relaxed mb-4">{building.description}</p>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center space-x-3">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase">Rooftop Solar</div>
            <div className="text-sm font-bold text-amber-300">{building.solarCapacityKw} kW</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase">Rating</div>
            <div className="text-xs font-bold text-emerald-400">{building.sustainabilityRating}</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase">Structure</div>
            <div className="text-xs font-bold text-blue-300">{building.floors} Floors ({building.height}m)</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase">Power Line</div>
            <div className="text-xs font-bold text-cyan-300">Underground HV Grid</div>
          </div>
        </div>
      </div>

      {/* Smart Features */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span>Smart & IoT Capabilities</span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {building.smartFeatures.map((feat, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs bg-slate-800 border border-slate-700/60 rounded-lg text-slate-200"
            >
              {feat}
            </span>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 mb-4 text-xs text-slate-300">
        <span className="font-semibold text-sky-400 block mb-0.5">Primary Purpose:</span>
        {building.purpose}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onEnterRoadView(building.zoneId)}
          className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/20 transition active:scale-95"
        >
          <Navigation className="w-4 h-4" />
          <span>Street View Here</span>
        </button>
      </div>
    </div>
  );
};
