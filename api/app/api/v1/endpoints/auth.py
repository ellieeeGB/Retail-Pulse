from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.auth import UserCreate, UserLogin, Token
from app.models.domain import User, Client
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.dependencies import get_db

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    client = db.query(Client).filter(Client.client_id == user.client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )

    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        full_name=user.full_name,
        role=user.role,
        client_id=user.client_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generar token
    access_token = create_access_token(data={"sub": user.email, "client_id": new_user.client_id, "role": new_user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role,
        },
        "client": {
            "id": client.client_id,
            "name": client.name,
        },
    }

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    client = db.query(Client).filter(Client.client_id == db_user.client_id).first()

    access_token = create_access_token(data={
        "sub": db_user.email,
        "client_id": db_user.client_id,
        "role": db_user.role,
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": db_user.email,
            "full_name": db_user.full_name,
            "role": db_user.role,
        },
        "client": {
            "id": client.client_id if client else None,
            "name": client.name if client else "",
        },
    }
