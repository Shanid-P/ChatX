from pydantic import BaseModel, Field, ConfigDict

class RegisterDTO(BaseModel):
    username: str
    password: str
    
class LoginDTO(BaseModel):
    username: str
    password: str
    
class UserDTO(BaseModel):
    username: str
    
class CreateChatDTO(BaseModel):
    # member_ids: list[int]
    user_id: int
    
class MessageDTO(BaseModel):
    chat_id: int
    content: str