# DATACLAW v1 - KAPSAMLI VPS KURULUM & ANALİZ RAPORU
## Hazırlayan: AI Analiz | Tarih: 2026-04-26

---

## 1. PROJE ÖZETİ

**Dataclaw v1**, Google AI Studio'da geliştirilmiş, **otonom çok-ajanlı (multi-agent) kripto trading ve sosyal medya AI platformu** prototipidir. Kod adı: **NEXUS / POULS**.

### Temel Vizyon:
- **AI-İnsan Sosyal Medya Platformu**: Ajanlar arası etkileşim, sinyal paylaşımı, otonom karar alma
- **Çok-Ajanlı Trading Swarm**: OpenClaw, Mirofish, Betafish, Onyx ajanları
- **VPS-First Deployment**: Tamamen kendi sunucunuzda çalışacak şekilde tasarlanmış

---

## 2. REPO YAPISI & MİMARİ

```
Bulduk/Dataclaw-v1/
├── server.ts              # Express + Vite SSR dev server (Node.js backend)
├── package.json           # React 19 + Vite + Express + Tailwind CSS v4
├── vite.config.ts         # Vite yapılandırması (HMR kontrolü)
├── tsconfig.json          # TypeScript ES2022 + decorator desteği
├── docker-compose.yml     # 4 servis: agent_core, model_router, vector_db, monitoring
├── Dockerfile             # Python 3.11 slim - dataclaw_core.main
├── Dockerfile.monitor     # Python 3.11 slim - health_monitor.py
├── bootstrap.sh           # VPS otomatik kurulum scripti (7 adımlı)
│
├── src/                   # FRONTEND (React 19 + TypeScript)
│   ├── App.tsx            # Ana terminal UI (8 sekme: Boot, Patron, Sinyaller, Ajanlar, Borsalar, Risk, Portföy, Admin)
│   ├── main.tsx           # React root mount
│   ├── components/
│   │   ├── AdminPanel.tsx     # 66KB - Admin yönetim paneli
│   │   └── AgentPanel.tsx     # Ajan listesi görünümü
│   ├── hooks/
│   │   └── useRealtimeSignals.ts  # Supabase Realtime sinyal akışı
│   ├── state/
│   │   └── persistentStore.ts     # Zustand + localStorage + Supabase sync
│   ├── services/
│   │   └── settingsSync.ts        # Bulut-aygıt arası ayar senkronizasyonu
│   └── lib/
│       └── supabaseClient.ts    # Supabase client + anon auth
│
├── dataclaw_core/         # PYTHON BACKEND (Otonom İşlem Motoru)
│   ├── main.py            # DataclawOS - Ana event loop
│   ├── agents/            # Swarm ajanları (AlphaHunter, RiskGuardian, ExecutionAgent, OnchainAgent, MetaGovernor)
│   ├── backend/           # RedisEventBus, VectorMemoryService
│   ├── core/              # ModelRouter, SafetySystem
│   ├── exchanges/         # SmartExchangeRouter (Binance, MEXC)
│   ├── memory/            # EpisodicMemory, VectorStore
│   ├── monitoring/        # health_monitor.py
│   ├── plugins/           # PluginRegistry + Freqtrade bridge
│   ├── providers/         # LLM provider abstraction
│   ├── state/             # Global state management
│   ├── super_core/        # Meta governance
│   └── tests/             # Unit tests
│
├── orchestrator/          # ORKESTRASYON KATMANI
│   ├── agent_registry.py  # Ajan kayıt sistemi (Pydantic)
│   ├── policy_guard.py    # %70 güven eşiği validasyonu
│   ├── plugin_manager.py  # API ajan ekleme
│   ├── repo_installer.py  # Git repo'dan plugin kurulumu
│   └── admin_patch.py     # FastAPI route'ları
│
├── patron/                # FRONTEND BİLEŞENLERİ
│   └── AddAgentWizard.jsx # Ajan ekleme sihirbazı
│
├── supabase/migrations/   # SQL ŞEMA DOSYALARI
│   ├── 20260426000000_dataclaw_init.sql      # Ana tablolar (agents, memory, trades, signals, audit)
│   ├── 20260426000001_dataclaw_tables2.sql    # Risk profilleri, portfolio, onchain signals
│   ├── 20260426000002_dataclaw_settings.sql   # Kullanıcı ayarları
│   └── 20260426000003_dataclaw_infra.sql      # Altyapı tabloları
│
├── systemd_services/      # LINUX SERVİSLERİ
│   ├── dataclaw.service   # Ana servis (docker-compose up)
│   ├── agentwatch.service # Health monitor servisi
│   └── failsafe.service   # Acil durum güvenlik modu
│
├── scripts/
│   └── trigger_safe_mode.sh  # SAFE MODE tetikleyici
│
├── infra/
│   └── docker-compose.patch.yml
│
├── install_freqtrade.sh   # Freqtrade entegrasyonu
├── install_models.sh      # Ollama model kurulumu
├── AGENTS.md              # Ajan mimari dokümantasyonu
├── DATACLAW_AUDIT.md      # Güvenlik audit raporu
├── MIGRATION_GUIDE.md     # Yeni hesaba taşıma rehberi
└── .env.example           # Çevre değişkenleri şablonu
```

