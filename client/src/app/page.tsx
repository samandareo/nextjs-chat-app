"use client";
import carIcon from "@/images/cars.svg";
import techIcon from "@/images/technology.svg";
import sportIcon from "@/images/sport.svg";
import fashionIcon from "@/images/fashion.svg";
import businessIcon from "@/images/business.svg";
import marketIcon from "@/images/market.svg";
import othersIcon from "@/images/others.svg";
import errorIcon from "@/images/error.png";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import "./globals.css"

type btnsType = {
  name: string;
  icon: StaticImageData;
};

const btns: btnsType[] = [
  {
    name: "Cars",
    icon: carIcon,
  },
  {
    name: "Technology",
    icon: techIcon,
  },
  {
    name: "Sport",
    icon: sportIcon,
  },
  {
    name: "Fashion",
    icon: fashionIcon,
  },
  {
    name: "Business",
    icon: businessIcon,
  },
  {
    name: "Market",
    icon: marketIcon,
  },
  {
    name: "Others",
    icon: othersIcon,
  },
];

export default function Home() {
  const [activeBtn, setActiveBtn] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [emailError, setEmailError] = useState("");
  const userEmailVal = useDebounce(userEmail);

  const router = useRouter();

  const btnHandler = (btnName: string) => {
    setActiveBtn(btnName);
  };

  useEffect(() => {
    if (!userEmailVal || !activeBtn || emailError) {
      setBtnDisabled(true);
      return;
    }
    setBtnDisabled(false);
  }, [userEmailVal, activeBtn, emailError]);

  useEffect(() => {
    if (userEmailVal) {
      const testEmail = /^\w+@[a-z]{4,5}\.[a-z]{2,}$/;
      if (!testEmail.test(userEmailVal)) {
        setEmailError("Invalid email, please try again!!");
        return;
      }
    }
    setEmailError("");
  }, [userEmailVal]);

  const joinBtnHandler = () => {
    router.push(`/roomchat?userEmail=${userEmail}&chatRoom=${activeBtn}`);
  };

  return (
    <div className="grid place-items-center h-dvh">
      <header className="border-2 w-96 rounded-lg p-4 flex flex-col gap-9 bg-[--soft-gray]">
        <h1 className="text-center text-4xl font-bold text-[--dark-charcoal]">Chat App</h1>
        <div className="relative">
          <input
            onChange={(e) => setUserEmail(e.target.value)}
            type="text"
            placeholder="Please enter your email"
            className={` ${
              emailError && "border-[--sunset-orange]"
            } border-2 w-full p-2 text-[--dark-charcoal] rounded-lg outline-none`}
          />
          {emailError && (
            <div className="flex gap-1  absolute bottom-[-26px]">
              <Image src={errorIcon} width={25} height={20} alt="error icon" />
              <span className="text-red-500 ">{emailError}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-[--dark-charcoal]">
            Please choose on of the topics below that you want to discuss
            about...
          </p>
          <ul className="flex flex-wrap gap-4">
            {btns.map((btn, i) => (
                <li
                    onClick={() => btnHandler(btn.name)}
                    key={i}
                    className={`flex gap-3 p-1 rounded-lg border-2 hover:border-[--dark-charcoal] hover:cursor-pointer
                  ${activeBtn === btn.name ? "bg-[--incoming-message] border-[--dark-charcoal]" : ""}`}
                >
                  <span className="select-none text-[--dark-charcoal]">{btn.name}</span>
                  <Image src={btn.icon} alt="btn icon" width={25} height={25}/>
                </li>
            ))}
          </ul>
        </div>

        <button
            disabled={btnDisabled}
            onClick={joinBtnHandler}
            className={`${
            btnDisabled
              ? "hover:cursor-not-allowed"
              : "hover:cursor-pointer bg-[--hover-sunset-orange] animate-pulse transition"
          }     border-2 p-2 rounded-lg text-2xl bg-[--sunset-orange] text-white`}
        >
          Join In
        </button>
      </header>
    </div>
  );
}
