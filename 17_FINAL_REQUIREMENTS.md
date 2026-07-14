# 17 — FINAL REQUIREMENTS (Yayın Öncesi Kontrol Listesi)

## 1. Fonksiyonel Kabul Kriterleri

- [ ] Ders/Konu/Alt Konu/Kazanım yönetimi sınırsız derinlikte çalışıyor
- [ ] Test kayıt motoru, tüm doğrulama kurallarıyla (bkz. 09_TEST_ENGINE.md) sorunsuz çalışıyor
- [ ] Tüm sınav türleri (LGS, TYT, AYT, KPSS, ALES, DGS, YDS, YÖKDİL) için deneme girişi ve puan hesaplama doğru çalışıyor
- [ ] Üniversite modülü (vize/final/GPA) doğru hesaplıyor
- [ ] Yanlış analizi, kazanım bazlı etiketleme yapabiliyor
- [ ] Tekrar sistemi (spaced repetition) otomatik zamanlama üretiyor
- [ ] Çalışma planı oluşturma ve plan-gerçekleşen karşılaştırması çalışıyor
- [ ] Hedef yönetimi, ilerleme takibini doğru gösteriyor
- [ ] Akademi AI, hem yerel motor hem (opsiyonel) LLM katmanıyla doğru içgörü üretiyor
- [ ] Oyunlaştırma (XP, rozet, seviye, seri) doğru tetikleniyor
- [ ] JSON/Excel/PDF export-import kayıpsız çalışıyor
- [ ] Dark/Light mode tüm ekranlarda tutarlı
- [ ] Çoklu profil desteği tam izolasyonla çalışıyor

## 2. Performans Kabul Kriterleri (Ölçülebilir)

| Metrik | Hedef |
|---|---|
| Soğuk açılış süresi | < 2 saniye |
| 100.000 test kaydıyla dashboard yüklenmesi | < 500ms |
| Test kayıt formu açılış süresi | < 100ms |
| Arama sonucu gösterimi | < 150ms |
| Rapor filtreleme yanıt süresi | < 200ms |
| Bellek kullanımı (boşta) | < 150MB |

## 3. Güvenlik Kabul Kriterleri

Bkz. 13_SECURITY.md §8 — tüm maddeler doğrulanmış olmalı.

## 4. Kod Kalitesi Kabul Kriterleri

- [ ] `domain/` katmanı %90+ test kapsamına sahip
- [ ] ESLint/Clippy sıfır hata/uyarı ile geçiyor
- [ ] Hiçbir ekranda mock/sahte veri yok
- [ ] Hiçbir "TODO" veya çalışmayan buton yok
- [ ] Tüm migration'lar geriye dönük veri kaybı yaratmadan çalışıyor

## 5. UX Kabul Kriterleri

- [ ] Her liste/rapor ekranında boş durum (empty state) tasarlanmış
- [ ] Her form inline validation kullanıyor
- [ ] Her silme işlemi onay modalı gerektiriyor
- [ ] Klavye kısayolları (hızlı test girişi vb.) çalışıyor
- [ ] Erişilebilirlik: WCAG AA kontrast oranı karşılanıyor

## 6. Dokümantasyon Tamlığı

- [ ] 00-17 arası tüm dokümanlar güncel ve tutarlı
- [ ] Yeni modül ekleme protokolü (bkz. 02_SYSTEM_ARCHITECTURE.md §8) en az bir gerçek modülle (örn. yeni bir sınav türü) doğrulanmış

## 7. Yayın Sonrası İzleme Planı (v1 sonrası)

- Kullanıcı geri bildirim mekanizması (yerel, uygulama içi — internet gerektirmez)
- Hata raporlama (opt-in, yerel log dosyası paylaşımı şeklinde, otomatik telemetri değil)
- Sürüm güncelleme kontrolü (opsiyonel, internet varsa)

## 8. v1 Sonrası Yol Haritası (Referans, Kapsam Dışı)

Bkz. 01_PROJECT_RULES.md §4 — bulut senkronizasyonu, öğretmen/veli portalı, mobil companion uygulama gibi maddeler bu dokümanın kapsamı dışındadır ancak mimari bunlara açık bırakılmıştır (bkz. 02_SYSTEM_ARCHITECTURE.md §6 senkron stratejisi).

---
*Bu doküman, tüm önceki dokümanların (00-16) nihai kabul kontrol noktasıdır. Proje bu listedeki tüm maddeler karşılanmadan "v1 tamamlandı" olarak işaretlenemez.*