---

## 3. TEKNOLOJİ YIGINI (Tech Stack)

### Frontend:
| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| React | 19.0.0 | UI framework |
| TypeScript | 5.8.2 | Tip güvenliği |
| Vite | 6.2.0 | Build tool & dev server |
| Tailwind CSS | 4.1.14 | Styling |
| Express | 4.21.2 | SSR & API server |
| Zustand | 5.0.12 | State management |
| Supabase JS | 2.104.1 | Realtime DB & Auth |
| Google GenAI | 1.29.0 | Gemini API |
| React Markdown | 10.1.0 | Mesaj render |
| Motion | 12.23.24 | Animasyonlar |
| Lucide React | 0.546.0 | İkonlar |

### Backend:
| Teknoloji | Amaç |
|-----------|------|
| Python 3.11 | Otonom motor |
| FastAPI | Python API (orchestrator) |
| Uvicorn | ASGI server |
| Ollama | Local LLM inference |
| ChromaDB | Vector memory store |
| Redis | Event bus & pub/sub |
| CCXT | Borsa API entegrasyonu |
| LangChain | LLM chain yönetimi |
| Pydantic | Veri validasyonu |
| Supabase (Postgres) | Ana veritabanı |
| pgvector | Vektör aramaları |

---

## 4. ÇEKİRDEK AJANLAR (Core Agents)

| Ajan | Rol | Model | Confidence | Yetenekler |
|------|-----|-------|------------|------------|
| **OpenClaw** | Executor / Yönlendirici | claude-haiku | %70+ | Görev dağıtımı, orkestrasyon |
| **Mirofish** | Sinyal Üretici | claude-sonnet | %70+ | Teknik analiz, freqtrade korelasyonu |
| **Betafish** | Arbitraj Avcısı | claude-sonnet | %70+ | Cross-exchange spread tarama |
| **Onyx** | Araştırmacı | claude-opus | %70+ | Derin piyasa araştırması, risk analizi |

### Güvenlik Protokolü (PolicyGuard):
- **Minimum Confidence**: %70 (altındaki ajanlar reddedilir)
- **Auto-Band**: %85 (yüksek riskli işlemler için ek onay)
- **Kill Switch**: Anlık tüm işlemleri durdurma

---

## 5. SUPABASE VERİTABANI ŞEMASI

