# 07 — ANALYTICS (Analiz ve Raporlama Motoru)

## 1. Temel Hesaplama Formülleri

| Metrik | Formül |
|---|---|
| **Net** | `Doğru − (Yanlış / Yanlış Katsayısı)` — katsayı sınav türüne göre değişir (bkz. 08_EXAMS.md) |
| **Başarı Oranı %** | `(Net / Soru Sayısı) × 100` |
| **Konu Hakimiyeti %** | `Tamamlanan Kazanım Sayısı / Toplam Kazanım Sayısı × 100` |
| **Gelişim Eğimi** | Son N kayıt üzerinde basit lineer regresyon eğimi (net veya başarı % üzerinden) |
| **Çalışma Tutarlılığı** | Hedeflenen çalışma günü / Gerçekleşen çalışma günü (haftalık) |
| **GPA (Üniversite)** | `Σ(Ders Notu × Kredi) / Σ(Kredi)` — 4'lük veya 100'lük sisteme göre normalize edilir |

## 2. Rapor Kategorileri

### 2.1 Ders Bazlı Raporlar
- Zaman içinde net/başarı trendi (çizgi grafik)
- Konu bazlı kırılım (bar grafik)
- Kaynak/kitap karşılaştırması

### 2.2 Konu Bazlı Raporlar
- Kazanım tamamlanma haritası (heatmap/radar)
- Yanlış analizi dağılımı (hata türüne göre pasta grafik)
- Tekrar geçmişi ve başarı değişimi

### 2.3 Deneme/Sınav Raporları
- Puan trendi (zaman serisi)
- Ders bazlı net karşılaştırması (radar grafik — güçlü/zayıf dersler tek bakışta)
- Yayınevi bazlı deneme performansı

### 2.4 Genel Dashboard
- Haftalık/aylık özet KPI'lar (toplam çözülen soru, ortalama net, çalışma süresi)
- Aktif hedeflerin ilerleme durumu
- Son AI içgörüleri
- Yaklaşan tekrar/plan görevleri

### 2.5 Karşılaştırmalı Raporlar
- Dönem karşılaştırma (bu ay vs geçen ay)
- Ders karşılaştırma (hangi derste en çok gelişim var)
- Hedef vs gerçekleşen karşılaştırması

## 3. Grafik Türü Seçim Rehberi

| Veri Tipi | Önerilen Grafik |
|---|---|
| Zaman serisi (trend) | Çizgi grafik |
| Kategori karşılaştırma (ders/konu) | Bar grafik |
| Çok boyutlu karşılaştırma (dersler arası profil) | Radar grafik |
| Oran/dağılım (hata türleri) | Donut/Pasta grafik |
| Yoğunluk/örüntü (kazanım haritası) | Heatmap |
| İlerleme (hedef, kazanım tamamlama) | Progress ring/bar |

## 4. Performans Gereksinimleri

- Dashboard yüklenme süresi: 100.000 kayıt üzerinde < 500ms
- Rapor filtreleme (tarih aralığı değişimi): < 200ms yanıt
- Ağır hesaplamalar (regresyon, çoklu korelasyon) önceden hesaplanıp önbelleğe alınır, her render'da yeniden hesaplanmaz — yalnızca ilgili veri değiştiğinde invalidate edilir (bkz. 02_SYSTEM_ARCHITECTURE.md §5)

## 5. Veri Güncelleme Tetikleyicileri

Her yeni test/deneme/yazılı kaydında otomatik olarak yeniden hesaplanması gerekenler:

1. İlgili dersin/konunun özet istatistikleri
2. Genel dashboard KPI'ları
3. Aktif hedeflerin ilerleme yüzdesi
4. Tekrar kuyruğu (yeni kazanım verisi varsa)
5. AI içgörüleri (eşik aşıldıysa yeni insight üretilir)

## 6. Export Edilebilir Rapor Formatları

Bkz. 14_EXPORTS.md — her rapor PDF (görsel/sunum) veya Excel (ham veri + pivot) olarak dışa aktarılabilir.

---
*Bağımlı olduğu doküman: 03, 06 — Sonraki doküman: 08_EXAMS.md*
