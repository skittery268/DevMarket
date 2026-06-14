import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  MoreVertical,
  Pencil,
  SendHorizonal,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useMessage } from "@/hooks/useMessage";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { initials, formatTime, apiError, productImage } from "@/lib/format";
import { cn } from "@/lib/utils";

import Container from "@/components/common/Container";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function ChatRoom() {
  const { chatId } = useParams();
  const location = useLocation();

  const {
    messages,
    loadMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    addIncomingMessage,
    replaceMessage,
    removeMessage,
    clearMessages,
  } = useMessage();
  const { loadChats } = useChat();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [chat, setChat] = useState(location.state?.chat || null);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const bottomRef = useRef(null);

  // Load chat header info if we arrived via a direct link
  useEffect(() => {
    if (chat) return;
    (async () => {
      try {
        const list = await loadChats();
        setChat((list || []).find((c) => c._id === chatId) || null);
      } catch {
        /* ignore */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // Load history; clear on leave
  useEffect(() => {
    loadMessages(chatId).catch(() => {});
    return () => clearMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // Real-time wiring
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", chatId);

    const onNew = (m) => {
      if (String(m?.chat) === String(chatId)) addIncomingMessage(m);
    };
    const onEdit = (m) => {
      if (String(m?.chat) === String(chatId)) replaceMessage(m);
    };
    const onDelete = (id) => removeMessage(id);

    socket.on("newMessage", onNew);
    socket.on("editMessage", onEdit);
    socket.on("deleteMessage", onDelete);

    return () => {
      socket.emit("leaveRoom", chatId);
      socket.off("newMessage", onNew);
      socket.off("editMessage", onEdit);
      socket.off("deleteMessage", onDelete);
    };
  }, [socket, chatId, addIncomingMessage, replaceMessage, removeMessage]);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const other = user?._id === chat?.buyer?._id ? chat?.seller : chat?.buyer;

  const handleSend = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setText("");
    try {
      await sendMessage({ chatId, content });
    } catch (err) {
      toast.error(apiError(err, "Message not sent"));
    }
  };

  const handleSaveEdit = async () => {
    const content = editText.trim();
    if (!content) return;
    try {
      await editMessage(editingId, content);
      setEditingId(null);
      setEditText("");
    } catch (err) {
      toast.error(apiError(err, "Could not edit message"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
    } catch (err) {
      toast.error(apiError(err, "Could not delete message"));
    }
  };

  return (
    <Container className="py-6">
      <div className="mx-auto flex h-[calc(100vh-12rem)] max-w-3xl flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link to="/chats" aria-label="Back to messages">
              <ArrowLeft />
            </Link>
          </Button>
          {chat?.product && (
            <ImageWithFallback
              src={productImage(chat.product)}
              alt={chat.product?.universal?.title}
              className="size-10 rounded-lg border border-border/60"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 font-semibold">{other?.fullname || "Conversation"}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {chat?.product?.universal?.title || "Product chat"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const mine = (m.sender?._id || m.sender) === user?._id;
              const isEditing = editingId === m._id;
              return (
                <motion.div
                  key={m._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn("flex items-end gap-2", mine ? "justify-end" : "justify-start")}
                >
                  {!mine && (
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px]">
                        {initials(m.sender?.fullname)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "group relative max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                      mine
                        ? "rounded-br-md bg-brand-gradient text-white"
                        : "rounded-bl-md bg-secondary text-secondary-foreground"
                    )}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                          autoFocus
                          className="h-8 min-w-40 bg-card text-foreground"
                        />
                        <button onClick={handleSaveEdit} aria-label="Save"><Check className="size-4" /></button>
                        <button onClick={() => setEditingId(null)} aria-label="Cancel"><X className="size-4" /></button>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap wrap-break-word">{m.content}</p>
                        <span
                          className={cn(
                            "mt-1 block text-[10px]",
                            mine ? "text-white/70" : "text-muted-foreground"
                          )}
                        >
                          {formatTime(m.createdAt)}
                        </span>

                        {mine && (
                          <div className="absolute -left-9 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
                                <MoreVertical className="size-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingId(m._id);
                                    setEditText(m.content);
                                  }}
                                >
                                  <Pencil /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" onClick={() => handleDelete(m._id)}>
                                  <Trash2 /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border/70 p-3">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" variant="brand" size="icon" disabled={!text.trim()} aria-label="Send">
            <SendHorizonal />
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default ChatRoom;
