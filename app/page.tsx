"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward, Settings, ExternalLink, Volume2 } from "lucide-react"

interface ServerStats {
  online: number
  maxSlots: number
  upvotes: number
}

interface NewsItem {
  id: number
  title: string
  date: string
  content: string
}

interface FiveMPlayer {
  id: number
  name: string
  ping: number
  identifiers: string[]
}

export default function FiveMServerLauncher() {
  const [serverStats, setServerStats] = useState<ServerStats>({
    online: 0,
    maxSlots: 2025,
    upvotes: 3,
  })

  const [news, setNews] = useState<NewsItem[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const fetchServerStats = async () => {
      try {
        // Use our proxy API route instead of direct fetch
        const response = await fetch("/api/players")
        const players: FiveMPlayer[] = await response.json()

        setServerStats({
          online: players.length, // Use real player count
          maxSlots: 2025,
          upvotes: Math.floor(Math.random() * 10) + 1,
        })
      } catch (error) {
        console.error("Failed to fetch player data:", error)
        // Fallback to simulated data if API fails
        setServerStats({
          online: Math.floor(Math.random() * 150) + 50,
          maxSlots: 2025,
          upvotes: Math.floor(Math.random() * 10) + 1,
        })
      }
    }

    fetchServerStats()
    const interval = setInterval(fetchServerStats, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Simulate fetching news
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: 1,
        title: "Updates",
        date: "11.08.2025",
        content: "Der Server ist aktuell in der Entwicklung",
      },
    ]
    setNews(mockNews)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  const handleLaunchGame = () => {
    window.open("https://cfx.re/join/gybb9q", "_self")
  }

  const handleDiscord = () => {
    window.open("https://discord.gg/elbfuhrt", "_blank")
  }

  const handleWebsite = () => {
    window.open("https://elbfuhrtnetzwerk.nicklas187.de", "_blank")
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/fivem-police-night.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <audio ref={audioRef} src="https://leondc1.isfucking.pro/63CDnI.mp3" loop onEnded={() => setIsPlaying(false)} />

      {/* Window Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <div className="p-6 flex items-center backdrop-blur-md bg-black/10 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://lsqhnoadkkitxumnlmlw.supabase.co/storage/v1/object/public/images/uploads/06f8adf3-6b5d-494f-8a50-2e828ef9145e/1754926016772-rki9p6vy05.png"
                alt="GreenCity Roleplay Logo"
                className="h-12 w-12 rounded-lg backdrop-blur-sm bg-white/5 p-1"
                style={{ filter: "blur(0.5px)" }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white backdrop-blur-sm">GreenCity Roleplay</h1>
            </div>
          </div>
        </div>

        {/* Left side - News positioned higher and stretched */}
        <div className="flex-1 flex relative pb-24">
          <div className="absolute left-6 top-8 max-w-4xl w-full max-w-[60%]">
            <Card className="bg-black/10 border-white/5 backdrop-blur-sm h-80 overflow-hidden">
              <div className="p-6 h-full">
                {news.length > 0 ? (
                  <div className="space-y-4 h-full overflow-y-auto pr-2">
                    {news.map((item) => (
                      <div key={item.id} className="border-b border-white/10 pb-3 last:border-b-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-white font-medium text-sm">{item.title}</h3>
                          <span className="text-white/50 text-xs">{item.date}</span>
                        </div>
                        <p className="text-white/70 text-xs leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-lg">Keine News verfügbar.</p>
                )}
              </div>
            </Card>
          </div>

          {/* Right side - Buttons at absolute right edge with separate sections */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-80 space-y-4">
            <div className="bg-black/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6 space-y-6">
              {/* Server Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/3 backdrop-blur-sm border border-white/5 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white">{serverStats.online}</div>
                  <div className="text-white/70 text-sm uppercase tracking-wide">ONLINE</div>
                </div>

                <div className="bg-white/3 backdrop-blur-sm border border-white/5 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white">Dev</div>
                  <div className="text-white/70 text-sm uppercase tracking-wide">SLOTS</div>
                </div>

                <div className="bg-white/3 backdrop-blur-sm border border-white/5 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400">0</div>
                  <div className="text-white/70 text-sm uppercase tracking-wide">UPVOTES</div>
                </div>

                <div className="bg-white/3 backdrop-blur-sm border border-white/5 rounded-2xl p-6 text-center">
                  <div className="text-xl font-bold text-blue-400">DEV</div>
                  <div className="text-white/70 text-sm uppercase tracking-wide">EDITION</div>
                </div>
              </div>

<Button
  onClick={handleLaunchGame}
  className="w-full h-16 bg-green-500 hover:bg-green-600 text-white font-semibold text-xl rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
>
  <Play className="mr-2 h-6 w-6" />
  Spiel starten
</Button>

            </div>

            <div className="bg-black/5 backdrop-blur-xl border border-white/5 rounded-3xl p-4 space-y-3">
              <Button
                onClick={handleDiscord}
                className="w-full h-16 bg-black/10 hover:bg-black/20 text-white border border-white/5 rounded-2xl backdrop-blur-sm transition-all duration-200 text-lg"
              >
                <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.076.076 0 0 0 .084.028a14.09 14.09 0 0 0 1.226-1.994a.077.077 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Discord
              </Button>

              <Button
                onClick={handleWebsite}
                className="w-full h-16 bg-black/10 hover:bg-black/20 text-white border border-white/5 rounded-2xl backdrop-blur-sm transition-all duration-200 text-lg"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Webseite
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 text-white hover:text-white hover:bg-white/10"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Track Info and Progress */}
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-white/70 mb-1">
                  <span>GreenCity Roleplay</span>
                  <div className="flex items-center gap-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  className="w-full h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-blue-500 transition-all duration-100"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              {/* Volume */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-white/70 hover:text-white hover:bg-white/10"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
