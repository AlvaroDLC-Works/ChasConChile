/**
 * Crea un Google Spreadsheet base para la app de topografía urbana en AppSheet.
 * La hoja generada contiene las tablas principales y la plantilla para PDF.
 */
function crearSpreadsheetTopografiaChile() {
  var nombreSpreadsheet = 'Topografia Urbana AppSheet - Estructura Inicial';
  var spreadsheet = SpreadsheetApp.create(nombreSpreadsheet);

  var sheets = [
    {
      name: 'Clientes',
      headers: [
        'ClienteID',
        'NombreCliente',
        'TipoCliente',
        'RUT',
        'Email',
        'Telefono',
        'DireccionFacturacion',
        'Comuna',
        'ObservacionesCliente',
        'FechaCreacion',
        'EstadoCliente'
      ]
    },
    {
      name: 'Solicitudes',
      headers: [
        'SolicitudID',
        'ClienteID',
        'FechaSolicitud',
        'TipoServicio',
        'DireccionTerreno',
        'Comuna',
        'SuperficieEstimadaM2',
        'AnchoEstimadoM',
        'LargoEstimadoM',
        'AccesoTerreno',
        'Vegetacion',
        'ObstruccionGNSS',
        'RequierePlanoDWG',
        'RequiereInformePDF',
        'RequiereFotos',
        'RequiereCoordenadas',
        'DiasEstimadosCampo',
        'DiasEstimadosOficina',
        'Prioridad',
        'EstadoSolicitud',
        'PresupuestoID',
        'ProyectoID'
      ]
    },
    {
      name: 'Presupuestos',
      headers: [
        'PresupuestoID',
        'SolicitudID',
        'ClienteID',
        'FechaPresupuesto',
        'ValidezDias',
        'TipoServicio',
        'SuperficieM2',
        'ValorBase',
        'FactorComuna',
        'FactorUrgencia',
        'FactorComplejidad',
        'CostoCORS',
        'CostoMovilizacion',
        'CostoProcesamiento',
        'CostoInforme',
        'CostoPlanoDWG',
        'Subtotal',
        'IVA',
        'Total',
        'FormaPago',
        'EstadoPresupuesto',
        'PDFPresupuesto',
        'ObservacionesPresupuesto',
        'FechaEnvio',
        'EnviadoACliente'
      ]
    },
    {
      name: 'Proyectos',
      headers: [
        'ProyectoID',
        'PresupuestoID',
        'ClienteID',
        'NombreProyecto',
        'DireccionTerreno',
        'Comuna',
        'FechaInicio',
        'FechaFinEstimada',
        'FechaFinReal',
        'Responsable',
        'MetodoMedicion',
        'EquipoRecomendado',
        'SistemaCoordenadas',
        'EstadoProyecto',
        'CarpetaDriveProyecto',
        'ObservacionesProyecto'
      ]
    },
    {
      name: 'Checklist PreCampo',
      headers: [
        'ChecklistID',
        'ProyectoID',
        'EscrituraRecibida',
        'PlanoExistenteRecibido',
        'DireccionVerificada',
        'AccesoConfirmado',
        'ClienteConfirmado',
        'RedCORSVerificada',
        'ChipInternetActivo',
        'BateriasCargadas',
        'BastonYBipodeListos',
        'HuinchaDisponible',
        'EPPDisponible',
        'FechaSalidaProgramada',
        'ObservacionesPreCampo',
        'EstadoChecklist'
      ]
    },
    {
      name: 'Salidas a Campo',
      headers: [
        'SalidaID',
        'ProyectoID',
        'FechaCampo',
        'HoraInicio',
        'HoraFin',
        'Operador',
        'Clima',
        'EstadoCORS',
        'EstadoRTK',
        'SatelitesPromedio',
        'RMSHorizontalPromedio',
        'RMSVerticalPromedio',
        'EquipoUsado',
        'ObservacionesCampo',
        'EstadoSalida'
      ]
    },
    {
      name: 'Puntos Levantados',
      headers: [
        'PuntoID',
        'ProyectoID',
        'SalidaID',
        'CodigoPunto',
        'DescripcionPunto',
        'Este',
        'Norte',
        'Cota',
        'RMSHorizontal',
        'RMSVertical',
        'EstadoRTK',
        'TipoPunto',
        'FotoAsociada',
        'ObservacionesPunto'
      ]
    },
    {
      name: 'Fotografias',
      headers: [
        'FotoID',
        'ProyectoID',
        'SalidaID',
        'PuntoID',
        'FechaFoto',
        'TipoFoto',
        'ArchivoFoto',
        'DescripcionFoto',
        'ObservacionesFoto'
      ]
    },
    {
      name: 'Procesamiento',
      headers: [
        'ProcesamientoID',
        'ProyectoID',
        'FechaProcesamiento',
        'Responsable',
        'ArchivoCSV',
        'ArchivoRAW',
        'ArchivoDWG',
        'ArchivoDXF',
        'ArchivoKML',
        'ArchivoExcelCalculos',
        'SuperficieMedidaM2',
        'SuperficieEscrituraM2',
        'DiferenciaM2',
        'DiferenciaPorcentaje',
        'ControlCierreCM',
        'EstadoProcesamiento',
        'ObservacionesProcesamiento'
      ]
    },
    {
      name: 'Entregables',
      headers: [
        'EntregableID',
        'ProyectoID',
        'TipoEntregable',
        'ArchivoEntregable',
        'FechaGeneracion',
        'EstadoEntregable',
        'RequiereCliente',
        'ObservacionesEntregable',
        'EnlaceDrive'
      ]
    },
    {
      name: 'Informes',
      headers: [
        'InformeID',
        'ProyectoID',
        'FechaInforme',
        'Version',
        'ObjetivoTrabajo',
        'Ubicacion',
        'Metodologia',
        'EquipoUtilizado',
        'SistemaCoordenadas',
        'Resultados',
        'ObservacionesTecnicas',
        'Conclusiones',
        'ArchivoPDF',
        'EstadoInforme'
      ]
    },
    {
      name: 'Pagos',
      headers: [
        'PagoID',
        'ProyectoID',
        'ClienteID',
        'PresupuestoID',
        'FechaCobro',
        'MontoTotal',
        'MontoPagado',
        'Saldo',
        'EstadoPago',
        'MedioPago',
        'BoletaEmitida',
        'NumeroBoleta',
        'ObservacionesPago'
      ]
    },
    {
      name: 'Parametros',
      headers: [
        'ParametroID',
        'NombreParametro',
        'Valor',
        'Unidad',
        'Categoria',
        'Activo'
      ]
    }
  ];

  var firstSheet = spreadsheet.getSheets()[0];
  firstSheet.setName(sheets[0].name);
  firstSheet.getRange(1, 1, 1, sheets[0].headers.length).setValues([sheets[0].headers]);

  for (var i = 1; i < sheets.length; i++) {
    var sheet = spreadsheet.insertSheet(sheets[i].name);
    sheet.getRange(1, 1, 1, sheets[i].headers.length).setValues([sheets[i].headers]);
  }

  crearSheetPDFTemplate(spreadsheet);
  SpreadsheetApp.flush();

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

  template.getRange(1, 1, 1, 2).setValues([['ID_Presupuesto para exportar', 'PR001']]);
  template.getRange('A1:B1').setFontWeight('bold');

  var rows = [
    ['Documento', 'Presupuesto Topografía Chile'],
    ['Fecha', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 4, FALSE), ""))'],
    ['Proyecto', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 3, FALSE), ""))'],
    ['Cliente', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 3, FALSE), ""))'],
    ['Tipo servicio', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 6, FALSE), ""))'],
    ['Superficie m²', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 7, FALSE), ""))'],
    ['Valor base', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 8, FALSE), ""))'],
    ['Subtotal', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 17, FALSE), ""))'],
    ['IVA', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 18, FALSE), ""))'],
    ['Total', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 19, FALSE), ""))'],
    ['Estado presupuesto', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 21, FALSE), ""))'],
    ['Observaciones', '=IF($B$1="", "", IFERROR(VLOOKUP($B$1, INDIRECT("Presupuestos!A:Z"), 23, FALSE), ""))']
  ];

  template.getRange(3, 1, rows.length, 2).setValues(rows);
  template.getRange(3, 1, rows.length, 1).setFontWeight('bold');
  template.setColumnWidth(1, 240);
  template.setColumnWidth(2, 500);
}

