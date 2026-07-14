# 10 — LGS (Liselere Geçiş Sistemi Modülü)

## 1. Sınav Formatı (Çekirdek Yapı)

LGS, 8. sınıf öğrencileri için merkezi sınavdır ve sabit ders/soru dağılımına sahiptir. Bu dağılım `exam_type = 'LGS'` için sistemde sabit bir referans tablo olarak tutulur:

| Ders | Soru Sayısı |
|---|---|
| Türkçe | 20 |
| Matematik | 20 |
| Fen Bilimleri | 20 |
| T.C. İnkılap Tarihi ve Atatürkçülük | 10 |
| Din Kültürü ve Ahlak Bilgisi | 10 |
| Yabancı Dil | 10 |

**Not:** Bu sayılar yıllara göre değişebileceğinden, sistemde sabit kodlanmaz — `exam_format_templates` adında yapılandırılabilir bir referans tablo/JSON olarak tutulur ve kullanıcı/yönetici tarafından güncellenebilir (bkz. 01_PROJECT_RULES.md §modülerlik ilkesi).

## 2. Yanlış Götürme Katsayısı

LGS'de yanlış cevaplar doğruyu götürmez (4 yanlış 1 doğruyu götürmez) — güncel uygulamada her doğru 1 puan, yanlış etkisiz sayılır. Sistem bu davranışı `wrong_coefficient = 0` (etkisiz) olarak modelleyebilir; ancak kullanıcı isterse klasik "4 yanlış 1 doğruyu götürür" hesaplamasını da (geçmiş yıllar/bazı deneme yayınları için) seçenek olarak açabilir.

**Kural:** Bu davranış `subjects`/`exam_format_templates` seviyesinde konfigüre edilir, koda gömülmez — resmi sınav kuralları değişirse yalnızca konfigürasyon güncellenir.

## 3. Puan Hesaplama Yaklaşımı

LGS'de ham puan, ders bazlı doğru sayılarının ağırlıklandırılmış toplamına dayanır ve yıllar içinde MEB tarafından farklı formüllerle (bazen sabit katsayı, bazen istatistiksel ortalama/standart sapmaya dayalı) hesaplanmıştır. Bu nedenle:

- Sistem varsayılan olarak **basit ağırlıklı net toplamı** kullanır (kullanıcıya "tahmini puan" olarak gösterilir)
- Kullanıcı, güncel resmi katsayıları biliyorsa `exam_format_templates` üzerinden ders ağırlıklarını güncelleyebilir
- Uygulama, gösterilen puanın "tahmini" olduğunu ve MEB'in resmi istatistiksel yöntemiyle birebir örtüşmeyebileceğini UI'da açıkça belirtir

## 4. Deneme Analizi Özellikleri

- Ders bazlı net trend grafiği (6 dersin tamamı tek radar grafikte)
- Yayınevi bazlı deneme karşılaştırması
- Hedef okul/puan karşılaştırması (kullanıcı hedef puan girer, sistem farkı gösterir)
- Konu bazlı yanlış analizi → LGS müfredat kazanımlarıyla ilişkilendirme

## 5. Müfredat Şablonu

LGS modülü için MEB 8. sınıf müfredatına dayalı önceden tanımlı ders/konu/kazanım şablonu sağlanır (bkz. 05_FEATURES.md §1 "toplu içe aktarma"). Kullanıcı bu şablonu doğrudan kullanabilir veya özelleştirebilir.

## 6. Genişletilebilirlik

Bu modül, 08_EXAMS.md'de tanımlanan `ExamModule` sözleşmesini implemente eder. Resmi hesaplama kuralları değiştiğinde yalnızca bu modülün `calculateScore()` implementasyonu güncellenir — diğer sınav modülleri (TYT/AYT vb.) etkilenmez.

---
*Bağımlı olduğu doküman: 08, 09 — Sonraki doküman: 11_TYT_AYT.md*
