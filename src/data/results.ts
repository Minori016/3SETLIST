/**
 * CẤU HÌNH THÔNG TIN DÒNG SẢN PHẨM & SET ĐỒ GỢI Ý - THƯƠNG HIỆU ELOT
 *
 * Lưu ý dành cho bạn:
 * Bạn có thể dễ dàng thay đổi tên set, hình ảnh, mô tả hoặc thêm nhiều set đồ mới
 * trong mảng `outfits` của từng dòng mà không làm ảnh hưởng đến cấu trúc ứng dụng.
 */

export interface OutfitItem {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  material: string;
  priceNote?: string;
  description: string;
  highlights: string[];
  /**
   * Đường dẫn ảnh:
   * - Có thể dùng đường dẫn nội bộ: '/assets/aistudio/image_xxx.png'
   * - Hoặc URL ảnh thật trên hosting / drive / cdn của bạn
   */
  imageUrl: string;
  altText: string;
}

export interface ElotResultConfig {
  id: 'SOFT' | 'DAILY' | 'ORIGINAL';
  brandName: string;
  fullName: string;
  slogan: string;
  subTitle: string;
  description: string;
  vibeText: string;
  colorTheme: {
    accent: string;
    lightBg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    pillBg: string;
  };
  personalityKeywords: string[];
  stylingPhilosophy: string[];
  outfits: OutfitItem[];
}