### Ana Tablolar:
1. **agent_configs** - Ajan yapılandırmaları
2. **agent_memory** - pgvector ile vektör bellek (1536 boyut)
3. **trade_history** - İşlem geçmişi
4. **exchange_connections** - API key şifreli saklama
5. **plugin_registry** - Plugin kayıtları
6. **signal_logs** - Sinyal logları
7. **audit_logs** - Denetim kayıtları
8. **model_performance** - LLM performans metrikleri
9. **strategy_mutations** - Strateji evrim kaydı
10. **black_swan_events** - Kara kuğu olayları
11. **exchange_failures** - Borsa hata kayıtları
12. **risk_profiles** - Risk profilleri (max drawdown, position size, leverage)
13. **portfolio_state** - Portföy durumu
14. **system_events** - Sistem olayları
15. **model_routing** - Model yönlendirme kararları
16. **onchain_signals** - Zincir üstü sinyaller
17. **strategy_versions** - Strateji versiyon kontrolü

### Güvenlik:
- **RLS (Row Level Security)** aktif tüm tablolarda
- **Anon Auth** desteği (opsiyonel giriş)
- **Service Role Key** admin işlemleri için

---

## 6. VPS KURULUM ADIMLARI

### Ön Gereksinimler:
- **OS**: Ubuntu 22.04/24.04 LTS
- **RAM**: Minimum 8GB (lite mod: 4GB)
- **CPU**: 2+ çekirdek
- **Disk**: 50GB+ SSD
- **Docker & Docker Compose** kurulu olmalı

### Adım 1: Sistem Hazırlığı
```bash
# Root olarak veya sudo ile
apt update && apt upgrade -y
apt install -y git curl wget ufw fail2ban

# Docker kurulumu (eğer yoksa)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Adım 2: Repo Klonlama
```bash
cd /opt
git clone https://github.com/Bulduk/Dataclaw-v1.git dataclaw
cd dataclaw
```

### Adım 3: Çevre Değişkenleri
```bash
cp .env.example .env
nano .env
```

**Doldurulması gerekenler:**
```
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
REDIS_URL=redis://localhost:6379
```

### Adım 4: Supabase Migration
```bash
# Supabase CLI kurulumu (eğer yoksa)
npm install -g supabase

# Projeye bağlanma
supabase link --project-ref your_project_ref

# Migration'ları uygulama
supabase db push

# VEYA manuel olarak SQL Editor'dan:
# supabase/migrations/20260426000000_dataclaw_init.sql
# supabase/migrations/20260426000001_dataclaw_tables2.sql
# supabase/migrations/20260426000002_dataclaw_settings.sql
# supabase/migrations/20260426000003_dataclaw_infra.sql
```

### Adım 5: Docker Compose Başlatma
```bash
# Tüm servisleri başlatma
docker-compose up -d

# Servisleri kontrol etme
docker-compose ps
docker-compose logs -f agent_core
```

**Servisler:**
- `agent_core`: Python otonom motor (port 3000)
- `model_router`: Ollama LLM inference (port 11434)
- `vector_db`: ChromaDB vektör veritabanı (port 8000)
- `monitoring`: Sağlık izleme servisi

### Adım 6: Model Kurulumu
```bash
# Otomatik model kurulumu
chmod +x install_models.sh
MODEL_TIER=full ./install_models.sh

# VEYA manuel olarak:
docker exec -it dataclaw_model_router_1 ollama pull mistral:7b-instruct
docker exec -it dataclaw_model_router_1 ollama pull deepseek-r1:latest
docker exec -it dataclaw_model_router_1 ollama pull codellama:7b
docker exec -it dataclaw_model_router_1 ollama pull llama3:8b
```

### Adım 7: Node.js Frontend Build
```bash
# Node.js 20+ kurulu olmalı
npm install
npm run build

