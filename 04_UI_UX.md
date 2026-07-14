# 04 — UI / UX (Tasarım Sistemi)

## 1. Tasarım Felsefesi

Google Material, Apple HIG ve Microsoft Fluent'in ortak paydası: **sadelik, boşluk kullanımı, tutarlılık**. AkademiX Pro X bu üç sistemden ilham alır ama hiçbirini birebir kopyalamaz — kendi tutarlı token setini kullanır.

**Kurallar:**
- Her ekranda maksimum 1 birincil aksiyon (primary CTA) vurgulanır
- Bilgi yoğunluğu yüksek ekranlarda (dashboard, raporlar) bile "nefes alan" boşluk bırakılır
- Animasyonlar 150-250ms arası, ease-out — asla dikkat dağıtıcı değil

## 2. Renk Sistemi (Design Tokens)

### Light Mode
| Token | Değer | Kullanım |
|---|---|---|
| `--bg-primary` | #FFFFFF | Ana arkaplan |
| `--bg-secondary` | #F5F6F8 | Kart/panel arkaplanı |
| `--text-primary` | #1A1D23 | Ana metin |
| `--text-secondary` | #6B7280 | İkincil metin |
| `--accent` | #3B5BFD | Birincil marka rengi |
| `--success` | #16A34A | Doğru/başarı |
| `--danger` | #DC2626 | Yanlış/uyarı |
| `--warning` | #D97706 | Dikkat |

### Dark Mode
| Token | Değer |
|---|---|
| `--bg-primary` | #0F1115 |
| `--bg-secondary` | #1A1D23 |
| `--text-primary` | #F3F4F6 |
| `--text-secondary` | #9CA3AF |
| `--accent` | #5B7CFF |
| `--success` | #22C55E |
| `--danger` | #EF4444 |
| `--warning` | #F59E0B |

**Kural:** Renk asla hardcode edilmez; her komponent CSS değişkenleri üzerinden çalışır — tema değişimi anlık ve tutarlı olur.

## 3. Tipografi

- **Font:** Inter (sistem fontuna düşen fallback: -apple-system, Segoe UI)
- **Ölçek:** 12 / 14 / 16 / 20 / 24 / 32 / 40px (8'li ritim)
- **Ağırlıklar:** Regular (400), Medium (500), Semibold (600) — Bold (700) yalnızca büyük başlıklarda

## 4. Spacing Sistemi

4px taban birim: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px. Kart içi padding minimum 16px, ekran kenar boşluğu minimum 24px (masaüstü).

## 5. Komponent Kütüphanesi (Çekirdek Set)

- **Button** (primary/secondary/ghost/danger, 3 boyut)
- **Card** (istatistik kartı, konu kartı, test kartı varyantları)
- **DataTable** (sanal kaydırmalı, sıralanabilir, filtrelenebilir)
- **Chart Wrapper** (Recharts üzerine tutarlı stil katmanı: çizgi, bar, radar, donut)
- **Modal / Drawer** (form girişleri için)
- **Toast/Notification** (işlem sonucu bildirimleri)
- **EmptyState** (veri yokken gösterilecek, her ekran için özelleştirilmiş illüstrasyon + CTA)
- **ProgressRing / ProgressBar** (kazanım tamamlama, hedef ilerlemesi)
- **Badge/Chip** (rozet, etiket, ders rengi göstergesi)

## 6. Ekran Şablonları (Screen Templates)

1. **Dashboard Template** — üstte özet KPI kartları, ortada trend grafiği, altta son aktiviteler
2. **List + Detail Template** — sol panel liste (ders/konu ağacı), sağ panel detay (Konu Detayı, Kitap Detayı)
3. **Form Template** — Test/Deneme/Yazılı giriş formları, adım adım (wizard) veya tek sayfa
4. **Report Template** — filtre çubuğu üstte, çoklu grafik + tablo altta, PDF/Excel export butonu sağ üstte
5. **AI Coach Panel** — sohbet benzeri arayüz + öne çıkan "insight kartları"

## 7. Navigasyon Yapısı

```
┌─ Sol Kenar Çubuğu (Sidebar) ─┐
│ Dashboard                     │
│ Derslerim                     │
│ Testler                       │
│ Denemeler                     │
│ Yazılılar (Okul/Üniversite)   │
│ Tekrar Sistemi                │
│ Çalışma Planı                 │
│ Raporlar                      │
│ Akademi AI                    │
│ Başarılar (Oyunlaştırma)      │
│ Ayarlar                       │
└────────────────────────────────┘
```

Modül bazlı (LGS/TYT-AYT/Üniversite) filtreleme üst çubukta profil/seviye seçici ile yapılır — sidebar sabit kalır, içerik modüle göre adapte olur.

## 8. Etkileşim Kuralları

- Her veri girişi formu **inline validation** kullanır (hata anında gösterilir, submit'te değil)
- Silme işlemleri her zaman onay modalı gerektirir
- Uzun işlemler (export, AI analiz) skeleton loading + ilerleme göstergesiyle desteklenir
- Klavye kısayolları: hızlı test girişi için (örn. `Ctrl+N`)

## 9. Erişilebilirlik (Accessibility)

- Kontrast oranı WCAG AA standardını karşılar (both modes)
- Tüm interaktif elemanlar klavye ile ulaşılabilir
- Grafiklerde renk körlüğüne duyarlı palet + doku/etiket desteği

## 10. Responsive Davranış

Masaüstü öncelikli tasarım; pencere daraldığında sidebar collapse olur, çoklu-kolon layout'lar tek kolona iner (gelecekteki mobil companion için temel oluşturur).

---
*Bağımlı olduğu doküman: 02, 03 — Sonraki doküman: 05_FEATURES.md*
