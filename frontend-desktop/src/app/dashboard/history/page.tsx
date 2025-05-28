"use client"

import { useState } from "react"
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
import { Search, Filter, Download, Eye, Trash2, Calendar, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

// Mock data for history
const mockHistoryData = [
  {
    id: "FP-2023-127",
    date: new Date(2023, 5, 15, 10, 42),
    classification: "Whorl",
    ridgeCount: 24,
    confidence: 96.7,
    status: "completed",
  },
  {
    id: "FP-2023-126",
    date: new Date(2023, 5, 15, 9, 15),
    classification: "Loop",
    ridgeCount: 18,
    confidence: 94.2,
    status: "completed",
  },
  {
    id: "FP-2023-125",
    date: new Date(2023, 5, 14, 16, 30),
    classification: "Arch",
    ridgeCount: 15,
    confidence: 92.8,
    status: "completed",
  },
  {
    id: "FP-2023-124",
    date: new Date(2023, 5, 14, 14, 15),
    classification: "Tented Arch",
    ridgeCount: 16,
    confidence: 89.5,
    status: "completed",
  },
  {
    id: "FP-2023-123",
    date: new Date(2023, 5, 13, 11, 45),
    classification: "Loop",
    ridgeCount: 20,
    confidence: 95.1,
    status: "completed",
  },
  {
    id: "FP-2023-122",
    date: new Date(2023, 5, 13, 9, 30),
    classification: "Whorl",
    ridgeCount: 22,
    confidence: 97.3,
    status: "completed",
  },
  {
    id: "FP-2023-121",
    date: new Date(2023, 5, 12, 15, 20),
    classification: "Arch",
    ridgeCount: 14,
    confidence: 91.8,
    status: "needs_review",
  },
  {
    id: "FP-2023-120",
    date: new Date(2023, 5, 12, 13, 10),
    classification: "Loop",
    ridgeCount: 19,
    confidence: 88.5,
    status: "needs_review",
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedClassification, setSelectedClassification] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const filteredData = mockHistoryData.filter((item) => {
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
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map((item) => item.id))
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
              <Button variant="outline" size="sm" className="h-9 gap-1" disabled={selectedItems.length === 0}>
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button variant="destructive" size="sm" className="h-9 gap-1" disabled={selectedItems.length === 0}>
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
                {filteredData.length === 0 ? (
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
                          <span>{format(item.date, "MMM d, yyyy")}</span>
                          <span className="text-xs text-muted-foreground">{format(item.date, "h:mm a")}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.classification}</TableCell>
                      <TableCell>{item.ridgeCount}</TableCell>
                      <TableCell>{item.confidence}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === "completed" ? "default" : "secondary"}
                          className={
                            item.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {item.status === "completed" ? "Completed" : "Needs Review"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
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
              Showing <strong>{filteredData.length}</strong> of <strong>{mockHistoryData.length}</strong> results
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
