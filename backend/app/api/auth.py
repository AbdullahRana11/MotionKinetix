from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.crud.user import get_user_by_email, create_user
from app.schemas.user import UserCreate, UserResponse, Token


router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    """
    user = get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # create_user hashes the password automatically
    new_user = create_user(db, user=user_in)
    return new_user


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, getting an access token for future requests.
    Using username and password from form data. We map username to email.
    """
    # Look up the user by email (OAuth2 specification passes this in the 'username' field)
    user = get_user_by_email(db, email=form_data.username)
    
    # Generic failure to avoid user enumeration attacks
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Generate the JWT using the unique user ID as the subject ('sub' claim)
    access_token = create_access_token(data={"sub": user.id})
    
    return {"access_token": access_token, "token_type": "bearer"}
