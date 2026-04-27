# Test İmplementasyon Stratejisi

Aşağıdaki 9 test senaryosu, sistemin stres altında ve uç durumlarda (edge cases) nasıl tepki vereceğini ölçmek için tasarlanmıştır.

### Test Senaryoları:
1. **Agent Failure:** Bir ajan çalışma anında çökerse sistem devralma (failover) yapıyor mu?
2. **High Volatility:** Piyasa verileri %20 dalgalandığında RiskEngine işlemi durduruyor mu?
3. **Consensus Breach:** Ajanların %51'i hatalı veri dönerse sistem blokluyor mu?
4. **Latency Spike:** Ağ gecikmesi 500ms üzerine çıktığında swarm nasıl tepki veriyor?
5. (Diğer 5 senaryo: API Rate Limit, Database Deadlock, Memory Leak, Auth Bypass, Signal Jamming).

### CI/CD Entegrasyonu:
- **GitHub Actions:** Her `push` işleminde `pytest` ve `flake8` kontrolleri çalıştırılmalı.
- **Auto-Deploy:** Testler %100 başarıyla tamamlanmadan `main` branch'ine merge yapılamaz.
