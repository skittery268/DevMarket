import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { MessageSquare, Trash2, ChevronRight } from "lucide-react";

import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { initials, timeAgo, apiError, productImage } from "@/lib/format";

import Container from "@/components/common/Container";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function Chats() {
  const { chats, loadChats, deleteChat } = useChat();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await loadChats();
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      await deleteChat(id);
      console.log("Conversation deleted");
    } catch (err) {
      console.error(apiError(err, "Could not delete chat"));
    }
  };

  if (loading) return <Loader full label="Loading conversations..." />;

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">Messages</h1>

      {chats.length ? (
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {chats.map((chat) => {
            const other = user?._id === chat.buyer?._id ? chat.seller : chat.buyer;
            return (
              <motion.div key={chat._id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <Link
                  to={`/chats/${chat._id}`}
                  state={{ chat }}
                  className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-card transition-shadow hover:shadow-glow"
                >
                  <ImageWithFallback
                    src={productImage(chat.product)}
                    alt={chat.product?.universal?.title}
                    className="size-14 rounded-xl border border-border/60"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-semibold">
                      {chat.product?.universal?.title || "Product"}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Avatar className="size-5">
                        <AvatarFallback className="text-[9px]">{initials(other?.fullname)}</AvatarFallback>
                      </Avatar>
                      {other?.fullname || "User"}
                    </p>
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    {timeAgo(chat.updatedAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => handleDelete(e, chat._id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Message a seller from any product page to start chatting."
          action={
            <Button variant="brand" asChild>
              <Link to="/products">Browse products</Link>
            </Button>
          }
        />
      )}
    </Container>
  );
}

export default Chats;
