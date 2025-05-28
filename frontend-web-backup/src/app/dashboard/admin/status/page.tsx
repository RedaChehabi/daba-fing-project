import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Server } from "lucide-react"

export default function SystemStatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Status</h1>
        <p className="text-muted-foreground">Monitor the health and performance of all system components.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operational</div>
            <p className="text-xs text-muted-foreground">Last checked 2 minutes ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-muted-foreground">99.9% uptime this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <div className="mt-2">
              <Progress value={68} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">458 GB of 750 GB used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Queue</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Tasks</div>
            <p className="text-xs text-muted-foreground">Est. completion: 25 minutes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Current status of all system components.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-3 p-4 text-sm font-medium">
                  <div>Service</div>
                  <div>Status</div>
                  <div>Metrics</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      service: "API Gateway",
                      status: "Operational",
                      metrics: "Response time: 24ms",
                    },
                    {
                      service: "Authentication Service",
                      status: "Operational",
                      metrics: "Load: Low",
                    },
                    {
                      service: "Database Cluster",
                      status: "Operational",
                      metrics: "CPU: 32%",
                    },
                    {
                      service: "Analysis Engine",
                      status: "Operational",
                      metrics: "Processing: 12 tasks",
                    },
                    {
                      service: "Storage Service",
                      status: "Degraded",
                      metrics: "I/O: Higher than normal",
                    },
                    {
                      service: "ML Processing",
                      status: "Operational",
                      metrics: "GPU: 45%",
                    },
                  ].map((component, i) => (
                    <div key={i} className="grid grid-cols-3 p-4 text-sm">
                      <div>{component.service}</div>
                      <div>
                        <Badge
                          variant={
                            component.status === "Operational"
                              ? "default"
                              : component.status === "Degraded"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {component.status}
                        </Badge>
                      </div>
                      <div>{component.metrics}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="servers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Server Status</CardTitle>
              <CardDescription>Individual server performance and health.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {[
                  {
                    name: "app-server-01",
                    status: "Online",
                    cpu: 24,
                    memory: 62,
                    network: "3.2 MB/s",
                  },
                  {
                    name: "app-server-02",
                    status: "Online",
                    cpu: 18,
                    memory: 48,
                    network: "2.8 MB/s",
                  },
                  {
                    name: "db-server-01",
                    status: "Online",
                    cpu: 32,
                    memory: 78,
                    network: "5.1 MB/s",
                  },
                  {
                    name: "ml-server-01",
                    status: "Online",
                    cpu: 45,
                    memory: 82,
                    network: "8.4 MB/s",
                  },
                  {
                    name: "storage-server-01",
                    status: "Warning",
                    cpu: 12,
                    memory: 35,
                    network: "14.2 MB/s",
                  },
                ].map((server, i) => (
                  <div key={i} className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2" />
                        <span className="font-medium">{server.name}</span>
                      </div>
                      <Badge
                        variant={
                          server.status === "Online"
                            ? "default"
                            : server.status === "Warning"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {server.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">CPU</p>
                        <div className="flex items-center">
                          <Progress value={server.cpu} className="h-2 mr-2" />
                          <span className="text-xs">{server.cpu}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Memory</p>
                        <div className="flex items-center">
                          <Progress value={server.memory} className="h-2 mr-2" />
                          <span className="text-xs">{server.memory}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Network</p>
                        <span className="text-xs">{server.network}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent warnings and critical alerts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Storage Server High I/O",
                    level: "Warning",
                    message: "Storage-server-01 has unusually high I/O operations.",
                    time: "15 minutes ago",
                  },
                  {
                    title: "Database CPU Spike",
                    level: "Warning",
                    message: "DB-server-01 experienced a CPU spike to 95% for 3 minutes.",
                    time: "2 hours ago",
                  },
                  {
                    title: "API Rate Limit Reached",
                    level: "Warning",
                    message: "Rate limiting activated for external API endpoints.",
                    time: "5 hours ago",
                  },
                  {
                    title: "Authentication Service Restart",
                    level: "Info",
                    message: "Auth service was automatically restarted after update.",
                    time: "1 day ago",
                  },
                  {
                    title: "ML Processing Error",
                    level: "Critical",
                    message: "ML model failed to process certain fingerprint types.",
                    time: "2 days ago",
                  },
                ].map((alert, i) => (
                  <div key={i} className="flex">
                    <div className="mr-4">
                      {alert.level === "Critical" ? (
                        <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        </div>
                      ) : alert.level === "Warning" ? (
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center dark:bg-amber-900/30">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{alert.title}</p>
                        <Badge
                          className="ml-2"
                          variant={
                            alert.level === "Critical"
                              ? "destructive"
                              : alert.level === "Warning"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {alert.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
