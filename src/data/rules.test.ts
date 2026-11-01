import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SOFT_COMBINATIONS,
  DAILY_COMBINATIONS,
  ORIGINAL_COMBINATIONS,
  ELOT_LOOKUP_TABLE,
  determineElotLine,
  isValidAnswerKey,
} from './rules.ts';

test('Mỗi dòng ELOT có đúng 81 tổ hợp', () => {
  assert.equal(SOFT_COMBINATIONS.length, 81, 'SOFT phải có đúng 81 tổ hợp');
  assert.equal(DAILY_COMBINATIONS.length, 81, 'DAILY phải có đúng 81 tổ hợp');
  assert.equal(ORIGINAL_COMBINATIONS.length, 81, 'ORIGINAL phải có đúng 81 tổ hợp');
});

test('Không có tổ hợp trùng lặp trong từng danh sách', () => {
  const softSet = new Set(SOFT_COMBINATIONS);
  const dailySet = new Set(DAILY_COMBINATIONS);
  const originalSet = new Set(ORIGINAL_COMBINATIONS);

  assert.equal(softSet.size, 81, 'SOFT không được có phần tử trùng lặp');
  assert.equal(dailySet.size, 81, 'DAILY không được có phần tử trùng lặp');
  assert.equal(originalSet.size, 81, 'ORIGINAL không được có phần tử trùng lặp');
});

test('Ba dòng hoàn toàn phân biệt (không giao thoa)', () => {
  const softSet = new Set(SOFT_COMBINATIONS);
  const dailySet = new Set(DAILY_COMBINATIONS);
  const originalSet = new Set(ORIGINAL_COMBINATIONS);

  for (const item of softSet) {
    assert.equal(dailySet.has(item), false, `Phần tử ${item} vừa thuộc SOFT vừa thuộc DAILY`);
    assert.equal(originalSet.has(item), false, `Phần tử ${item} vừa thuộc SOFT vừa thuộc ORIGINAL`);
  }

  for (const item of dailySet) {
    assert.equal(originalSet.has(item), false, `Phần tử ${item} vừa thuộc DAILY vừa thuộc ORIGINAL`);
  }
});

test('Bao phủ trọn vẹn tất cả 243 (= 3^5) tổ hợp có thể có của 5 câu A/B/C', () => {
  const options = ['A', 'B', 'C'];
  const allPossible: string[] = [];

  for (const c1 of options) {
    for (const c2 of options) {
      for (const c3 of options) {
        for (const c4 of options) {
          for (const c5 of options) {
            allPossible.push(`${c1}${c2}${c3}${c4}${c5}`);
          }
        }
      }
    }
  }

  assert.equal(allPossible.length, 243, 'Tổng số tổ hợp toán học phải là 243');

  // Kiểm tra từng tổ hợp đều có trong bảng tra cứu O(1)
  for (const combo of allPossible) {
    assert.ok(
      combo in ELOT_LOOKUP_TABLE,
      `Tổ hợp ${combo} bị thiếu trong ELOT_LOOKUP_TABLE`
    );
    const result = determineElotLine(combo);
    assert.ok(
      ['SOFT', 'DAILY', 'ORIGINAL'].includes(result),
      `Kết quả cho ${combo} không hợp lệ: ${result}`
    );
  }

  assert.equal(Object.keys(ELOT_LOOKUP_TABLE).length, 243, 'Lookup table phải chứa đúng 243 cặp key-value');
});

test('Kiểm tra một số tổ hợp tiêu biểu theo bảng', () => {
  assert.equal(determineElotLine('AAAAA'), 'SOFT');
  assert.equal(determineElotLine('BBBBB'), 'DAILY');
  assert.equal(determineElotLine('CCCCC'), 'ORIGINAL');
  assert.equal(determineElotLine('ABACA'), 'SOFT');
  assert.equal(determineElotLine('BCABC'), 'DAILY');
  assert.equal(determineElotLine('ACBCB'), 'ORIGINAL');
});

test('Kiểm tra hàm validate isValidAnswerKey', () => {
  assert.equal(isValidAnswerKey('ABCAB'), true);
  assert.equal(isValidAnswerKey('abcab'), true);
  assert.equal(isValidAnswerKey('AAAAA'), true);
  assert.equal(isValidAnswerKey('ABCDA'), false);
  assert.equal(isValidAnswerKey('ABC'), false);
  assert.equal(isValidAnswerKey('ABCABC'), false);
});
