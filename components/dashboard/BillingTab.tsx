'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { Printer, Download } from 'lucide-react';

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
      <div className="no-print p-5 rounded-2xl border border-surface-border bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <label className="block text-gsitText-secondary mb-1 font-bold">Número de Acta Oficial</label>
            <input
              type="text"
              value={actaNumber}
              onChange={(e) => setActaNumber(e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gsitText-secondary mb-1 font-bold">Fecha de Corte</label>
            <input
              type="date"
              value={cutoffDate}
              onChange={(e) => setCutoffDate(e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-surface-subtle border border-surface-borderStrong text-xs font-bold text-brand-deep transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-brand-primary" strokeWidth={2} />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-brand-cyan" strokeWidth={2} />
            <span>Imprimir Certificado</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Document with Official Logo */}
      <div className="rounded-2xl border border-surface-border bg-white p-8 shadow-gsit-md space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Certificate Header with Logo */}
        <div className="border-b-2 border-brand-deep pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex items-start gap-4">
            <img src="/logo.png" alt="Logo Global Solutions IT" className="h-12 w-auto object-contain shrink-0" />
            <div>
              <div className="text-xs font-mono text-brand-accent font-bold tracking-widest uppercase">
                DOCUMENTO TÉCNICO OFICIAL DE CORTE DE OBRA
              </div>
              <h2 className="text-xl font-black text-brand-deep tracking-tight mt-0.5">
                ACTA DE METRADO Y CORTE FINANCIERO DE INSTALACIÓN
              </h2>
              <p className="text-xs font-mono text-gsitText-secondary mt-0.5">
                Contratista: <strong>{project.contractor}</strong> &bull; NIT: 901.458.921-3
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-gsitText-secondary space-y-0.5">
            <div><strong>N° ACTA:</strong> {actaNumber}</div>
            <div><strong>FECHA CORTE:</strong> {cutoffDate}</div>
            <div><strong>ESTÁNDAR:</strong> {project.systemType}</div>
          </div>
        </div>

        {/* Project Meta Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-main border border-surface-border text-xs font-mono">
          <div>
            <span className="text-gsitText-muted block">PROYECTO:</span>
            <span className="font-bold text-brand-deep">{project.name}</span>
          </div>
          <div>
            <span className="text-gsitText-muted block">CLIENTE / ENTIDAD:</span>
            <span className="font-bold text-brand-deep">{project.client}</span>
          </div>
          <div>
            <span className="text-gsitText-muted block">INTERVENTORÍA:</span>
            <span className="font-bold text-brand-deep">{project.interventoria}</span>
          </div>
          <div>
            <span className="text-gsitText-muted block">UBICACIÓN:</span>
            <span className="font-bold text-brand-deep">{project.address}</span>
          </div>
        </div>

        {/* Financial Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-xs font-mono">
            <span className="text-gsitText-secondary">Presupuesto Contratado</span>
            <div className="text-lg font-bold text-brand-deep mt-1">
              ${totalBudget.toLocaleString('es-CO')} COP
            </div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono">
            <span className="text-emerald-700 font-bold">Valor Acumulado Ejecutado ({executionPercent}%)</span>
            <div className="text-lg font-black text-emerald-600 mt-1">
              ${executedValue.toLocaleString('es-CO')} COP
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-xs font-mono">
            <span className="text-gsitText-secondary">Saldo Pendiente por Ejecutar</span>
            <div className="text-lg font-bold text-gsitText-main mt-1">
              ${balanceValue.toLocaleString('es-CO')} COP
            </div>
          </div>
        </div>

        {/* Detailed Item List */}
        <div>
          <h4 className="text-xs font-bold uppercase text-brand-deep mb-3">
            Detalle de Metrado Ejecutado en Obra
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-surface-border">
              <thead className="bg-surface-subtle text-gsitText-secondary uppercase font-bold">
                <tr>
                  <th className="p-2 border border-surface-border">Tag</th>
                  <th className="p-2 border border-surface-border">Descripción Técnica</th>
                  <th className="p-2 border border-surface-border">Zona</th>
                  <th className="p-2 border border-surface-border">Cantidad</th>
                  <th className="p-2 border border-surface-border">V. Unitario</th>
                  <th className="p-2 border border-surface-border">Subtotal</th>
                  <th className="p-2 border border-surface-border">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-gsitText-secondary">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 font-bold text-brand-primary border border-surface-border">
                      {item.code}
                    </td>
                    <td className="p-2 font-medium text-brand-deep border border-surface-border">
                      {item.name}
                    </td>
                    <td className="p-2 border border-surface-border">
                      {item.zone}
                    </td>
                    <td className="p-2 font-bold border border-surface-border">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-2 border border-surface-border">
                      ${item.unitPrice.toLocaleString('es-CO')}
                    </td>
                    <td className="p-2 font-bold text-brand-deep border border-surface-border">
                      ${(item.quantity * item.unitPrice).toLocaleString('es-CO')}
                    </td>
                    <td className="p-2 uppercase font-bold text-[10px] border border-surface-border">
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
          <div className="border-t-2 border-brand-deep pt-2">
            <p className="font-bold text-brand-deep">{project.contractor}</p>
            <p className="text-[11px] text-gsitText-secondary">Firma Contratista Ejecutor</p>
          </div>
          <div className="border-t-2 border-brand-deep pt-2">
            <p className="font-bold text-brand-deep">{project.interventoria}</p>
            <p className="text-[11px] text-gsitText-secondary">Firma Interventoría Técnica</p>
          </div>
        </div>
      </div>
    </div>
  );
}
