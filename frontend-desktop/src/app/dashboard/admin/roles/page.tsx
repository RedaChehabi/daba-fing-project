"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Shield, Users, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { roleService } from "@/services/api"

interface Role {
  id: number;
  role_name: string;
  description: string;
  access_level: number;
  can_provide_expert_feedback: boolean;
  can_manage_users: boolean;
  can_access_analytics: boolean;
  user_count: number;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const response = await roleService.listRoles()
      setRoles(response.roles)
    } catch (error) {
      console.error('Error loading roles:', error)
      alert('Failed to load roles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditRole = (role: Role) => {
    alert(`Edit role functionality for ${role.role_name} - This would open an edit form`)
  }

  const handleDeleteRole = async (role: Role) => {
    if (confirm(`Are you sure you want to delete the ${role.role_name} role?`)) {
      try {
        await roleService.deleteRole(role.id)
        alert('Role deleted successfully')
        loadRoles()
      } catch (error) {
        console.error('Error deleting role:', error)
        alert('Failed to delete role')
      }
    }
  }

  const handleCreateRole = () => {
    alert('Create role functionality - This would open a create form')
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/admin/users" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to User Management
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Role Management</h1>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>
          <Button onClick={handleCreateRole}>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Roles
          </CardTitle>
          <CardDescription>Configure roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading roles...
                    </TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No roles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="font-medium">{role.role_name}</div>
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Level {role.access_level}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{role.user_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.can_provide_expert_feedback && (
                            <Badge variant="secondary" className="text-xs">Expert Feedback</Badge>
                          )}
                          {role.can_manage_users && (
                            <Badge variant="secondary" className="text-xs">Manage Users</Badge>
                          )}
                          {role.can_access_analytics && (
                            <Badge variant="secondary" className="text-xs">Analytics</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditRole(role)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive" 
                            onClick={() => handleDeleteRole(role)}
                            disabled={['Admin', 'Expert', 'Regular'].includes(role.role_name)}
                          >
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
        </CardContent>
      </Card>
    </div>
  )
} 