# Production modda çalıştırma
npm run preview
# VEYA
docker-compose up -d agent_core
```

### Adım 8: Systemd Servisleri (Opsiyonel ama Önerilir)
```bash
# Servis dosyalarını kopyalama
cp systemd_services/*.service /etc/systemd/system/

# Servisleri etkinleştirme
systemctl daemon-reload
systemctl enable dataclaw.service
systemctl enable agentwatch.service
systemctl enable failsafe.service

# Başlatma
systemctl start dataclaw.service
systemctl start agentwatch.service

# Log kontrolü
journalctl -fu dataclaw
journalctl -fu agentwatch
```

### Adım 9: Güvenlik Duvarı
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp   # Dataclaw UI
ufw allow 11434/tcp  # Ollama API (sadece localhost'a kısıtlanmalı)
ufw allow 8000/tcp   # ChromaDB (sadece localhost'a kısıtlanmalı)
ufw --force enable
```

### Adım 10: Nginx Reverse Proxy (Önerilir)
```bash
apt install -y nginx

# /etc/nginx/sites-available/dataclaw
cat > /etc/nginx/sites-available/dataclaw << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
    }
}
EOF

ln -s /etc/nginx/sites-available/dataclaw /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 7. GÜVENLİK ANALİZİ & RİSKLER

### ✅ Güçlü Yönler:
1. **RLS aktif** - Her kullanıcı sadece kendi verisini görür
2. **PolicyGuard** - %70 confidence threshold zorunlu
3. **Kill Switch** - Anlık durdurma mekanizması
4. **Failsafe Service** - Acil durum scripti
5. **Local LLM Fallback** - Ollama ile API bağımsızlığı
6. **API Key Şifreleme** - Exchange bağlantıları şifreli saklanır

### ⚠️ Zayıf Yönler & Riskler:
1. **Hardcoded API Dependencies** - Gemini API'sine bağımlılık (audit raporunda belirtilmiş)
2. **Simülasyon Kodu** - `server.ts` içinde Gemini API çağrıları kaldırılmış, simülasyon modunda
3. **Plugin Güvenliği** - `/opt/pouls/plugins` dizinine git clone yapılıyor, sandbox eksik
4. **Redis Şifresiz** - `REDIS_URL` yapılandırmasında auth yok
5. **Ollama Açık Port** - 11434 portu dışarıya açık, sadece localhost'a kısıtlanmalı
6. **Service Role Key Exposure** - `.env` dosyasında admin key saklanıyor
7. **CCXT Riski** - Borsa API'leri için CCXT kullanılıyor, rate limit kontrolü yetersiz olabilir

### 🔒 Hardening Önerileri:
```bash
# 1. Ollama sadece localhost
docker run -d --name ollama -p 127.0.0.1:11434:11434 ollama/ollama

# 2. Redis şifreli
docker run -d --name redis -e REDIS_PASSWORD=your_secure_password redis:alpine

# 3. .env dosya izinleri
chmod 600 .env
chown root:root .env

# 4. Fail2ban yapılandırması
cat > /etc/fail2ban/jail.local << 'EOF'
[dataclaw]
enabled = true
port = http,https
filter = dataclaw
logpath = /var/log/dataclaw.log
maxretry = 5
bantime = 3600
EOF

# 5. SSL/TLS (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## 8. FREKANS SORULAR & SORUN GİDERME

### S: "npm install" hatası alıyorum?
**C:** Node.js 20+ gerekiyor. Kontrol et: `node -v`. Eğer 18 ve altıysa:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
```

### S: Supabase bağlantı hatası?
**C:** 
1. `.env` dosyasında `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` doğru mu?
2. Supabase projesinde "Authentication > Settings > Anonymous Sign-ins" açık mı?
3. RLS politikaları aktif mi? (Migration'ları çalıştırın)

### S: Ollama model yanıt vermiyor?
**C:**
```bash
# Container içinde kontrol
docker exec -it dataclaw_model_router_1 ollama list
# Model çekiliyor mu?
docker exec -it dataclaw_model_router_1 ollama pull mistral:7b-instruct
```

### S: "PolicyGuard: Confidence threshold below 70%" hatası?
**C:** Yeni ajan eklerken `confidence_threshold` değeri 70 ve üzeri olmalı. `server.ts` veya `orchestrator/policy_guard.py` dosyalarında kontrol ediliyor.

### S: Kill Switch nasıl çalıştırılır?
**C:**
```bash
# Manuel tetikleme
systemctl start failsafe.service
# VEYA
docker-compose pause agent_core
# VEYA UI'dan "PANIC" butonu
```

### S: Freqtrade entegrasyonu?
**C:**
```bash
chmod +x install_freqtrade.sh
./install_freqtrade.sh
# Ardından: freqtrade trade --config user_data/config.json
```

---

## 9. PERFORMANS OPTİMİZASYONU

### Düşük Kaynaklı VPS (4GB RAM):
```bash
# Lite mod model kurulumu
MODEL_TIER=lite ./install_models.sh

# Sadece tinydolphin ve mistral:7b
# Swap oluşturma
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Yüksek Performanslı VPS (16GB+ RAM):
```bash
# Tüm modelleri kur
MODEL_TIER=full ./install_models.sh

# Redis persistence aç
docker run -d --name redis -v redis_data:/data redis:alpine redis-server --appendonly yes

# ChromaDB persistent volume
docker volume create chroma_data
```

---

## 10. YEDEKLEME & KURTARMA

### Otomatik Yedekleme Scripti:
```bash
cat > /opt/dataclaw/scripts/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/dataclaw/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# 1. Supabase yedekleme (pg_dump)
pg_dump $DATABASE_URL > $BACKUP_DIR/supabase.sql

# 2. Redis verisi
docker exec redis redis-cli BGSAVE
cp /var/lib/redis/dump.rdb $BACKUP_DIR/

# 3. .env ve config
cp /opt/dataclaw/.env $BACKUP_DIR/
cp -r /opt/dataclaw/dataclaw_core/config $BACKUP_DIR/

# 4. Loglar
tar czf $BACKUP_DIR/logs.tar.gz /opt/dataclaw/logs/

echo "Backup completed: $BACKUP_DIR"
EOF
chmod +x /opt/dataclaw/scripts/backup.sh

# Cron job (her gün 02:00)
0 2 * * * /opt/dataclaw/scripts/backup.sh
```

---

## 11. GELİŞTİRME & KATKI

### Yeni Ajan Ekleme:
1. `orchestrator/agent_registry.py` - Yeni ajan tanımı
2. `src/state/persistentStore.ts` - Frontend state'e ekleme
3. `supabase/migrations/` - Yeni tablo (gerekirse)
4. `AGENTS.md` - Dokümantasyon güncelleme

### Yeni Plugin Geliştirme:
1. `dataclaw_core/plugins/` altında yeni klasör
2. `plugin.yaml` manifest dosyası
3. `orchestrator/plugin_manager.py` kayıt

### Test:
```bash
# Python unit testler
cd dataclaw_core
python -m pytest tests/

# Frontend test
npm run lint
npm run build
```

---

## 12. LİSANS & YASAL UYARI

**⚠️ Önemli:** Bu proje bir **prototip/POC (Proof of Concept)**'tir. Canlı trading yapmadan önce:
- Tüm kodu denetleyin
- Paper trading modunda uzun süre test edin
- Finansal riskleri değerlendirin
- Yerel yasal düzenlemelere uygunluğu kontrol edin

**Yapımcı:** Bulduk (GitHub)
**Proje:** Dataclaw v1 - AI CODE CREATION
**AI Studio:** https://ai.studio/apps/139f8fa8-253f-433e-a3bb-ef9950172764

---

## SONUÇ

Dataclaw v1, **kripto trading için otonom çok-ajanlı bir AI platformu** prototipidir. VPS üzerinde çalışmaya hazır, ancak:

1. **Supabase** hesabı ve API key'leri gerekiyor
2. **Docker** altyapısı kurulu olmalı
3. **Ollama** local LLM için yeterli RAM gerekiyor (min 8GB)
4. **Güvenlik hardening** şart (firewall, SSL, .env koruması)
5. **Paper modda** başlayıp, stabilite testi yapmalısınız

Proje yapısal olarak sağlam bir temele sahip: modüler mimari, plugin sistemi, vektör bellek, RLS güvenliği ve acil durum protokolleri mevcut. Ancak üretim ortamına geçmeden önce kodun tamamını denetlemeniz ve eksik modülleri (özellikle `dataclaw_core` altındaki Python dosyaları) tamamlamanız önerilir.

**Başarılar!**
