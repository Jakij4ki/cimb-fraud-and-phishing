import os
import asyncio
import logging
import uuid
from datetime import datetime
import pandas as pd
import asyncpg
import bcrypt

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/cimb_phishing_db")
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")
ADMIN_DEFAULT_PASSWORD = os.environ.get("ADMIN_DEFAULT_PASSWORD", "changeme123")
XLSX_PATH = os.path.join(os.path.dirname(__file__), "..", "backend", "data", "Dataset_AntiPhishing_CIMB_Capstone.xlsx")

async def seed_whitelist_urls(conn):
    try:
        df = pd.read_excel(XLSX_PATH, sheet_name="Whitelist_CIMB")
        inserted = 0
        for _, row in df.iterrows():
            domain = str(row.get("Nilai (Domain / Email Domain)", "")).strip()
            if not domain or domain == "nan":
                continue
            label = str(row.get("Label Resmi", ""))
            category = str(row.get("Tipe", ""))
            status = str(row.get("Status", "AKTIF")).upper()
            is_active = (status == "AKTIF")
            
            res = await conn.execute(
                """
                INSERT INTO whitelist_urls (id, domain, label, category, is_active, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (domain) DO NOTHING
                """,
                uuid.uuid4(), domain, label, category, is_active, datetime.utcnow()
            )
            if res == "INSERT 0 1":
                inserted += 1
        return inserted
    except Exception as e:
        logger.error(f"Error seeding whitelist_urls: {str(e)}")
        return 0

async def seed_whitelist_phones(conn):
    try:
        df = pd.read_excel(XLSX_PATH, sheet_name="Whitelist_Phones")
        inserted = 0
        for _, row in df.iterrows():
            phone = str(row.get("Nomor Telepon", "")).strip()
            if not phone or phone == "nan":
                continue
            label = str(row.get("Label", ""))
            phone_type = str(row.get("Tipe", ""))
            institution = str(row.get("Bank/Institusi", ""))
            status = str(row.get("Status", "AKTIF")).upper()
            is_active = (status == "AKTIF")
            
            res = await conn.execute(
                """
                INSERT INTO whitelist_phones (id, phone_number, label, phone_type, institution, is_active, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (phone_number) DO NOTHING
                """,
                uuid.uuid4(), phone, label, phone_type, institution, is_active, datetime.utcnow()
            )
            if res == "INSERT 0 1":
                inserted += 1
        return inserted
    except Exception as e:
        logger.error(f"Error seeding whitelist_phones: {str(e)}")
        return 0

async def seed_risk_keywords(conn):
    try:
        df = pd.read_excel(XLSX_PATH, sheet_name="Kata_Kunci_Risiko")
        inserted = 0
        for _, row in df.iterrows():
            keyword = str(row.get("Kata / Frasa", "")).strip().lower()
            if not keyword or keyword == "nan":
                continue
            category = str(row.get("Kategori", ""))
            try:
                risk_weight = int(row.get("Bobot Risiko (1-5)", 3))
            except:
                risk_weight = 3
            description = str(row.get("Deskripsi Bahaya", ""))
            
            res = await conn.execute(
                """
                INSERT INTO risk_keywords (id, keyword, category, risk_weight, description, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (keyword) DO NOTHING
                """,
                uuid.uuid4(), keyword, category, risk_weight, description, datetime.utcnow()
            )
            if res == "INSERT 0 1":
                inserted += 1
        return inserted
    except Exception as e:
        logger.error(f"Error seeding risk_keywords: {str(e)}")
        return 0

async def seed_admin(conn):
    try:
        val = await conn.fetchval("SELECT id FROM admin_users WHERE username = $1", "admin")
        if val:
            logger.info("Admin user already exists. Skipped.")
            return "skipped"
            
        salt = bcrypt.gensalt(rounds=12)
        hashed_password = bcrypt.hashpw(ADMIN_DEFAULT_PASSWORD.encode("utf-8"), salt).decode("utf-8")
        
        await conn.execute(
            """
            INSERT INTO admin_users (id, username, email, hashed_password, role, is_active, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            """,
            uuid.uuid4(), "admin", "admin@phishingguard.internal", hashed_password, "super_admin", True, datetime.utcnow()
        )
        
        if ADMIN_DEFAULT_PASSWORD == "changeme123":
            logger.warning("Default admin password is 'changeme123'. Please change it immediately.")
            
        return "created"
    except Exception as e:
        logger.error(f"Error seeding admin user: {str(e)}")
        return "error"

async def seed_reports_dummy(conn):
    try:
        if ENVIRONMENT != "development":
            logger.info("ENVIRONMENT is not development. Skipping dummy reports.")
            return 0
            
        df = pd.read_excel(XLSX_PATH, sheet_name="Report_Dummy")
        inserted = 0
        for _, row in df.iterrows():
            ticket_id = str(row.get("ticket_id", "")).strip()
            if not ticket_id or ticket_id == "nan":
                continue
                
            msg_text = str(row.get("message_text", ""))
            msg_type = str(row.get("message_type", ""))
            try:
                risk_score = int(row.get("risk_score", 0))
            except:
                risk_score = 0
            risk_level = str(row.get("risk_level", ""))
            explanation = str(row.get("explanation_text", ""))
            status = str(row.get("status", "submitted"))
            
            res = await conn.execute(
                """
                INSERT INTO reports (id, ticket_id, message_text, message_type, risk_score, risk_level, explanation_text, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (ticket_id) DO NOTHING
                """,
                uuid.uuid4(), ticket_id, msg_text, msg_type, risk_score, risk_level, explanation, status, datetime.utcnow(), datetime.utcnow()
            )
            if res == "INSERT 0 1":
                inserted += 1
        return inserted
    except Exception as e:
        logger.error(f"Error seeding dummy reports: {str(e)}")
        return 0

async def main():
    if not os.path.exists(XLSX_PATH):
        logger.error(f"Excel file not found at {XLSX_PATH}")
        return
        
    try:
        # asyncpg requires postgres:// scheme, replace +asyncpg if present
        conn_url = DATABASE_URL
        if conn_url.startswith("postgresql+asyncpg://"):
            conn_url = conn_url.replace("postgresql+asyncpg://", "postgresql://")
            
        conn = await asyncpg.connect(conn_url)
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        return

    logger.info("Starting database seed...")
    
    wl_urls = await seed_whitelist_urls(conn)
    wl_phones = await seed_whitelist_phones(conn)
    risk_kw = await seed_risk_keywords(conn)
    admin_stat = await seed_admin(conn)
    reports_dummy = await seed_reports_dummy(conn)
    
    await conn.close()
    
    logger.info("=== SEED SELESAI ===")
    logger.info(f"Whitelist URLs  : {wl_urls} records")
    logger.info(f"Whitelist Phones: {wl_phones} records")
    logger.info(f"Risk Keywords   : {risk_kw} records")
    logger.info(f"Admin user      : {admin_stat}")
    logger.info(f"Report dummy    : {reports_dummy} records")

if __name__ == "__main__":
    asyncio.run(main())
