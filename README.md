# AkademiX Pro X

`docs/` klasöründeki 17 dokümanlık şartnameye dayanan, gerçekten çalışan bir akademik takip
platformu. Sahte veri yok, placeholder yok — her ekran gerçek IndexedDB verisiyle çalışır.

## Şu An Çalışan Modüller

| Modül | Açıklama | İlgili Doküman |
|---|---|---|
| **Derslerim** | Sınırsız ders/konu ekleme | 05_FEATURES.md §1 |
| **Testler** | Test kayıt motoru, gerçek Net/Başarı % hesaplama | 09_TEST_ENGINE.md |
| **Denemeler** | LGS/TYT/AYT/KPSS/ALES/DGS/YDS/YÖKDİL — tümü için format şablonlu giriş, tahmini puan | 08/10/11 |
| **Profilim** | Ad/Soyad + Sınıf/Seviye takibi, sınıf değiştirildiğinde eski veriler korunur | 01_PROJECT_RULES.md §2 |
| **Sınıf Gelişimi** | Sınıf sınıf ortalama başarı karşılaştırması (geçmiş sınıflar hiç silinmez) | Yeni |
| **Üniversite** | Ders + vize/final/quiz/proje girişi, ağırlıklı not ve GPA hesaplama | 12_UNIVERSITY.md |
| **Tekrar Sistemi** | Unutma eğrisi tabanlı otomatik tekrar zamanlaması | 05_FEATURES.md §7 |
| **Çalışma Planı** | Günlük/haftalık/aylık plan + görev takibi | 05_FEATURES.md §8 |
| **Raporlar** | Ders bazlı bar grafik, deneme radar profili, puan trendi | 07_ANALYTICS.md |
| **Akademi AI** | Tamamen yerel/offline kural motoru: trend tespiti, zayıf ders, unutma uyarısı, günlük odak önerisi | 06_AI_SYSTEM.md |
| **Başarılar** | XP, seviye, çalışma serisi (streak), rozetler | 05_FEATURES.md §12 |
| **Ayarlar** | JSON tam yedek + Excel export, JSON import (onaylı) | 14_EXPORTS.md |
| **Dashboard** | Gerçek KPI'lar + net trend grafiği | 07_ANALYTICS.md |
| Dark/Light Mode | Tüm uygulamada tutarlı tema | 04_UI_UX.md |

## Henüz Yok (v1 sonrası — bkz. 01_PROJECT_RULES.md §4)

- Kaynak/Kitap bazlı detaylı takip (temel veri modeli var, UI'da yok)
- Yanlış analizi ekranı (veri modeli hazır: `wrongAnalysis` tablosu)
- Kazanım (outcome) bazlı ince taneli takip (konu seviyesinde çalışıyor)
- SQLCipher şifreleme + Tauri masaüstü paketleme (şu an tarayıcı/web uygulaması)
- Çoklu kullanıcı profili
- Bulut senkronizasyonu (kapsam dışı, bkz. 01_PROJECT_RULES.md §4)

## Nasıl Çalıştırılır

Gereksinim: **Node.js 18+** → https://nodejs.org

```bash
npm install
npm run dev
```

Terminalde çıkan adresi (genelde `http://localhost:5173`) tarayıcıda açın.

**Kalıcı/production modu:**
```bash
npm run build
npm run preview
```

## Veri Nerede Saklanıyor?

Tarayıcınızın IndexedDB deposunda (`AkademiXProX`). Hiçbir veri internete gönderilmez
(bkz. 01_PROJECT_RULES.md — Offline-First). Düzenli olarak **Ayarlar → JSON Yedek İndir**
ile yedek almanız önerilir — tarayıcı verilerini temizlerseniz (veya farklı bir tarayıcı/
bilgisayar kullanırsanız) geri yükleme için bu dosyaya ihtiyacınız olur.

## Proje Yapısı

```
src/
├── domain/            # Saf hesaplama fonksiyonları (framework bağımsız, test edilebilir)
│   ├── calculations.ts    # Net, başarı %, trend eğimi
│   ├── exams.ts           # Sınav format şablonları + puan hesaplama
│   ├── university.ts      # Ders notu + GPA hesaplama
│   ├── review.ts           # Spaced repetition algoritması
│   ├── gamification.ts      # XP/seviye/rozet mantığı
│   └── aiCoach.ts            # Yerel AI içgörü üretimi
├── data/
│   ├── db.ts                  # IndexedDB şeması (Dexie)
│   └── exportImport.ts         # JSON/Excel export-import
├── store/                       # Zustand state yönetimi (feature bazlı)
├── features/                     # Sayfa komponentleri (her biri kendi klasöründe)
└── App.tsx                        # Sidebar navigasyon + ana kabuk
```

Bu yapı `docs/02_SYSTEM_ARCHITECTURE.md`'deki katmanlı mimariyi birebir takip eder:
UI → Store → Domain (saf mantık) → Data (Dexie/IndexedDB).

## Kalite Kontrolleri (Bu Sürüm İçin Yapıldı)

- ✅ `tsc -b` — sıfır TypeScript hatası (strict mode)
- ✅ `oxlint` — sıfır lint hatası/uyarısı
- ✅ `npm run build` — production build başarılı
- ✅ Preview sunucusu ile tüm asset'ler (JS/CSS) gerçek HTTP isteğiyle doğrulandı

## Sırada Ne Var?

Bu depoyu Claude Code ile açıp şartname dokümanlarına referansla devam ettirebilirsiniz, örneğin:

> "docs/03_DATABASE.md §Kaynak/Kitap bölümünü oku ve Kaynak/Kitap yönetimi ekranını ekle"

> "docs/13_SECURITY.md'yi oku ve bu web uygulamasını Tauri ile masaüstü uygulamasına çevir"

`docs/PLAN.md` dosyası, orijinal 17 dokümanın tam listesini ve bağımlılık sırasını içerir.
