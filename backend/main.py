from typing import Annotated
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from generated.prisma import Prisma
from prisma.errors import PrismaError
from pydantic import BaseModel
import uuid, random, bcrypt, jwt, os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv


db = Prisma()

#State to turn connector on or off
connector = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield 
    await db.disconnect()


app = FastAPI(lifespan=lifespan)


class EventCreate(BaseModel):
    creatorId: str
    title: str
    description: str
    date: datetime
    location: str 

class EventUpdate(BaseModel):
    title: str 
    description: str 
    date: datetime 
    location: str 

class ProfileUpdate(BaseModel):
    fullName: str
    bio: str
    avatar: str
    location: str


class GenerateInvite(BaseModel):
    createdById: str

class UserRegistration(BaseModel):
    email: str
    phoneNumber: str

class OTPVerify(BaseModel):
    phoneNumber: str
    otp: str

class Token(BaseModel):
    access_token: str
    token_type: str

password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

otp_secret_key = os.getenv("OTP_SECRET_KEY")
otp_algorithm = os.getenv("ALGORITHM")
access_token = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")


def hash_code(password: str):
        password_bytes = password.encode('utf-8')

        salt = bcrypt.gensalt()

        hashed_password = bcrypt.hashpw(password_bytes, salt)
        return hashed_password.decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy() #making copy of the incoming directory so you can safetly modify it
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=2)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, f"SECRET KEY: {otp_secret_key}", f"OTP CODE: {otp_algorithm}")
    return encoded_jwt




@app.get("/users") 
async def get_users():
    return await db.user.find_many()
 
 #Helps me get individuals users
 #pulling user info for login
 #profile features to create events, send invites, and track used invites.

@app.get("/users/{id}")
async def get_user(id: str):
    try:
        return await db.user.find_unique_or_raise(
            where = {"id": id},
            include= {
                "invitesSent": True,
                "invitesUsed": True,
                "eventsCreated": True,
                "attendees": True
                }
        )
    except PrismaError as e:
        if e.code == "P2025":
            raise HTTPException(status_code=404, detail="User Not Found")
        raise HTTPException(status_code=400, detail=f"Database Error {e.code}")



#Create Profile after user sign in
@app.post("/users")
async def create_user(user: UserRegistration):
    try:

        existing_user = await db.user.find_unique(where={"phoneNumber": user.phoneNumber})
        if existing_user:
            raise HTTPException(status_code=409, detail="User already exists")

        username = f"user_{uuid.uuid4().hex[:8]}"
        otpHash = ''.join(str(random.randint(0,9)) for _ in range(6))
    
        new_user = await db.user.create(
            data={
                "username": username,
                "phoneNumber": user.phoneNumber,
                "email": user.email,
                "otp": hash_code(otpHash),
                "profile": {
                    "create": {
                        "fullName": "",
                        "bio" : "",
                        "avatarUrl": "",
                        "location": ""
                    }
                }
            },
            include={"profile": True}
        )

        return {
            "message": "User created succesfully.",
            "userId" : new_user.id,
            "temporaryPassword": otpHash
        }

    except PrismaError as e:
        if e.code == "P2002":
            raise HTTPException(status_code=409, detail="Profile Already Exists")
        raise HTTPException(status_code=500, detail=f"Database Error, {e.code}")
    
    except PrismaError:
        raise HTTPException(status_code=500, detail="Unable to create profile after sign-in")

#verifying otp
@app.post("/verify-otp")
async def verify_user(otp_request: OTPVerify):
        
        user = await db.user.find_unique(where={"phoneNumber": otp_request.phoneNumber})
        if not user: 
            raise HTTPException(status_code=404, detail="User not found")
        #verify's otp
        if not bcrypt.checkpw( otp_request.otp.encode("utf-8"), user.otp.encode("utf-8")):
            raise HTTPException(status_code= 401, detail="Invalid OTP")
        token = create_access_token({"token": user.id})
        return {"access token": token}

#Getting Attendee by userId and eventId
#Find exactly one record in the Attendee table where both the userId and eventId match this pair.
@app.get("/attendee/{userId}/{eventId}")
async def get_attendee(userId: str, eventId: str ):
    try:
        return await db.attendee.find_unique_or_raise(
            where = { "userId_eventId": {"userId": userId, "eventId": eventId}},
            include = {
                "event": True,
                "user": True
            }
        )
    except PrismaError as e:
        if e.code == "P2025":
            raise HTTPException(status_code=404, detail=f"{userId} is not associated with {eventId}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")

#Deleting Attendee from event
@app.delete("/attendee/{userId}/{eventId}")
async def delete_Attendee(userId: str, eventId: str ):
    try:
        return await db.attendee.delete(
            where = { 
                "userId_eventId": {"userId": userId, "eventId": eventId}
                },
            include = {
                "user": True
            }
        )
    except PrismaError as e:
        if e.code == "P2025": # Record not found
            raise HTTPException(status_code=404, detail="Attendee can't be removed") 
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")

#Inserts a new record into Attendee table linking that user to that event.
@app.post("/attendee/{userId}/{eventId}")
async def event_Attendee(userId: str, eventId: str):
    try:
        return await db.attendee.create(
            data = {"userId": userId, "eventId": eventId}, 
        )
    except PrismaError as e:
        if e.code == "P2002": # Record not found
            raise HTTPException(status_code=409, detail="An attendee with this unique field already exists") 
        if e.code == "P2003": # Record not found
            raise HTTPException(status_code=404, detail="Creator Doesn't Exist") 
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")
    
