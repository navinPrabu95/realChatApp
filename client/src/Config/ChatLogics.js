export const GetSender=(user,chatUser)=>{
        if(chatUser!==undefined){
          return chatUser[0]?._id===user._id ? chatUser[1]?.name:chatUser[0]?.name
        }else{
          return;
        }
}

export const GetUser=(user,chatUser)=>{
       
       if(chatUser!==undefined){
         return chatUser[0]?._id == user._id ? chatUser[1]?.pic:chatUser[0]?.pic
       }else{
         return;
       }
}

export const SameUser=(senderId,UserId)=>{
        return senderId==UserId ? "single-messages-same":"single-messages-diff"
}