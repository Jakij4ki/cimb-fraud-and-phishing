import logging
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

async def log_action(
    db: AsyncSession,
    action_type: str,
    admin_id: UUID | None,
    report_id: UUID | None,
    notes: str,
    ip_address: str
) -> None:
    from app.models.report import ReportAction
    try:
        new_action = ReportAction(
            action_type=action_type,
            admin_id=admin_id,
            report_id=report_id,
            notes=notes,
            ip_address=ip_address
        )
        db.add(new_action)
        await db.commit()
    except Exception as e:
        logger.error(f"Failed to log action: {action_type}, admin_id: {admin_id}, error: {str(e)}")
        # We do not raise an exception to ensure it doesn't break the main execution flow
