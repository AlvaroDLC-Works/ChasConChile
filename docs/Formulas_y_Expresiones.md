Fórmulas principales (Google Sheets) y expresiones AppSheet
==========================================================

Convenciones:
- Supongamos que la hoja `Variables de costo` tiene columnas: A=ID_Variable, B=Nombre variable, C=Categoría, D=Valor CLP, E=Unidad.
- Crear named ranges: VAR_NOMBRE = 'Variables de costo'!$B:$B, VAR_VALOR = 'Variables de costo'!$D:$D

Ejemplos de fórmulas en Google Sheets (fila 2 del sheet `Presupuestos`):

- Obtener valor de una variable (ej.: Costo diario operador):

  =IFERROR(INDEX('Variables de costo'!$D:$D, MATCH("Costo diario operador", 'Variables de costo'!$B:$B, 0)), 0)

- Costo terreno:

  =IF($G2>0, $G2 * INDEX('Variables de costo'!$D:$D, MATCH("Costo diario operador", 'Variables de costo'!$B:$B, 0)), 0)
  (donde `$G2` = Días terreno)

- Costo gabinete (por horas o días):

  =IF($H2>0, $H2 * INDEX('Variables de costo'!$D:$D, MATCH("Costo hora gabinete", 'Variables de costo'!$B:$B, 0)), 0)
  (donde `$H2` = Horas gabinete)

- Costo CAD:

  =$I2 * INDEX('Variables de costo'!$D:$D, MATCH("Costo hora CAD", 'Variables de costo'!$B:$B, 0))
  (donde `$I2` = Horas CAD)

- Costo traslado:

  =INDEX('Variables de costo'!$D:$D, MATCH("Costo traslado base", 'Variables de costo'!$B:$B, 0)) + ($J2 * INDEX('Variables de costo'!$D:$D, MATCH("Costo por km adicional", 'Variables de costo'!$B:$B, 0)))
  (donde `$J2` = Distancia estimada km)

- Costo equipos (suma de costo diario * días terreno):

  =SUMPRODUCT( (Equipos!$H$2:$H$100) * ($G2) * (Equipos!$I$2:$I$100<>"" ) )
  Recomendación: tener en la hoja `Presupuestos` una columna "Equipos usados" con IDs separados por coma y usar una fórmula con SPLIT+ARRAYFORMULA o Apps Script para desglosar.

- Costo servicios (prorrateos):

  =($G2 * INDEX('Variables de costo'!$D:$D, MATCH("Costo NTRIP mensual prorrateado", 'Variables de costo'!$B:$B, 0))/22) + ($G2 * INDEX('Variables de costo'!$D:$D, MATCH("Costo chip internet mensual prorrateado", 'Variables de costo'!$B:$B, 0))/22)

- Subtotal costo directo:

  =SUM($K2:$P2)
  (Asegurar que K..P cubran Costo terreno, gabinete, traslado, equipos, servicios, documentación)

- Utilidad:

  =$Q2 * (INDEX('Variables de costo'!$D:$D, MATCH("Margen de utilidad recomendado %", 'Variables de costo'!$B:$B, 0))/100)
  (donde `$Q2` = Subtotal costo directo)

- Precio sugerido:

  =$Q2 + $R2

- Retención boleta:

  =$S2 * (INDEX('Variables de costo'!$D:$D, MATCH("Retención boleta honorarios %", 'Variables de costo'!$B:$B, 0))/100)
  (donde `$S2` = Precio sugerido)

- Total líquido esperado:

  =$S2 - $T2

Recomendaciones de Sheets:
- Usar named ranges o tablas con filtro para variables activas.
- Crear columnas auxiliares si aplica (p.ej. % aplicable por comuna) y mantener todo con fórmulas enlazadas.

Expresiones AppSheet (ejemplos de Virtual Columns y App Formula):

- Obtener valor variable (AppSheet):

  LOOKUP("Costo diario operador","Variables de costo","Nombre variable","Valor CLP")

- CostoTerreno (Virtual Column):

  [Días terreno] * LOOKUP("Costo diario operador","Variables de costo","Nombre variable","Valor CLP")

- CostoGabinete (si se usa horas):

  [Horas gabinete] * LOOKUP("Costo hora gabinete","Variables de costo","Nombre variable","Valor CLP")

- CostoTraslado (Virtual Column):

  LOOKUP("Costo traslado base","Variables de costo","Nombre variable","Valor CLP") + [Distancia estimada km] * LOOKUP("Costo por km adicional","Variables de costo","Nombre variable","Valor CLP")

- CostoEquipos (sumar equipos seleccionados almacenados en un List):

  SUM(SELECT(Equipos[Costo diario estimado], IN([ID_Equipo], SPLIT([Equipos usados], ",")))) * [Días terreno]

- SubtotalCostoDirecto (Virtual Column):

  [Costo terreno] + [Costo gabinete] + [Costo CAD] + [Costo traslado] + [Costo equipos] + [Costo servicios NTRIP/internet] + [Costo documentación]

- Utilidad y Precio sugerido:

  [Utilidad] = [Subtotal costo directo] * (LOOKUP("Margen de utilidad recomendado %","Variables de costo","Nombre variable","Valor CLP")/100)
  [Precio sugerido cliente] = [Subtotal costo directo] + [Utilidad]

- Retención y Total líquido:

  [Monto retención] = [Precio sugerido cliente] * (LOOKUP("Retención boleta honorarios %","Variables de costo","Nombre variable","Valor CLP")/100)
  [Total líquido esperado] = [Precio sugerido cliente] - [Monto retención]

Notas AppSheet:
- Marcar columnas calculadas como Virtual Columns para que se recalculen automáticamente.
- Permitir edición en la hoja `Variables de costo` y sincronizar para que cambios afecten cálculos.
- Para listas de equipos usar tipo `EnumList` con base en la tabla `Equipos`.
