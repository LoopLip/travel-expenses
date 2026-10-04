from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/advances", tags=["advances"])
DB = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[schemas.AdvanceOut])
def list_advances(
    db: DB, trip_id: int | None = None, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)
):
    return crud.list_advances(db, skip, limit, trip_id)


@router.post("", response_model=schemas.AdvanceOut, status_code=status.HTTP_201_CREATED)
def create_advance(data: schemas.AdvanceCreate, db: DB):
    return crud.create_advance(db, data)


@router.get("/{advance_id}", response_model=schemas.AdvanceOut)
def get_advance(advance_id: int, db: DB):
    return crud.get_advance(db, advance_id)


@router.patch("/{advance_id}", response_model=schemas.AdvanceOut)
def update_advance(advance_id: int, data: schemas.AdvanceUpdate, db: DB):
    return crud.update_advance(db, advance_id, data)


@router.delete("/{advance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_advance(advance_id: int, db: DB):
    crud.delete_advance(db, advance_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
