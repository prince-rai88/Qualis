import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from backend.database import get_db
from backend.models import Investigation, AuditLog
from backend.schemas import InvestigationCreate, InvestigationUpdate, InvestigationOut

router = APIRouter(prefix="/investigations", tags=["Investigations"])

@router.get("", response_model=List[InvestigationOut])
def list_investigations(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Investigation)
    if status and status != "All":
        query = query.filter(Investigation.status == status)
    if severity and severity != "All":
        query = query.filter(Investigation.severity == severity)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Investigation.deviation_number.ilike(search_filter)) |
            (Investigation.title.ilike(search_filter)) |
            (Investigation.product_name.ilike(search_filter)) |
            (Investigation.batch_number.ilike(search_filter))
        )
    return query.order_by(Investigation.updated_at.desc()).all()


@router.post("", response_model=InvestigationOut)
def create_investigation(payload: InvestigationCreate, db: Session = Depends(get_db)):
    # Check duplicate deviation_number
    existing = db.query(Investigation).filter(Investigation.deviation_number == payload.deviation_number).first()
    if existing:
        # If exists, append timestamp or return existing
        payload.deviation_number = f"{payload.deviation_number}-{int(datetime.utcnow().timestamp()) % 1000}"

    inv = Investigation(**payload.model_dump())
    db.add(inv)
    db.commit()
    db.refresh(inv)

    # Log audit trail
    audit = AuditLog(
        investigation_id=inv.id,
        action="INVESTIGATION_CREATED",
        actor=inv.reported_by or "Quality Specialist",
        details={"deviation_number": inv.deviation_number, "severity": inv.severity}
    )
    db.add(audit)
    db.commit()

    return inv


@router.get("/{inv_id}", response_model=InvestigationOut)
def get_investigation(inv_id: int, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter(Investigation.id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return inv


@router.put("/{inv_id}", response_model=InvestigationOut)
def update_investigation(inv_id: int, payload: InvestigationUpdate, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter(Investigation.id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    update_data = payload.model_dump(exclude_unset=True)
    changed_keys = list(update_data.keys())

    for key, value in update_data.items():
        setattr(inv, key, value)

    # Audit log
    audit = AuditLog(
        investigation_id=inv.id,
        action="INVESTIGATION_UPDATED",
        actor="Investigator",
        details={"modified_fields": changed_keys}
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)
    return inv


@router.delete("/{inv_id}")
def delete_investigation(inv_id: int, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter(Investigation.id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    db.delete(inv)
    db.commit()
    return {"status": "success", "message": f"Investigation {inv_id} deleted"}


@router.post("/{inv_id}/qp-signoff", response_model=InvestigationOut)
def qp_signoff(inv_id: int, signoff_data: dict, db: Session = Depends(get_db)):
    """Formal Qualified Person (QP) Electronic Sign-Off under 21 CFR Part 11."""
    inv = db.query(Investigation).filter(Investigation.id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    signoff_record = {
        "signed": True,
        "signer_name": signoff_data.get("signer_name", "Dr. A. Vance, QP"),
        "signer_role": signoff_data.get("signer_role", "Qualified Person / Head of QA"),
        "signed_at": datetime.utcnow().isoformat() + "Z",
        "comments": signoff_data.get("comments", "RCA investigation reviewed, root cause verified, and CAPA approved for implementation.")
    }
    inv.qp_signoff = signoff_record
    inv.status = "CAPA Approved"

    audit = AuditLog(
        investigation_id=inv.id,
        action="QP_ELECTRONIC_SIGNATURE",
        actor=signoff_record["signer_name"],
        details=signoff_record
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)
    return inv


@router.get("/{inv_id}/audit-logs")
def get_audit_trail(inv_id: int, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).filter(AuditLog.investigation_id == inv_id).order_by(AuditLog.timestamp.desc()).all()
    return logs