/**
 * Inserta datos de ejemplo básicos para validar la estructura.
 */
function insertarDatosEjemploTopografia() {
  var spreadsheet = SpreadsheetApp.getActive();
  var clientes = spreadsheet.getSheetByName('Clientes');
  if (clientes) {
    clientes.getRange(2, 1, 2, 11).setValues([
      ['CL001', 'Topografia Vitacura', 'Empresa', '76.123.456-7', '+56912345678', 'Av. Vitacura 100', 'Vitacura', 'Observaciones de cliente', '=TODAY()', 'Activo'],
      ['CL002', 'Arquitecto Perez', 'Arquitecto', '12.345.678-9', '+56998765432', 'Av. Providencia 500', 'Providencia', 'Cliente recurrente', '=TODAY()', 'Activo']
    ]);
  }

  var solicitudes = spreadsheet.getSheetByName('Solicitudes');
  if (solicitudes) {
    solicitudes.getRange(2, 1, 1, 22).setValues([
      ['S001', 'CL001', '=TODAY()', 'Levantamiento RTK CORS', 'Av. El Bosque 123', 'Vitacura', 320, 16, 20, 'Facil', 'Baja', 'Baja', 'Sí', 'Sí', 'Sí', 'Sí', 2, 1, 'Normal', 'Nueva', '', '']
    ]);
  }

  var presupuestos = spreadsheet.getSheetByName('Presupuestos');
  if (presupuestos) {
    presupuestos.getRange(2, 1, 1, 25).setValues([
      ['PRES001', 'S001', 'CL001', '=TODAY()', 15, 'Levantamiento RTK CORS', 320, 120000, 1.0, 1.0, 1.0, 45000, 20000, 15000, 10000, 8000, 225000, 42750, 267750, 'Transferencia', 'Borrador', '', 'Presupuesto inicial de prueba', '', 'No']
    ]);
  }
}

