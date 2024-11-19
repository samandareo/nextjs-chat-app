type MessagePropsType = {
  owner: boolean;
  email: string;
  message: string;
  leftChat : boolean;
};


export default function Message({ owner, email, message, leftChat}: MessagePropsType) {
    return (
        <article
            className={`${
                leftChat
                    ? owner
                        ? ""
                        : "self-center text-red-600 text-center px-2 py-1 text-[12px] border-[1px] rounded-full mt-5"
                    : owner
                        ? "self-end bg-green-800 p-2 rounded-lg"
                        : "p-2 border-2 rounded-lg"
            } w-1/2 flex flex-col`}
        >
            {!leftChat && (
                <span
                    className={`${
                        owner ? "text-white" : "text-gray-500"
                    } self-end text-sm`}
                >
                  {email}
                </span>
            )}
            <span className={`${owner ? "text-white" : ""}`}>{message}</span>
        </article>

    )
}
