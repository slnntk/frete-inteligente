"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from "lucide-react"

interface Post {
  id: string
  author: {
    name: string
    role: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  comments: number
}

export function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">{post.author.name}</h4>
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed">{post.content}</p>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">{likeCount} curtidas</span>
          <span className="text-sm text-muted-foreground">{post.comments} comentários</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 gap-2 ${isLiked ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
            onClick={handleLike}
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            Curtir
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-primary">
            <MessageSquare className="h-4 w-4" />
            Comentar
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-primary">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
