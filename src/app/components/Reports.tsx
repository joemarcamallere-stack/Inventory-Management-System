import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Calendar, TrendingUp, Package, DollarSign, ShoppingCart, Filter } from "lucide-react";

export function Reports() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("30days");
  const [selectedMainCategory, setSelectedMainCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [selectedMainCategory, selectedSubCategory]);

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

  const salesTrendData = [
    { date: "Week 1", revenue: 12400, orders: 42 },
    { date: "Week 2", revenue: 15800, orders: 56 },
    { date: "Week 3", revenue: 13200, orders: 48 },
    { date: "Week 4", revenue: 18900, orders: 67 },
  ];

  const allCategoryPerformance = [
    { id: "meat-poultry", category: "Meat", subCategory: "Poultry", sales: 8900, percentage: 17 },
    { id: "meat-beef", category: "Meat", subCategory: "Beef", sales: 6200, percentage: 12 },
    { id: "seafood-fish", category: "Seafood", subCategory: "Fish", sales: 7100, percentage: 14 },
    { id: "seafood-shellfish", category: "Seafood", subCategory: "Shellfish", sales: 4200, percentage: 8 },
    { id: "fruits-berries", category: "Fruits", subCategory: "Berries", sales: 5800, percentage: 11 },
    { id: "fruits-citrus", category: "Fruits", subCategory: "Citrus Fruits", sales: 4600, percentage: 9 },
    { id: "fruits-tropical", category: "Fruits", subCategory: "Tropical Fruits", sales: 4000, percentage: 8 },
    { id: "dairy-cheese", category: "Dairy", subCategory: "Cheese", sales: 4300, percentage: 8 },
    { id: "dairy-yogurt", category: "Dairy", subCategory: "Yogurt", sales: 3800, percentage: 7 },
    { id: "dairy-milk", category: "Dairy", subCategory: "Milk Products", sales: 2700, percentage: 5 },
    { id: "vegetables-leafy", category: "Vegetables", subCategory: "Leafy Greens", sales: 4200, percentage: 8 },
    { id: "vegetables-root", category: "Vegetables", subCategory: "Root Vegetables", sales: 4100, percentage: 8 },
  ];

  // Filter and aggregate category performance
  const filteredCategoryData = allCategoryPerformance.filter(item => {
    const matchesMain = selectedMainCategory === "all" || item.category === selectedMainCategory;
    const matchesSub = selectedSubCategory === "all" || item.subCategory === selectedSubCategory;
    return matchesMain && matchesSub;
  });

  // Determine what to show based on selection
  let categoryPerformance: any[] = [];

  if (selectedSubCategory !== "all") {
    // Show only the selected subcategory
    categoryPerformance = filteredCategoryData.map(item => ({
      id: item.id,
      category: item.subCategory,
      sales: item.sales,
      percentage: 0
    }));
  } else if (selectedMainCategory !== "all") {
    // Show subcategories within the selected main category
    categoryPerformance = filteredCategoryData.map(item => ({
      id: item.id,
      category: item.subCategory,
      sales: item.sales,
      percentage: 0
    }));
  } else {
    // Show main categories (aggregate by main category)
    categoryPerformance = filteredCategoryData.reduce((acc: any[], item) => {
      const existing = acc.find(a => a.category === item.category);
      if (existing) {
        existing.sales += item.sales;
      } else {
        acc.push({
          id: item.category.toLowerCase().replace(/\s+/g, '-'),
          category: item.category,
          sales: item.sales,
          percentage: 0
        });
      }
      return acc;
    }, []);
  }

  // Recalculate percentages
  const totalSales = categoryPerformance.reduce((sum, item) => sum + item.sales, 0);
  categoryPerformance.forEach(item => {
    item.percentage = totalSales > 0 ? Math.round((item.sales / totalSales) * 100) : 0;
  });

  const topProducts = [
    { id: "salmon", name: "Fresh Salmon Fillet", sold: 324, revenue: 8095 },
    { id: "chicken", name: "Organic Chicken Breast", sold: 489, revenue: 6348 },
    { id: "yogurt", name: "Greek Yogurt 32oz", sold: 612, revenue: 4278 },
    { id: "strawberries", name: "Strawberries 1lb", sold: 576, revenue: 2874 },
    { id: "cheddar", name: "Aged Cheddar Cheese", sold: 403, revenue: 3623 },
  ];

  const inventoryTurnover = [
    { month: "Jan", turnover: 4.2 },
    { month: "Feb", turnover: 3.8 },
    { month: "Mar", turnover: 5.1 },
    { month: "Apr", turnover: 4.6 },
    { month: "May", turnover: 5.8 },
    { month: "Jun", turnover: 6.2 },
  ];

  const COLORS = ["#ea580c", "#65a30d", "#eab308", "#f59e0b"];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Reports & Analytics</h1>
        </div>
        <div className="flex gap-6">
          <div className="relative">
            <Filter className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={selectedMainCategory}
              onChange={(e) => handleMainCategoryChange(e.target.value)}
              className="pl-6 pr-4 py-2 text-sm bg-input-background border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer min-w-[120px]"
            >
              <option value="all">All Categories</option>
              {mainCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {selectedMainCategory !== "all" && (
            <div className="relative">
              <Filter className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="pl-6 pr-4 py-2 text-sm bg-input-background border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer min-w-[120px]"
              >
                <option value="all">All {selectedMainCategory}</option>
                {currentSubCategories.map((subCat) => (
                  <option key={subCat} value={subCat}>{subCat}</option>
                ))}
              </select>
            </div>
          )}

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-2 py-2 text-sm bg-input-background border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-3 bg-primary text-white rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
        <div className="bg-card rounded-2xl p-2 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-green-600 font-medium">+24.5%</span>
          </div>
          <h3 className="text-muted-foreground text-sm mb-6">Total Revenue</h3>
          <p className="text-xl font-bold text-foreground">₱60,300</p>
          <p className="text-muted-foreground text-xs mt-2">vs. last period</p>
        </div>

        <div className="bg-card rounded-2xl p-2 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-green-600 font-medium">+18.2%</span>
          </div>
          <h3 className="text-muted-foreground text-sm mb-6">Total Orders</h3>
          <p className="text-xl font-bold text-foreground">213</p>
          <p className="text-muted-foreground text-xs mt-2">vs. last period</p>
        </div>

        <div className="bg-card rounded-2xl p-2 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12.8%</span>
          </div>
          <h3 className="text-muted-foreground text-sm mb-6">Avg. Order Value</h3>
          <p className="text-xl font-bold text-foreground">₱283</p>
          <p className="text-muted-foreground text-xs mt-2">vs. last period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
        {/* Revenue Trend */}
        <div className="bg-card rounded-2xl p-2 shadow-sm border border-border">
          <h2 className="text-xl font-bold text-foreground mb-8">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesTrendData} key="revenue-bar-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" key="bar-grid" />
              <XAxis dataKey="date" stroke="#64748b" key="bar-x-axis" />
              <YAxis stroke="#64748b" key="bar-y-axis" />
              <Tooltip
                key="bar-tooltip"
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} key="revenue-bar" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="bg-card rounded-2xl p-2 shadow-sm border border-border overflow-hidden">
          <h2 className="text-xl font-bold text-foreground mb-8">Category Performance</h2>
          <ResponsiveContainer width="100%" height={300} key={`reports-container-${chartKey}`}>
            <PieChart key={`reports-piechart-${chartKey}`}>
              <Pie
                key={`reports-pie-${chartKey}`}
                data={categoryPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="sales"
                nameKey="category"
                label={({ name, percentage }) => {
                  const shortName = name.length > 10 ? name.substring(0, 10) + '...' : name;
                  return `${shortName} ${percentage}%`;
                }}
                isAnimationActive={false}
                onClick={(data) => navigate(`/category?category=${encodeURIComponent(data.category)}&sub=all`)}
                cursor="pointer"
              >
                {categoryPerformance.map((entry, index) => (
                  <Cell key={`cell-reports-${chartKey}-${index}-${entry.category}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip key={`reports-pie-tooltip-${chartKey}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-card rounded-2xl p-2 shadow-sm border border-border">
          <h2 className="text-xl font-bold text-foreground mb-8">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-1.5 p-1.5 rounded-2xl hover:bg-muted/50 transition-colors">
                <div className="w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sold} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Turnover */}
        <div className="bg-card rounded-2xl p-2 shadow-sm border border-border">
          <h2 className="text-xl font-bold text-foreground mb-8">Inventory Turnover Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={inventoryTurnover} key="turnover-line-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" key="turnover-grid" />
              <XAxis dataKey="month" stroke="#64748b" key="turnover-x-axis" />
              <YAxis stroke="#64748b" key="turnover-y-axis" />
              <Tooltip
                key="turnover-tooltip"
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                }}
              />
              <Line
                key="turnover-line"
                type="monotone"
                dataKey="turnover"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-1.5 bg-green-50 rounded-2xl">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Great performance!</span> Your inventory turnover is improving, indicating efficient stock management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
