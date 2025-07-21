"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, FileText, CheckCircle, XCircle, Clock, LogOut, Search, Filter, Shuffle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Application {
  id: number
  nome_completo: string
  email: string
  telefone: string
  curso_interesse: string
  status: string
  created_at: string
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
  analysis: number
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0, analysis: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const router = useRouter()

  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnCandidate, setDrawnCandidate] = useState<any>(null)
  const [showDrawResult, setShowDrawResult] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchApplications()
  }, [searchTerm, statusFilter])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    }
  }

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "todos") params.append("status", statusFilter)

      const response = await fetch(`/api/applications?${params}`)
      const data = await response.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error("Erro ao buscar candidaturas:", error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchApplications()
        fetchStats()
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Erro no logout:", error)
    }
  }

  const handleDrawCandidate = async () => {
    setIsDrawing(true)
    try {
      const response = await fetch("/api/draw-candidate")
      const data = await response.json()

      if (response.ok && data.candidate) {
        // Simular um delay para criar suspense
        setTimeout(() => {
          setDrawnCandidate(data.candidate)
          setShowDrawResult(true)
          setIsDrawing(false)
        }, 2000)
      } else {
        alert(data.error || "Nenhum candidato disponível para sorteio")
        setIsDrawing(false)
      }
    } catch (error) {
      console.error("Erro no sorteio:", error)
      alert("Erro ao realizar sorteio")
      setIsDrawing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pendente: { label: "Pendente", variant: "secondary" as const },
      em_analise: { label: "Em Análise", variant: "default" as const },
      aprovado: { label: "Aprovado", variant: "default" as const },
      rejeitado: { label: "Rejeitado", variant: "destructive" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
            <p className="text-gray-300">Gestão da Bolsa de estudos Emanuel Xirimbimbi</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleDrawCandidate}
              disabled={isDrawing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isDrawing ? (
                <>
                  <Shuffle className="w-4 h-4 mr-2 animate-spin" />
                  Sorteando...
                </>
              ) : (
                <>
                  <Shuffle className="w-4 h-4 mr-2" />
                  Sortear Candidato
                </>
              )}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Candidaturas</CardTitle>
              <Users className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.analysis}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="candidaturas" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="candidaturas" className="data-[state=active]:bg-emerald-600">
              Candidaturas
            </TabsTrigger>
            <TabsTrigger value="analises" className="data-[state=active]:bg-emerald-600">
              Análises
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidaturas">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle className="text-white">Lista de Candidaturas</CardTitle>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Pesquisar candidaturas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_analise">Em Análise</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center text-white py-8">Carregando candidaturas...</div>
                ) : applications.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma candidatura encontrada.</p>
                    <p className="text-sm mt-2">
                      {searchTerm || statusFilter !== "todos"
                        ? "Tente ajustar os filtros de pesquisa."
                        : "As candidaturas aparecerão aqui quando forem submetidas."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20">
                          <TableHead className="text-gray-300">Nome</TableHead>
                          <TableHead className="text-gray-300">Email</TableHead>
                          <TableHead className="text-gray-300">Curso</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Data</TableHead>
                          <TableHead className="text-gray-300">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((application) => (
                          <TableRow key={application.id} className="border-white/20">
                            <TableCell className="text-white">{application.nome_completo}</TableCell>
                            <TableCell className="text-gray-300">{application.email}</TableCell>
                            <TableCell className="text-gray-300">{application.curso_interesse}</TableCell>
                            <TableCell>{getStatusBadge(application.status)}</TableCell>
                            <TableCell className="text-gray-300">
                              {new Date(application.created_at).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                      onClick={() => setSelectedApplication(application)}
                                    >
                                      Ver
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Detalhes da Candidatura</DialogTitle>
                                    </DialogHeader>
                                    {selectedApplication && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                                            <p className="text-white">{selectedApplication.nome_completo}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-300">Email</label>
                                            <p className="text-white">{selectedApplication.email}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-300">Telefone</label>
                                            <p className="text-white">{selectedApplication.telefone}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-300">
                                              Curso de Interesse
                                            </label>
                                            <p className="text-white">{selectedApplication.curso_interesse}</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Select
                                            value={selectedApplication.status}
                                            onValueChange={(value) => handleStatusChange(selectedApplication.id, value)}
                                          >
                                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pendente">Pendente</SelectItem>
                                              <SelectItem value="em_analise">Em Análise</SelectItem>
                                              <SelectItem value="aprovado">Aprovado</SelectItem>
                                              <SelectItem value="rejeitado">Rejeitado</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analises">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Análises e Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Funcionalidade de análises em desenvolvimento.</p>
                  <p className="text-sm mt-2">Em breve você poderá visualizar relatórios detalhados.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Draw Result Modal */}
        {showDrawResult && drawnCandidate && (
          <Dialog open={showDrawResult} onOpenChange={setShowDrawResult}>
            <DialogContent className="bg-gradient-to-br from-purple-900 to-pink-900 border-purple-500/30 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold text-yellow-400">
                  🎉 Candidato Sorteado! 🎉
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 text-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="text-3xl font-bold text-white">{drawnCandidate.nome_completo.charAt(0)}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 text-4xl animate-bounce">🏆</div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-yellow-300">{drawnCandidate.nome_completo}</h3>
                  <p className="text-purple-200">{drawnCandidate.email}</p>
                  <p className="text-purple-200">{drawnCandidate.telefone}</p>
                  {drawnCandidate.curso && <p className="text-purple-200">Curso: {drawnCandidate.curso}</p>}
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-sm text-purple-200">Candidato sorteado em {new Date().toLocaleString("pt-BR")}</p>
                  <Badge className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    {drawnCandidate.status === "aprovado" ? "Aprovado" : drawnCandidate.status}
                  </Badge>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => setShowDrawResult(false)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDrawResult(false)
                      handleDrawCandidate()
                    }}
                    variant="outline"
                    className="border-purple-400 text-purple-200 hover:bg-purple-800/50"
                  >
                    Sortear Novamente
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
