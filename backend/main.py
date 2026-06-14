from fastapi import FastAPI, Request, Depends, Query, HTTPException

from sqlalchemy import DateTime
from datetime import datetime, timezone

from sqlalchemy.orm import joinedload, Session
from sqlalchemy import func
from database import engine, Base
from database import get_db, SessionLocal

from models import User, ChatMember, Chat , Message
from schemas import RegisterDTO, LoginDTO, CreateChatDTO, MessageDTO, UserDTO

# for jwt token 
from jose import jwt
from datetime import datetime, timedelta


from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

import bcrypt

# 1. Function to hash a password during registration
def hash_password(password: str) -> str:
    # Convert string to bytes
    password_bytes = password.encode('utf-8')
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    # Convert back to a string to store cleanly in your SQLite database
    return hashed.decode('utf-8')

# 2. Function to verify a password during login
def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


Base.metadata.create_all(bind=engine)



# jwt token

SECRET_KEY = "my_super_secret_key"
ALGORITHM = "HS256"


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=200
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    
    token = credentials.credentials

    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )
    
    return payload


app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",  # Your local Vite React app
    "http://localhost:5174",  # Your local Vite React app
    "http://127.0.0.1:5173",
    "https://chatwithchatx.vercel.app"
]

# 2. Add the CORS middleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,      
    allow_methods=["*"],         
    allow_headers=["*"],         
)



@app.get('/home')
def home():
    return "Welcome to home page"

@app.post('/register')
def register_user(user: RegisterDTO, db: Session = Depends(get_db)):
    
    hashed_password = hash_password(user.password)
    
    dbusers = db.query(User)\
        .filter(User.username == user.username)\
        .first()
    
    if dbusers:
        raise HTTPException(
            status_code = 409,
            detail = "Username already taken"
        )
        
    new_user = User(
        username = user.username,
        password = hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    raise HTTPException(
        status_code=200,
        detail = "User Registered" 
    )
    
@app.post('/login')
def login_user(user: LoginDTO, db: Session = Depends(get_db)):
    
    dbusers = db.query(User)\
        .filter(User.username == user.username)\
        .first()
    
    if not dbusers:
        raise HTTPException(
            status_code = 404,
            detail = "User not found"
        )
    
    if verify_password(user.password, dbusers.password):
        
        token = create_access_token({
            "user_id" : dbusers.id,
            "name" : dbusers.username,
            # "role" : dbuser.role
        })
        return {
            "token" : token,
            "type": "bearer",
            "msg" : "Logined Succesfully"
        }
        
    else:
        raise HTTPException(
            status_code = 401,
            detail = "Inavalid Password"
        )
        
@app.get('/user-data')
def me(chat_id: int, currentUser = Depends(get_current_user), db : Session = Depends(get_db)):
    
    user = db.query(User)\
        .filter(User.id == currentUser['user_id'])\
        .first()
        
    other_user = db.query(ChatMember)\
            .filter(ChatMember.chat_id == chat_id, ChatMember.user_id != user.id)\
            .first()
    
    other_user_id = other_user.user_id
    
    other_user_data = db.query(User)\
        .filter(User.id == other_user_id)\
        .first()
    
    user_data = {
        "username" : other_user_data.username,
        "id" : other_user_data.id,
        "last_seen" : other_user_data.last_seen
    }
    return {"status" : "You are welcome", "data" : user_data}



# @app.post('/chats')
# def chats(ids : CreateChatDTO, 
#           currentUser = Depends(get_current_user), 
#           db : Session = Depends(get_db)):
    
#     user = db.query(User)\
#         .filter(User.id == currentUser['user_id'])\
#         .first()
    
#     current_user = {
#         "username" : user.username,
#         "id" : user.id
#     }
    
#     target_user = (
#         db.query(User)
#         .filter(User.id.in_(ids.member_ids))
#         .all()
#     )
    
#     if len(target_user) != len(ids.member_ids):
#         raise HTTPException(
#             status_code=404,
#             detail="One or more users not found"
#         )
    
#     if current_user["id"] in ids.member_ids:
#         raise HTTPException(
#             status_code=400,
#             detail="Cannot create chat with yourself"
#         )
    
#     new_chat_room = Chat()
    
#     db.add(new_chat_room)
#     db.commit()
#     db.refresh(new_chat_room)
    
#     chat_id_list = set(ids.member_ids + [current_user['id']])
    
#     for i in chat_id_list:
#         new_members = ChatMember(
#             user_id = i,
#             chat_id = new_chat_room.id
#         )
    
#         db.add(new_members)

#     db.commit()
    
#     return {
#         "message": "Chat created",
#         "chat_id": new_chat_room.id
#     }

@app.get('/users')
def users(user: str = '', 
          currentUser = Depends(get_current_user),
          db : Session = Depends(get_db)):
    
    users = db.query(User)\
        .filter(User.username.contains(user))\
        .all()
    
    results = []
    
    for user in users:
        results.append({
            "username" : user.username,
            "id" : user.id
        })
    
    user = db.query(User)\
        .filter(User.id == currentUser['user_id'])\
        .first() 
      
    current_user = {
        "username" : user.username,
        "id" : user.id
    }
        
    if current_user in results:
        results.remove(current_user)
    
    return {"status" : results}

@app.post('/chats')
def chats(ids : CreateChatDTO, 
          currentUser = Depends(get_current_user), 
          db : Session = Depends(get_db)):
    
    print(ids)
    user = db.query(User)\
        .filter(User.id == currentUser['user_id'])\
        .first()
    
    current_user = {
        "username" : user.username,
        "id" : user.id
    }
    
    target_user = (
        db.query(User)
        .filter(User.id == ids.user_id)
        .first()
    )

    if not target_user:
        raise HTTPException(
            status_code = 404,
            detail = "User not found"
        )
    
    if current_user["id"] == ids.user_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot create chat with yourself"
        )
        
    #checking already having chat
    userChats = db.query(ChatMember)\
        .filter(ChatMember.user_id == user.id)\
        .all()
        
    opp_users_list = []
    
    for i in userChats:
        chat_id_list = db.query(ChatMember)\
            .filter(ChatMember.chat_id == i.chat_id, ChatMember.user_id != user.id)\
            .all()
        for j in chat_id_list:
            
            opp_users_list.append(j.user_id)
            
    if ids.user_id in opp_users_list:
        return {"error" : "Chat already Present"}
    
    print(opp_users_list)    
    
    new_chat_room = Chat()
    
    db.add(new_chat_room)
    db.commit()
    db.refresh(new_chat_room)
    
    member1 = ChatMember(
        user_id=current_user["id"],
        chat_id=new_chat_room.id
    )
    
    # already_have_chats = db.query(Chat)\
    #     .filter(Chat.id == ids.user_id)\
    #     .first()
    
    # if already_have_chats:
    #     raise HTTPException(
    #         status_code = 409,
    #         detail = "You have already a vhat with this user"
    #     )
        
    member2 = ChatMember(
        user_id=ids.user_id,
        chat_id=new_chat_room.id
    )

    db.add(member1)
    db.add(member2)

    db.commit()
    
    return {
        "message": "Chat created",
        "chat_id": ids.user_id
    }
    
    
