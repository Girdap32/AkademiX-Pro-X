# 14 — EXPORTS (Dışa/İçe Aktarma Spesifikasyonu)

## 1. Genel Prensip

Kullanıcı verisi her zaman taşınabilir olmalıdır (bkz. 01_PROJECT_RULES.md). Üç format desteklenir: **JSON** (tam yedek/taşıma), **Excel** (analiz/paylaşım), **PDF** (sunum/rapor).

## 2. JSON Export/Import (Tam Yedek Formatı)

### Yapı
```json
{
  "export_version": "1.0",
  "exported_at": "ISO-8601 tarih",
  "app_version": "uygulama versiyonu",
  "data": {
    "users": [...],
    "subjects": [...],
    "topics": [...],
    "subtopics": [...],
    "outcomes": [...],
    "resources": [...],
    "books": [...],
    "test_records": [...],
    "exams": [...],
    "exam_subject_results": [...],
    "school_exams": [...],
    "wrong_analysis": [...],
    "review_queue": [...],
    "study_plans": [...],
    "plan_tasks": [...],
    "gamification": {...},
    "ai_insights": [...]
  }
}
```

### Kurallar
- `export_version` alanı, import sırasında uyumluluk kontrolü için kullanılır (eski versiyon JSON'lar migration ile güncel şemaya dönüştürülür)
- Import işlemi öncesi mevcut veritabanının otomatik yedeği alınır (bkz. 13_SECURITY.md §3)
- Import, **birleştirme (merge)** veya **tam değiştirme (replace)** modlarından biriyle yapılabilir — kullanıcı seçer
- Merge modunda ID çakışmaları, yeni ID ataması ile çözülür (ilişkiler korunarak yeniden eşlenir)

## 3. Excel Export (Analiz Formatı)

- Her ana varlık türü (Testler, Denemeler, Yazılılar vb.) ayrı bir sheet olarak dışa aktarılır
- Pivot-tablo dostu düz format kullanılır (her satır bir kayıt, tüm ilişkili isimler — ders adı, konu adı vb. — denormalize edilmiş şekilde eklenir, kullanıcı ham veriyle kendi analizini yapabilsin)
- Özet sheet: dashboard KPI'larının statik anlık görüntüsü
- Excel import: yalnızca **test kayıtları** ve **deneme sonuçları** için desteklenir (toplu veri girişi senaryosu — örn. kullanıcı Excel'de tuttuğu geçmiş verileri sisteme aktarmak isterse); şablon dosyası uygulama içinden indirilebilir

## 4. PDF Export (Rapor/Sunum Formatı)

- Seçilen rapor ekranının (dashboard, ders raporu, deneme analizi) görsel çıktısı olarak üretilir
- Grafikler vektörel (SVG tabanlı) olarak gömülür, düşük çözünürlükte piksel bozulması olmaz
- Rapor başlığı, tarih aralığı, kullanıcı adı otomatik üst bilgi (header) olarak eklenir
- Çok sayfalı raporlarda otomatik sayfa numarası ve içindekiler (uzun raporlarda)

## 5. Veri Bütünlüğü Doğrulama (Import Sırasında)

1. Şema versiyon uyumluluğu kontrolü
2. Zorunlu alan kontrolü (eksik FK ilişkisi varsa import reddedilir, hata detayı gösterilir)
3. Çakışan kayıt tespiti ve kullanıcıya seçenek sunma (üzerine yaz / atla / yeni kayıt olarak ekle)
4. Import sonrası bütünlük özeti raporu ("1.245 test kaydı, 12 deneme, 3 ders içe aktarıldı")

## 6. Zamanlanmış Export (Opsiyonel Özellik)

Kullanıcı, otomatik JSON yedeğinin belirli bir klasöre (örn. bulut senkron klasörü — Google Drive/OneDrive masaüstü uygulaması gibi harici bir senkron aracı kullanıyorsa) periyodik olarak kopyalanmasını ayarlayabilir. Bu, uygulamanın kendisinin bulut senkronu yapması değil, kullanıcının kendi harici aracını kullanabilmesi için bir "dışa aktarma hedefi" ayarıdır.

---
*Bağımlı olduğu doküman: 03, 13 — Sonraki doküman: 15_DEVELOPMENT_RULES.md*
