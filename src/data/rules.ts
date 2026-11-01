/**
 * Logic tra cứu kết quả khảo sát ELOT
 * Tổng cộng 243 tổ hợp (3^5) phân bổ chính xác:
 * - ELOT SOFT: 81 tổ hợp
 * - ELOT DAILY: 81 tổ hợp
 * - ELOT ORIGINAL: 81 tổ hợp
 */

export type ElotLine = 'SOFT' | 'DAILY' | 'ORIGINAL';

export const SOFT_COMBINATIONS: string[] = [
  // 1
  'AAAAA',
  // 10
  'BAAAA', 'ABAAA', 'AABAA', 'AAABA', 'AAAAB', 'CAAAA', 'ACAAA', 'AACAA', 'AAACA', 'AAAAC',
  // 10
  'BBAAA', 'BABAA', 'BAABA', 'BAAAB', 'ABBAA', 'ABABA', 'ABAAB', 'AABBA', 'AABAB', 'AAABB',
  // 10
  'CCAAA', 'CACAA', 'CAACA', 'CAAAC', 'ACCAA', 'ACACA', 'ACAAC', 'AACCA', 'AACAC', 'AAACC',
  // 10
  'BCAAA', 'BACAA', 'BAACA', 'BAAAC', 'CBAAA', 'ABCAA', 'ABACA', 'ABAAC', 'CABAA', 'ACBAA',
  // 10
  'AABCA', 'AABAC', 'CAABA', 'ACABA', 'AACBA', 'AAABC', 'CAAAB', 'ACAAB', 'AACAB', 'AAACB',
  // 10
  'CABAB', 'CBAAB', 'CBBAA', 'ACBAB', 'BCAAB', 'BCBAA', 'ABCAB', 'BACAB', 'BBCAA', 'ABBAC',
  // 10
  'BABAC', 'BBAAC', 'ABBCA', 'BABCA', 'BBACA', 'BACAC', 'BCAAC', 'BCCAA', 'ABCAC', 'CBAAC',
  // 10
  'CBCAA', 'ACBAC', 'CABAC', 'CCBAA', 'ACCAB', 'CACAB', 'CCAAB', 'ACCBA', 'CACBA', 'CCABA',
];

export const DAILY_COMBINATIONS: string[] = [
  // 1
  'BBBBB',
  // 10
  'ABBBB', 'BABBB', 'BBABB', 'BBBAB', 'BBBBA', 'CBBBB', 'BCBBB', 'BBCBB', 'BBBCB', 'BBBBC',
  // 10
  'AABBB', 'ABABB', 'ABBAB', 'ABBBA', 'BAABB', 'BABAB', 'BABBA', 'BBAAB', 'BBABA', 'BBBAA',
  // 10
  'CCBBB', 'CBCBB', 'CBBCB', 'CBBBC', 'BCCBB', 'BCBCB', 'BCBBC', 'BBCCB', 'BBCBC', 'BBBCC',
  // 10
  'ACBBB', 'ABCBB', 'ABBCB', 'ABBBC', 'CABBB', 'BACBB', 'BABCB', 'BABBC', 'CBABB', 'BCABB',
  // 10
  'BBACB', 'BBABC', 'CBBAB', 'BCBAB', 'BBCAB', 'BBBAC', 'CBBBA', 'BCBBA', 'BBCBA', 'BBBCA',
  // 10
  'CBABA', 'CABBA', 'CAABB', 'BCABA', 'ACBBA', 'ACABB', 'BACBA', 'ABCBA', 'AACBB', 'BAABC',
  // 10
  'ABABC', 'AABBC', 'BAACB', 'ABACB', 'AABCB', 'ABCBC', 'ACBBC', 'ACCBB', 'BACBC', 'CABBC',
  // 10
  'CACBB', 'BCABC', 'CBABC', 'CCABB', 'BCCBA', 'CBCBA', 'CCBBA', 'BCCAB', 'CBCAB', 'CCBAB',
];

export const ORIGINAL_COMBINATIONS: string[] = [
  // 1
  'CCCCC',
  // 10
  'BCCCC', 'CBCCC', 'CCBCC', 'CCCBC', 'CCCCB', 'ACCCC', 'CACCC', 'CCACC', 'CCCAC', 'CCCCA',
  // 10
  'BBCCC', 'BCBCC', 'BCCBC', 'BCCCB', 'CBBCC', 'CBCBC', 'CBCCB', 'CCBBC', 'CCBCB', 'CCCBB',
  // 10
  'AACCC', 'ACACC', 'ACCAC', 'ACCCA', 'CAACC', 'CACAC', 'CACCA', 'CCAAC', 'CCACA', 'CCCAA',
  // 10
  'BACCC', 'BCACC', 'BCCAC', 'BCCCA', 'ABCCC', 'CBACC', 'CBCAC', 'CBCCA', 'ACBCC', 'CABCC',
  // 10
  'CCBAC', 'CCBCA', 'ACCBC', 'CACBC', 'CCABC', 'CCCBA', 'ACCCB', 'CACCB', 'CCACB', 'CCCAB',
  // 10
  'ACBCB', 'ABCCB', 'ABBCC', 'CABCB', 'BACCB', 'BABCC', 'CBACB', 'BCACB', 'BBACC', 'CBBCA',
  // 10
  'BCBCA', 'BBCCA', 'CBBAC', 'BCBAC', 'BBCAC', 'BCACA', 'BACCA', 'BAACC', 'CBACA', 'ABCCA',
  // 10
  'ABACC', 'CABCA', 'ACBCA', 'AABCC', 'CAACB', 'ACACB', 'AACCB', 'CAABC', 'ACABC', 'AACBC',
];

// Khởi tạo bảng tra cứu O(1)
export const ELOT_LOOKUP_TABLE: Record<string, ElotLine> = {};

SOFT_COMBINATIONS.forEach(code => {
  ELOT_LOOKUP_TABLE[code] = 'SOFT';
});

DAILY_COMBINATIONS.forEach(code => {
  ELOT_LOOKUP_TABLE[code] = 'DAILY';
});

ORIGINAL_COMBINATIONS.forEach(code => {
  ELOT_LOOKUP_TABLE[code] = 'ORIGINAL';
});

/**
 * Tra cứu dòng ELOT từ chuỗi 5 đáp án (ví dụ "ABACA")
 * Bắt buộc chuẩn hóa chữ in hoa
 */
export function determineElotLine(answersKey: string): ElotLine {
  const cleanKey = answersKey.trim().toUpperCase();
  const matched = ELOT_LOOKUP_TABLE[cleanKey];
  if (matched) {
    return matched;
  }

  // Dự phòng an toàn (nếu có chuỗi bất thường)
  const aCount = (cleanKey.match(/A/g) || []).length;
  const bCount = (cleanKey.match(/B/g) || []).length;
  const cCount = (cleanKey.match(/C/g) || []).length;

  if (aCount >= bCount && aCount >= cCount) return 'SOFT';
  if (bCount >= cCount) return 'DAILY';
  return 'ORIGINAL';
}

/**
 * Kiểm tra chuỗi đáp án có hợp lệ (5 ký tự A/B/C)
 */
export function isValidAnswerKey(answersKey: string): boolean {
  return /^[ABC]{5}$/.test(answersKey.trim().toUpperCase());
}
