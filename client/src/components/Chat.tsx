"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import Message from "./Message";
import Image from "next/image";
import logoutIcon from "@/images/logoutIcon.png";
import userIcon from "@/images/user.svg";
import emojiIcon from "@/images/emoji.svg"
import sendIcon from "@/images/send.svg"
import EmojiPicker from "emoji-picker-react";


type ChatPropsType = {
  userEmail: string;
  chatRoom: string;
};

export default function Chat({ userEmail, chatRoom }: ChatPropsType) {
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState<string>("");
  const [allMessage, setAllMessage] = useState<
    { senderEmail: string; userMessage: string, leftChat: boolean}[]
  >([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const inputRef = useRef(null);


  const [onlineUsers, setOnlineUsers] =
    useState<{ userEmail: string; chatRoom: string; socketId: string }[]>();

  const [currentRoomsUsers, setCurrentRoomUsers] =
      useState<{ userEmail: string, chatRoom: string, socketId: string}[]>();

  useEffect(() => {
    setCurrentRoomUsers(onlineUsers?.filter((user) => user.chatRoom === chatRoom))
  }, [onlineUsers, chatRoom]);


  useEffect(() => {
    if (userEmail && chatRoom) {
      setSocket(io("http://localhost:3010"));
    }
  }, [userEmail, chatRoom]);

  useEffect(() => {
    if (socket) {
      socket.emit("newUserJoining", { userEmail, chatRoom });
    }
  }, [socket, userEmail, chatRoom]);

  useEffect(() => {
    if (socket) {
      socket.on("onlineUsers", (payload) => {
        setOnlineUsers(payload);
      });
    }
  }, [socket]);

  const logoutHandler = () => {
    socket?.disconnect()
    router.push("/");
  };

  const emojiHandler = () =>{
    if(!showModal){
      setShowModal(true)
    }else{
      setShowModal(false)
    }
  };



  const handleEmoji = (emoji:string) => {
    const input = inputRef.current;

    // @ts-ignore
    const cursorPos = input.selectionStart;

    const newMessage = message.slice(0, cursorPos) + emoji + message.slice(cursorPos);
    setMessage(newMessage);

    setTimeout(() => {
      // @ts-ignore
      input.focus();
      const newPosition = cursorPos + emoji.length;
      // @ts-ignore
      input.setSelectionRange(newPosition, newPosition);
      setShowModal(false)
    });
  }

  const sendMessageHandler = () => {
    if (!message) return;

    socket?.emit("newMessage", {
      senderEmail: userEmail,
      userMessage: message,
      chatRoom: chatRoom,
    });

    setMessage("");
  };

  useEffect(() => {
    if (socket) {
      socket.on("allMessages", (payload) => {
        setAllMessage((prev) => [...prev, payload]);
      });
    }
  }, [socket]);

  return (
    <div className="grid place-items-center h-dvh">
      <header className="border-2 w-3/4 h-96 rounded-lg flex bg-[--soft-gray] border-[--dark-charcoal]">
        <aside className="basis-[30%] p-3">
          <div className="flex flex-col gap-2 w-full">
            {currentRoomsUsers?.map((user) => (
              <article key={user.socketId} className="flex gap-3 border-b px-2 py-1 w-full">
                <Image
                  className="rounded-full scale-150"
                  src={userIcon}
                  alt="user icon"
                />
                <div className="flex flex-col ">
                  <span className="w-full">{user.userEmail}</span>
                  <span className="text-green-700 text-[14px]">online</span>
                </div>
              </article>
            ))}
          </div>
        </aside>

        <section className="border-l-2 border-[--dark-charcoal] basis-[70%]">
          <div className="flex flex-col gap-2 p-3 h-full">
            <nav className="flex justify-between items-center">
              <h1 className="flex flex-row gap-2">
                Room:
                <span className="text-[--sunset-orange] font-black">{chatRoom}</span>
              </h1>
              <button
                onClick={logoutHandler}
                className="flex gap-2 border-2 rounded-lg py-2 px-3 border-red-600"
              >
                <span className="text-red-600">Log out</span>
                <Image src={logoutIcon} alt="logout" height={20} width={20} />
              </button>
            </nav>
            <section className="border-2  h-full overflow-y-scroll flex flex-col gap-2 p-2">
              {allMessage.map((mes, i) => (
                <Message
                  key={i}
                  owner={userEmail === mes.senderEmail}
                  email={mes.senderEmail}
                  message={mes.userMessage}
                  leftChat={mes.leftChat}
                />
              ))}
              {showModal && (
                  <span className="absolute w-1/4 h-auto p-2 bottom-64 right-52 bg-white border-2 border-black rounded">
                        <EmojiPicker
                            onEmojiClick={(e) => handleEmoji(e.emoji)}
                        width={320}
                        height={320}
                        />
                  </span>
              )}
            </section>
            <footer className="mt-auto bg-[--deep-royal-blue] p-3 flex gap-2 rounded-b-md">
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="grow rounded-lg p-2 text-[--dark-charcoal]"
                type="text"
                placeholder="what do you wanna say?"
              />
              <Image
                  onClick={emojiHandler}
                  src={emojiIcon}
                  alt="Emoji icon"
                  width={20}
                  height={20}
              />
              <Image src={sendIcon} onClick={sendMessageHandler} alt="Send icon" className="hover:scale-125 transition-transform scale-110 cursor-pointer"/>
            </footer>
          </div>
        </section>
      </header>
    </div>
  );
}
