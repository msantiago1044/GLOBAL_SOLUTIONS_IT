'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { Printer, Download, Camera, Eye, X, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  project: Project;
  items: FloorItem[];
}

export default function BillingTab({ project, items }: Props) {
  // Rango de fechas para el corte
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0] || '2026-10-11');
  const [statusFilter, setStatusFilter] = useState<'executed' | 'installed' | 'inspected' | 'all'>('executed');
  const [actaNumber, setActaNumber] = useState(`ACTA-${Date.now().toString().slice(-6)}`);
  const [previewItem, setPreviewItem] = useState<FloorItem | null>(null);
  const [previewPhotoError, setPreviewPhotoError] = useState(false);

  // Filtrado de elementos para el corte
  const billedItems = items.filter((item) => {
    // 1. Filtro por estado
    if (statusFilter === 'executed' && item.status === 'pending') return false;
    if (statusFilter === 'installed' && item.status !== 'installed') return false;
    if (statusFilter === 'inspected' && item.status !== 'inspected') return false;

    // 2. Filtro por rango de fechas (si está instalado/ejecutado)
    if (item.status !== 'pending') {
      const itemDate = item.installedAt ? item.installedAt.split('T')[0] : null;
      if (itemDate) {
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
      }
    } else {
      // Si el usuario eligió ver 'all' (incluye pendientes), los pendientes no tienen fecha de instalación
      if (statusFilter !== 'all') return false;
    }

    return true;
  });

  // Métricas financieras
  const totalBudget = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  const allExecutedItems = items.filter((i) => i.status !== 'pending');
  const totalExecutedValue = allExecutedItems.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  const corteValue = billedItems.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  const balanceValue = totalBudget - totalExecutedValue;
  const cortePercent = totalBudget > 0 ? Math.round((corteValue / totalBudget) * 100) : 0;
  const executedPercent = totalBudget > 0 ? Math.round((totalExecutedValue / totalBudget) * 100) : 0;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportCSV = () => {
    const headers =
      'Codigo,Nombre,Zona,Cantidad,Unidad,PrecioUnitario,Subtotal,Estado,FechaInstalacion,Cuadrilla,FotoEvidencia,Observaciones\n';
    const rows = billedItems
      .map(
        (i) =>
          `"${i.code}","${i.name}","${i.zone}",${i.quantity},"${i.unit}",${i.unitPrice},${
            i.quantity * i.unitPrice
          },"${i.status}","${i.installedAt ? i.installedAt.split('T')[0] : ''}","${i.installerTeam || ''}","${
            i.photoUrl || ''
          }","${(i.notes || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Corte_Facturacion_${project.id}_${startDate}_a_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Configuration and Controls Bar (no-print) */}
      <div className="no-print p-5 rounded-2xl border border-surface-border bg-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <label className="block text-gsitText-secondary mb-1 font-bold">N° Acta de Corte</label>
            <input
              type="text"
              value={actaNumber}
              onChange={(e) => setActaNumber(e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gsitText-secondary mb-1 font-bold">Desde (Fecha Inicio)</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gsitText-secondary mb-1 font-bold">Hasta (Fecha Fin)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gsitText-secondary mb-1 font-bold">Filtro por Estado</label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'executed' | 'installed' | 'inspected' | 'all')
              }
              className="rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
            >
              <option value="executed">Solo Ejecutados (Instalados &amp; Comisionados)</option>
              <option value="installed">Solo Instalados en Obra</option>
              <option value="inspected">Solo Comisionados / Aprobados</option>
              <option value="all">Todos los Ítems (Incluir Pendientes)</option>
            </select>
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

      {/* Printable Certificate Document with Official Header */}
      <div className="rounded-2xl border border-surface-border bg-white p-8 shadow-gsit-md space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Certificate Header */}
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
            <div><strong>PERÍODO CORTE:</strong> {startDate} al {endDate}</div>
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-xs font-mono">
            <span className="text-gsitText-secondary">Presupuesto Contratado</span>
            <div className="text-lg font-bold text-brand-deep mt-1">
              ${totalBudget.toLocaleString('es-CO')} COP
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs font-mono">
            <span className="text-blue-800 font-bold">Valor Este Corte ({cortePercent}%)</span>
            <div className="text-lg font-black text-blue-700 mt-1">
              ${corteValue.toLocaleString('es-CO')} COP
            </div>
            <span className="text-[10px] text-blue-600 block mt-0.5">
              {billedItems.length} ítems en período
            </span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono">
            <span className="text-emerald-800 font-bold">Acumulado Ejecutado ({executedPercent}%)</span>
            <div className="text-lg font-black text-emerald-600 mt-1">
              ${totalExecutedValue.toLocaleString('es-CO')} COP
            </div>
            <span className="text-[10px] text-emerald-700 block mt-0.5">
              {allExecutedItems.length} de {items.length} totales
            </span>
          </div>
          <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-xs font-mono">
            <span className="text-gsitText-secondary">Saldo Pendiente</span>
            <div className="text-lg font-bold text-gsitText-main mt-1">
              ${balanceValue.toLocaleString('es-CO')} COP
            </div>
          </div>
        </div>

        {/* Detailed Item List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase text-brand-deep">
              Detalle de Metrado Ejecutado en el Período ({billedItems.length} elementos)
            </h4>
            <span className="text-xs font-mono text-gsitText-muted">
              Rango: {startDate} a {endDate} &bull; Criterio:{' '}
              {statusFilter === 'executed'
                ? 'Ejecutados'
                : statusFilter === 'installed'
                ? 'Instalados'
                : statusFilter === 'inspected'
                ? 'Comisionados'
                : 'Todos'}
            </span>
          </div>

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
                  <th className="p-2 border border-surface-border">Fecha Instalación</th>
                  <th className="p-2 border border-surface-border">Evidencia Fotográfica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-gsitText-secondary">
                {billedItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-gsitText-muted">
                      No se encontraron elementos instalados dentro del rango de fechas y estado seleccionados.
                    </td>
                  </tr>
                ) : (
                  billedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-main/60 transition-colors">
                      <td className="p-2 font-bold text-brand-primary border border-surface-border whitespace-nowrap">
                        {item.code}
                      </td>
                      <td className="p-2 font-medium text-brand-deep border border-surface-border">
                        <div>{item.name}</div>
                        {item.notes && (
                          <div className="text-[10px] text-gsitText-muted mt-0.5 truncate max-w-xs" title={item.notes}>
                            📝 {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="p-2 border border-surface-border whitespace-nowrap">
                        {item.zone}
                      </td>
                      <td className="p-2 font-bold border border-surface-border whitespace-nowrap">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="p-2 border border-surface-border whitespace-nowrap">
                        ${item.unitPrice.toLocaleString('es-CO')}
                      </td>
                      <td className="p-2 font-bold text-brand-deep border border-surface-border whitespace-nowrap">
                        ${(item.quantity * item.unitPrice).toLocaleString('es-CO')}
                      </td>
                      <td className="p-2 uppercase font-bold text-[10px] border border-surface-border whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full border ${
                            item.status === 'inspected'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.status === 'installed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2 border border-surface-border whitespace-nowrap text-gsitText-muted text-[11px]">
                        {item.installedAt ? item.installedAt.split('T')[0] : 'Sin fecha'}
                      </td>
                      <td className="p-2 border border-surface-border whitespace-nowrap">
                        {item.photoUrl ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewPhotoError(false);
                                setPreviewItem(item);
                              }}
                              className="no-print inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-deep/5 hover:bg-brand-deep/10 text-brand-deep text-[11px] font-bold border border-brand-primary/20 transition-all"
                            >
                              <Camera className="w-3.5 h-3.5 text-brand-primary" />
                              <span>Ver Foto</span>
                            </button>
                            <span className="print:inline hidden text-[11px] text-emerald-700 font-bold">
                              ✓ Foto adjunta
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gsitText-muted">Sin foto</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
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

      {/* Floating Modal de Evidencia Fotográfica */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-surface-border shadow-2xl max-w-xl w-full overflow-hidden text-xs font-mono">
            {/* Modal Header */}
            <div className="p-4 border-b border-surface-border bg-surface-subtle flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-primary">
                  Evidencia Fotográfica de Instalación
                </span>
                <h3 className="text-sm font-bold text-brand-deep mt-0.5">
                  {previewItem.code} — {previewItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg hover:bg-surface-main text-gsitText-muted hover:text-gsitText-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Photo Display */}
              <div className="rounded-xl overflow-hidden bg-surface-main border border-surface-border aspect-video flex items-center justify-center">
                {previewItem.photoUrl && !previewPhotoError ? (
                  <img
                    src={previewItem.photoUrl}
                    alt={`Evidencia ${previewItem.code}`}
                    onError={() => setPreviewPhotoError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-gsitText-muted space-y-1">
                    <Camera className="w-8 h-8 mx-auto mb-1 opacity-40 text-brand-primary" />
                    <p className="font-bold text-xs text-brand-deep">
                      {previewPhotoError
                        ? 'Fotografía pendiente de sincronización o no disponible'
                        : 'No hay imagen adjunta para este elemento'}
                    </p>
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-main border border-surface-border text-[11px]">
                <div>
                  <span className="text-gsitText-muted block">Ubicación / Zona:</span>
                  <strong className="text-brand-deep">{previewItem.zone}</strong>
                </div>
                <div>
                  <span className="text-gsitText-muted block">Fecha de Instalación:</span>
                  <strong className="text-brand-deep">
                    {previewItem.installedAt ? previewItem.installedAt.replace('T', ' ').substring(0, 16) : 'N/A'}
                  </strong>
                </div>
                <div>
                  <span className="text-gsitText-muted block">Cuadrilla Responsable:</span>
                  <strong className="text-brand-deep">{previewItem.installerTeam || 'No asignada'}</strong>
                </div>
                <div>
                  <span className="text-gsitText-muted block">Estado Técnico:</span>
                  <strong className="text-brand-deep uppercase">{previewItem.status}</strong>
                </div>
              </div>

              {/* Observations */}
              <div>
                <span className="text-gsitText-secondary font-bold block mb-1">
                  Observaciones Técnicas Registradas:
                </span>
                <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border text-gsitText-secondary text-[11px] leading-relaxed">
                  {previewItem.notes || 'Sin observaciones adicionales registradas.'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-surface-border bg-surface-subtle flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
