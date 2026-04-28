// Configuración Global del Spreadsheet
var SPREADSHEET_ID = '1-Yi2nfl7wI_OORzTpdrMCMdjXvrYVPQ_aVaVdMTaGlM';

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('AESA - Portal de Gestión Documental')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getActiveData() {
  try {
    const CACHE_KEY = "DB_DOCUMENTOS_CACHE";
    try {
      const cache = CacheService.getScriptCache();
      const cachedData = cache.get(CACHE_KEY);
      if (cachedData) {
        Logger.log('[DEBUG] Datos retornados desde la caché.');
        return JSON.parse(cachedData);
      }
    } catch (e) {
      Logger.log(`[WARN] Error al leer de la caché: ${e.message}`);
    }
    
    Logger.log('[DEBUG] No hay caché. Consultando Google Sheets...');
    let ss;
    try {
      const sheetId = SPREADSHEET_ID;
      Logger.log(`[DEBUG] Intentando abrir Spreadsheet ID: ${sheetId}`);
      ss = SpreadsheetApp.openById(sheetId);
    } catch (errss) {
      Logger.log(`[ERROR] No se pudo abrir el Spreadsheet: ${errss.message}`);
      // RETORNAR DATOS DE PRUEBA SI FALLA EL SHEET PARA NO BLOQUEAR LA APP
      return [
        { ID: "DUMMY", TITULO: "ERROR DE ACCESO AL SHEET", DESCRIPCION_CORTA: "No se pudo abrir el origen de datos. Verifica el ID del Spreadsheet y los permisos.", CATEGORIA: "Comunicado", ESTADO: "activo", LINK_FOTO: "" }
      ];
    }
    
    const sheetName = 'DB_DOCUMENTOS';
    Logger.log(`[DEBUG] Intentando abrir Hoja: ${sheetName}`);
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      Logger.log(`[ERROR] Hoja "${sheetName}" NO encontrada. Hojas disponibles: ${ss.getSheets().map(s => s.getName()).join(', ')}`);
      throw new Error(`Hoja "${sheetName}" no encontrada.`);
    }
    
    // Get all data
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    Logger.log(`[DEBUG] Filas totales recuperadas: ${values.length}`);
    
    if (values.length < 2) {
      Logger.log('[WARN] La hoja tiene menos de 2 filas (Solo encabezados o vacía).');
      return [];
    }
    
    // Log Headers to verify column order
    const headers = values[0];
    Logger.log(`[DEBUG] Encabezados detectados: ${JSON.stringify(headers)}`);
    Logger.log(`[DEBUG] Verificando columnas críticas: Columna J (Index 9) debería ser ESTADO. Valor actual encabezado: "${headers[9]}"`);

    // Remove headers
    values.shift();

    // Filter and Map
    const filteredData = values.filter((row, index) => {
      // Index 9 is Column J (ESTADO)
      const rawState = row[9]; 
      const estado = String(rawState || "").trim().toLowerCase();
      
      const isActive = estado === 'activo';
      
      // Log first 3 rows to check what is being read
      if (index < 3) {
        Logger.log(`[DEBUG] Fila ${index + 2}: ID=${row[0]}, ESTADO_RAW="${rawState}", ESTADO_CLEAN="${estado}", ES_ACTIVO=${isActive}`);
      }
      
      return isActive;
    });

    Logger.log(`[DEBUG] Filas después de filtrar 'Activo': ${filteredData.length}`);

    const mappedData = filteredData.map(row => {
      return {
        ID: row[0],
        TITULO: row[1],
        DESCRIPCION_CORTA: row[2],
        DESCRIPCION_LARGA: row[3],
        CATEGORIA: row[4],
        FECHA: (row[5] instanceof Date) ? row[5].toISOString() : String(row[5]),
        LINK_FOTO: row[6],
        LINK_INFORMACION: row[7],
        ORDEN: row[8],
        ESTADO: row[9]
      };
    });

    if (mappedData.length > 0) {
      Logger.log(`[DEBUG] Primer elemento mapeado: ${JSON.stringify(mappedData[0])}`);
    } else {
      Logger.log('[WARN] No se encontraron datos activos para retornar.');
    }
    
    // Guardar en la caché por 5 minutos (300 segundos) - Con manejo de errores por cuota excedida
    try {
      const cache = CacheService.getScriptCache();
      const stringifiedData = JSON.stringify(mappedData);
      // El límite de CacheService es de 100KB por llave
      if (stringifiedData.length < 100000) {
        Logger.log('[DEBUG] Guardando datos procesados en la caché por 5 minutos.');
        cache.put(CACHE_KEY, stringifiedData, 300);
      } else {
        Logger.log('[WARN] Los datos exceden el límite de 100KB de la caché. No se guardarán.');
      }
    } catch (e) {
      Logger.log(`[WARN] No se pudo guardar en la caché (posible límite excedido): ${e.message}`);
    }

    return mappedData;
      
  } catch (e) {
    Logger.log(`[ERROR] Error CRÍTICO en getActiveData: ${e.toString()} \nStack: ${e.stack}`);
    throw e;
  }
}

/**
 * Guarda el feedback proporcionado por el usuario en la hoja "FEEDBACK".
 * @param {string} comentario - El feedback escrito por el usuario.
 * @return {object} - Objeto con el status de la operación.
 */
function saveFeedback(comentario) {
  try {
    const sheetId = SPREADSHEET_ID;
    const sheetName = 'FEEDBACK';
    const ss = SpreadsheetApp.openById(sheetId);
    let sheet = ss.getSheetByName(sheetName);
    
    // Si la hoja no existe, la creamos con los encabezados
    if (!sheet) {
      Logger.log(`[INFO] La hoja "${sheetName}" no existe. Creándola...`);
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(["ID", "Comentario", "Fecha"]);
      // Opcional: Dar formato a encabezados
      sheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#f3f4f6");
    }
    
    // Generar datos para la nueva fila
    const id = Utilities.getUuid();
    // Capturar fecha actual en formato ISO o local según el script timezone
    const now = new Date();
    const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT-5", "yyyy-MM-dd HH:mm:ss");
    
    // Insertar el comentario
    sheet.appendRow([id, comentario, formattedDate]);
    Logger.log(`[SUCCESS] Feedback guardado. ID: ${id}`);
    
    return { status: 'success', message: 'Comentario enviado exitosamente' };
  } catch(e) {
    Logger.log(`[ERROR] Fallo al guardar feedback: ${e.toString()}`);
    return { status: 'error', message: e.toString() };
  }
}