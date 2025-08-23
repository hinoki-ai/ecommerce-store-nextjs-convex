"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  User,
  Bot,
  Phone,
  Mail,
  Clock,
  CheckCircle2
} from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useLanguage } from "@/components/LanguageProvider"
import { toast } from "sonner"

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent' | 'bot'
  timestamp: Date
  status?: 'sent' | 'delivered' | 'read'
  agentName?: string
  isTyping?: boolean
}

interface ChatSession {
  id: string
  status: 'active' | 'waiting' | 'closed'
  agentName?: string
  agentAvatar?: string
  estimatedWaitTime?: number
  queuePosition?: number
}

export function ChatWidget() {
  const { isSignedIn, user } = useAuth()
  const { t } = useLanguage()
  
  // Widget state
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentView, setCurrentView] = useState<'chat' | 'form' | 'queue'>('chat')
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [session, setSession] = useState<ChatSession | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    subject: "",
    message: "",
    urgency: "medium" as "low" | "medium" | "high"
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && currentView === 'chat') {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized, currentView])

  // Initialize chat
  const initializeChat = async () => {
    if (!isSignedIn) {
      setCurrentView('form')
      return
    }

    // Simulate session creation
    setSession({
      id: `session-${Date.now()}`,
      status: 'waiting',
      queuePosition: 3,
      estimatedWaitTime: 2
    })

    // Welcome message
    const welcomeMessage: Message = {
      id: `msg-${Date.now()}`,
      content: t('chat.welcome') || "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      sender: 'bot',
      timestamp: new Date(),
      status: 'delivered'
    }
    
    setMessages([welcomeMessage])
    
    // Simulate agent connection after delay
    setTimeout(() => {
      setSession(prev => prev ? {...prev, status: 'active', agentName: 'María García', queuePosition: undefined} : null)
      
      const agentMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: "¡Hola! Soy María, tu agente de soporte. He revisado tu historial y estoy lista para ayudarte. ¿Cuál es tu consulta?",
        sender: 'agent',
        timestamp: new Date(),
        status: 'delivered',
        agentName: 'María García'
      }
      
      setMessages(prev => [...prev, agentMessage])
    }, 3000)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !session) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate agent typing and response
    setTimeout(() => {
      setIsTyping(false)
      
      const responses = [
        "Entiendo tu consulta. Déjame revisar esa información para ti.",
        "Gracias por contactarnos. Voy a verificar el estado de tu pedido.",
        "Por supuesto, puedo ayudarte con eso. ¿Podrías darme más detalles?",
        "Perfecto, esa es una excelente pregunta. Te explico:",
        "He encontrado la información que necesitas. Aquí tienes los detalles:"
      ]

      const agentResponse: Message = {
        id: `msg-${Date.now() + 2}`,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: session.status === 'active' ? 'agent' : 'bot',
        timestamp: new Date(),
        status: 'delivered',
        agentName: session.agentName
      }

      setMessages(prev => [...prev, agentResponse])
    }, 1500 + Math.random() * 2000)
  }

  const submitContactForm = async () => {
    try {
      // Here you would integrate with your support system
      toast.success("Mensaje enviado correctamente. Te responderemos pronto.")
      setIsOpen(false)
      
      // Reset form
      setContactForm(prev => ({
        ...prev,
        subject: "",
        message: "",
        urgency: "medium"
      }))
    } catch (error) {
      toast.error("Error al enviar el mensaje. Inténtalo de nuevo.")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Widget toggle button
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            setIsOpen(true)
            if (!session) initializeChat()
          }}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 sm:w-96 transition-all duration-300 shadow-2xl ${
        isMinimized ? 'h-14' : 'h-[500px]'
      }`}>
        {/* Header */}
        <CardHeader className="p-4 border-b bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <CardTitle className="text-sm">
                  {session?.status === 'active' && session.agentName 
                    ? `Chat con ${session.agentName}`
                    : session?.status === 'waiting'
                    ? 'Conectando...'
                    : 'Soporte en Línea'
                  }
                </CardTitle>
                {session?.status === 'active' && (
                  <p className="text-xs opacity-90 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    En línea
                  </p>
                )}
                {session?.status === 'waiting' && session.queuePosition && (
                  <p className="text-xs opacity-90 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Posición {session.queuePosition} - ~{session.estimatedWaitTime}min
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[436px]">
            {/* Chat Messages */}
            {currentView === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : message.sender === 'agent'
                            ? 'bg-green-100 text-green-900 border border-green-200'
                            : 'bg-muted'
                        }`}
                      >
                        {message.sender !== 'user' && (
                          <div className="flex items-center space-x-2 mb-1">
                            {message.sender === 'agent' ? (
                              <User className="h-3 w-3" />
                            ) : (
                              <Bot className="h-3 w-3" />
                            )}
                            <span className="text-xs font-medium">
                              {message.agentName || (message.sender === 'agent' ? 'Agente' : 'Asistente')}
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-between mt-1 ${
                          message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <span className="text-xs">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.sender === 'user' && (
                            <CheckCircle2 className={`h-3 w-3 ${
                              message.status === 'read' ? 'text-green-400' : 
                              message.status === 'delivered' ? 'text-blue-400' : 
                              'text-gray-400'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1"
                      disabled={!session || session.status === 'waiting'}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || !session || session.status === 'waiting'}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Contact Form */}
            {currentView === 'form' && (
              <div className="p-4 space-y-4">
                <div className="text-center">
                  <h3 className="font-medium">Contáctanos</h3>
                  <p className="text-sm text-muted-foreground">
                    Envíanos un mensaje y te responderemos pronto
                  </p>
                </div>

                <div className="space-y-3">
                  <Input
                    placeholder="Nombre"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  
                  <Input
                    type="email"
                    placeholder="Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                  
                  <Input
                    placeholder="Asunto"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                  
                  <Textarea
                    placeholder="Escribe tu mensaje..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="min-h-[80px]"
                  />

                  <div className="flex space-x-2">
                    <Button 
                      onClick={submitContactForm}
                      className="flex-1"
                      disabled={!contactForm.email || !contactForm.message}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar
                    </Button>
                    {isSignedIn && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setCurrentView('chat')
                          initializeChat()
                        }}
                      >
                        Chat
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick Contact Options */}
                <div className="pt-4 border-t space-y-2">
                  <p className="text-xs text-center text-muted-foreground">O contáctanos directamente:</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span className="text-xs">+56 9 1234 5678</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span className="text-xs">soporte@tienda.cl</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}