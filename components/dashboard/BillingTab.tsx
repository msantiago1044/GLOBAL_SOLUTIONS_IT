'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { Printer, Download, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  project: Project;
  items: FloorItem[];
}

export default function BillingTab({ project, items }: Props) {
  const [cutoffDate, setCutoffDate] = useState('2026-10-10');
  const [actaNumber, setActaNumber] = useState(`ACTA-${Date.now().toString().slice(-6)}`);

  const installedItems = items.filter((i) => i.status !== 'pending');
  const totalBudget = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  const executedValue = installedItems.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  const balanceValue = totalBudget - executedValue;
  const executionPercent = totalBudget > 0 ? Math.round((executedValue / totalBudget) * 100) : 0;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportCSV = () => {
    const headers = 'Codigo,Nombre,Zona,Cantidad,Unidad,PrecioUnitario,Subtotal,Estado\n';
    const rows = items
      .map(
        (i) =>
          `"${i.code}","${i.name}","${i.zone}",${i.quantity},"${i.unit}",${i.unitPrice},${
            i.quantity * i.unitPrice
          },"${i.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Corte_Metrado_${project.id}_${cutoffDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Configuration and Controls Bar (no-print) */}
      <div className="no-print p-4 rounded-xl border border-industrial-800 bg-industrial-900 shadow-industrial-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <label className="block text-industrial-400 mb-1">Número de Acta Oficial</label>
            <input
              type="text"
              value={actaNumber}
              onChange={(e) => setActaNumber(e.target.value)}
              className="rounded border border-industrial-800 bg-industrial-950 px-2.5 py-1.5 text-white focus:border-radar-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-industrial-400 mb-1">Fecha de Corte</label>
            <input
              type="date"
              value={cutoffDate}
              onChange={(e) => setCutoffDate(e.target.value)}
              className="rounded border border-industrial-800 bg-industrial-950 px-2.5 py-1.5 text-white focus:border-radar-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-xs font-mono text-white transition-colors"
          >
            <Download className="w-4 h-4 text-radar-500" strokeWidth={1.75} />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-radar-500 hover:bg-radar-400 text-industrial-950 font-bold text-xs font-mono transition-colors shadow-industrial-sm"
          >
            <Printer className="w-4 h-4" strokeWidth={2} />
            <span>Imprimir Certificado</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Document */}
      <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-8 shadow-2xl space-y-6 print:border-none print:bg-white print:text-black print:p-0">
        {/* Certificate Header */}
        <div className="border-b-2 border-radar-500 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="text-xs font-mono text-radar-500 font-bold tracking-widest uppercase">
              DOCUMENTO TÉCNICO OFICIAL DE CORTE DE OBRA
            </div>
            <h2 className="text-xl font-extrabold text-white print:text-black tracking-wide mt-1">
              ACTA DE METRADO Y CORTE FINANCIERO DE INSTALACIÓN
            </h2>
            <p className="text-xs font-mono text-industrial-400 print:text-gray-600 mt-0.5">
              Contratista: <strong>{project.contractor}</strong> &bull; NIT: 901.458.921-3
            </p>
          </div>

          <div className="text-right font-mono text-xs text-industrial-300 print:text-gray-800 space-y-0.5">
            <div><strong>N° ACTA:</strong> {actaNumber}</div>
            <div><strong>FECHA CORTE:</strong> {cutoffDate}</div>
            <div><strong>ESTÁNDAR:</strong> {project.systemType}</div>
          </div>
        </div>

        {/* Project Meta Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-industrial-950/70 border border-industrial-800 print:bg-gray-50 print:border-gray-300 text-xs font-mono">
          <div>
            <span className="text-industrial-500 print:text-gray-500 block">PROYECTO:</span>
            <span className="font-bold text-white print:text-black">{project.name}</span>
          </div>
          <div>
            <span className="text-industrial-500 print:text-gray-500 block">CLIENTE / ENTIDAD:</span>
            <span className="font-bold text-white print:text-black">{project.client}</span>
          </div>
          <div>
            <span className="text-industrial-500 print:text-gray-500 block">INTERVENTORÍA:</span>
            <span className="font-bold text-white print:text-black">{project.interventoria}</span>
          </div>
          <div>
            <span className="text-industrial-500 print:text-gray-500 block">UBICACIÓN:</span>
            <span className="font-bold text-white print:text-black">{project.address}</span>
          </div>
        </div>

        {/* Financial Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-industrial-850/60 border border-industrial-800 print:bg-gray-100 print:border-gray-300 text-xs font-mono">
            <span className="text-industrial-400 print:text-gray-600">Presupuesto Contratado</span>
            <div className="text-lg font-bold text-white print:text-black mt-1">
              ${totalBudget.toLocaleString('es-CO')} COP
            </div>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 print:bg-emerald-50 print:border-emerald-300 text-xs font-mono">
            <span className="text-emerald-400 print:text-emerald-700">Valor Acumulado Ejecutado ({executionPercent}%)</span>
            <div className="text-lg font-bold text-emerald-400 print:text-emerald-800 mt-1">
              ${executedValue.toLocaleString('es-CO')} COP
            </div>
          </div>
          <div className="p-4 rounded-lg bg-industrial-850/60 border border-industrial-800 print:bg-gray-100 print:border-gray-300 text-xs font-mono">
            <span className="text-industrial-400 print:text-gray-600">Saldo Pendiente por Ejecutar</span>
            <div className="text-lg font-bold text-industrial-300 print:text-gray-700 mt-1">
              ${balanceValue.toLocaleString('es-CO')} COP
            </div>
          </div>
        </div>

        {/* Detailed Item List */}
        <div>
          <h4 className="text-xs font-bold font-mono uppercase text-white print:text-black mb-3">
            Detalle de Metrado Ejecutado en Obra
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-industrial-800 print:border-gray-300">
              <thead className="bg-industrial-850 print:bg-gray-200 text-industrial-400 print:text-gray-700 uppercase">
                <tr>
                  <th className="p-2 border border-industrial-800 print:border-gray-300">Tag</th>
                  <th className="p-2 border border-industrial-800 print:border-gray-300">Descripción Técnica</th>
                  <th className="p-2 border border-industrial-800 print:border-gray-300">Zona</th>
                  <th className="p-2 border border-industrial-800 print:border-gray-300">Cantidad</th>
                  <th className="p-2 border border-industrial-800 print:border-gray-300">V. Unitario</th>
                  <th className="p-2 border border-industrial-800 print:border-gray-300">Subtotal</th>
                  <th className="p-2 border border-industrial-800 print:border-gray-300">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-850 print:divide-gray-300 text-industrial-300 print:text-gray-800">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 font-bold text-radar-500 print:text-gray-900 border border-industrial-800 print:border-gray-300">
                      {item.code}
                    </td>
                    <td className="p-2 border border-industrial-800 print:border-gray-300">
                      {item.name}
                    </td>
                    <td className="p-2 border border-industrial-800 print:border-gray-300">
                      {item.zone}
                    </td>
                    <td className="p-2 font-bold border border-industrial-800 print:border-gray-300">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-2 border border-industrial-800 print:border-gray-300">
                      ${item.unitPrice.toLocaleString('es-CO')}
                    </td>
                    <td className="p-2 font-bold border border-industrial-800 print:border-gray-300">
                      ${(item.quantity * item.unitPrice).toLocaleString('es-CO')}
                    </td>
                    <td className="p-2 uppercase font-semibold text-[10px] border border-industrial-800 print:border-gray-300">
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="pt-12 grid grid-cols-2 gap-12 font-mono text-xs text-center">
          <div className="border-t border-industrial-700 print:border-black pt-2">
            <p className="font-bold text-white print:text-black">{project.contractor}</p>
            <p className="text-[11px] text-industrial-400 print:text-gray-600">Firma Contratista Ejecutor</p>
          </div>
          <div className="border-t border-industrial-700 print:border-black pt-2">
            <p className="font-bold text-white print:text-black">{project.interventoria}</p>
            <p className="text-[11px] text-industrial-400 print:text-gray-600">Firma Interventoría Técnica</p>
          </div>
        </div>
      </div>
    </div>
  );
}