@app.get('/chat-list')
def get_chats(
          currentUser = Depends(get_current_user), 
          db : Session = Depends(get_db)):
    
    user = db.query(User)\
        .filter(User.id == currentUser['user_id'])\
        .first()
    
    chats = db.query(ChatMember)\
        .filter(ChatMember.user_id == user.id)\
        .all()
            
    results = []
    
    for i in chats:
        
        other_user = db.query(ChatMember)\
            .filter(ChatMember.chat_id == i.chat_id, ChatMember.user_id != user.id)\
            .first()
            
        if not other_user:
            continue
            
        username = db.query(User)\
            .filter(User.id == other_user.user_id)\
            .first()
            
            
        #to get last message
        lastMsgRow = (db.query(Message)
            .filter(Message.chat_id == i.chat_id)
            .order_by(Message.id.desc())
            .first()
        )
        
        if not lastMsgRow:
            lastMsg = ""
        else:
            lastMsg = lastMsgRow.content
    
        #to get no of unread msgs
        unread_msgs = db.query(Message)\
            .filter(Message.chat_id == i.chat_id,
                    Message.sender_id != user.id,
                    Message.is_read == False)\
            .count()
        
        #--------------------------
        
        results.append({
            "chat_id" : i.chat_id,
            "user_id" : other_user.user_id,
            "username" : username.username,
            "last_message" : lastMsg,
            "unread" : unread_msgs
        })
    
    return {"status" : results}


@app.post('/message')
def message_user(data : MessageDTO, 
          currentUser = Depends(get_current_user), 
          db : Session = Depends(get_db)):
    
    user = db.query(User)\
        .filter(User.id == currentUser['user_id'])\
        .first()
        
    
    chat = db.query(Chat)\
        .filter(Chat.id == data.chat_id)\
        .first()

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )
        
    membership = db.query(ChatMember)\
        .filter(
            ChatMember.chat_id == data.chat_id,
            ChatMember.user_id == user.id
        )\
        .first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this chat"
        )
        
    message = Message(
        content=data.content,
        sender_id= user.id,
        chat_id=data.chat_id
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return {
        "message_id": message.id,
        "chat_id": message.chat_id,
        "sender_id": message.sender_id,
        "content": message.content
    }
        

@app.get('/messages/{chat_id}')
def get_messages(chat_id: int,
          currentUser = Depends(get_current_user), 
          db : Session = Depends(get_db)):
    
    user = db.query(User)\
        .filter(User.id == currentUser['user_id'])\
        .first()
        
        
    membership = db.query(ChatMember)\
        .filter(
            ChatMember.chat_id == chat_id,
            ChatMember.user_id != user.id
        )\
        .first()
    
    opposite_user_id = membership.user_id
    
    Ouser = db.query(User)\
        .filter(User.id == opposite_user_id)\
        .first()
        
    opposite_name = Ouser.username  
        
    membership = db.query(ChatMember)\
        .filter(
            ChatMember.chat_id == chat_id,
            ChatMember.user_id == user.id
        )\
        .first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this chat"
        ) 
        
    messages = db.query(Message)\
        .filter(Message.chat_id == chat_id)\
        .all()
        
    # making all messages as read
    db.query(Message)\
        .filter(Message.chat_id == chat_id,
                Message.sender_id != user.id,
                Message.is_read == False)\
        .update(
             {"is_read" : True},
             synchronize_session=False
        )
    db.commit()
    
    results = []
    
    for msg in messages:
        
        SenderUsername = db.query(User)\
            .filter(User.id == msg.sender_id)\
            .first()
    
            
        results.append({
            "id" : msg.id,
            "sender_id" : msg.sender_id,
            'sender_name' : SenderUsername.username,
            "content" : msg.content
        })
    
    return {"status" : results, "opposite_name" : opposite_name, "OuserID" : opposite_user_id}
    
    
