# NirussVn0 Dev — Thiệp Chúc Mừng 8/3 ✿

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Anime.js](https://img.shields.io/badge/Anime.js-4-ff6b6b)

Ứng dụng web tạo thiệp chúc mừng Ngày Quốc tế Phụ nữ 8/3 với hiệu ứng đẹp mắt, hoa rơi, nhạc nền và mã QR trái tim.

> **Author**: [NirussVn0](https://sabicoder.xyz)

---

## ✨ Tính Năng

| # | Tính năng | Mô tả |
|---|-----------|-------|
| 1 | **2 Theme** | "Catch Me 🌸" (nút chạy trốn) & "Thư Tình 💌" (phong bì vintage) |
| 2 | **Anime.js** | Hoa rơi, hoa hồng nở, phong bì bay, confetti |
| 3 | **Nhạc nền** | Auto-play + nút bật/tắt luôn hiển thị |
| 4 | **Upload ảnh** | Ảnh hiển thị trong thư (max 500KB) |
| 5 | **QR trái tim** | Canvas heart với QR code bên trong |
| 6 | **Tên người gửi** | URL: `/card/ten-nguoi-gui-randomId` |
| 7 | **Link 10 ngày** | Tự cleanup hết hạn |
| 8 | **Watermark** | "Điều bất ngờ bởi NirussVn0" → sabicoder.xyz |

---

## 🏗️ Kiến Trúc

```
app/
├── layout.tsx                # Root layout + fonts (Inter, Playfair, Dancing Script)
├── page.tsx                  # Trang tạo thiệp
└── card/[id]/page.tsx        # Trang xem thiệp

components/
├── BrandWatermark.tsx        # Badge → sabicoder.xyz
├── card/
│   ├── CardView.tsx          # Router 2 themes
│   ├── CreatorForm.tsx       # Form tạo thiệp + HeartQR
│   ├── MemeOpening.tsx       # Mở đầu meme (chung)
│   ├── EnvelopeLetter.tsx    # Theme A: phong bì
│   ├── DodgeButton.tsx       # Theme A: nút chạy trốn
│   ├── MessageReveal.tsx     # Theme A: tin nhắn + confetti
│   ├── RoseDrawing.tsx       # Theme B: SVG hoa hồng
│   ├── EnvelopeScene.tsx     # Theme B: phong bì + trái tim CSS
│   ├── LetterModal.tsx       # Theme B: thư tay (600x350px per reference)
│   ├── HeartQR.tsx           # Canvas QR trái tim
│   └── MusicToggle.tsx       # Bật/tắt nhạc
└── effects/
    ├── PetalRain.tsx         # Cánh hoa rơi
    └── RoseGift.tsx          # Hoa hồng nở

lib/
├── store.ts                  # In-memory store + expiry + slug
└── actions.ts                # Server actions
```

---

## 🧱 Design Principles

- **SRP**: Mỗi component 1 trách nhiệm (`HeartDecor`, `GiftSection`, `LetterTextContent`)
- **OCP**: Dễ thêm theme mới qua CardView state machine
- **DRY**: `PetalRain`, `BrandWatermark` tái sử dụng xuyên suốt
- **Type Safety**: TypeScript strict, interface cho tất cả props

---

## 🚀 Getting Started

```bash
npm install        # Cài dependencies
npm run dev        # Chạy dev server → http://localhost:3000
npx tsc --noEmit   # Type check
npm run build      # Build production
```

### Thay đổi nội dung thiệp

1. Mở `http://localhost:3000`
2. Chọn theme, nhập tên người nhận, tin nhắn, tên người gửi
3. (Tùy chọn) Upload ảnh người nhận (max 500KB)
4. Nhấn "Tạo thiệp" → lấy link gửi
5. Tải QR trái tim để gửi qua tin nhắn

### Thêm nhạc nền

Copy file `.mp3` vào thư mục `public/` và đặt tên `music.mp3`.

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | Anime.js 4 |
| Icons | react-icons (Phosphor) |
| QR | qrcode |
| Fonts | Dancing Script, Inter, Playfair Display |

---

## 📄 License

Made with ❤️ by [NirussVn0](https://sabicoder.xyz)