#Retrieve an event and it's information
@app.get("/event/{id}")
async def get_events(id: str):
    try:
        return await db.event.find_unique_or_raise(
            where={"id": id},
            include={
                "creator": True,      
                "attendees": True     
            }     
        )
    except PrismaError as e:
        if e.code == "P2025":
            raise HTTPException(status_code=404, detail="Event not found")
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")
    
@app.delete("/event/{id}")
async def delete_events(id: str):
    try: 
        return await db.event.delete(
            where={"id": id},
            include={
                "creator": True,
                "attendees": True
            }
        )
    except PrismaError as e:
        if e.code == "P2025": # Record not found
            raise HTTPException(status_code=404, detail="Event can't be Deleted!") 
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")
    
@app.post("/event/") 
async def create_event(event: EventCreate):
    try:
        return await db.event.create(
           
            data= {
                "creatorId" : event.creatorId,
                "title" : event.title,
                "description" : event.description,
                "date" : event.date,
                "location" : event.location
                }
        )
    except PrismaError as e:
        if e.code == "P2002":
            raise HTTPException(status_code=409, detail="An event with these fields already exists")
        if e.code == "P2003":
            raise HTTPException(status_code=400, detail="Invalid creatorId — user does not exist")
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")
    
@app.put("/event/{id}")
async def update_event(id: str, event: EventUpdate):
    try:
        return await db.event.update(
            where = {   
                "id": id
            },
            data= {
                "title": event.title,
                "description" : event.description,
                "date" : event.date,
                "location" : event.location
            }
        )
    except PrismaError as e:
        if e.code == "P2025":  # Record not found
            raise HTTPException(status_code=404, detail=f"Event {id} not found")
        if e.code == "P2002":  # Unique constraint violation
            raise HTTPException(status_code=409, detail="Event with these details already exists")
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")

#get user profile
@app.get("/profile/{userId}")
async def get_profile(userId: str):
    try: 
        return await db.profile.find_unique_or_raise(
            where={"userId" : userId},
            include= {
                "user": True
            }
        )
    except PrismaError as e:
        if e.code == "P2025":
            raise HTTPException(status_code=404, detail="Profile Not Found")
        raise HTTPException(status_code=400, detail=f"Database Error {e.code}")

#delete user profile
@app.delete("/profile/{userId}")
async def delete_profile(userId: str):
    try:
        #Deletes the profile first
        await db.profile.delete( where = {"userId": userId})

        #Deletes user
        await db.user.delete(where= {"id": userId})

    except PrismaError as e:
        if e.code == "P2025": # Record not found
            raise HTTPException(status_code=404, detail="Profile can't be deleted!") 
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")

#Updating User Profile 
@app.put("/profile/{userId}")
async def update_profile(userId: str, profile: ProfileUpdate):
    try:
        return await db.profile.update(
            where = {"userId": userId},
            data= {
                "fullName" : profile.fullName,
                "bio" : profile.bio,
                "avatarUrl" : profile.avatar,
                "location" : profile .location
            }
        )
    except PrismaError as e:
        if e.code == "P2025":  # Record not found
            raise HTTPException(status_code=404, detail=f"Profile for user {userId} not found")
        if e.code == "P2002":  # Unique constraint violation
            raise HTTPException(status_code=409, detail="A profile with these details already exists")
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")

# Fetches a single invite by its unique code.
# Includes details about who created the invite and  who used it.
# Raises 404 if the invite code does not exist.
@app.get("/invites/{code}")
async def get_invites(code: str):
    try: 
        return await db.invite.find_unique_or_raise(
            where={
                "code" : code
            },
            include={
                "createdBy": True,
                "usedBy": True
            }
        )
    except PrismaError as e:
        if e.code == "P2025":
            raise HTTPException(status_code=404, detail=f"Invite code {code} not found")
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")


@app.post("/invites")
async def create_invite(invite: GenerateInvite):
    try:
        # You can auto-generate a code if not provided
        code = str(uuid.uuid4())[:8]

        new_invite = await db.invite.create(
            data={
                "code": code,
                "createdById": invite.createdById,
                "createdAt": datetime.utcnow(),  # optional, defaults to now() in Prisma
            },
            include={
                "createdBy": True,
                "usedBy": True
            }
        )

        return new_invite

    except PrismaError as e:
        if e.code == "P2002":  # unique constraint failed (duplicate code)
            raise HTTPException(status_code=400, detail=f"Invite code {code} already exists")
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")
    
@app.put("/invites/{code}/redeem")
async def update_invites( code: str, usedById: str):
    try:

        invite = await db.invite.find_unique_or_raise(where={"code": code})
        
        if invite.usedById is not None:
            raise HTTPException(status_code=400, detail="Invite code already used.")

        update_invite = await db.invite.update(
            where= {
                "code": code
            },
            data= {
                "usedById": usedById,
                "usedAt": datetime.utcnow()
            }, 
            include= {
                "createdBy": True,
                "usedBy": True
            }
        )

        return {
            "message": f"Invite {code} redeemed succesfully!",
            "invite": update_invite
        }

    except PrismaError as e:
        if e.code == "P2025":  # Record not found
            raise HTTPException(status_code=404, detail=f"Unabled to update for code {invite.code}")
        if e.code == "P2002":  # Unique constraint violation
            raise HTTPException(status_code=409, detail="A profile with these details already exists")
        raise HTTPException(status_code=400, detail=f"Database error: {e.code}")