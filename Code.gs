/**
 * =========================================================================
 * GOOGLE APPS SCRIPT CHO HỆ THỐNG KHẢO SÁT PHONG CÁCH ĐỒ BỘ ELOT
 * TƯƠNG THÍCH CHÍNH XÁC VỚI 2 TRANG TÍNH (SHEETS) CỦA BẠN:
 * 
 * 1. Sheet "Kết quả tư vấn":
 *    Cột: [A] Khách hàng | [B] email | [C] Câu 1 | [D] Câu 2 | [E] Câu 3 | [F] Câu 4 | [G] Câu 5 | [H] Set đề xuất
 * 
 * 2. Sheet "Tổng hợp kết quả":
 *    [A1:B1] Bảng tổng hợp số set
 *    [A2] Elot Soft     -> [B2] Số lượng
 *    [A3] Elot Daily    -> [B3] Số lượng
 *    [A4] Elot Original -> [B4] Số lượng
 * =========================================================================
 */

const SHEET_DETAIL_NAME = 'Kết quả tư vấn';
const SHEET_SUMMARY_NAME = 'Tổng hợp kết quả';

function getDetailSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_DETAIL_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Khách hàng', 'email', 'Câu 1', 'Câu 2', 'Câu 3', 'Câu 4', 'Câu 5', 'Set đề xuất']);
    sheet.getRange(1, 1, 1, 8).setBackground('#F9CB9C').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getSummarySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SUMMARY_NAME);
  if (!sheet && ss.getSheets().length > 1) {
    sheet = ss.getSheets()[1];
  }
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_SUMMARY_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange('A1:B1').merge().setValue('Bảng tổng hợp số set').setBackground('#F6B26B').setFontWeight('bold');
    sheet.getRange('A2').setValue('Elot Soft').setBackground('#CFE2F3');
    sheet.getRange('A3').setValue('Elot Daily').setBackground('#CFE2F3');
    sheet.getRange('A4').setValue('Elot Original').setBackground('#CFE2F3');
    sheet.getRange('B2').setValue(0);
    sheet.getRange('B3').setValue(0);
    sheet.getRange('B4').setValue(0);
    sheet.getRange('A1:B4').setBorder(true, true, true, true, true, true);
  }
  return sheet;
}

function formatResultName(rawResult) {
  const clean = (rawResult || '').trim().toUpperCase();
  if (clean.includes('SOFT')) return 'Elot Soft';
  if (clean.includes('DAILY')) return 'Elot Daily';
  if (clean.includes('ORIGINAL')) return 'Elot Original';
  return 'Elot Soft';
}

