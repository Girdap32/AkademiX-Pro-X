# 16 — CODING STANDARD (Kodlama Standartları)

## 1. Genel Prensipler

- **TypeScript strict mode** her zaman aktiftir (`strict: true`), `any` kullanımı yasaktır (gerekirse `unknown` + tip daraltma)
- SOLID prensipleri, özellikle **Single Responsibility** ve **Open/Closed** (bkz. 02_SYSTEM_ARCHITECTURE.md §8 modül ekleme protokolü) titizlikle uygulanır
- Kod tekrarından kaçınılır; 3'ten fazla yerde tekrar eden mantık ortak bir fonksiyona/hook'a çıkarılır

## 2. İsimlendirme Kuralları

| Öğe | Konvansiyon | Örnek |
|---|---|---|
| Dosya (komponent) | PascalCase | `TestRecordForm.tsx` |
| Dosya (yardımcı/hook) | camelCase | `useTestRecords.ts` |
| Komponent | PascalCase | `TestRecordForm` |
| Fonksiyon/değişken | camelCase | `calculateNet()` |
| Sabitler | UPPER_SNAKE_CASE | `DEFAULT_WRONG_COEFFICIENT` |
| Tip/Arayüz | PascalCase, `I` prefiksi yok | `TestRecord`, `ExamModule` |
| Veritabanı tablo/alan | snake_case | `test_records`, `wrong_coefficient` |

## 3. Klasör/Dosya Kuralları

- Her feature klasörü kendi `components/`, `hooks/`, `store.ts` alt yapısını taşır (bkz. 02_SYSTEM_ARCHITECTURE.md §3)
- `domain/` katmanındaki hiçbir dosya React/Tauri importu içeremez — saf TypeScript fonksiyonları
- Bir dosya 300 satırı aştığında bölünmesi değerlendirilir (kesin kural değil, kod kokusu sinyali)

## 4. React Kuralları

- Yalnızca fonksiyonel komponentler + Hooks kullanılır
- Prop tipleri her zaman açıkça tanımlanır (`interface XProps { ... }`)
- Gereksiz re-render'ları önlemek için `useMemo`/`useCallback` performans-kritik listelerde kullanılır (her yerde değil — gereksiz optimizasyon da kaçınılır)
- Component içinde doğrudan veritabanı/repository çağrısı yapılmaz — her zaman hook veya store üzerinden

## 5. State Yönetimi (Zustand)

- Her feature kendi store'unu tanımlar (`useTestStore`, `useAnalyticsStore` vb.)
- Global tek bir dev-store anti-pattern'inden kaçınılır
- Store içinde iş mantığı bulunmaz — store yalnızca state tutar ve `domain/`/`data/` katmanlarını çağırır

## 6. Hata Yönetimi

- Tüm repository/DB çağrıları `try/catch` ile sarılır, kullanıcıya anlamlı hata mesajı gösterilir (teknik stack trace değil)
- Beklenmeyen hatalar merkezi bir hata loglama mekanizmasına (yerel log dosyası) yazılır

## 7. Yorum ve Dokümantasyon Kuralları

- Karmaşık hesaplama fonksiyonları (net, puan, GPA) üstünde JSDoc ile formül açıklaması bulunur
- "Neden" açıklanır, "ne" değil (kod zaten neyi yaptığını gösterir)

## 8. Linting ve Formatlama

- ESLint (strict, `no-explicit-any`, `no-unused-vars` aktif) + Prettier
- Pre-commit hook ile otomatik lint/format kontrolü (commit öncesi engelleyici)

## 9. Rust (Tauri Backend) Standartları

- `clippy` uyarılarına sıfır tolerans (CI'da build'i kırar)
- Tauri command fonksiyonları ince tutulur (thin layer) — ağır mantık ayrı modüllerde

---
*Bağımlı olduğu doküman: 15 — Sonraki doküman: 17_FINAL_REQUIREMENTS.md*
