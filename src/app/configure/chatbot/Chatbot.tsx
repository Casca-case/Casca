"use client";
import React, { useState } from "react";
import { Button, buttonVariants } from "../../../components/ui/button";
import { MessageCircle, X } from "lucide-react";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="z-50">
      {isChatOpen ? (
        <div className="relative z-50">
          <Button
            onClick={() => setIsChatOpen(false)}
            className="absolute -right-0 top-6 rounded-full p-3 bg-gray-800 hover:bg-gray-700"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
          <iframe
            title="Customer Support Chatbot"
            className="rounded-lg shadow-lg"
            width="350"
            height="500"
            src="https://app.fastbots.ai/embed/cm2rctird12g6n8bm6cqboonq"
          ></iframe>
        </div>
      ) : (
        <Button
          onClick={() => setIsChatOpen(true)}
          className={buttonVariants({
            size: "lg",
            className: "rounded-full shadow-lg",
          })}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;