export const ELOT_RESULTS: Record<'SOFT' | 'DAILY' | 'ORIGINAL', ElotResultConfig> = {
  SOFT: {
    id: 'SOFT',
    brandName: 'ELOT',
    fullName: 'ELOT SOFT',
    slogan: 'Dịu dàng – Nhẹ nhàng – Bình yên',
    subTitle: 'Nốt hương dịu ngọt ôm trọn những giây phút thư thái tại tổ ấm',
    description:
      'Bạn là người trân quý những khoảnh khắc bình yên, yêu sự tĩnh lặng và chăm sóc bản thân với tất cả sự nâng niu. Với bạn, trang phục mặc nhà không chỉ để mặc, mà là một chiếc ôm vỗ về sau ngày dài, mang lại cảm giác mềm mại như mây và thư thái tuyệt đối.',
    vibeText: 'Thư thái · Nữ tính dịu ngọt · Chữa lành tâm hồn',
    colorTheme: {
      accent: '#CE9893', // Pink-500
      lightBg: '#FAF5F5', // Pink-50
      border: '#EAD4D2', // Pink-200
      badgeBg: '#F3E8E7', // Pink-100
      badgeText: '#713D38', // Pink-800
      pillBg: '#FAF5F5',
    },
    personalityKeywords: ['Dịu dàng', 'Nhẹ nhàng', 'Bình yên', 'Nuông chiều giác quan'],
    stylingPhilosophy: [
      'Ưu tiên chất liệu tơ lụa mềm mượt, cotton dệt thoi mịn mát xoa dịu làn da.',
      'Bảng màu pastel phấn sữa, hồng cánh sen, kem sữa và họa tiết hoa nhí li ti ngọt ngào.',
      'Chi tiết bèo nhún viền tinh xảo, dây rút nhỏ duyên dáng làm mềm mại vóc dáng.',
    ],
    outfits: [
      {
        id: 'soft-01',
        name: 'Set Camisole Bèo Nhún Floral Sweetheart',
        badge: 'Gợi ý đặc quyền cho bạn',
        tagline: 'Chạm nhẹ như làn gió sớm, thoáng mát và yêu kiều',
        material: 'Lụa tơ tằm nhân tạo & Cotton mềm mịn 100%',
        priceNote: 'Bộ sưu tập Timeless Loungewear',
        description:
          'Thiết kế áo hai dây dáng xoè nhẹ nhàng đính bèo nhún tinh tế ở viền ngực và gấu áo, kết hợp quần short hoa nhí đồng điệu. Phom rộng rãi đem lại sự tự do tối đa cho cơ thể, nâng niu giấc ngủ ngon và buổi sớm thanh thản.',
        highlights: [
          'Chất vải siêu nhẹ, thấm hút mồ hôi và không gây hằn da',
          'Viền bèo thủ công tỉ mỉ tôn bờ vai thon nữ tính',
          'Quần chun co giãn êm ái, túi hai bên tiện lợi',
        ],
        // [THAY ẢNH SET ĐỒ TẠI ĐÂY NẾU MUỐN]:
        imageUrl: '/assets/aistudio/image_35b77ac9.png',
        altText: 'Set đồ bộ ELOT SOFT hai dây hoa nhí bèo nhún nữ tính',
      },
    ],
  },

  DAILY: {
    id: 'DAILY',
    brandName: 'ELOT',
    fullName: 'ELOT DAILY',
    slogan: 'Năng động – Thân thiện – Linh hoạt',
    subTitle: 'Đẹp thanh lịch tại nhà, tự tin rạng rỡ khi bước ra phố',
    description:
      'Bạn là cô nàng của nhịp sống hiện đại: linh hoạt, cởi mở và luôn sẵn sàng cho những khoảnh khắc bất ngờ. Bạn không muốn bị giới hạn bởi ranh giới "đồ ở nhà" hay "đồ dạo phố". Trang phục lý tưởng của bạn phải đa năng, trẻ trung, chỉn chu và đem lại nguồn năng lượng tích cực.',
    vibeText: 'Linh hoạt · Trẻ trung · Đa năng tiện lợi',
    colorTheme: {
      accent: '#819266', // Green-500
      lightBg: '#F5F6F3', // Green-50
      border: '#DADFD3', // Green-200
      badgeBg: '#EBEEE8', // Green-100
      badgeText: '#3A422E', // Green-800
      pillBg: '#EBEEE8',
    },
    personalityKeywords: ['Năng động', 'Thân thiện', 'Linh hoạt', 'Tràn đầy sức sống'],
    stylingPhilosophy: [
      'Phom dáng đa dụng: mặc nhà thư giãn, ra ngõ nhận hàng, cà phê cuối tuần đều cuốn hút.',
      'Chất vải đũi xước tơ, thun cotton co giãn 4 chiều đứng dáng nhưng không thô cứng.',
      'Sắc xanh olive non, vàng bơ nhạt, hoa nhí tươi sáng mang hơi thở mùa hè tươi mát.',
    ],
    outfits: [
      {
        id: 'daily-01',
        name: 'Váy Maxi Tầng Hoa Nhí Summer Breeze',
        badge: 'Gợi ý đặc quyền cho bạn',
        tagline: 'Lướt từ phòng ngủ ra góc phố cà phê trong tíc tắc',
        material: 'Đũi tơ tự nhiên dệt hoa nổi mềm rủ',
        priceNote: 'Bộ sưu tập Ready-to-Step-Out',
        description:
          'Thiết kế maxi bồng bềnh chia tầng uyển chuyển với họa tiết hoa nhí nền vàng nắng nhạt. Dây áo thanh mảnh có nút điều chỉnh, phom váy rủ mềm che khuyết điểm hoàn hảo, sẵn sàng cùng bạn đón ngày mới tràn ngập ánh nắng.',
        highlights: [
          'Chất đũi tơ nhẹ mát, hạn chế nhăn và thoáng khí tuyệt đối',
          'Dáng xòe tầng che khuyết điểm, chuyển động mềm mại',
          'Tích hợp lót trong kín đáo, tự tin dạo phố mà không cần thay trang phục',
        ],
        // [THAY ẢNH SET ĐỒ TẠI ĐÂY NẾU MUỐN]:
        imageUrl: '/assets/aistudio/image_31b8bda4.png',
        altText: 'Váy maxi ELOT DAILY tầng hoa nhí vàng bơ dạo phố',
      },
    ],
  },

  ORIGINAL: {
    id: 'ORIGINAL',
    brandName: 'ELOT',
    fullName: 'ELOT ORIGINAL',
    slogan: 'Cá tính – Độc lập – Khác biệt',
    subTitle: 'Định hình chất riêng với phom dáng sắc nét và thẩm mỹ tối giản',
    description:
      'Bạn không chạy theo số đông và có tiêu chuẩn thẩm mỹ rất cao. Dù ở không gian riêng tư, bạn vẫn muốn thể hiện sự chỉn chu, gu chọn đồ sắc sảo và cá tính độc lập. Một set đồ chuẩn mực với đường cắt dứt khoát, gam màu trung tính tinh tế chính là tiếng nói phong cách của bạn.',
    vibeText: 'Khác biệt · Tinh tế · Tối giản thời thượng',
    colorTheme: {
      accent: '#57717B', // Slate / Chic neutral blue
      lightBg: '#F3F5F7',
      border: '#D2D9DE',
      badgeBg: '#E4EAED',
      badgeText: '#233238',
      pillBg: '#E4EAED',
    },
    personalityKeywords: ['Cá tính', 'Độc lập', 'Khác biệt', 'Tối giản có gu'],
    stylingPhilosophy: [
      'Cấu trúc may đo hiện đại: ve áo sơ mi sắc nét, phom suông phóng khoáng.',
      'Bảng màu đơn sắc cao cấp: xanh pastel lạnh, be cát, xám ấm và navy sâu lắng.',
      'Chi tiết nút bấm mạ satin, đường gân chỉ nổi và túi hộp tối giản tôn vinh sự tinh tế.',
    ],
    outfits: [
      {
        id: 'original-01',
        name: 'Set Sơ Mi Croptop & Quần Suông Pastel Blue',
        badge: 'Gợi ý đặc quyền cho bạn',
        tagline: 'Phom dáng may đo sắc sảo, tuyên ngôn của sự tự tin',
        material: 'Lụa chéo Hàn Quốc cao cấp, đứng phom và ít nhăn',
        priceNote: 'Bộ sưu tập Modern Identity',
        description:
          'Set áo sơ mi cộc tay dáng lửng croptop thời thượng phối cùng quần tây ống suông rộng cạp cao tôn dáng. Sắc xanh pastel thanh lịch kết hợp đường kim mũi chỉ chuẩn mực mang đến thần thái tự tin, sang trọng dù ở nhà hay làm việc từ xa.',
        highlights: [
          'Chất lụa chéo dệt sợi cao cấp, giữ phom suông phẳng phiu',
          'Quần cạp cao xếp ly nhẹ giúp kéo dài đôi chân thanh thoát',
          'Sơ mi cộc tay túi ốp ngực chỉn chu chuẩn gu thời trang tối giản',
        ],
        // [THAY ẢNH SET ĐỒ TẠI ĐÂY NẾU MUỐN]:
        imageUrl: '/assets/aistudio/image_4e6398fe.png',
        altText: 'Set ELOT ORIGINAL sơ mi croptop và quần ống suông xanh pastel',
      },
    ],
  },
};
