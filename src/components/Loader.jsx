import React from "react";
import logo from "../assets/fabicon.png";

const Loader = ({ fullScreen = true }) => {
    return (
        <div
            className={`
        ${fullScreen ? "fixed inset-0 z-[9999]" : "relative min-h-[300px]"}
        flex items-center justify-center
        bg-white/95 backdrop-blur-md
      `}
        >
            <div className="flex flex-col items-center">
                <div className="relative flex h-28 w-28 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#4254bf]/10 blur-xl" />

                    <div
                        className="
              absolute inset-0 rounded-full
              border-[3px] border-transparent
              border-t-[#4254bf]
              border-r-[#168864]
              animate-spin
            "
                    />


                    <div
                        className="
              absolute inset-2 rounded-full
              border border-[#4254bf]/10
            "
                    />

                    <div
                        className="
              relative flex h-20 w-20 items-center justify-center
             rounded-full
              bg-white
              shadow-[0_10px_40px_rgba(66,84,191,0.18)]
            "
                    >
                        <img
                            src={logo}
                            alt="VYASON"
                            className="
                h-14 w-14 object-contain
                animate-[pulse_2s_ease-in-out_infinite]
              "
                        />
                    </div>
                </div>


                <div className="mt-7 text-center">
                    <p className="text-sm font-semibold tracking-[0.25em] text-[#111A3A]">
                        LOADING
                    </p>


                    <div className="mt-3 flex justify-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4254bf] animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4254bf] animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#168864] animate-bounce" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Loader;