function recordSubmission(customerName, customerEmail, answersKey, rawResult) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    if (!/^[ABC]{5}$/.test(answersKey)) {
      return jsonResponse({ success: false, error: 'Chuỗi đáp án không hợp lệ, phải gồm 5 ký tự A/B/C' });
    }

    const answers = answersKey.split('');
    const formattedResult = formatResultName(rawResult);

    // 1. Thêm dòng mới vào Sheet "Kết quả tư vấn"
    const detailSheet = getDetailSheet();
    detailSheet.appendRow([
      customerName || 'Ẩn danh',
      customerEmail || '',
      answers[0],
      answers[1],
      answers[2],
      answers[3],
      answers[4],
      formattedResult
    ]);

    // 2. Tự động tính toán lại và cập nhật Sheet "Tổng hợp kết quả"
    updateSummarySheet();

    return jsonResponse({
      success: true,
      message: 'Đã lưu kết quả thành công vào cả 2 trang tính',
      customer: customerName,
      email: customerEmail,
      result: formattedResult
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'postData rỗng' });
    }
    const payload = JSON.parse(e.postData.contents);
    return recordSubmission(
      payload.customerName,
      payload.customerEmail,
      payload.answersKey,
      payload.result
    );
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function updateSummarySheet() {
  try {
    const detailSheet = getDetailSheet();
    const lastRow = detailSheet.getLastRow();
    
    let countSoft = 0;
    let countDaily = 0;
    let countOriginal = 0;

    if (lastRow > 1) {
      const resultsCol = detailSheet.getRange(2, 8, lastRow - 1, 1).getValues();
      for (let i = 0; i < resultsCol.length; i++) {
        const val = String(resultsCol[i][0] || '').trim();
        if (val === 'Elot Soft' || val.toUpperCase().includes('SOFT')) countSoft++;
        else if (val === 'Elot Daily' || val.toUpperCase().includes('DAILY')) countDaily++;
        else if (val === 'Elot Original' || val.toUpperCase().includes('ORIGINAL')) countOriginal++;
      }
    }

    const summarySheet = getSummarySheet();
    summarySheet.getRange('B2').setValue(countSoft);
    summarySheet.getRange('B3').setValue(countDaily);
    summarySheet.getRange('B4').setValue(countOriginal);
  } catch (err) {
    Logger.log('Lỗi cập nhật bảng tổng hợp: ' + err.toString());
  }
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'stats';

    // Hỗ trợ nộp bài bằng GET để tương thích 100% với trình duyệt
    if (action === 'submit') {
      const p = e.parameter || {};
      return recordSubmission(
        p.customerName || p.name,
        p.customerEmail || p.email,
        p.answersKey || p.key,
        p.result
      );
    }

    if (action === 'stats') {
      const detailSheet = getDetailSheet();
      const lastRow = detailSheet.getLastRow();

      if (lastRow <= 1) {
        return jsonResponse({
          success: true,
          total: 0,
          lines: { SOFT: 0, DAILY: 0, ORIGINAL: 0 },
          percentages: { SOFT: 0, DAILY: 0, ORIGINAL: 0 },
          questions: [
            { question: 1, A: 0, B: 0, C: 0 },
            { question: 2, A: 0, B: 0, C: 0 },
            { question: 3, A: 0, B: 0, C: 0 },
            { question: 4, A: 0, B: 0, C: 0 },
            { question: 5, A: 0, B: 0, C: 0 },
          ],
          recent: [],
          updatedAt: Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'HH:mm:ss dd/MM/yyyy')
        });
      }

      const data = detailSheet.getRange(2, 1, lastRow - 1, 8).getValues();
      const total = data.length;

      const lines = { SOFT: 0, DAILY: 0, ORIGINAL: 0 };
      const qDist = [
        { question: 1, A: 0, B: 0, C: 0 },
        { question: 2, A: 0, B: 0, C: 0 },
        { question: 3, A: 0, B: 0, C: 0 },
        { question: 4, A: 0, B: 0, C: 0 },
        { question: 5, A: 0, B: 0, C: 0 },
      ];

      const recentList = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const q1 = String(row[2] || '').trim().toUpperCase();
        const q2 = String(row[3] || '').trim().toUpperCase();
        const q3 = String(row[4] || '').trim().toUpperCase();
        const q4 = String(row[5] || '').trim().toUpperCase();
        const q5 = String(row[6] || '').trim().toUpperCase();
        const setCol = String(row[7] || '').trim().toUpperCase();

        if (setCol.includes('SOFT')) lines.SOFT++;
        else if (setCol.includes('DAILY')) lines.DAILY++;
        else if (setCol.includes('ORIGINAL')) lines.ORIGINAL++;

        const answers = [q1, q2, q3, q4, q5];
        answers.forEach((ans, idx) => {
          if (qDist[idx] && qDist[idx][ans] !== undefined) {
            qDist[idx][ans]++;
          }
        });
      }

      const maxRecent = Math.min(10, data.length);
      for (let i = data.length - 1; i >= data.length - maxRecent; i--) {
        const row = data[i];
        const customer = row[0] ? String(row[0]) : 'Khách hàng';
        const setCol = String(row[7] || '');
        let lineType = 'SOFT';
        if (setCol.toUpperCase().includes('DAILY')) lineType = 'DAILY';
        if (setCol.toUpperCase().includes('ORIGINAL')) lineType = 'ORIGINAL';

        const keyCombo = `${row[2] || ''}${row[3] || ''}${row[4] || ''}${row[5] || ''}${row[6] || ''}`;

        recentList.push({
          time: customer,
          result: lineType,
          key: keyCombo
        });
      }

      const percentages = {
        SOFT: total > 0 ? Math.round((lines.SOFT / total) * 100) : 0,
        DAILY: total > 0 ? Math.round((lines.DAILY / total) * 100) : 0,
        ORIGINAL: total > 0 ? Math.round((lines.ORIGINAL / total) * 100) : 0,
      };

      return jsonResponse({
        success: true,
        total: total,
        lines: lines,
        percentages: percentages,
        questions: qDist,
        recent: recentList,
        updatedAt: Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'HH:mm:ss dd/MM/yyyy')
      });
    }

    return jsonResponse({
      success: true,
      status: 'ELOT API is healthy.'
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
