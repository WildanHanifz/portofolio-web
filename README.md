HEAD
# portofolio-web
=======
# 🎨 Modern Developer Profile

Website profil developer dengan interactive header, project viewer, dan repository browser!

## ✨ Fitur Baru

### 🎭 Interactive Header
- Full-screen hero section
- Smooth scroll navigation
- Floating navbar yang berubah saat scroll
- Animated scroll indicators

### 📂 Project Viewer
- View detail project dengan modal
- Full description & tags
- 3 cara akses repository:
  - **View Live Demo** - Buka demo langsung
  - **View on GitHub** - Buka repository
  - **Browse Code** - Buka code browser (GitHub1s)

### 📝 Blog Post Viewer
- Klik post untuk baca full content
- Modal dengan Markdown rendering
- Clean reading experience

## 🔧 Fitur Lainnya

- 🔒 Password Protected Edit Mode
- 🖼️ Custom Header Background Image  
- 🌈 Custom Color Theme
- 💾 Auto Save ke localStorage
- 📱 Fully Responsive
- 📦 Export/Import Data

## 🚀 Quick Start

```bash
npm install
npm run dev
```

### Login Edit Mode
1. Klik ⚙️ (pojok kanan bawah)
2. Password: `admin123`
3. **GANTI PASSWORD SEGERA!**

## 🎨 Customization

**Tab Profile**: Nama, bio, avatar, social media, header image, password  
**Tab Projects**: Judul, deskripsi, gambar, **Live Demo URL**, **GitHub URL**, tags  
**Tab Blog**: Tulis dengan Markdown support  
**Tab Theme**: Ganti semua warna

## 🔗 Repository Browser

Saat add project, isi:
- **Live Demo URL**: `https://your-demo.com` (optional)
- **GitHub URL**: `https://github.com/username/repo` (required untuk browse code)

Tombol "Browse Code" akan buka GitHub1s - VSCode online untuk explore repository!

## 🎯 Interactive Header

Header punya:
- **Title & Subtitle**: Edit di Tab Profile
- **Background Image**: URL gambar custom
- **Navigation**: Auto scroll ke section
- **Floating Nav**: Berubah warna saat scroll

## 🖼️ Rekomendasi Gambar

### Header (Full Screen)
- Ukuran: minimal 1920x1080px
- Landscape/panorama works best
- Unsplash: `https://images.unsplash.com/photo-[ID]?w=1920`

### Project Thumbnails
- Ukuran: 800x600px (4:3) atau 1200x675px (16:9)
- Screenshot atau mockup

## 🔐 Security

Password tersimpan di localStorage.  
**PENTING**: Export data berkala!

Ganti password: Tab Profile → Security

## 🌐 Deploy

**Vercel**: Push ke GitHub → vercel.com  
**Netlify**: Build `npm run build`, Publish `dist`

## 🐛 Troubleshooting

### Lupa Password
Console (F12):
```javascript
localStorage.clear()
```

### Browse Code Tidak Buka
Pastikan GitHub URL format: `https://github.com/username/repo`

## 💡 Tips

- Gunakan **Unsplash** untuk gambar header berkualitas tinggi
- **GitHub1s** otomatis detect dari URL repository
- Add **Live Demo** untuk show working version
- Tulis deskripsi project yang detail

## 📄 License

MIT

---

**New Features**: Interactive header, project detail viewer, dan code browser! 🚀
3bb970a (Initial commit)