@app.get('/chat/{chat_id}')
def chat_envelope(chat_id: int,
          currentUser = Depends(get_current_user), 
          db : Session = Depends(get_db)):
    
    user = db.query(User)\
        .filter(User.id == currentUser['user_id'])\
        .first()
        
    chat = db.query(Chat)\
        .filter(Chat.id == chat_id)\
        .first()

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )
        
    membership = db.query(ChatMember)\
        .filter(
            ChatMember.chat_id == chat_id,
            ChatMember.user_id == user.id
        )\
        .first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this chat"
        ) 
        
    other_user = db.query(ChatMember)\
            .filter(ChatMember.chat_id == chat_id, ChatMember.user_id != user.id)\
            .first()
            
    messageCount = db.query(Message)\
        .filter(Message.chat_id == chat_id)\
        .count()
    
    if other_user:
        username = db.query(User)\
                .filter(User.id == other_user.user_id)\
                .first()
            
    return {
        "chat_id": chat_id,
        "other_user": {
            "id": other_user.user_id,
            "username": username.username
        },
        "message_count": messageCount
    }
   
   
import json    
    
from fastapi import WebSocket, WebSocketDisconnect


active_connections = {}


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket):
    await websocket.accept()


    # await websocket.send_text(
    #     f"Welcome User {user_id}"
    # )
    
    db = SessionLocal()
    
    token = websocket.query_params.get("token")
            
    try:
        tokenExtract = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except Exception:
        await websocket.close()
        return
    
    sender_id = tokenExtract["user_id"] 
    # also known as user_id
    
    active_connections[sender_id] = websocket
    
    print("Connected users:", list(active_connections.keys()))
    
    # Cuser = db.query(User)\
    #     .filter(User.id == sender_id)\
    #     .first()
    
    # Cuser.last_seen = "Online"
        
    # db.commit()
    # db.refresh(Cuser)
    
    
    # global receiver_id

    try:
        while True:

            data = await websocket.receive_text()

            payload = json.loads(data)

            chat_id = payload["chat_id"]
            # receiver_id = payload["receiver_id"] we will collect from db
            message = payload["message"]
            
            # check membership
            membership = db.query(ChatMember)\
                .filter(ChatMember.chat_id == chat_id,
                        ChatMember.user_id == sender_id)\
                .first()
            
            if not membership:
                await websocket.send_text(
                    json.dumps({
                        "error": "You are not a member of this chat"
                    })
                )
                continue
            
            # save message
            new_message = Message(
                content=message,
                sender_id=sender_id,
                chat_id=chat_id,
                is_read = False
            )

            db.add(new_message)
            db.commit()
            db.refresh(new_message)
            
            #reciever id
            other_user = db.query(ChatMember)\
                .filter(ChatMember.chat_id == chat_id, ChatMember.user_id != sender_id)\
                .first()
                
            if not other_user:
                continue
                
            receiver_id = other_user.user_id
            
            # deliver message
            if receiver_id in active_connections:

                await active_connections[receiver_id].send_text(
                    json.dumps({
                        "id": new_message.id,
                        "chat_id": chat_id,
                        "sender_id": sender_id,
                        "message": message
                    })
                )

            #notifying sender about his message that was sent
            await websocket.send_text(
                json.dumps({
                    "type": "sent",
                    "message_id": new_message.id,
                    "sender_id": sender_id,
                    "message" : new_message.content
                })
            )

    except WebSocketDisconnect:

        active_connections.pop(sender_id, None)
        
        # last_seen_time = datetime.now()
        # print(datetime.now())
        
        user = db.query(User)\
            .filter(User.id == sender_id)\
            .first()
        
        user.last_seen = datetime.now()
       
        
        db.commit()
        db.refresh(user)
            

        print(f"User {sender_id} disconnected")
    
    finally:
        db.close()
        

@app.get("/online-users")
async def onlineUsers(currentUser=Depends(get_current_user), db : Session = Depends(get_db)):
    
    results = []
    
    for user in active_connections:
        results.append(user)
        
        
    return results