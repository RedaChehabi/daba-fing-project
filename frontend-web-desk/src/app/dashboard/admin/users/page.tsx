"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Edit,
  UserPlus,
  ChevronDown,
  CheckCircle2,
  Shield,
  User,
  Users,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data for users
const mockUsers = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    lastActive: "2 minutes ago",
    joinDate: "Jan 15, 2023",
    analyses: 127,
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "expert",
    status: "active",
    lastActive: "1 hour ago",
    joinDate: "Feb 3, 2023",
    analyses: 98,
  },
  {
    id: "USR-003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "user",
    status: "active",
    lastActive: "3 hours ago",
    joinDate: "Mar 12, 2023",
    analyses: 45,
  },
  {
    id: "USR-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "expert",
    status: "inactive",
    lastActive: "2 days ago",
    joinDate: "Apr 5, 2023",
    analyses: 72,
  },
  {
    id: "USR-005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "user",
    status: "pending",
    lastActive: "Never",
    joinDate: "May 20, 2023",
    analyses: 0,
  },
  {
    id: "USR-006",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    role: "user",
    status: "active",
    lastActive: "5 hours ago",
    joinDate: "Jun 8, 2023",
    analyses: 31,
  },
  {
    id: "USR-007",
    name: "David Miller",
    email: "david.miller@example.com",
    role: "user",
    status: "active",
    lastActive: "1 day ago",
    joinDate: "Jul 17, 2023",
    analyses: 24,
  },
  {
    id: "USR-008",
    name: "Lisa Taylor",
    email: "lisa.taylor@example.com",
    role: "expert",
    status: "active",
    lastActive: "4 hours ago",
    joinDate: "Aug 22, 2023",
    analyses: 86,
  },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all-users")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  const filteredUsers = mockUsers.filter((user) => {
    // Filter by search query
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by role
    const matchesRole = selectedRole === "all" || user.role === selectedRole

    // Filter by status
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
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
    if (selectedItems.length === filteredUsers.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredUsers.map((user) => user.id))
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Admin</Badge>
      case "expert":
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Expert</Badge>
      default:
        return <Badge variant="outline">User</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactive</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="gap-2 button-hover-effect" onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger
                value="all-users"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Users
              </TabsTrigger>
              <TabsTrigger
                value="admins"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Admins
              </TabsTrigger>
              <TabsTrigger
                value="experts"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Experts
              </TabsTrigger>
              <TabsTrigger
                value="standard"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Standard Users
              </TabsTrigger>
            </TabsList>
            <div className="hidden md:flex items-center gap-2">
              <div className="text-sm text-muted-foreground">{filteredUsers.length} users</div>
            </div>
          </div>

          <TabsContent value="all-users" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="pl-8 w-full sm:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
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
                            <label className="text-xs font-medium">Role</label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Status</label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" className="h-9 gap-1" disabled={selectedItems.length === 0}>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox
                            checked={selectedItems.length === filteredUsers.length && filteredUsers.length > 0}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                          />
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Analyses</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(user.id)}
                                onCheckedChange={() => handleSelectItem(user.id)}
                                aria-label={`Select ${user.name}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                                  <AvatarFallback>
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.lastActive}</TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell>{user.analyses}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
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

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{filteredUsers.length}</strong> of <strong>{mockUsers.length}</strong> users
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
          </TabsContent>

          <TabsContent value="admins" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Users with administrative privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers
                        .filter((user) => user.role === "admin")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                                  <AvatarFallback>
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.lastActive}</TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expert Users</CardTitle>
                <CardDescription>Users with expert privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Analyses</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers
                        .filter((user) => user.role === "expert")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                                  <AvatarFallback>
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.lastActive}</TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell>{user.analyses}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="standard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Standard Users</CardTitle>
                <CardDescription>Regular users of the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Analyses</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers
                        .filter((user) => user.role === "user")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                                  <AvatarFallback>
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.lastActive}</TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell>{user.analyses}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* User Statistics */}
      <motion.div variants={itemVariants}>
        <Card className="hover-card-effect">
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>Overview of user activity and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 stagger-animation">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">User Distribution</h3>
                    <p className="text-xs text-muted-foreground">By role</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                      <span className="text-sm">Admin</span>
                    </div>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "12.5%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Expert</span>
                    </div>
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: "37.5%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm">User</span>
                    </div>
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gray-400" style={{ width: "50%" }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">User Status</h3>
                    <p className="text-xs text-muted-foreground">Account status</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Active</span>
                    </div>
                    <span className="text-sm font-bold">6</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm">Inactive</span>
                    </div>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gray-400" style={{ width: "12.5%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: "12.5%" }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Access Control</h3>
                    <p className="text-xs text-muted-foreground">Permission management</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Manage Roles
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Shield className="h-4 w-4" />
                    Permission Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Users className="h-4 w-4" />
                    User Groups
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. They will receive an email to set their password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" placeholder="Full name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" placeholder="Email address" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select defaultValue="user">
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setIsAddUserOpen(false)}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
