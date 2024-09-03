'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Scanner } from './Scanner'
import { UserPlus } from 'lucide-react'

export function TotenInterface({ storeName = "Loja do Edipo", logoUrl = "/placeholder.svg?height=50&width=50", sessionType = "Sessão Regular", sessionDate = new Date().toLocaleDateString() }) {
  const [message, setMessage] = useState("")

  const handleQRCodeScan = (value: string) => {
    setMessage(`QR Code lido com sucesso. Presença registrada! Valor: ${value}`)
  }

  const handleCIMSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Placeholder for CIM submission logic
    setMessage("CIM verificado. Presença registrada!")
  }

  const handleNewUserRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Placeholder for new user registration logic
    setMessage("Novo usuário cadastrado com sucesso!")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{storeName}</h1>
          </div>
          <div className="text-right">
            <p className="font-semibold">{sessionType}</p>
            <p>{sessionDate}</p>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <Tabs defaultValue="qrcode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="cadastro">Novo Cadastro</TabsTrigger>
          </TabsList>
          <TabsContent value="qrcode">
            <Card>
              <CardHeader>
                <CardTitle>Leitura de QR Code</CardTitle>
                <CardDescription>Aponte a câmera para o QR Code para registrar presença</CardDescription>
              </CardHeader>
              <CardContent className="flex w-full h-full">
                <Scanner setScanValue={handleQRCodeScan} />
              </CardContent>
            </Card>
            <hr className="my-4" />
            ou
            <Card>
              <CardHeader>
                <CardTitle>CIM ou Token NFC</CardTitle>
                <CardDescription>Digite seu CIM ou aproxime o token NFC</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCIMSubmit} className="space-y-4">
                  <Input type="text" placeholder="Digite seu CIM" />
                  <Button type="submit" className="w-full">Registrar com CIM</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle>Novo Cadastro</CardTitle>
                <CardDescription>Preencha os dados para se cadastrar</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewUserRegistration} className="space-y-4">
                  <Input type="text" placeholder="Nome completo" />
                  <Input type="email" placeholder="E-mail" />
                  <Input type="tel" placeholder="Telefone" />
                  <Input type="text" placeholder="CIM (se aplicável)" />
                  <Button type="submit" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" /> Cadastrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {message && (
          <div className="mt-4 p-4 bg-secondary text-secondary-foreground rounded-md text-3xl">
            {message}
          </div>
        )}
      </main>

      <footer className="bg-muted text-muted-foreground p-4 text-center">
        <p>© 2024 DailyCode. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
