from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/users", tags=["users"])
DB = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[schemas.UserOut])
def list_users(db: DB, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)):
    return crud.list_users(db, skip, limit)


@router.post("", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(data: schemas.UserCreate, db: DB):
    return crud.create_user(db, data)


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: DB):
    return crud.get_user(db, user_id)


@router.patch("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, data: schemas.UserUpdate, db: DB):
    return crud.update_user(db, user_id, data)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: DB):
    crud.delete_user(db, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
