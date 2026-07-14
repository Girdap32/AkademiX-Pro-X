# AkademiX Pro X — Doküman Yol Haritası

## Teknoloji Kararları (Sabit)
- **Shell:** Tauri (Rust + WebView) — Windows/Mac/Linux masaüstü
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Zustand
- **Veritabanı:** SQLite (yerel, tek dosya, ilişkisel)
- **Grafik:** Recharts
- **Export:** JSON / Excel (xlsx) / PDF (yerel üretim)
- **AI Katmanı:** Yerel kural + istatistik motoru (çekirdek, offline) + opsiyonel bulut LLM zenginleştirmesi (varsa internet)
- **Mimari:** Modüler monorepo, feature-based klasörleme, SOLID prensipleri

## Yazım Sırası ve Her Dosyanın Kapsamı

| # | Dosya | İçerik | Bağımlı Olduğu Dosya |
|---|---|---|---|
| 00 | MASTER_PROMPT.md | ✅ Hazır (kullanıcı sağladı) | — |
| 01 | PROJECT_RULES.md | Kapsam, kısıtlar, kalite kuralları, "yapılmayacaklar" listesi, terminoloji sözlüğü | 00 |
| 02 | SYSTEM_ARCHITECTURE.md | Katman mimarisi, klasör yapısı, modül iletişimi, offline senkron stratejisi, performans mimarisi | 01 |
| 03 | DATABASE.md | Tam ER şeması: Ders→Konu→AltKonu→Kazanım→Kaynak→Kitap→Test→YanlışAnaliz→Tekrar→İstatistik zinciri, tablo/alan tanımları, indeksleme | 02 |
| 04 | UI_UX.md | Tasarım sistemi (renk/tipografi/spacing), Dark/Light mode token'ları, komponent kütüphanesi, ekran şablonları, mikro-etkileşim kuralları | 02, 03 |
| 05 | FEATURES.md | Tüm özelliklerin tam listesi + kullanıcı hikayeleri (ders yönetimi, konu takibi, çalışma planı, tekrar sistemi, hedefler, oyunlaştırma) | 03, 04 |
| 06 | AI_SYSTEM.md | Akademi AI davranış kuralları, analiz algoritmaları (trend tespiti, zayıf konu tespiti, öneri motoru), soru-cevap senaryoları | 03, 05 |
| 07 | ANALYTICS.md | İstatistik/rapor motoru: hangi metrikler, hangi grafikler, hesaplama formülleri (net, başarı %, gelişim eğrisi vb.) | 03, 06 |
| 08 | EXAMS.md | Genel sınav/deneme modeli (tüm sınav türleri için ortak çekirdek yapı) | 03 |
| 09 | TEST_ENGINE.md | Test kayıt motoru: veri girişi akışı, doğrulama kuralları, otomatik hesaplamalar | 03, 08 |
| 10 | LGS.md | LGS'ye özel puan/net hesaplama kuralları, ders ağırlıkları, deneme formatı | 08, 09 |
| 11 | TYT_AYT.md | TYT/AYT puan hesaplama, alan/puan türü kuralları, YKS deneme formatı | 08, 09 |
| 12 | UNIVERSITY.md | Üniversite ders/not sistemi (vize/final/quiz/proje), GPA hesaplama, dönem takibi | 03, 05 |
| 13 | SECURITY.md | Yerel veri güvenliği, şifreleme, yedekleme, veri kaybı önleme stratejisi | 02, 03 |
| 14 | EXPORTS.md | JSON/Excel/PDF export-import format spesifikasyonları, veri bütünlüğü kuralları | 03, 13 |
| 15 | DEVELOPMENT_RULES.md | Geliştirme süreci kuralları, branch stratejisi, test politikası, code review kriterleri | 01, 02 |
| 16 | CODING_STANDARD.md | TypeScript/React kod standartları, isimlendirme, klasör/dosya kuralları, lint/format kuralları | 15 |
| 17 | FINAL_REQUIREMENTS.md | Yayın öncesi kontrol listesi, kabul kriterleri, performans hedefleri (ölçülebilir) | Tümü |

## Şimdi Ne Yapıyoruz
Bu turda **01_PROJECT_RULES.md** yazılıyor. Onayınızla sırayla 02, 03... şeklinde devam edilecek.
