import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User, ArrowRight, Clock, Tag, ChevronRight } from "lucide-react"

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: "Advancements in Fingerprint Classification Using Machine Learning",
    excerpt:
      "Explore how machine learning is revolutionizing fingerprint classification with higher accuracy and faster processing times.",
    image: "/placeholder.svg?height=300&width=600",
    date: "March 28, 2025",
    author: "Dr. Jean Bosco Nsekuye",
    readTime: "8 min read",
    category: "Technology",
    tags: ["Machine Learning", "Fingerprint Analysis", "AI"],
  },
  {
    id: 2,
    title: "The History and Evolution of Fingerprint Identification",
    excerpt:
      "A comprehensive look at how fingerprint identification has evolved from ancient times to modern digital analysis.",
    image: "/placeholder.svg?height=300&width=600",
    date: "March 15, 2025",
    author: "Sarah Johnson",
    readTime: "12 min read",
    category: "History",
    tags: ["History", "Forensics", "Identification"],
  },
  {
    id: 3,
    title: "Best Practices for Fingerprint Image Capture",
    excerpt:
      "Learn the techniques and tools for capturing high-quality fingerprint images that yield the best analysis results.",
    image: "/placeholder.svg?height=300&width=600",
    date: "February 22, 2025",
    author: "Michael Chen",
    readTime: "6 min read",
    category: "Tutorials",
    tags: ["Best Practices", "Image Capture", "Quality"],
  },
  {
    id: 4,
    title: "Understanding Ridge Patterns: Loops, Whorls, and Arches",
    excerpt: "A detailed guide to the three main fingerprint pattern types and how to identify them in your analysis.",
    image: "/placeholder.svg?height=300&width=600",
    date: "February 10, 2025",
    author: "Dr. Emily Rodriguez",
    readTime: "10 min read",
    category: "Education",
    tags: ["Patterns", "Classification", "Forensics"],
  },
  {
    id: 5,
    title: "The Role of Fingerprint Analysis in Modern Forensics",
    excerpt:
      "Discover how fingerprint analysis continues to play a crucial role in criminal investigations despite new technologies.",
    image: "/placeholder.svg?height=300&width=600",
    date: "January 28, 2025",
    author: "Detective James Wilson",
    readTime: "9 min read",
    category: "Forensics",
    tags: ["Criminal Investigation", "Evidence", "Law Enforcement"],
  },
  {
    id: 6,
    title: "Privacy Concerns in Biometric Data Collection",
    excerpt:
      "An examination of the ethical and legal considerations surrounding the collection and storage of fingerprint data.",
    image: "/placeholder.svg?height=300&width=600",
    date: "January 15, 2025",
    author: "Lisa Patel, J.D.",
    readTime: "11 min read",
    category: "Privacy",
    tags: ["Ethics", "Data Protection", "Regulations"],
  },
]

// Sample categories
const categories = [
  { name: "Technology", count: 12 },
  { name: "Forensics", count: 8 },
  { name: "Tutorials", count: 15 },
  { name: "Research", count: 7 },
  { name: "Privacy", count: 5 },
  { name: "Education", count: 9 },
  { name: "History", count: 4 },
]

// Sample tags
const tags = [
  { name: "Machine Learning", count: 8 },
  { name: "Fingerprint Analysis", count: 15 },
  { name: "AI", count: 6 },
  { name: "Forensics", count: 12 },
  { name: "Best Practices", count: 7 },
  { name: "Classification", count: 9 },
  { name: "Privacy", count: 5 },
  { name: "Research", count: 8 },
  { name: "Biometrics", count: 10 },
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center animate-slide-up">
          <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
            Blog
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            DabaFing <span className="gradient-text">Blog</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Insights, tutorials, and updates on fingerprint analysis, classification, and the latest in biometric
            technology.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search articles..." className="pl-10 w-full" />
          </div>
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Post */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl animate-pulse-slow"></div>
          <Link href={`/blog/${blogPosts[0].id}`} className="block">
            <div className="relative rounded-2xl overflow-hidden hover-card-effect animate-float">
              <div className="relative aspect-[21/9] w-full">
                <Image
                  src={blogPosts[0].image || "/placeholder.svg"}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <Badge className="mb-4 bg-primary/80 text-primary-foreground hover:bg-primary/90">Featured</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{blogPosts[0].title}</h2>
                  <p className="text-white/80 mb-4 max-w-3xl">{blogPosts[0].excerpt}</p>
                  <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{blogPosts[0].date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{blogPosts[0].readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
          {blogPosts.slice(1).map((post, index) => (
            <Link href={`/blog/${post.id}`} key={post.id} className="block">
              <Card className="hover-card-effect animate-scale-in h-full overflow-hidden">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{post.category}</Badge>
                  <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <Button variant="outline" size="lg" className="gap-2">
            Load More Articles
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Categories */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link href={`/blog/category/${category.name.toLowerCase()}`} key={category.name} className="block">
                  <div
                    className="
flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span>{category.name}</span>
                    </div>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link href={`/blog/tag/${tag.name.toLowerCase().replace(/\s+/g, "-")}`} key={tag.name}>
                  <Badge variant="outline" className="hover:bg-primary/10 hover:text-primary transition-colors">
                    {tag.name} ({tag.count})
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground">
              Stay updated with the latest articles, tutorials, and news about fingerprint analysis.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email address" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            <Link href="/blog/archive" className="text-primary hover:underline flex items-center gap-1">
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 stagger-animation">
            {blogPosts.slice(0, 4).map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id} className="block">
                <Card className="hover-card-effect animate-scale-in h-full overflow-hidden">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-bold line-clamp-2">{post.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-blue-600/10 p-8 animate-gradient">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40 transition-all duration-300">
              Join Our Community
            </Badge>
            <h2 className="text-2xl font-bold">Want to Contribute to Our Blog?</h2>
            <p className="text-muted-foreground max-w-xl">
              Share your knowledge and expertise with our community. We welcome guest posts from experts in fingerprint
              analysis, biometrics, and related fields.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2 button-hover-effect">
                  Submit a Guest Post
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog/guidelines">
                <Button variant="outline" size="lg" className="gap-2">
                  View Submission Guidelines
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

