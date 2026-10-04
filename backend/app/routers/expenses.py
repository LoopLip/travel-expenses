from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/expenses", tags=["expenses"])
DB = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[schemas.ExpenseOut])
def list_expenses(
    db: DB, trip_id: int | None = None, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)
):
    return crud.list_expenses(db, skip, limit, trip_id)


@router.post("", response_model=schemas.ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(data: schemas.ExpenseCreate, db: DB):
    return crud.create_expense(db, data)


@router.get("/{expense_id}", response_model=schemas.ExpenseOut)
def get_expense(expense_id: int, db: DB):
    return crud.get_expense(db, expense_id)


@router.patch("/{expense_id}", response_model=schemas.ExpenseOut)
def update_expense(expense_id: int, data: schemas.ExpenseUpdate, db: DB):
    return crud.update_expense(db, expense_id, data)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: DB):
    crud.delete_expense(db, expense_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
