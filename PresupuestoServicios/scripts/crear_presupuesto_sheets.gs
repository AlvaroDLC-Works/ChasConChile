/**
 * Crea un nuevo Google Spreadsheet con la estructura requerida para
 * la app "Presupuestos Topografía Chile" y añade una plantilla PDF.
 *
 * Uso: copiar este código en un proyecto de Google Apps Script y ejecutar
 * la función crearSpreadsheetPresupuestosTopografiaChile().
 */
function crearSpreadsheetPresupuestosTopografiaChile() {
  var nombreSpreadsheet = 'Presupuestos Topografía Chile';
  var spreadsheet = SpreadsheetApp.create(nombreSpreadsheet);

  var sheets = [
    {
      name: 'Clientes',
      headers: [
        'ID_Cliente',
        'Nombre cliente',
        'RUT',
        'Teléfono',
        'Email',
        'Dirección',
        'Comuna',
        'Tipo cliente',
        'Observaciones'
      ]
    },
    {
      name: 'Proyectos',
      headers: [
        'ID_Proyecto',
        'Fecha solicitud',
        'Cliente',
        'Nombre proyecto',
        'Dirección terreno',
        'Comuna',
        'Tipo de zona',
        'Superficie aproximada m²',
        'Dificultad de acceso',
        'Urgencia',
        'Estado',
        'Observaciones'
      ]
    },
    {
      name: 'Tipos de levantamiento',
      headers: [
        'ID_Tipo_Trabajo',
        'Nombre del servicio',
        'Descripción',
        'Unidad de cobro',
        'Precio base editable',
        'Horas terreno estimadas',
        'Horas gabinete estimadas',
        'Requiere GNSS RTK',
        'Requiere estación total',
        'Requiere nivel',
        'Requiere CAD',
        'Requiere informe',
        'Requiere entrega DWG/PDF'
      ]
    },
    {
      name: 'Variables de costo',
      headers: [
        'ID_Variable',
        'Nombre variable',
        'Categoría',
        'Valor CLP',
        'Unidad',
        'Activo',
        'Observaciones'
      ]
    },
    {
      name: 'Equipos',
      headers: [
        'ID_Equipo',
        'Nombre equipo',
        'Tipo',
        'Costo compra',
        'Vida útil meses',
        'Costo mensual estimado',
        'Costo diario estimado',
        'Activo'
      ]
    },
    {
      name: 'Presupuestos',
      headers: [
        'ID_Presupuesto',
        'Fecha',
        'Proyecto',
        'Cliente',
        'Tipo de levantamiento',
        'Días terreno',
        'Días gabinete',
        'Horas CAD',
        'Distancia estimada km',
        'Número de puntos',
        'Superficie m²',
        'Usa GNSS',
        'Usa estación total',
        'Usa nivel',
        'Incluye informe',
        'Incluye plano CAD',
        'Incluye entrega urgente',
        'Factor comuna',
        'Factor dificultad',
        'Factor urgencia',
        'Costo terreno',
        'Costo gabinete',
        'Costo traslado',
        'Costo equipos',
        'Costo servicios NTRIP/internet',
        'Costo documentación',
        'Subtotal costo directo',
        'Margen utilidad %',
        'Utilidad',
        'Subtotal neto',
        'Retención boleta %',
        'Monto retención',
        'Total líquido esperado',
        'Precio sugerido cliente',
        'Precio final ofertado',
        'Estado presupuesto',
        'Fecha envío',
        'Observaciones'
      ]
    }
  ];

  var defaultSheet = spreadsheet.getSheets()[0];
  defaultSheet.setName(sheets[0].name);
  defaultSheet.getRange(1, 1, 1, sheets[0].headers.length).setValues([sheets[0].headers]);

  for (var i = 1; i < sheets.length; i++) {
    var sheet = spreadsheet.insertSheet(sheets[i].name);
    sheet.getRange(1, 1, 1, sheets[i].headers.length).setValues([sheets[i].headers]);
  }

  crearSheetPDFTemplate(spreadsheet);

  Logger.log('Spreadsheet creado: ' + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

function crearSheetPDFTemplate(spreadsheet) {
  var templateName = 'PDF Template';
  var template = spreadsheet.getSheetByName(templateName);
  if (!template) {
    template = spreadsheet.insertSheet(templateName);
  } else {
    template.clear();
  }

  var header = [['ID_Presupuesto para exportar', 'PR001']];
  template.getRange(1, 1, 1, 2).setValues(header);
  template.getRange('A1:B1').setFontWeight('bold');

  var rows = [
    ['Documento', 'Presupuesto Topografía Chile'],
    ['Fecha', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 2, FALSE), ""))'],
    ['Proyecto', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 3, FALSE), ""))'],
    ['Cliente', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 4, FALSE), ""))'],
    ['Tipo levantamiento', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 5, FALSE), ""))'],
    ['Días terreno', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 6, FALSE), ""))'],
    ['Días gabinete', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 7, FALSE), ""))'],
    ['Horas CAD', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 8, FALSE), ""))'],
    ['Distancia estimada km', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 9, FALSE), ""))'],
    ['Superficie m²', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 11, FALSE), ""))'],
    ['Usa GNSS', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 12, FALSE), ""))'],
    ['Incluye plano CAD', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 16, FALSE), ""))'],
    ['Subtotal costo directo', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 27, FALSE), ""))'],
    ['Utilidad', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 31, FALSE), ""))'],
    ['Precio sugerido cliente', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 34, FALSE), ""))'],
    ['Monto retención', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 36, FALSE), ""))'],
    ['Total líquido esperado', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 37, FALSE), ""))'],
    ['Estado presupuesto', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 40, FALSE), ""))'],
    ['Observaciones', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:AL"), 41, FALSE), ""))']
  ];

  template.getRange(3, 1, rows.length, 2).setValues(rows);
  template.getRange(3, 1, rows.length, 1).setFontWeight('bold');
  template.setColumnWidth(1, 220);
  template.setColumnWidth(2, 420);
}

