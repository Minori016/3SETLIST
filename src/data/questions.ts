/**
 * Danh sách 5 câu hỏi khảo sát phong cách đồ bộ ELOT
 * Giữ nguyên văn thuần túy theo yêu cầu của thương hiệu, không kèm gợi ý hay nhãn phong cách
 */

export interface QuestionOption {
  key: 'A' | 'B' | 'C';
  text: string;
}

export interface Question {
  id: number;
  title: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Một ngày ở nhà lý tưởng của bạn sẽ như thế nào?',
    options: [
      {
        key: 'A',
        text: 'Ngủ nướng một chút, chăm sóc da, đọc sách và nhâm nhi tách trà nóng.',
      },
      {
        key: 'B',
        text: 'Làm việc, nấu ăn, xem phim, tiện thì ghé quán cà phê gần nhà.',
      },
      {
        key: 'C',
        text: 'Nghe nhạc, sắp xếp góc nhỏ của mình và làm điều mình thích theo cách riêng.',
      },
    ],
  },
  {
    id: 2,
    title: 'Khi chọn đồ bộ, bạn ưu tiên điều gì nhất?',
    options: [
      {
        key: 'A',
        text: 'Chất vải mềm, nhẹ, mặc vào là muốn nghỉ ngơi.',
      },
      {
        key: 'B',
        text: 'Dễ mặc, thoải mái và đủ chỉn chu để ra ngoài không cần thay đồ.',
      },
      {
        key: 'C',
        text: 'Chất liệu đẹp, đường may tinh tế và những chi tiết nhỏ có gu.',
      },
    ],
  },
  {
    id: 3,
    title: 'Bạn thích kiểu màu sắc và họa tiết nào nhất?',
    options: [
      {
        key: 'A',
        text: 'Màu dịu mắt, họa tiết nhẹ nhàng, tạo cảm giác thư thái.',
      },
      {
        key: 'B',
        text: 'Màu tươi sáng, họa tiết vừa phải, trẻ trung và dễ phối.',
      },
      {
        key: 'C',
        text: 'Màu trung tính, ít họa tiết, chỉ một điểm nhấn nhỏ như logo.',
      },
    ],
  },
  {
    id: 4,
    title: 'Câu nào mô tả đúng phong cách sống của bạn nhất?',
    options: [
      {
        key: 'A',
        text: '"Mình thích sống chậm, chăm sóc bản thân và tận hưởng những điều bình dị."',
      },
      {
        key: 'B',
        text: '"Mình thích sự thoải mái, linh hoạt và luôn sẵn sàng cho kế hoạch bất ngờ."',
      },
      {
        key: 'C',
        text: '"Mình không cần quá nổi bật, chỉ cần những gì mình chọn thể hiện được chất riêng."',
      },
    ],
  },
  {
    id: 5,
    title: 'Bạn bè sẽ dùng 3 từ nào để miêu tả bạn?',
    options: [
      {
        key: 'A',
        text: 'Dịu dàng – Nhẹ nhàng – Bình yên.',
      },
      {
        key: 'B',
        text: 'Năng động – Thân thiện – Linh hoạt.',
      },
      {
        key: 'C',
        text: 'Cá tính – Độc lập – Khác biệt.',
      },
    ],
  },
];
