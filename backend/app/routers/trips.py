from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.db import get_db

router = APIRouter(prefix="/trips", tags=["trips"])
DB = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[schemas.TripOut])
def list_trips(
    db: DB,
    status: models.TripStatus | None = None,
    user_id: int | None = None,
    budget_id: int | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    return crud.list_trips(db, skip, limit, status, user_id, budget_id)


@router.post("", response_model=schemas.TripOut, status_code=status.HTTP_201_CREATED)
def create_trip(data: schemas.TripCreate, db: DB):
    return crud.create_trip(db, data)


@router.get("/{trip_id}", response_model=schemas.TripDetail)
def get_trip(trip_id: int, db: DB):
    return crud.get_trip(db, trip_id)


@router.patch("/{trip_id}", response_model=schemas.TripOut)
def update_trip(trip_id: int, data: schemas.TripUpdate, db: DB):
    return crud.update_trip(db, trip_id, data)


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: int, db: DB):
    crud.delete_trip(db, trip_id)
    return Response(status_code=204)
