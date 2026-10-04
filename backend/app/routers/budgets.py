from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/budgets", tags=["budgets"])
DB = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[schemas.BudgetOut])
def list_budgets(db: DB, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)):
    return crud.list_budgets(db, skip, limit)


@router.post("", response_model=schemas.BudgetOut, status_code=status.HTTP_201_CREATED)
def create_budget(data: schemas.BudgetCreate, db: DB):
    return crud.create_budget(db, data)


@router.get("/{budget_id}", response_model=schemas.BudgetOut)
def get_budget(budget_id: int, db: DB):
    return crud.get_budget(db, budget_id)


@router.get("/{budget_id}/summary", response_model=schemas.BudgetSummary)
def get_budget_summary(budget_id: int, db: DB):
    return crud.budget_summary(db, budget_id)


@router.patch("/{budget_id}", response_model=schemas.BudgetOut)
def update_budget(budget_id: int, data: schemas.BudgetUpdate, db: DB):
    return crud.update_budget(db, budget_id, data)


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(budget_id: int, db: DB):
    crud.delete_budget(db, budget_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
