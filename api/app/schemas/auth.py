from pydantic import BaseModel, EmailStr
from typing import Optional

# ======================
# USER SCHEMAS
# ======================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str = "user"
    client_id: int


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenUser(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: str


class TokenClient(BaseModel):
    id: Optional[int] = None
    name: str = ""


class Token(BaseModel):
    access_token: str
    token_type: str
    user: TokenUser
    client: TokenClient
