/**
 * Apps Script opcional para Google Sheets.
 * Proyecto: Control Empresa Topografia Chile
 *
 * Uso sugerido:
 * 1. En Google Sheets: Extensiones > Apps Script.
 * 2. Pega este archivo.
 * 3. Ajusta EMAIL_ADMIN.
 * 4. Crea triggers diarios/mensuales desde Apps Script.
 *
 * AppSheet puede reemplazar la mayoria de estas funciones con Bots.
 */

const EMAIL_ADMIN = 'admin@tuempresa.cl';
const IVA_ALERTA_CLP = 500000;

function enviarResumenMensual() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();

  const flujo = buscarFilaPorMesAnio_(ss.getSheetByName('Flujo_Caja'), mes, anio);
  const impuesto = buscarFilaPorMesAnio_(ss.getSheetByName('Impuestos'), mes, anio);
  const kpi = buscarFilaPorMesAnio_(ss.getSheetByName('KPI'), mes, anio);

  const html = `
    <h2>Resumen mensual - ${mes}/${anio}</h2>
    <p><b>Ingresos:</b> ${formatoClp_(flujo.Total_Ingresos)}</p>
    <p><b>Egresos:</b> ${formatoClp_(flujo.Total_Egresos)}</p>
    <p><b>Impuestos:</b> ${formatoClp_(flujo.Total_Impuestos)}</p>
    <p><b>Saldo final:</b> ${formatoClp_(flujo.Saldo_Final)}</p>
    <p><b>IVA a pagar:</b> ${formatoClp_(impuesto.IVA_A_Pagar)}</p>
    <p><b>Utilidad neta:</b> ${formatoClp_(kpi.Utilidad_Neta)}</p>
    <p><b>Recuperacion inversion:</b> ${formatoPct_(kpi.Porcentaje_Recuperacion_Inversion)}</p>
  `;

  MailApp.sendEmail({
    to: EMAIL_ADMIN,
    subject: `Resumen financiero ${mes}/${anio} - Control Empresa Topografia Chile`,
    htmlBody: html
  });
}

function alertarDocumentosPorVencer() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Documentos');
  const rows = tableObjects_(sheet);
  const hoy = new Date();
  const limite = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);

  const vencen = rows.filter(row => {
    const vencimiento = parseDate_(row.Vencimiento);
    return vencimiento && vencimiento >= hoy && vencimiento <= limite && row.Estado !== 'Archivado';
  });

  if (!vencen.length) return;

  const html = vencen.map(row => `<li>${row.Nombre_Documento} - vence ${row.Vencimiento}</li>`).join('');
  MailApp.sendEmail({
    to: EMAIL_ADMIN,
    subject: 'Documentos proximos a vencer',
    htmlBody: `<h2>Documentos proximos a vencer</h2><ul>${html}</ul>`
  });
}

function alertarCotizacionesSinRespuesta() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Cotizaciones');
  const rows = tableObjects_(sheet);
  const hoy = new Date();

  const pendientes = rows.filter(row => {
    const fechaEnvio = parseDate_(row.Fecha_Envio);
    const dias = fechaEnvio ? Math.floor((hoy - fechaEnvio) / (24 * 60 * 60 * 1000)) : 0;
    return row.Estado === 'Enviada' && dias > 7;
  });

  if (!pendientes.length) return;

  const html = pendientes.map(row => `<li>${row.ID_Cotizacion} - ${row.Nombre_Proyecto} - ${row.ID_Cliente}</li>`).join('');
  MailApp.sendEmail({
    to: EMAIL_ADMIN,
    subject: 'Cotizaciones sin respuesta por mas de 7 dias',
    htmlBody: `<h2>Cotizaciones pendientes de seguimiento</h2><ul>${html}</ul>`
  });
}

function alertarIvaAlto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();
  const impuesto = buscarFilaPorMesAnio_(ss.getSheetByName('Impuestos'), mes, anio);

  if (Number(impuesto.IVA_A_Pagar || 0) <= IVA_ALERTA_CLP) return;

  MailApp.sendEmail({
    to: EMAIL_ADMIN,
    subject: `Alerta IVA estimado alto ${mes}/${anio}`,
    htmlBody: `<p>IVA estimado a pagar: <b>${formatoClp_(impuesto.IVA_A_Pagar)}</b></p>`
  });
}

function buscarFilaPorMesAnio_(sheet, mes, anio) {
  return tableObjects_(sheet).find(row => Number(row.Mes) === Number(mes) && Number(row['Año']) === Number(anio)) || {};
}

function tableObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1)
    .filter(row => row.some(cell => cell !== '' && cell !== null))
    .map(row => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
}

function parseDate_(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function formatoClp_(value) {
  return Number(value || 0).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });
}

function formatoPct_(value) {
  return Number(value || 0).toLocaleString('es-CL', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
}