function exportarPresupuestoAPDF(spreadsheetId, idPresupuesto) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var templateSheet = spreadsheet.getSheetByName('PDF Template');
  if (!templateSheet) {
    throw new Error('No se encontró la hoja PDF Template. Ejecuta crearSpreadsheetPresupuestosTopografiaChile primero.');
  }

  templateSheet.getRange('B1').setValue(idPresupuesto);
  SpreadsheetApp.flush();

  var url = 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/export?';
  var exportOptions = [
    'exportFormat=pdf',
    'format=pdf',
    'size=letter',
    'portrait=true',
    'fitw=true',
    'sheetnames=false',
    'printtitle=false',
    'pagenumbers=false',
    'gridlines=false',
    'fzr=false',
    'gid=' + templateSheet.getSheetId(),
    'horizontal_alignment=CENTER'
  ].join('&');

  var token = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(url + exportOptions, {
    headers: { Authorization: 'Bearer ' + token }
  });

  var blob = response.getBlob().setName('Presupuesto-' + idPresupuesto + '.pdf');
  var folder = DriveApp.getRootFolder();
  var file = folder.createFile(blob);
  return file.getUrl();
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var spreadsheetId = payload.spreadsheetId;
    var idPresupuesto = payload.idPresupuesto;
    if (!spreadsheetId || !idPresupuesto) {
      throw new Error('Faltan parámetros: spreadsheetId o idPresupuesto');
    }
    var pdfUrl = exportarPresupuestoAPDF(spreadsheetId, idPresupuesto);
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      pdfUrl: pdfUrl
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function insertarDatosEjemplo() {
  var spreadsheet = SpreadsheetApp.getActive();

  var clientes = spreadsheet.getSheetByName('Clientes');
  clientes.getRange(2, 1, 2, 9).setValues([
    ['C001', 'Juan Perez', '11.111.111-1', '+56961234567', 'juan.perez@mail.cl', 'Av. Principal 123', 'Vitacura', 'Particular', 'Cliente demo'],
    ['C002', 'Constructora ABC', '76.543.210-9', '+5622345678', 'contacto@constructoraabc.cl', 'Av. Obra 45', 'San Bernardo', 'Constructor', 'Cliente demo']
  ]);

  var proyectos = spreadsheet.getSheetByName('Proyectos');
  proyectos.getRange(2, 1, 2, 12).setValues([
    ['P001', '2026-06-01', 'C001', 'Casa Perez', 'Los Bosques 10', 'Vitacura', 'Alta plusvalía', 250, 'Media', 'Normal', 'Consulta', 'Ejemplo Vitacura'],
    ['P002', '2026-06-05', 'C002', 'Condominio Alfa', 'Laguna 45', 'San Bernardo', 'Urbana', 800, 'Baja', 'Normal', 'Presupuestado', 'Ejemplo San Bernardo']
  ]);

  var tipos = spreadsheet.getSheetByName('Tipos de levantamiento');
  tipos.getRange(2, 1, 3, 13).setValues([
    ['T001', 'Levantamiento de límites de terreno', 'Medición de deslindes', 'Día', 120000, 1, 4, 'Sí', 'Sí', 'No', 'Sí', 'Sí', 'Sí'],
    ['T002', 'Levantamiento planimétrico simple', 'Planimetría básica', 'Proyecto', 90000, 1, 2, 'Sí', 'No', 'No', 'Sí', 'No', 'Sí'],
    ['T003', 'Apoyo topográfico por día', 'Apoyo por jornada', 'Día', 80000, 1, 0, 'Sí', 'No', 'No', 'No', 'No', 'No']
  ]);

  var variables = spreadsheet.getSheetByName('Variables de costo');
  variables.getRange(2, 1, 11, 7).setValues([
    ['V001', 'Costo diario operador', 'Operación', 80000, 'día', 'Sí', ''],
    ['V002', 'Costo hora gabinete', 'Operación', 15000, 'hora', 'Sí', ''],
    ['V003', 'Costo hora CAD', 'Operación', 12000, 'hora', 'Sí', ''],
    ['V004', 'Costo traslado base', 'Servicios', 5000, 'unidad', 'Sí', ''],
    ['V005', 'Costo por km adicional', 'Servicios', 200, 'km', 'Sí', ''],
    ['V006', 'Costo NTRIP mensual prorrateado', 'Servicios', 20000, 'mes', 'Sí', ''],
    ['V007', 'Costo chip internet mensual prorrateado', 'Servicios', 10000, 'mes', 'Sí', ''],
    ['V008', 'Margen de utilidad recomendado %', 'Factor', 30, '%', 'Sí', ''],
    ['V009', 'Retención boleta honorarios %', 'Impuestos', 10, '%', 'Sí', ''],
    ['V010', 'Factor comuna alta plusvalía', 'Factor', 1.2, 'unidad', 'Sí', ''],
    ['V011', 'Factor urgencia', 'Factor', 1.25, 'unidad', 'Sí', '']
  ]);

  var equipos = spreadsheet.getSheetByName('Equipos');
  equipos.getRange(2, 1, 3, 8).setValues([
    ['E001', 'GNSS RTK Trimble', 'GNSS', 4500000, 60, 75000, 30000, 'Sí'],
    ['E002', 'Estación Total Leica', 'Estación Total', 3200000, 60, 53333, 22000, 'Sí'],
    ['E003', 'Notebook Ruger', 'Notebook', 1200000, 48, 25000, 10000, 'Sí']
  ]);

  var presupuestos = spreadsheet.getSheetByName('Presupuestos');
  presupuestos.getRange(2, 1, 1, 41).setValues([
    ['PR001', '2026-06-02', 'P001', 'C001', 'T001', 1, 1, 2, 12, 50, 250, 'Sí', 'Sí', 'No', 'Sí', 'Sí', 'No', 1.2, 1.0, 1.0, 80000, 12000, 7400, 30000, 1500, 2000, 125900, 30, 37770, 163670, 10, 16367, 147303, 163670, 160000, 'Borrador', '', 'Caso ejemplo Casa pequeña Vitacura']
  ]);
}
