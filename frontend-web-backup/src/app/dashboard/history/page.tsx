"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Eye, Trash2, Calendar, ChevronDown, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import api from "@/services/api"

// Interface for the API response
interface AnalysisHistoryItem {
  id: string;
  date: string;
  classification: string;
  ridge_count: number;
  confidence: number;
  status: string;
  image_id: number;
  processing_time: string;
}

// Real API helpers
const analysisService = {
  async getUserHistory() {
    const res = await api.get<{ history: AnalysisHistoryItem[]; total_count: number; status: string }>(
      '/api/user/analysis-history/'
    )
    return res.data
  },

  async deleteAnalysis(id: string) {
    return api.delete(`/api/analysis/${id}/delete/`)
  },

  async bulkDeleteAnalyses(ids: string[]) {
    return api.post('/api/user/analysis/bulk-delete/', { analysis_ids: ids })
  },

  async exportHistory() {
    const res = await api.get('/api/export/user/history/csv/', { responseType: 'blob' })
    return res.data as Blob
  },
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<AnalysisHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedClassification, setSelectedClassification] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Load history data on component mount
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const { history } = await analysisService.getUserHistory()
      setHistoryData(history)
    } catch (error) {
      console.error('Error loading history:', error)
      alert('Failed to load analysis history. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredData = historyData.filter((item) => {
    // Filter by search query
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

    // Filter by classification
    const matchesClassification = selectedClassification === "all" || item.classification === selectedClassification

    return matchesSearch && matchesStatus && matchesClassification
  })

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length && filteredData.length > 0) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map((item) => item.id))
    }
  }

  const handleExport = async () => {
    try {
      const blob = await analysisService.exportHistory()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'analysis_history.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting history:', error)
      alert('Failed to export history')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedItems.length} selected analyses?`)) {
      try {
        await analysisService.bulkDeleteAnalyses(selectedItems)
        alert(`${selectedItems.length} analyses deleted successfully`)
        setSelectedItems([])
        loadHistory() // Reload the history
      } catch (error) {
        console.error('Error deleting analyses:', error)
        alert('Failed to delete analyses')
      }
    }
  }

  const handleDeleteSingle = async (analysisId: string) => {
    if (confirm('Are you sure you want to delete this analysis?')) {
      try {
        await analysisService.deleteAnalysis(analysisId)
        alert('Analysis deleted successfully')
        loadHistory() // Reload the history
      } catch (error) {
        console.error('Error deleting analysis:', error)
        alert('Failed to delete analysis')
      }
    }
  }

  const handleViewAnalysis = (analysisId: string) => {
    // Navigate to analysis detail page
    window.location.href = `/dashboard/scan/${analysisId}`
  }

  const handleDownloadSingle = async (item: AnalysisHistoryItem) => {
    try {
      // Create a simple CSV for the single item
      const csvContent = [
        ['ID', 'Date', 'Classification', 'Ridge Count', 'Confidence', 'Status'].join(','),
        [
          item.id,
          new Date(item.date).toLocaleDateString(),
          item.classification,
          item.ridge_count,
          `${item.confidence}%`,
          item.status
        ].join(',')
      ].join('\n')
      
      // Download the CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analysis_${item.id}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading analysis:', error)
      alert('Failed to download analysis')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
      case "needs_review":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Needs Review</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Processing</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Analysis History</h2>
        <p className="text-muted-foreground">View and manage your fingerprint analysis history.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fingerprint Analyses</CardTitle>
          <CardDescription>A list of all your fingerprint analyses and their results.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID..."
                  className="pl-8 w-[200px] sm:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <div className="p-2 space-y-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Status</label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="needs_review">Needs Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Classification</label>
                      <Select value={selectedClassification} onValueChange={setSelectedClassification}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select classification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="Whorl">Whorl</SelectItem>
                          <SelectItem value="Loop">Loop</SelectItem>
                          <SelectItem value="Arch">Arch</SelectItem>
                          <SelectItem value="Tented Arch">Tented Arch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-1" disabled={selectedItems.length === 0} onClick={handleExport}>
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button variant="destructive" size="sm" className="h-9 gap-1" disabled={selectedItems.length === 0} onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Ridge Count</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <Loader2 className="animate-spin h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                          aria-label={`Select ${item.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(item.date), "MMM d, yyyy")}</span>
                          <span className="text-xs text-muted-foreground">{format(new Date(item.date), "h:mm a")}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.classification}</TableCell>
                      <TableCell>{item.ridge_count}</TableCell>
                      <TableCell>{item.confidence}%</TableCell>
                      <TableCell>
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewAnalysis(item.id)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadSingle(item)}>
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteSingle(item.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredData.length}</strong> of <strong>{historyData.length}</strong> results
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
