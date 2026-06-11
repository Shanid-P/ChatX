from sqlalchemy import Column
from sqlalchemy import Integer, Boolean
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime

from database import Base

# class User(BaseModel):
    
#     __tablename__ = "users"
    
#     id = Column(Integer, primary_key = true)
#     messages = relationship(
#         "Message",
#         back_populates = "sender"
#     )
    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    username = Column(String, unique=True)

    password = Column(String)
    
    last_seen = Column(DateTime, nullable=True)
# class Message(Base):
    
#     __tablename__ = "messages"
    
#     id = Column(Integer, primary_key = True)
#     content = Column(String)
#     sender_id = Column(Integer, ForeignKey("chats.id"))
    
#     sender = relationship(
#         "User",
#         back_populates = "messages"
#     )
    
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)

    content = Column(String)

    sender_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    chat_id = Column(
        Integer,
        ForeignKey("chats.id")
    )
    
# class Chat(Base):
    
#     __tablename__ = "chats"
    
#     id = Column(Integer, primary_key = True)
    
#     messages = relationship(
#         "Message",
#         back_populates = "chats"
#     )

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    
    is_group = Column(Boolean, default=False)
    

class ChatMember(Base):
    __tablename__ = "chat_members"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    chat_id = Column(
        Integer,
        ForeignKey("chats.id")
    )