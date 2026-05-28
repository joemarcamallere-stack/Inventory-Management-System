import { useState } from "react";
import { Package, Search, TrendingDown, TrendingUp, AlertCircle, RefreshCw, Download, BarChart3, Calendar, Clock } from "lucide-react";

type StockItem = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitCost: number;
  totalValue: number;
  status: "healthy" | "low" | "critical" | "overstock";
  turnoverRate: number;
  classification: "A" | "B" | "C";
  expiry?: string;
  location?: string;
};

type ExpiryItem = {
  id: string;
  name: string;
  category: string;
  sku: string;
  location: string;
  expiry: string;
  stock: number;
  daysUntilExpiry: number;
};

type ViewType = "control" | "low-stock" | "expiring";

export function StockControl() {
  const [viewType, setViewType] = useState<ViewType>("control");
  const [searchQuery, setSearchQuery] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stockItems: StockItem[] = [
    { id: "SKU-001", name: "Fresh Salmon Fillet", category: "Seafood", currentStock: 45, minStock: 20, maxStock: 100, reorderPoint: 30, unitCost: 24.99, totalValue: 1124.55, status: "healthy", turnoverRate: 8.5, classification: "A", expiry: "2024-05-28", location: "Cold Storage A" },
    { id: "SKU-002", name: "Organic Chicken Breast", category: "Meat", currentStock: 15, minStock: 25, maxStock: 80, reorderPoint: 30, unitCost: 12.99, totalValue: 194.85, status: "low", turnoverRate: 12.3, classification: "A", expiry: "2024-05-29", location: "Cold Storage B" },
    { id: "SKU-003", name: "Greek Yogurt 32oz", category: "Dairy", currentStock: 8, minStock: 15, maxStock: 60, reorderPoint: 20, unitCost: 6.99, totalValue: 55.92, status: "critical", turnoverRate: 15.2, classification: "A", expiry: "2024-05-27", location: "Dairy Section" },
    { id: "SKU-004", name: "Strawberries 1lb", category: "Fruits", currentStock: 95, minStock: 20, maxStock: 70, reorderPoint: 25, unitCost: 4.99, totalValue: 474.05, status: "overstock", turnoverRate: 9.1, classification: "B", expiry: "2024-05-29", location: "Produce Section" },
    { id: "SKU-005", name: "Aged Cheddar Cheese", category: "Dairy", currentStock: 42, minStock: 15, maxStock: 50, reorderPoint: 20, unitCost: 8.99, totalValue: 377.58, status: "healthy", turnoverRate: 6.7, classification: "B", expiry: "2024-05-30", location: "Dairy Section" },
    { id: "SKU-006", name: "Extra Virgin Olive Oil", category: "Oils", currentStock: 28, minStock: 10, maxStock: 40, reorderPoint: 15, unitCost: 18.99, totalValue: 531.72, status: "healthy", turnoverRate: 4.2, classification: "C", expiry: "2025-12-31", location: "Dry Storage" },
    { id: "SKU-007", name: "Sourdough Bread", category: "Bakery", currentStock: 0, minStock: 15, maxStock: 40, reorderPoint: 20, unitCost: 5.99, totalValue: 0, status: "critical", turnoverRate: 18.5, classification: "A", expiry: "2024-05-26", location: "Bakery Shelf" },
    { id: "SKU-008", name: "Romaine Lettuce", category: "Vegetables", currentStock: 3, minStock: 20, maxStock: 50, reorderPoint: 25, unitCost: 3.49, totalValue: 10.47, status: "critical", turnoverRate: 14.2, classification: "B", expiry: "2024-05-27", location: "Produce Section" },
  ];

  const expiryItems: ExpiryItem[] = [
    { id: "SKU-007", name: "Sourdough Bread", category: "Bakery", sku: "SKU-007", location: "Bakery Shelf", expiry: "2024-05-26", stock: 0, daysUntilExpiry: 0 },
    { id: "SKU-008", name: "Romaine Lettuce", category: "Vegetables", sku: "SKU-008", location: "Produce Section", expiry: "2024-05-27", stock: 3, daysUntilExpiry: 1 },
    { id: "SKU-003", name: "Greek Yogurt 32oz", category: "Dairy", sku: "SKU-003", location: "Dairy Section", expiry: "2024-05-27", stock: 8, daysUntilExpiry: 1 },
    { id: "SKU-001", name: "Fresh Salmon Fillet", category: "Seafood", sku: "SKU-001", location: "Cold Storage A", expiry: "2024-05-28", stock: 45, daysUntilExpiry: 2 },
    { id: "SKU-002", name: "Organic Chicken Breast", category: "Meat", sku: "SKU-002", location: "Cold Storage B", expiry: "2024-05-29", stock: 15, daysUntilExpiry: 3 },
    { id: "SKU-004", name: "Strawberries 1lb", category: "Fruits", sku: "SKU-004", location: "Produce Section", expiry: "2024-05-29", stock: 95, daysUntilExpiry: 3 },
  ];

  const lowStockItems = stockItems.filter(item => item.status === "low" || item.status === "critical");

  const filteredControlItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClassification = classificationFilter === "all" || item.classification === classificationFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesClassification && matchesStatus;
  });

  const filteredLowStockItems = lowStockItems.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredExpiryItems = expiryItems.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.sku.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      healthy: "bg-green-100 text-green-700 border-green-200",
      low: "bg-yellow-100 text-yellow-700 border-yellow-200",
      critical: "bg-red-100 text-red-700 border-red-200",
      overstock: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getClassificationBadge = (classification: string) => {
    const styles = {
      A: "bg-purple-100 text-purple-700 border-purple-200",
      B: "bg-blue-100 text-blue-700 border-blue-200",
      C: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[classification as keyof typeof styles]}`}>
        {classification}
      </span>
    );
  };

  const getExpiryStatus = (daysUntilExpiry: number) => {
    if (daysUntilExpiry === 0) {
      return {
        status: "expired",
        label: "Expired Today",
        color: "bg-black",
        textColor: "text-white",
        borderColor: "border-black",
      };
    } else if (daysUntilExpiry === 1) {
      return {
        status: "critical",
        label: "Expires Tomorrow",
        color: "bg-red-500",
        textColor: "text-white",
        borderColor: "border-red-500",
      };
    } else if (daysUntilExpiry <= 3) {
      return {
        status: "urgent",
        label: `Expires in ${daysUntilExpiry} days`,
        color: "bg-orange-500",
        textColor: "text-white",
        borderColor: "border-orange-500",
      };
    } else if (daysUntilExpiry <= 7) {
      return {
        status: "warning",
        label: `Expires in ${daysUntilExpiry} days`,
        color: "bg-yellow-500",
        textColor: "text-white",
        borderColor: "border-yellow-500",
      };
    } else {
      return {
        status: "good",
        label: `Expires in ${daysUntilExpiry} days`,
        color: "bg-green-500",
        textColor: "text-white",
        borderColor: "border-green-500",
      };
    }
  };

  const stats = [
    { label: "Total Stock Value", value: `₱${stockItems.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}`, icon: Package, color: "from-blue-500 to-cyan-500" },
    { label: "Critical Items", value: stockItems.filter(i => i.status === "critical").length, icon: AlertCircle, color: "from-red-500 to-rose-500" },
    { label: "Low Stock Items", value: stockItems.filter(i => i.status === "low").length, icon: TrendingDown, color: "from-yellow-500 to-orange-500" },
    { label: "Expiring Soon", value: expiryItems.filter(i => i.daysUntilExpiry <= 3).length, icon: Calendar, color: "from-orange-500 to-red-500" },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      // In a real app, this would fetch fresh data from the backend
      alert("Stock data refreshed successfully!");
    }, 1000);
  };

  const handleExportReport = () => {
    let csvContent = "";
    let filename = "";

    if (viewType === "control") {
      // Export Stock Control data
      csvContent = "SKU,Product Name,Category,Current Stock,Min Stock,Max Stock,Reorder Point,Unit Cost,Total Value,Status,Turnover Rate,Classification,Location\n";

      filteredControlItems.forEach(item => {
        csvContent += `${item.id},${item.name},${item.category},${item.currentStock},${item.minStock},${item.maxStock},${item.reorderPoint},${item.unitCost.toFixed(2)},${item.totalValue.toFixed(2)},${item.status},${item.turnoverRate},${item.classification},${item.location}\n`;
      });

      filename = "stock_control_report.csv";
    } else if (viewType === "low-stock") {
      // Export Low Stock Alerts
      csvContent = "SKU,Product Name,Category,Current Stock,Min Stock,Reorder Point,Status,Location\n";

      filteredLowStockItems.forEach(item => {
        csvContent += `${item.id},${item.name},${item.category},${item.currentStock},${item.minStock},${item.reorderPoint},${item.status},${item.location}\n`;
      });

      filename = "low_stock_alerts.csv";
    } else if (viewType === "expiring") {
      // Export Expiring Items
      csvContent = "SKU,Product Name,Category,Expiry Date,Days Until Expiry,Current Stock,Location\n";

      filteredExpiryItems.forEach(item => {
        csvContent += `${item.sku},${item.name},${item.category},${item.expiry},${item.daysUntilExpiry},${item.stock},${item.location}\n`;
      });

      filename = "expiring_items_report.csv";
    }

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Stock Control & Alerts</h1>
          <p className="text-muted-foreground">Monitor stock levels, alerts, reorder points, and inventory valuation</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-6 py-3 bg-muted text-foreground rounded-2xl hover:bg-muted/80 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={handleExportReport}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 bg-muted rounded-2xl p-1 mb-6 w-fit">
        <button
          onClick={() => setViewType("control")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            viewType === "control"
              ? "bg-primary text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Stock Control
        </button>
        <button
          onClick={() => setViewType("low-stock")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            viewType === "low-stock"
              ? "bg-primary text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="w-4 h-4" />
          Low Stock Alerts
        </button>
        <button
          onClick={() => setViewType("expiring")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            viewType === "expiring"
              ? "bg-primary text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Expiring Items
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          {viewType === "control" && (
            <>
              <select
                value={classificationFilter}
                onChange={(e) => setClassificationFilter(e.target.value)}
                className="px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Classifications</option>
                <option value="A">Class A (High Value)</option>
                <option value="B">Class B (Medium Value)</option>
                <option value="C">Class C (Low Value)</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="low">Low Stock</option>
                <option value="critical">Critical</option>
                <option value="overstock">Overstock</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Content Based on View Type */}
      {viewType === "control" && (
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Product Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Category</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-foreground">Current Stock</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-foreground">Reorder Point</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-foreground">Unit Cost</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-foreground">Total Value</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-foreground">Turnover</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-foreground">ABC</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredControlItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-primary">{item.id}</span>
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-foreground">{item.currentStock}</span>
                        <span className="text-xs text-muted-foreground">Min: {item.minStock} | Max: {item.maxStock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground">{item.reorderPoint}</td>
                    <td className="px-6 py-4 text-right text-foreground">₱{item.unitCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-medium text-foreground">₱{item.totalValue.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        {item.turnoverRate}x
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{getClassificationBadge(item.classification)}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewType === "low-stock" && (
        <div className="space-y-4">
          {filteredLowStockItems.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center shadow-sm border border-border">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Low Stock Items</h3>
              <p className="text-muted-foreground">All items are well-stocked!</p>
            </div>
          ) : (
            filteredLowStockItems.map((item) => (
              <div
                key={item.id}
                className={`bg-card rounded-2xl p-6 shadow-sm border-2 ${
                  item.status === "critical" ? "border-red-300" : "border-yellow-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                      {getStatusBadge(item.status)}
                      {getClassificationBadge(item.classification)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">SKU</p>
                        <p className="text-sm font-medium text-foreground">{item.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Category</p>
                        <p className="text-sm font-medium text-foreground">{item.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Current Stock</p>
                        <p className="text-sm font-bold text-red-600">{item.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Min Stock</p>
                        <p className="text-sm font-medium text-foreground">{item.minStock}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Reorder Point</p>
                        <p className="text-sm font-medium text-foreground">{item.reorderPoint}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                        <p className="text-sm font-medium text-foreground">{item.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Unit Cost</p>
                        <p className="text-sm font-medium text-foreground">₱{item.unitCost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                        <p className="text-sm font-bold text-foreground">₱{item.totalValue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <AlertCircle className={`w-8 h-8 ${item.status === "critical" ? "text-red-500" : "text-yellow-500"}`} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewType === "expiring" && (
        <div className="space-y-4">
          {filteredExpiryItems.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center shadow-sm border border-border">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Expiring Items</h3>
              <p className="text-muted-foreground">All items are fresh!</p>
            </div>
          ) : (
            filteredExpiryItems.map((item) => {
              const expiryStatus = getExpiryStatus(item.daysUntilExpiry);
              return (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl p-6 shadow-sm border-2 border-border hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${expiryStatus.color} ${expiryStatus.textColor}`}>
                          {expiryStatus.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">SKU</p>
                          <p className="text-sm font-medium text-foreground">{item.sku}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Category</p>
                          <p className="text-sm font-medium text-foreground">{item.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Stock Remaining</p>
                          <p className="text-sm font-bold text-foreground">{item.stock}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Location</p>
                          <p className="text-sm font-medium text-foreground">{item.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                          <p className="text-sm font-medium text-foreground">{item.expiry}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Days Until Expiry</p>
                          <p className={`text-sm font-bold ${item.daysUntilExpiry <= 1 ? "text-red-600" : item.daysUntilExpiry <= 3 ? "text-orange-600" : "text-foreground"}`}>
                            {item.daysUntilExpiry === 0 ? "EXPIRED" : `${item.daysUntilExpiry} days`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Clock className={`w-8 h-8 ${item.daysUntilExpiry === 0 ? "text-black" : item.daysUntilExpiry === 1 ? "text-red-500" : item.daysUntilExpiry <= 3 ? "text-orange-500" : "text-yellow-500"}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
