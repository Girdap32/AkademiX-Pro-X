# 09 — TEST ENGINE (Test Kayıt Motoru)

## 1. Amaç

`test_records` tablosuna yazılan konu bazlı test kayıtlarının uçtan uca akışını, doğrulama kurallarını ve otomatik hesaplamalarını tanımlar (bkz. 03_DATABASE.md §3.5).

## 2. Giriş Akışı

```
1. Kullanıcı ders seçer → o derse bağlı konu/alt konu listesi filtrelenir
2. (Opsiyonel) kaynak/kitap seçer → o kaynağa bağlı kitaplar filtrelenir
3. Test no, tarih, süre, soru/doğru/yanlış/boş girilir
4. Anlık önizleme: net ve başarı % otomatik hesaplanıp gösterilir (kayıttan önce)
5. Kaydet → transaction içinde test_records'a yazılır
6. Yazma başarılı → bağlı istatistikler invalidate edilir (bkz. 02_SYSTEM_ARCHITECTURE.md §4)
```

## 3. Doğrulama Kuralları

- `correct + wrong + blank == question_count` (aşan/eksik girişe izin verilmez, UI anında uyarır)
- `duration_minutes > 0` (sıfır veya negatif süre kabul edilmez)
- `date <= bugün` (gelecek tarihli test girilemez)
- Ders/konu seçimi zorunlu; kaynak/kitap opsiyonel
- Aynı gün aynı kitap+test no ile mükerrer kayıt uyarısı (kullanıcı yine de onaylayarak kaydedebilir — örn. tekrar çözüm senaryosu)

## 4. Hesaplama Mantığı

```
net = correct - (wrong / wrong_coefficient)
success_rate = (net / question_count) * 100
```

`wrong_coefficient` varsayılan olarak konu bazlı testlerde **4**'tür (kullanıcı ayarlardan değiştirebilir — bazı öğretmenler 3 kullanır). Bu değer `subjects` tablosunda ders bazlı override edilebilir.

## 5. Toplu Giriş Modu

Bir çalışma oturumunda birden fazla test girilecekse:

- Ders/konu/kaynak bir kez seçilir, ardından test no + sonuç satırları art arda eklenir (spreadsheet benzeri hızlı giriş tablosu)
- Her satır bağımsız doğrulanır, hatalı satır diğerlerini engellemez

## 6. Düzenleme ve Silme

- Kayıtlı bir test düzenlendiğinde, tüm bağlı istatistikler (dashboard, konu özeti, AI insight) yeniden hesaplanır
- Silme, soft-delete ile yapılır (bkz. 03_DATABASE.md §1); bağlı `wrong_analysis` kayıtları da birlikte soft-delete olur

## 7. Yanlış Analizi Entegrasyonu

Test kaydedildikten sonra, kullanıcı isterse (opsiyonel adım) her yanlış cevabı bir kazanıma ve hata türüne bağlayabilir. Bu adım atlanırsa test kaydı yine geçerlidir — yanlış analizi zorunlu değil, tamamlayıcıdır.

## 8. Performans Notları

- Test giriş formu, ders/konu listelerini lazy-load eder (binlerce konu olsa bile form açılışı hızlı kalır)
- Kayıt işlemi optimistic UI güncellemesiyle anında yansır; arka planda DB yazımı ve istatistik güncellemesi asenkron devam eder

---
*Bağımlı olduğu doküman: 03, 08 — Sonraki doküman: 10_LGS.md*
