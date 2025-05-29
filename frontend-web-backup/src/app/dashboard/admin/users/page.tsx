"use client"

import { useState, useEffect } from "react"
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
import { adminService } from "@/services/api"

// Types for user data from API
interface ApiUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  status: string;
  last_active: string;
  join_date: string;
  analyses: number;
  date_joined: string;
  is_staff: boolean;
  is_superuser: boolean;
}

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
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("all-users")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "Regular"
  })

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminService.listUsers()
      setUsers(response.users)
    } catch (error: unknown) {
      console.error('Error loading users:', error)
      // Simple error handling without toast for now
      alert('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    // Filter by search query
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery.toLowerCase())

    // Filter by role
    const matchesRole = selectedRole === "all" || user.role === selectedRole

    // Filter by status
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedItems.length === users.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(users.map((user) => user.id))
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Admin</Badge>
      case "expert":
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Expert</Badge>
      case "regular":
        return <Badge variant="outline">Regular</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
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

  // Handler functions for user actions
  const handleViewUser = (user: ApiUser) => {
    // TODO: Implement view user details
    alert(`Viewing user: ${user.full_name}`)
  }

  const handleEditUser = (user: ApiUser) => {
    // TODO: Implement edit user
    alert(`Editing user: ${user.full_name}`)
  }

  const handleDeleteUser = async (user: ApiUser) => {
    if (confirm(`Are you sure you want to delete user ${user.full_name}?`)) {
      try {
        await adminService.deleteUser(user.id)
        alert('User deleted successfully')
        loadUsers() // Reload the users list
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user')
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedItems.length} selected users?`)) {
      try {
        await adminService.bulkDeleteUsers(selectedItems)
        alert(`${selectedItems.length} users deleted successfully`)
        setSelectedItems([])
        loadUsers() // Reload the users list
      } catch (error) {
        console.error('Error deleting users:', error)
        alert('Failed to delete users')
      }
    }
  }

  const handleCreateUser = async (userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role: string;
  }) => {
    try {
      await adminService.createUser(userData)
      alert('User created successfully')
      setIsAddUserOpen(false)
      loadUsers() // Reload the users list
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    }
  }

  const handleCreateUserSubmit = async () => {
    if (!newUserForm.username || !newUserForm.email || !newUserForm.password) {
      alert('Please fill in all required fields')
      return
    }

    try {
      await handleCreateUser(newUserForm)
      setNewUserForm({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        role: "Regular"
      })
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const handleExportUsers = async () => {
    try {
      const response = await adminService.listUsers()
      // Convert to CSV format
      const csvContent = [
        ['ID', 'Username', 'Email', 'Name', 'Role', 'Status', 'Join Date', 'Analyses'].join(','),
        ...response.users.map(user => [
          user.id,
          user.username,
          user.email,
          user.full_name,
          user.role,
          user.status,
          user.join_date,
          user.analyses
        ].join(','))
      ].join('\n')
      
      // Download the CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'users.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting users:', error)
      alert('Failed to export users')
    }
  }

  // Calculate user statistics
  const userStats = {
    byRole: {
      admin: users.filter(user => user.role.toLowerCase() === 'admin').length,
      expert: users.filter(user => user.role.toLowerCase() === 'expert').length,
      regular: users.filter(user => user.role.toLowerCase() === 'regular').length,
    },
    byStatus: {
      active: users.filter(user => user.status === 'active').length,
      inactive: users.filter(user => user.status === 'inactive').length,
      pending: users.filter(user => user.status === 'pending').length,
    },
    total: users.length
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
          <Button variant="outline" className="gap-2" onClick={handleExportUsers}>
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
                                <SelectItem value="regular">Regular</SelectItem>
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
                    <Button variant="outline" size="sm" className="h-9 gap-1" disabled={selectedItems.length === 0} onClick={handleBulkDelete}>
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
                            checked={selectedItems.length === users.length && users.length > 0}
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
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
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
                                aria-label={`Select ${user.full_name}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.full_name} />
                                  <AvatarFallback>
                                    {user.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.full_name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.last_active}</TableCell>
                            <TableCell>{user.join_date}</TableCell>
                            <TableCell>{user.analyses}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewUser(user)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditUser(user)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteUser(user)}>
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
                    Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
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
                      {users
                        .filter((user) => user.role === "admin")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.full_name} />
                                  <AvatarFallback>
                                    {user.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.full_name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.last_active}</TableCell>
                            <TableCell>{user.join_date}</TableCell>
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
                      {users
                        .filter((user) => user.role === "expert")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.full_name} />
                                  <AvatarFallback>
                                    {user.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.full_name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.last_active}</TableCell>
                            <TableCell>{user.join_date}</TableCell>
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
                      {users
                        .filter((user) => user.role === "regular")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.full_name} />
                                  <AvatarFallback>
                                    {user.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.full_name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.last_active}</TableCell>
                            <TableCell>{user.join_date}</TableCell>
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
                    <span className="text-sm font-bold">{userStats.byRole.admin}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(userStats.byRole.admin / userStats.total) * 100}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Expert</span>
                    </div>
                    <span className="text-sm font-bold">{userStats.byRole.expert}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(userStats.byRole.expert / userStats.total) * 100}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm">Regular</span>
                    </div>
                    <span className="text-sm font-bold">{userStats.byRole.regular}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gray-400" style={{ width: `${(userStats.byRole.regular / userStats.total) * 100}%` }}></div>
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
                    <span className="text-sm font-bold">{userStats.byStatus.active}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${(userStats.byStatus.active / userStats.total) * 100}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm">Inactive</span>
                    </div>
                    <span className="text-sm font-bold">{userStats.byStatus.inactive}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gray-400" style={{ width: `${(userStats.byStatus.inactive / userStats.total) * 100}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="text-sm font-bold">{userStats.byStatus.pending}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${(userStats.byStatus.pending / userStats.total) * 100}%` }}></div>
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
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => window.location.href = '/dashboard/admin/roles'}>
                    <User className="h-4 w-4" />
                    Manage Roles
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => window.location.href = '/dashboard/admin/permissions'}>
                    <Shield className="h-4 w-4" />
                    Permission Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => window.location.href = '/dashboard/admin/user-groups'}>
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
              <Label htmlFor="username" className="text-right">
                Username *
              </Label>
              <Input 
                id="username" 
                placeholder="Username" 
                className="col-span-3" 
                value={newUserForm.username}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input 
                id="first_name" 
                placeholder="First name" 
                className="col-span-3" 
                value={newUserForm.first_name}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input 
                id="last_name" 
                placeholder="Last name" 
                className="col-span-3" 
                value={newUserForm.last_name}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email *
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Email address" 
                className="col-span-3" 
                value={newUserForm.email}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password *
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Password" 
                className="col-span-3" 
                value={newUserForm.password}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreateUserSubmit}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
