import Chat from "@/components/Chat";

type ChatRoomPropsType = {
  searchParams: {
    userEmail: string;
    chatRoom: string;
  };
};

export default async function ChatRoom({ searchParams }: ChatRoomPropsType) {
  const { userEmail, chatRoom } = await searchParams;

  return <Chat userEmail={userEmail} chatRoom={chatRoom} />;
}
