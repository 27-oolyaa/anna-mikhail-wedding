const SPREADSHEET_ID = '1CfrLv8uQzaZxvIr_RKTBeHCGeP6lgw9jiWwc_xAjre0';
const SHEET_NAME = 'Ответы гостей';

function doGet() {
  return ContentService
    .createTextOutput('Сервер свадебного приглашения работает')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
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
    const name = String(p.name || '').trim();
    if (!name) throw new Error('Не указано имя гостя');

    sheet.appendRow([
      new Date(),
      name,
      String(p.attendance || ''),
      String(p.plusOne || ''),
      String(p.comments || '')
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