/**
 * Crea la estructura de carpetas en Google Drive para un proyecto dado.
 * Devuelve el URL de la carpeta creada.
 */
function crearEstructuraCarpetaProyecto(proyectoID, nombreCliente, direccionTerreno) {
  var nombreCarpeta = Utilities.formatString('%s_%s_%s', proyectoID, nombreCliente, direccionTerreno).replace(/[^a-zA-Z0-9_\- ]/g, '_');
  var root = DriveApp.getRootFolder();
  var proyectoFolder = root.createFolder(nombreCarpeta);

  var carpetas = [
    '01_ANTECEDENTES',
    '02_CAMPO',
    '02_CAMPO/FOTOS',
    '02_CAMPO/DATOS_GNSS',
    '02_CAMPO/BITACORA',
    '03_PROCESAMIENTO',
    '03_PROCESAMIENTO/CSV',
    '03_PROCESAMIENTO/DWG',
    '03_PROCESAMIENTO/DXF',
    '03_PROCESAMIENTO/KML',
    '03_PROCESAMIENTO/EXCEL',
    '04_PLANOS',
    '04_PLANOS/PDF',
    '04_PLANOS/DWG',
    '05_INFORME',
    '06_ENTREGA_CLIENTE',
    '07_ADMINISTRATIVO',
    '07_ADMINISTRATIVO/PRESUPUESTO',
    '07_ADMINISTRATIVO/BOLETA',
    '07_ADMINISTRATIVO/COMPROBANTES'
  ];

  for (var i = 0; i < carpetas.length; i++) {
    var subPath = carpetas[i].split('/');
    var parent = proyectoFolder;
    for (var j = 0; j < subPath.length; j++) {
      var name = subPath[j];
      var child = parent.getFoldersByName(name);
      if (child.hasNext()) {
        parent = child.next();
      } else {
        parent = parent.createFolder(name);
      }
    }
  }

  Logger.log('Carpeta proyecto creada: ' + proyectoFolder.getUrl());
  return proyectoFolder.getUrl();
}

/**
 * Crea carpetas de proyecto en Drive para cada fila de Proyectos sin carpeta definida.
 */
function crearCarpetasProyectoDesdeSheet() {
  var spreadsheet = SpreadsheetApp.getActive();
  var proyectosSheet = spreadsheet.getSheetByName('Proyectos');
  if (!proyectosSheet) {
    throw new Error('No se encontró la hoja Proyectos');
  }

  var data = proyectosSheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf('ProyectoID');
  var clienteIndex = headers.indexOf('ClienteID');
  var dirIndex = headers.indexOf('DireccionTerreno');
  var carpetaIndex = headers.indexOf('CarpetaDriveProyecto');

  if (idIndex < 0 || clienteIndex < 0 || dirIndex < 0 || carpetaIndex < 0) {
    throw new Error('No se encontraron las columnas necesarias en la hoja Proyectos');
  }

  var clientesSheet = spreadsheet.getSheetByName('Clientes');
  var clientes = {};
  if (clientesSheet) {
    var clienteData = clientesSheet.getDataRange().getValues();
    var idClienteIndex = clienteData[0].indexOf('ClienteID');
    var nombreClienteIndex = clienteData[0].indexOf('NombreCliente');
    for (var c = 1; c < clienteData.length; c++) {
      if (clienteData[c][idClienteIndex]) {
        clientes[clienteData[c][idClienteIndex]] = clienteData[c][nombreClienteIndex];
      }
    }
  }

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[idIndex] || row[carpetaIndex]) {
      continue;
    }

    var clienteNombre = clientes[row[clienteIndex]] || 'ClienteDesconocido';
    var url = crearEstructuraCarpetaProyecto(row[idIndex], clienteNombre, row[dirIndex]);
    proyectosSheet.getRange(i + 1, carpetaIndex + 1).setValue(url);
  }

  SpreadsheetApp.flush();
}
