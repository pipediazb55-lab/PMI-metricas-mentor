"use client";
import React, { useState } from 'react';

export default function AntigravityApp() {
  const initialState = { pv: 0, ev: 0, ac: 0, bac: 0 };
  const [values, setValues] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: parseFloat(value) || 0 });
  };

  const handleReset = () => setValues(initialState);

  // Lógica de Negocio (EVM)
  const cv = values.ev - values.ac;
  const sv = values.ev - values.pv;
  const cpi = values.ac > 0 ? (values.ev / values.ac) : 0;
  const spi = values.pv > 0 ? (values.ev / values.pv) : 0;
  const eac = cpi > 0 ? (values.bac / cpi) : 0;
  const etc = eac - values.ac;
  const vac = values.bac - eac;
  const tcpi = (values.bac - values.ac) > 0 ? (values.bac - values.ev) / (values.bac - values.ac) : 0;

  // Recomendación del Asesor (Banner Ejecutivo)
  const getAdvice = () => {
    if (values.ev === 0) return { title: "Esperando Datos", msg: "Inicia el análisis con los datos del caso.", color: "text-slate-400", border: "border-slate-300", bg: "bg-white" };
    if (cpi < 0.5 || spi < 0.5) return { title: "ESTADO DE EMERGENCIA", msg: "Doble desviación crítica. Se requiere intervención de alta dirección y auditoría inmediata.", color: "text-red-700", border: "border-red-600", bg: "bg-red-50" };
    if (cpi < 1 && spi < 1) return { title: "CRÍTICO: ACCIÓN INMEDIATA", msg: "Déficit en costo y tiempo. Prioriza entregables y ajusta la estrategia de recursos.", color: "text-red-600", border: "border-red-400", bg: "bg-white" };
    if (spi < 1) return { title: "ALERTA: RETRASO", msg: "Se recomienda evaluar 'Fast Tracking' o 'Crashing' en la ruta crítica.", color: "text-amber-600", border: "border-amber-400", bg: "bg-white" };
    if (cpi < 1) return { title: "ALERTA: SOBRECOSTO", msg: "Optimiza la eficiencia del gasto; el presupuesto actual es insuficiente.", color: "text-orange-600", border: "border-orange-400", bg: "bg-white" };
    return { title: "DESEMPEÑO ÓPTIMO", msg: "El proyecto cumple con los indicadores de desempeño establecidos.", color: "text-green-600", border: "border-green-500", bg: "bg-green-50/20" };
  };

  const advice = getAdvice();

  return (
    <main className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      <style jsx global>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .crisis-alert { animation: pulse-red 2s infinite; border: 2px solid #dc2626 !important; }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <header className="border-b border-slate-200 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Tsugí-D 🚀</h1>
            <p className="text-slate-500 italic text-sm">Panel Estratégico de Control de Proyectos </p>
          </div>
          <button onClick={handleReset} className="bg-white text-slate-400 hover:text-red-600 px-4 py-2 rounded-lg text-[10px] font-bold border border-slate-200 shadow-sm transition-all uppercase tracking-widest">
            🗑️ REINICIAR DATOS
          </button>
        </header>

        {/* 1. ENTRADAS DE DATOS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "V. PLANEADO (PV)", name: "pv", b: "border-blue-400" },
            { label: "V. GANADO (EV)", name: "ev", b: "border-green-400" },
            { label: "COSTO REAL (AC)", name: "ac", b: "border-red-400" },
            { label: "BAC TOTAL", name: "bac", b: "border-slate-800" },
          ].map((i) => (
            <div key={i.name} className={`bg-white p-5 rounded-xl shadow-sm border-t-4 ${i.b}`}>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">{i.label}</label>
              <input type="number" name={i.name} value={values[i.name] === 0 ? '' : values[i.name]} onChange={handleChange} className="w-full text-2xl font-bold focus:outline-none bg-transparent" placeholder="0" />
            </div>
          ))}
        </section>

        {/* 2. TABLA DE MÉTRICAS COMPLETA */}
        <section className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-800 text-white text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Métrica de Gestión</th>
                <th className="px-6 py-4 text-center">Sigla (Fórmula)</th>
                <th className="px-6 py-4 text-right">Resultado ($)</th>
                <th className="px-6 py-4 text-left italic text-slate-300">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {[
                { n: "Variación de Costo", s: "CV", f: "EV - AC", v: cv, i: cv >= 0 ? "Bajo presupuesto" : "Sobre presupuesto" },
                { n: "Variación de Tiempo", s: "SV", f: "EV - PV", v: sv, i: sv >= 0 ? "Adelantado" : "Retrasado" },
                { n: "Total Proyectado", s: "EAC", f: "BAC / CPI", v: eac, i: "Inversión final estimada" },
                { n: "Saldo por Ejecutar", s: "ETC", f: "EAC - AC", v: etc, i: "Dinero pendiente" },
                { n: "Variación al Cierre", s: "VAC", f: "BAC - EAC", v: vac, i: vac >= 0 ? "Ahorro al final" : "Déficit al final" },
              ].map((m, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{m.n}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-black text-blue-600 mr-2">{m.s}</span>
                    <span className="text-[10px] text-slate-400 italic">({m.f})</span>
                  </td>
                  <td className={`px-6 py-4 text-right font-black ${m.s === 'VAC' ? (m.v >= 0 ? 'text-green-600' : 'text-red-600') : 'text-slate-900'}`}>
                    {Math.round(m.v).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 italic text-slate-500 text-xs">{m.i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 3. EFICIENCIA CON FÓRMULAS Y MODO CRISIS */}
        <section className="grid grid-cols-3 gap-4">
          {[
            { label: "CPI (Eficiencia Costo)", f: "EV / AC", val: cpi, crisis: cpi < 0.5 && values.ev > 0 },
            { label: "SPI (Velocidad Tiempo)", f: "EV / PV", val: spi, crisis: spi < 0.5 && values.ev > 0 },
            { label: "TCPI (Esfuerzo)", f: "(BAC-EV)/(BAC-AC)", val: tcpi, crisis: false },
          ].map((card, idx) => (
            <div key={idx} className={`bg-slate-900 p-6 rounded-2xl shadow-lg text-center transition-all ${card.crisis ? 'crisis-alert bg-red-950' : 'border-b-4 border-slate-700'}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
              <p className="text-[9px] text-slate-500 font-mono italic mb-2">[{card.f}]</p>
              <p className={`text-4xl font-black ${card.label === 'TCPI (Esfuerzo)' ? 'text-blue-500' : (card.val >= 1 ? 'text-green-500' : 'text-red-500')}`}>{card.val.toFixed(2)}</p>
            </div>
          ))}
        </section>

        {/* 4. RECOMENDACIÓN DEL ASESOR (BANNER EJECUTIVO) */}
        <section className={`${advice.bg} p-7 rounded-2xl shadow-md border-l-8 ${advice.border} transition-all duration-500`}>
          <h2 className={`text-lg font-black mb-1 ${advice.color}`}>💡 ESTADO EJECUTIVO: {advice.title}</h2>
          <p className="text-slate-700 font-medium leading-relaxed">{advice.msg}</p>
        </section>

        {/* 5. REGLA DE ORO ORIGINAL */}
        <section className="bg-slate-900 p-8 rounded-2xl text-white shadow-2xl space-y-6 border border-slate-800">
          <h2 className="text-2xl font-black text-blue-400 border-b border-slate-800 pb-2">Regla de Oro para el Análisis</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center gap-5 bg-slate-800/50 p-5 rounded-xl">
              <span className="bg-blue-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">TIEMPO</span>
              <div className="text-xl">Compara <strong>EV</strong> vs <strong>PV</strong></div>
            </div>
            <div className="flex items-center gap-5 bg-slate-800/50 p-5 rounded-xl border-l-4 border-green-500">
              <span className="bg-green-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">COSTO</span>
              <div className="text-xl">Compara <strong>EV</strong> vs <strong>AC</strong></div>
            </div>
          </div>
          <p className="text-slate-500 text-xs italic text-center pt-2">"El valor ganado (EV) es el único dato que mide el avance físico real"</p>
        </section>

        <footer className="pt-6 text-center text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
          Diego Felipe Díaz Burgos | Mentoría Estratégica & Fortalecimiento de la Gestión
        </footer>

      </div>
    </main>
  );
}