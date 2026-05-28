import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Apple, TrendingUp, AlertTriangle, DollarSign, ShoppingCart, ArrowUp, ArrowDown, Calendar, Filter, CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type PendingOrder = {
  id: string;
  supplier: string;
  createdBy: string;
  date: string;
  items: number;
  total: number;
  expectedDelivery: string;
};

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedMainCategory, setSelectedMainCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [chartKey, setChartKey] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);
  const [userRole, setUserRole] = useState<string>("staff");

  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [selectedMainCategory, selectedSubCategory]);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "staff";
    setUserRole(role);
  }, []);

  // Hierarchical category structure
  const categoryHierarchy: { [key: string]: string[] } = {
    "Fruits": ["Citrus Fruits", "Berries", "Tropical Fruits", "Stone Fruits", "Melons"],
    "Vegetables": ["Leafy Greens", "Root Vegetables", "Cruciferous", "Nightshades", "Squash"],
    "Meat": ["Poultry", "Beef", "Pork", "Lamb", "Game Meat"],
    "Seafood": ["Fish", "Shellfish", "Crustaceans", "Mollusks", "Canned Seafood"],
    "Dairy": ["Milk Products", "Cheese", "Yogurt", "Butter & Cream", "Eggs"],
    "Bakery": ["Bread", "Pastries", "Cakes", "Cookies", "Muffins"],
    "Oils & Condiments": ["Cooking Oils", "Vinegars", "Sauces", "Spices", "Seasonings"],
  };

  const mainCategories = Object.keys(categoryHierarchy);
  const currentSubCategories = selectedMainCategory !== "all" && selectedMainCategory in categoryHierarchy
    ? categoryHierarchy[selectedMainCategory]
    : [];

  const handleMainCategoryChange = (category: string) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory("all");
  };

  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([
    {
      id: "PO-2024-001",
      supplier: "Fresh Farms Co.",
      createdBy: "John Smith",
      date: "2024-05-26",
      items: 3,
      total: 1919.10,
      expectedDelivery: "2024-05-29",
    },
    {
      id: "PO-2024-006",
      supplier: "Ocean Harvest",
      createdBy: "Sarah Johnson",
      date: "2024-05-26",
      items: 2,
      total: 1450.50,
      expectedDelivery: "2024-05-30",
    },
    {
      id: "PO-2024-007",
      supplier: "Local Dairy Inc.",
      createdBy: "Mike Chen",
      date: "2024-05-27",
      items: 4,
      total: 2340.75,
      expectedDelivery: "2024-05-31",
    },
  ]);

  const handleApproveOrder = (orderId: string) => {
    setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
    setShowApprovalModal(false);
    setSelectedOrder(null);
    // In a real app, this would send an API request to approve the order
  };

  const handleRejectOrder = (orderId: string) => {
    setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
    setShowApprovalModal(false);
    setSelectedOrder(null);
    // In a real app, this would send an API request to reject the order
  };

  const handleViewOrder = (order: PendingOrder) => {
    setSelectedOrder(order);
    setShowApprovalModal(true);
  };

  const stats = [
    {
      title: "Total Food Items",
      value: "842",
      change: "+12.5%",
      trend: "up",
      icon: Apple,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Expiring Soon",
      value: "18",
      change: "-8.2%",
      trend: "down",
      icon: Calendar,
      color: "from-orange-500 to-yellow-500",
    },
    {
      title: "Total Value",
      value: "₱84,590",
      change: "+18.3%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-lime-500",
    },
    {
      title: userRole === "admin" ? "Pending Approvals" : "My Orders",
      value: userRole === "admin" ? pendingOrders.length.toString() : "5",
      change: "+5.1%",
      trend: "up",
      icon: userRole === "admin" ? Clock : ShoppingCart,
      color: "from-amber-500 to-orange-500",
    },
  ];

  const salesData = [
    { month: "Jan", sales: 4200 },
    { month: "Feb", sales: 3800 },
    { month: "Mar", sales: 5100 },
    { month: "Apr", sales: 4600 },
    { month: "May", sales: 6200 },
    { month: "Jun", sales: 5800 },
  ];

  const allInventoryData = [
    { id: "fruits-berries", category: "Fruits", subCategory: "Berries", value: 85 },
    { id: "fruits-citrus", category: "Fruits", subCategory: "Citrus Fruits", value: 65 },
    { id: "fruits-tropical", category: "Fruits", subCategory: "Tropical Fruits", value: 70 },
    { id: "vegetables-leafy", category: "Vegetables", subCategory: "Leafy Greens", value: 90 },
    { id: "vegetables-root", category: "Vegetables", subCategory: "Root Vegetables", value: 95 },
    { id: "dairy-cheese", category: "Dairy", subCategory: "Cheese", value: 60 },
    { id: "dairy-yogurt", category: "Dairy", subCategory: "Yogurt", value: 50 },
    { id: "dairy-milk", category: "Dairy", subCategory: "Milk Products", value: 40 },
    { id: "meat-poultry", category: "Meat", subCategory: "Poultry", value: 72 },
    { id: "meat-beef", category: "Meat", subCategory: "Beef", value: 48 },
    { id: "seafood-fish", category: "Seafood", subCategory: "Fish", value: 55 },
    { id: "seafood-shellfish", category: "Seafood", subCategory: "Shellfish", value: 37 },
    { id: "bakery-bread", category: "Bakery", subCategory: "Bread", value: 60 },
    { id: "bakery-pastries", category: "Bakery", subCategory: "Pastries", value: 35 },
    { id: "oils-cooking", category: "Oils & Condiments", subCategory: "Cooking Oils", value: 30 },
    { id: "oils-sauces", category: "Oils & Condiments", subCategory: "Sauces", value: 20 },
  ];

  // Filter data based on selected categories
  const inventoryData = allInventoryData.filter(item => {
    const matchesMain = selectedMainCategory === "all" || item.category === selectedMainCategory;
    const matchesSub = selectedSubCategory === "all" || item.subCategory === selectedSubCategory;
    return matchesMain && matchesSub;
  });

  // Aggregate for pie chart display
  const aggregatedData = inventoryData.reduce((acc: any[], item) => {
    const existing = acc.find(a => a.category === item.category);
    if (existing) {
      existing.value += item.value;
    } else {
      acc.push({
        id: item.category.toLowerCase().replace(/\s+/g, '-'),
        category: item.category,
        value: item.value
      });
    }
    return acc;
  }, []);

  const COLORS = ["#ea580c", "#65a30d", "#eab308", "#f59e0b", "#dc2626", "#854d0e"];

  const recentActivity = [
    { id: 1, action: "New item added", item: "Fresh Salmon Fillet", time: "2 hours ago", type: "add" },
    { id: 2, action: "Stock updated", item: "Organic Strawberries", time: "4 hours ago", type: "update" },
    { id: 3, action: "Expiring soon", item: "Romaine Lettuce", time: "6 hours ago", type: "alert" },
    { id: 4, action: "Order received", item: "Greek Yogurt", time: "8 hours ago", type: "order" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          </div>

          {/* Category Filters */}
          <div className="flex gap-6">
            <div className="relative">
              <Filter className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedMainCategory}
                onChange={(e) => handleMainCategoryChange(e.target.value)}
                className="pl-6 pr-4 py-2 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer min-w-[120px] text-sm"
              >
                <option value="all">All Categories</option>
                {mainCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {selectedMainCategory !== "all" && (
              <div className="relative">
                <Filter className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="pl-6 pr-4 py-2 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer min-w-[120px] text-sm"
                >
                  <option value="all">All {selectedMainCategory}</option>
                  {currentSubCategories.map((subCat) => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-1.5 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={`stat-${index}`} className="bg-card rounded-2xl p-2 shadow-sm border border-border hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-8">
                <div className={`w-6 h-6 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-0.5 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm mb-2">{stat.title}</h3>
              <p className="text-sm font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-8">
        {/* Sales Trend Chart */}
        <div className="col-span-2 bg-card rounded-2xl p-2 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground">Sales Overview</h2>
            </div>
            <div className="flex items-center gap-0.5 text-green-600 bg-green-50 px-1.5 py-2 rounded-xl">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">+24.5%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={salesData} key="sales-line-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" key="grid" />
              <XAxis dataKey="month" stroke="#64748b" key="x-axis" tick={{ fontSize: 8 }} />
              <YAxis stroke="#64748b" key="y-axis" tick={{ fontSize: 8 }} />
              <Tooltip
                key="line-tooltip"
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '9px',
                  padding: '4px 6px'
                }}
              />
              <Line
                key="sales-line"
                type="monotone"
                dataKey="sales"
                stroke="#0ea5e9"
                strokeWidth={1.5}
                dot={{ fill: '#0ea5e9', r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Distribution */}
        <div className="bg-card rounded-2xl p-2 shadow-sm border border-border">
          <h2 className="text-xl font-bold text-foreground mb-8">Inventory</h2>
          <ResponsiveContainer width="100%" height={90} key={`pie-container-${chartKey}`}>
            <PieChart key={`piechart-${chartKey}`}>
              <Pie
                key={`pie-slice-${chartKey}`}
                data={aggregatedData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={38}
                paddingAngle={2}
                dataKey="value"
                nameKey="category"
                isAnimationActive={false}
                onClick={(data) => navigate(`/category?category=${encodeURIComponent(data.category)}&sub=all`)}
                cursor="pointer"
              >
                {aggregatedData.map((entry, index) => (
                  <Cell key={`cell-${chartKey}-${index}-${entry.category}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                key={`pie-tooltip-${chartKey}`}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '9px',
                  padding: '4px 6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1.5 space-y-0">
            {aggregatedData.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm p-0.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/category?category=${encodeURIComponent(item.category)}&sub=all`)}
              >
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-foreground">{item.category}</span>
                </div>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Info Banner */}
      {userRole === "staff" && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-1">Staff Account - Limited Access</h3>
              <p className="text-sm text-blue-800">
                You have access to core inventory operations. Purchase orders you create will require admin approval before processing.
                User management and approval features are restricted to admin accounts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Purchase Order Approvals - Admin Only */}
      {userRole === "admin" && pendingOrders.length > 0 && (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Purchase Orders Awaiting Approval</h2>
                <p className="text-sm text-muted-foreground">{pendingOrders.length} order{pendingOrders.length !== 1 ? 's' : ''} pending your review</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-amber-200">
                    <ShoppingCart className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{order.id}</h3>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-xs font-medium">
                        Pending Approval
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Supplier: <span className="font-medium text-foreground">{order.supplier}</span> •
                      Created by: <span className="font-medium text-foreground">{order.createdBy}</span> •
                      {order.items} item{order.items !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expected Delivery: {new Date(order.expectedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-bold text-foreground">₱{order.total.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Review
                  </button>
                  <button
                    onClick={() => handleApproveOrder(order.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectOrder(order.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-card rounded-2xl p-2 shadow-sm border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
        <div className="space-y-0.5">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-1.5 p-1 rounded hover:bg-muted/50 transition-colors">
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                activity.type === 'add' ? 'bg-green-100 text-green-600' :
                activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'alert' ? 'bg-orange-100 text-orange-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                <Apple className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium text-sm truncate">{activity.action}: {activity.item}</p>
              </div>
              <span className="text-muted-foreground text-[8px] whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowApprovalModal(false)}>
          <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Review Purchase Order</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Supplier</p>
                  <p className="font-semibold text-foreground">{selectedOrder.supplier}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Created By</p>
                  <p className="font-semibold text-foreground">{selectedOrder.createdBy}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Order Date</p>
                  <p className="font-semibold text-foreground">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Expected Delivery</p>
                  <p className="font-semibold text-foreground">{new Date(selectedOrder.expectedDelivery).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-900 font-medium">Total Items</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedOrder.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-900 font-medium">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-900">₱{selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <p className="text-sm font-semibold text-amber-900">Action Required</p>
                </div>
                <p className="text-sm text-amber-800">
                  This purchase order was created by <strong>{selectedOrder.createdBy}</strong> and requires your approval before processing.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => handleRejectOrder(selectedOrder.id)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject Order
              </button>
              <button
                onClick={() => handleApproveOrder(selectedOrder.id)}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
