# 02 — SYSTEM ARCHITECTURE (Sistem Mimarisi)

## 1. Genel Mimari Yaklaşım

AkademiX Pro X, **katmanlı + modüler (feature-based) mimari** kullanır. Amaç: her eğitim seviyesi/özellik bağımsız geliştirilebilsin, test edilebilsin ve gerekirse tek başına devre dışı bırakılabilsin.

```
┌─────────────────────────────────────────────┐
│              PRESENTATION LAYER               │
│   React Components + Tailwind + Zustand Store  │
├─────────────────────────────────────────────┤
│              APPLICATION LAYER                │
│   Use-Case Servisleri (iş akışları, orkestrasyon) │
├─────────────────────────────────────────────┤
│                DOMAIN LAYER                    │
│  Hesaplama Motorları (Net, Puan, GPA, Analiz)  │
│  Bu katman UI'dan tamamen bağımsızdır          │
├─────────────────────────────────────────────┤
│             DATA ACCESS LAYER                  │
│   Repository Pattern → SQLite (Tauri SQL Plugin)│
├─────────────────────────────────────────────┤
│              INFRASTRUCTURE                    │
│  Tauri Runtime (Rust) — Dosya Sistemi, OS API  │
└─────────────────────────────────────────────┘
```

## 2. Neden Tauri?

| Kriter | Electron | Tauri |
|---|---|---|
| Binary boyutu | ~150-200 MB | ~10-20 MB |
| RAM kullanımı | Yüksek (Chromium her instance) | Düşük (OS'nin native webview'i) |
| Açılış hızı | Orta | Hızlı |
| Güvenlik | Node.js tam erişim riski | Rust tabanlı, izin sistemi (allowlist) |

"Çok hızlı açılış" ve "100.000 kayıtta kasmama" hedefleri doğrudan Tauri'nin native performans avantajından beslenir.

## 3. Klasör Yapısı (Monorepo)

```
akademix-pro-x/
├── src-tauri/                  # Rust backend (Tauri)
│   ├── src/
│   │   ├── db/                 # SQLite bağlantı & migration yönetimi
│   │   ├── commands/           # Frontend'e açılan Rust komutları
│   │   └── main.rs
│   └── Cargo.toml
├── src/                         # React frontend
│   ├── app/                    # Uygulama kabuğu (routing, layout, providers)
│   ├── modules/                # Her eğitim seviyesi ayrı modül
│   │   ├── lgs/
│   │   ├── tyt-ayt/
│   │   ├── university/
│   │   └── shared/              # Ortak sınav/deneme çekirdek mantığı
│   ├── features/                # Çapraz-kesen özellikler
│   │   ├── subjects/            # Ders/Konu/Kazanım yönetimi
│   │   ├── tests/                # Test kayıt motoru
│   │   ├── analytics/            # Rapor & istatistik
│   │   ├── ai-coach/              # Akademi AI
│   │   ├── planner/               # Çalışma planı, tekrar sistemi
│   │   ├── gamification/          # Rozet, XP, seviye
│   │   └── exports/               # JSON/Excel/PDF
│   ├── domain/                   # Saf iş mantığı (framework-bağımsız)
│   │   ├── calculations/          # Net, puan, GPA formülleri
│   │   └── analysis/               # Trend/örüntü algoritmaları
│   ├── data/                      # Repository katmanı
│   │   ├── repositories/
│   │   └── schema/
│   ├── components/                # Paylaşılan UI komponentleri (design system)
│   ├── store/                      # Zustand store'ları (feature bazlı)
│   └── lib/                         # Yardımcı fonksiyonlar
├── tests/
└── docs/                            # Bu dokümanların bulunduğu klasör
```

**Kural:** `domain/` klasörü hiçbir React veya Tauri importu içeremez. Bu katman saf TypeScript'tir ve bağımsız birim testlerle doğrulanır.

## 4. Veri Akışı Prensibi

Kullanıcı bir test kaydettiğinde:

1. UI, `features/tests` içindeki bir use-case fonksiyonunu çağırır
2. Use-case, `domain/calculations` ile net/başarı hesaplar
3. Repository katmanı SQLite'a yazar (tek transaction içinde)
4. Yazma başarılı olursa, ilgili Zustand store'ları invalidate edilir
5. Bağlı tüm ekranlar (dashboard, konu istatistiği, AI analiz) otomatik yeniden hesaplanır — **reaktif zincir**

Bu, MASTER_PROMPT'taki "Ders→Konu→...→Yapay Zeka" otomatik güncelleme zincirinin teknik karşılığıdır.

## 5. Performans Mimarisi

- **İndeksleme:** Sık sorgulanan alanlar (ders_id, konu_id, tarih) SQLite indeksleriyle desteklenir (bkz. 03_DATABASE.md)
- **Sayfalama (Pagination):** Liste ekranları asla tüm veriyi tek seferde çekmez; sanal kaydırma (virtualized list) kullanılır
- **Önbellekleme:** Dashboard istatistikleri, her yazma işleminden sonra artımlı (incremental) güncellenir — her açılışta sıfırdan hesaplanmaz
- **Arka Plan İşleme:** Ağır analiz/AI hesaplamaları Rust tarafında (Tauri command) veya Web Worker'da çalışır, UI thread'i bloklamaz

## 6. Offline-First Senkron Stratejisi

- Tüm veri SQLite dosyasında tutulur (`%APPDATA%/AkademiXProX/data.db` benzeri OS-standart konum)
- Otomatik yedekleme: her gün ilk açılışta ve her büyük veri değişikliğinde `backups/` klasörüne zaman damgalı kopya alınır
- Export/Import (JSON/Excel/PDF) veri taşınabilirliğini sağlar (bkz. 14_EXPORTS.md)
- İleride bulut senkronizasyonu eklenirse, bu katman `data/repositories` arkasına opsiyonel bir "sync adapter" olarak eklenecek — mevcut mimari buna hazır (Repository Pattern sayesinde)

## 7. AI Katmanı Mimarisi

```
UI (AI Coach paneli)
      │
      ▼
Akademi AI Orkestratörü
      │
      ├──► Yerel Kural/İstatistik Motoru (her zaman çalışır, offline)
      │        - Trend tespiti, zayıf konu tespiti, tekrar önerisi
      │
      └──► Opsiyonel Bulut LLM Adaptörü (internet varsa)
               - Doğal dil soru-cevap, serbest metin öneriler
```

Çekirdek analiz **asla** bulut bağımlı değildir. LLM katmanı yalnızca "sohbet" deneyimini zenginleştirir (bkz. 06_AI_SYSTEM.md).

## 8. Modül Ekleme Protokolü

Yeni bir eğitim sistemi (örn. YDS) eklemek için:

1. `src/modules/yds/` klasörü oluşturulur
2. `shared/` içindeki ortak sınav arayüzleri (`ExamModule` interface) implemente edilir
3. Puan/net hesaplama mantığı `domain/calculations/yds.ts` içine yazılır
4. Veritabanı şeması değişmez — mevcut generic `exams` tablosu `exam_type` alanıyla ayırt edilir (bkz. 03_DATABASE.md)

Bu sayede mevcut kod hiç değişmeden yeni modül eklenebilir (Open/Closed Principle).

---
*Bağımlı olduğu doküman: 01_PROJECT_RULES.md — Sonraki doküman: 03_DATABASE.md*
