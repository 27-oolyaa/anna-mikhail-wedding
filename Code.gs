/**
 * Принимает RSVP с сайта и добавляет строку в Google Таблицу.
 * Разверните как веб-приложение: запуск от вашего имени, доступ — все.
 */
const SHEET_NAME = 'Ответы гостей';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата ответа',
        'Имя и фамилия',
        'Присутствие',
        'Сопровождающий',
        'Пожелания / комментарии'
      ]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    const p = (e && e.parameter) ? e.parameter : {};
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.attendance || '',
      p.plusOne || '',
      p.comments || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
