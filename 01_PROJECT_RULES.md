# 01 — PROJECT RULES (Proje Kuralları)

## 1. Amaç ve Kapsam

AkademiX Pro X, ilkokuldan üniversiteye ve sonrasına (KPSS, ALES, DGS, YDS, YÖKDİL, açık öğretim, sertifika eğitimleri) kadar tüm akademik süreci yönetebilen, **tamamen offline çalışan**, modüler bir Akademik Yönetim ve Öğrenme Platformudur.

Bu doküman, projenin tüm geliştirme sürecinde bağlayıcı olan temel kuralları tanımlar. Sonraki tüm teknik dokümanlar (02-17) bu kurallara uymak zorundadır.

## 2. Temel İlkeler

1. **Offline-First:** Uygulama internet olmadan tam işlevsel çalışmalıdır. İnternet, yalnızca opsiyonel AI zenginleştirmesi ve gelecekteki senkronizasyon özellikleri için kullanılır — asla zorunlu değildir.
2. **Veri Kaybı Sıfır Tolerans:** Hiçbir kullanıcı verisi, hangi senaryoda olursa olsun kaybolmamalıdır. Otomatik yedekleme ve kurtarma mekanizmaları zorunludur.
3. **Modülerlik:** Her eğitim seviyesi (LGS, TYT/AYT, Üniversite vb.) bağımsız bir modül olarak geliştirilir. Yeni bir eğitim sistemi eklemek, mevcut kodu bozmadan yapılabilmelidir.
4. **Gerçek Veri, Gerçek Hesaplama:** Hiçbir ekranda sahte/mock veri, placeholder istatistik veya "demo" mantığı bulunmaz. Her buton gerçek bir işlevi tetikler.
5. **Performans Önceliklidir:** 100.000+ test kaydında bile arayüz akıcı kalmalıdır. Performans, geliştirme sürecinin her aşamasında test edilir.
6. **Analiz > Kayıt:** Sistem yalnızca veri saklamaz; veriyi yorumlar, örüntü tespit eder ve öneri üretir.

## 3. Kapsam İçi (In-Scope)

- Sınırsız ders/konu/alt konu/kazanım tanımlama
- Sınırsız kaynak/kitap takibi
- Test, deneme, yazılı (vize/final/quiz/proje) kayıt sistemi
- Tüm sınav türleri için puan/net hesaplama motorları (LGS, TYT, AYT, KPSS vb.)
- Otomatik istatistik ve rapor üretimi
- Yerel kural tabanlı + opsiyonel LLM destekli AI analiz katmanı (Akademi AI)
- Çalışma planı, tekrar sistemi, hedef yönetimi
- Oyunlaştırma (rozet, XP, seviye, seri takibi)
- JSON / Excel / PDF export-import
- Dark Mode / Light Mode
- Çoklu kullanıcı profili (aynı cihazda birden fazla öğrenci desteği)

## 4. Kapsam Dışı (Out-of-Scope) — v1 için

- Bulut senkronizasyonu / çoklu cihaz eşitleme (ileriki faz)
- Öğretmen/veli portalı ve çoklu kullanıcı yetkilendirme sistemi (ileriki faz)
- Canlı ders / video içerik barındırma
- Sosyal özellikler (arkadaş ekleme, lider tablosu paylaşımı vb.)
- Üçüncü taraf soru bankası entegrasyonu

Bu maddeler mimariyi kısıtlamaz — ileride eklenebilecek şekilde tasarlanır ama v1 teslimatının parçası değildir.

## 5. Kesin Yasaklar ("Yapılmayacaklar")

- ❌ Sahte/örnek veri ile doldurulmuş ekran teslim etmek
- ❌ "TODO" veya çalışmayan buton bırakmak
- ❌ Kullanıcı onayı olmadan veri silmek
- ❌ İnterneti zorunlu kılan hiçbir çekirdek özellik
- ❌ Tek bir monolitik dosyada iş mantığı biriktirmek
- ❌ Hesaplama mantığını (net, puan, GPA vb.) UI katmanına gömmek — bu mantık her zaman ayrı, test edilebilir bir katmanda olmalı
- ❌ Kullanıcının izni olmadan veri dışa gönderimi (telemetri dahil)

## 6. Terminoloji Sözlüğü

| Terim | Tanım |
|---|---|
| **Ders** | En üst seviye akademik kategori (örn. Matematik, Python) |
| **Konu** | Bir derse bağlı ana başlık |
| **Alt Konu** | Bir konuya bağlı detay başlık |
| **Kazanım** | Alt konuya bağlı, ölçülebilir öğrenme çıktısı |
| **Kaynak** | Bir konuda kullanılan yayın/yayınevi |
| **Kitap** | Kaynak altındaki spesifik materyal |
| **Test** | Konu bazlı, tek oturumluk soru çözme kaydı |
| **Deneme** | Çok derslik, sınav formatında kapsamlı ölçme (LGS/TYT/AYT vb.) |
| **Yazılı** | Okul/üniversite bazlı resmi sınav kaydı (vize, final, quiz) |
| **Net** | Doğru − (Yanlış / Yanlış Katsayısı) |
| **Tekrar Sistemi** | Unutma eğrisine dayalı otomatik tekrar zamanlaması |
| **Akademi AI** | Uygulama içi analiz ve öneri motoru |

## 7. Kalite Kabul Kriterleri

Bir özellik "tamamlandı" sayılabilmesi için:

1. Gerçek veriyle uçtan uca çalışmalıdır (mock veri değil)
2. İlgili istatistik/dashboard'u otomatik güncellemelidir
3. Boş durum (empty state), hata durumu ve yükleniyor durumu tasarlanmış olmalıdır
4. Dark/Light mode'da test edilmiş olmalıdır
5. 10.000+ kayıt ile performans testinden geçmiş olmalıdır
6. Birim testleri (özellikle hesaplama mantığı için) yazılmış olmalıdır

## 8. Karar Değişikliği Protokolü

Bu dokümandaki herhangi bir kural değiştirilmek istendiğinde:

1. Değişikliğin hangi diğer dokümanları etkilediği belirlenir (bkz. PLAN.md bağımlılık tablosu)
2. Etkilenen tüm dokümanlar güncellenir
3. Değişiklik bu dosyanın sonuna bir "Değişiklik Geçmişi" notu olarak eklenir

---
*Bu doküman, 02_SYSTEM_ARCHITECTURE.md ve sonrasındaki tüm dokümanlar için bağlayıcı referans kaynağıdır.*
