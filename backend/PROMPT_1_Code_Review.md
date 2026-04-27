# Kod İnceleme ve Mimari Analiz Prompt'u (V1)

**Hedef:** Verilen 5 farklı deponun (Repository) "OpenClaw" ve "Oasis" standartlarına uygunluğunu denetlemek.

### Analiz Kriterleri:
1. **Modülerlik:** Kodlar bağımsız ajan servisleri olarak çalışmaya uygun mu?
2. **Hata Toleransı:** Risk motoru (RiskManager) beklenmedik veri girişlerini nasıl karşılıyor?
3. **Performans:** Swarm Intelligence katmanındaki gecikme (latency) süreleri optimize edilmiş mi?
4. **Güvenlik:** API anahtarları ve hassas veriler çevre değişkenleri üzerinden mi yönetiliyor?

### Çıktı Formatı:
Lütfen her repo için bir "Sağlık Skoru" (1-10) verin ve ardından:
- Kritik açıklar (Varsa)
- Refactoring önerileri
- Swarm entegrasyon potansiyeli
şeklinde listeleyin.
