-- Extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabel whitelist_urls
CREATE TABLE whitelist_urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) UNIQUE NOT NULL,
    label VARCHAR(100),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_whitelist_urls_domain_active ON whitelist_urls(domain, is_active);
COMMENT ON TABLE whitelist_urls IS 'Daftar domain resmi CIMB Niaga';

-- Tabel whitelist_phones
CREATE TABLE whitelist_phones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100),
    phone_type VARCHAR(50),
    institution VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_whitelist_phones_number ON whitelist_phones(phone_number);
COMMENT ON TABLE whitelist_phones IS 'Daftar nomor telepon resmi CIMB Niaga';

-- Tabel risk_keywords
CREATE TABLE risk_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword VARCHAR(200) UNIQUE NOT NULL,
    category VARCHAR(50),
    risk_weight INTEGER DEFAULT 3,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_risk_keywords_category ON risk_keywords(category);
COMMENT ON TABLE risk_keywords IS 'Kata kunci yang mengindikasikan risiko penipuan/phishing';

-- Tabel admin_users
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE admin_users IS 'Pengguna admin untuk dashboard';

-- Tabel reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id VARCHAR(20) UNIQUE NOT NULL,
    message_text TEXT NOT NULL,
    message_type VARCHAR(20),
    extracted_urls TEXT[] DEFAULT '{}',
    extracted_phones TEXT[] DEFAULT '{}',
    extracted_emails TEXT[] DEFAULT '{}',
    risk_score INTEGER DEFAULT 0,
    risk_level VARCHAR(20),
    explanation_text TEXT,
    breakdown JSONB DEFAULT '[]',
    typosquatting_alerts JSONB DEFAULT '[]',
    status VARCHAR(30) DEFAULT 'submitted',
    reporter_name VARCHAR(100),
    reporter_email VARCHAR(200),
    evidence_url TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_risk_level ON reports(risk_level);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_reports_ticket_id ON reports(ticket_id);
COMMENT ON TABLE reports IS 'Laporan pengecekan pesan atau aduan pengguna';

-- Trigger auto-update updated_at pada tabel reports
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reports_modtime
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Tabel report_actions
CREATE TABLE report_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES admin_users(id),
    action_type VARCHAR(50),
    notes TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_report_actions_report_id ON report_actions(report_id);
CREATE INDEX idx_report_actions_admin_id ON report_actions(admin_id);
COMMENT ON TABLE report_actions IS 'Log aksi admin terhadap laporan (audit trail)';

-- Tabel education_content
CREATE TABLE education_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content_type VARCHAR(20),
    content_body JSONB NOT NULL,
    difficulty VARCHAR(20),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE education_content IS 'Materi edukasi dan microlearning';

-- Tabel quiz_results
CREATE TABLE quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_session VARCHAR(100),
    content_id UUID REFERENCES education_content(id),
    score INTEGER,
    answers JSONB,
    completed_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE quiz_results IS 'Hasil kuis pengguna berdasarkan sesi';

-- Tabel user_badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_session VARCHAR(100),
    badge_type VARCHAR(50),
    earned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_session, badge_type)
);
COMMENT ON TABLE user_badges IS 'Badge gamifikasi untuk pengguna';

-- Tabel threat_analytics
CREATE TABLE threat_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id),
    modus_type VARCHAR(50),
    channel VARCHAR(20),
    week_number INTEGER,
    year INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_threat_analytics_multi ON threat_analytics(modus_type, channel, week_number, year);
COMMENT ON TABLE threat_analytics IS 'Data analitik untuk Peta Ancaman (Threat Map)';
