import { useState } from "react";
import { Search, Filter, Edit, Trash2, Eye, AlertCircle, X, Save, ArrowRight, ChevronRight, ChevronDown, Folder, FolderOpen, Package } from "lucide-react";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  maxStock: number;
  price: number;
  expiry: string;
  location?: string;
};

export function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMainCategories, setExpandedMainCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferProduct, setTransferProduct] = useState<Product | null>(null);
  const [editMainCategory, setEditMainCategory] = useState("");
  const [editSubCategory, setEditSubCategory] = useState("");

  // Hierarchical category structure
  const categoryHierarchy: { [key: string]: string[] } = {
    "Fruits": ["Citrus Fruits", "Berries", "Tropical Fruits", "Stone Fruits", "Melons"],
    "Vegetables": ["Leafy Greens", "Root Vegetables", "Cruciferous", "Nightshades", "Squash"],
    "Meat": ["Poultry", "Beef", "Pork", "Lamb", "Game Meat"],
    "Seafood": ["Fish", "Shellfish", "Crustaceans", "Mollusks", "Canned Seafood"],
    "Dairy": ["Milk Products", "Cheese", "Yogurt", "Butter & Cream", "Eggs"],
    "Bakery": ["Bread", "Pastries", "Cakes", "Cookies", "Muffins"],
    "Oils & Condiments": ["Cooking Oils", "Vinegars", "Sauces", "Spices", "Seasonings"],
    "Frozen Foods": ["Frozen Vegetables", "Frozen Fruits", "Frozen Meals", "Ice Cream", "Frozen Seafood"]
  };

  const [products, setProducts] = useState<Product[]>([
    // Seafood
    { id: 1, name: "Fresh Salmon Fillet", sku: "FSH-SAL-001", category: "Seafood > Fish", stock: 45, maxStock: 80, price: 24.99, expiry: "2024-05-28", location: "Cold Storage A" },
    { id: 9, name: "Wild-Caught Tuna", sku: "FSH-TUN-009", category: "Seafood > Fish", stock: 28, maxStock: 60, price: 19.99, expiry: "2024-05-31", location: "Cold Storage A" },
    { id: 20, name: "Jumbo Shrimp", sku: "SEA-SHR-020", category: "Seafood > Shellfish", stock: 35, maxStock: 70, price: 18.99, expiry: "2024-05-29", location: "Cold Storage A" },
    { id: 21, name: "Lobster Tail", sku: "SEA-LOB-021", category: "Seafood > Shellfish", stock: 12, maxStock: 40, price: 34.99, expiry: "2024-05-27", location: "Cold Storage A" },

    // Meat - Poultry
    { id: 2, name: "Organic Chicken Breast", sku: "MET-CHK-002", category: "Meat > Poultry", stock: 32, maxStock: 80, price: 12.99, expiry: "2024-05-30", location: "Cold Storage B" },
    { id: 11, name: "Chicken Wings", sku: "MET-CHK-011", category: "Meat > Poultry", stock: 28, maxStock: 60, price: 8.99, expiry: "2024-05-29", location: "Cold Storage B" },
    { id: 12, name: "Whole Chicken", sku: "MET-CHK-012", category: "Meat > Poultry", stock: 15, maxStock: 50, price: 15.99, expiry: "2024-05-28", location: "Cold Storage B" },

    // Meat - Beef
    { id: 10, name: "Grass-Fed Ground Beef", sku: "MET-BEF-010", category: "Meat > Beef", stock: 5, maxStock: 60, price: 9.99, expiry: "2024-05-29", location: "Cold Storage B" },
    { id: 13, name: "Ribeye Steak", sku: "MET-BEF-013", category: "Meat > Beef", stock: 18, maxStock: 50, price: 24.99, expiry: "2024-05-30", location: "Cold Storage B" },
    { id: 14, name: "Sirloin Steak", sku: "MET-BEF-014", category: "Meat > Beef", stock: 22, maxStock: 60, price: 19.99, expiry: "2024-05-30", location: "Cold Storage B" },

    // Meat - Pork
    { id: 15, name: "Ground Pork", sku: "MET-PRK-015", category: "Meat > Pork", stock: 25, maxStock: 50, price: 8.99, expiry: "2024-05-29", location: "Cold Storage B" },
    { id: 16, name: "Pork Chop", sku: "MET-PRK-016", category: "Meat > Pork", stock: 30, maxStock: 60, price: 11.99, expiry: "2024-05-30", location: "Cold Storage B" },
    { id: 17, name: "Pork Tenderloin", sku: "MET-PRK-017", category: "Meat > Pork", stock: 18, maxStock: 50, price: 14.99, expiry: "2024-05-29", location: "Cold Storage B" },
    { id: 18, name: "Bacon Strips", sku: "MET-PRK-018", category: "Meat > Pork", stock: 42, maxStock: 80, price: 7.99, expiry: "2024-06-05", location: "Refrigerator 1" },

    // Vegetables
    { id: 4, name: "Romaine Lettuce", sku: "VEG-ROM-004", category: "Vegetables > Leafy Greens", stock: 3, maxStock: 50, price: 3.49, expiry: "2024-05-27", location: "Produce Section" },
    { id: 22, name: "Spinach", sku: "VEG-SPN-022", category: "Vegetables > Leafy Greens", stock: 25, maxStock: 50, price: 2.99, expiry: "2024-05-28", location: "Produce Section" },
    { id: 23, name: "Carrots", sku: "VEG-CAR-023", category: "Vegetables > Root Vegetables", stock: 40, maxStock: 80, price: 2.49, expiry: "2024-06-05", location: "Produce Section" },
    { id: 24, name: "Potatoes 5lb", sku: "VEG-POT-024", category: "Vegetables > Root Vegetables", stock: 35, maxStock: 70, price: 4.99, expiry: "2024-06-10", location: "Dry Storage" },

    // Fruits
    { id: 7, name: "Strawberries 1lb", sku: "FRT-STR-007", category: "Fruits > Berries", stock: 24, maxStock: 60, price: 4.99, expiry: "2024-05-29", location: "Produce Section" },
    { id: 25, name: "Blueberries 1lb", sku: "FRT-BLU-025", category: "Fruits > Berries", stock: 18, maxStock: 50, price: 6.99, expiry: "2024-05-30", location: "Produce Section" },
    { id: 26, name: "Oranges", sku: "FRT-ORG-026", category: "Fruits > Citrus Fruits", stock: 50, maxStock: 100, price: 5.99, expiry: "2024-06-03", location: "Produce Section" },
    { id: 27, name: "Lemons", sku: "FRT-LEM-027", category: "Fruits > Citrus Fruits", stock: 32, maxStock: 70, price: 3.99, expiry: "2024-06-02", location: "Produce Section" },

    // Dairy
    { id: 5, name: "Greek Yogurt 32oz", sku: "DRY-YOG-005", category: "Dairy > Yogurt", stock: 67, maxStock: 100, price: 6.99, expiry: "2024-06-15", location: "Refrigerator 1" },
    { id: 8, name: "Aged Cheddar Cheese", sku: "DRY-CHD-008", category: "Dairy > Cheese", stock: 15, maxStock: 50, price: 8.99, expiry: "2024-07-10", location: "Refrigerator 2" },
    { id: 28, name: "Whole Milk 1gal", sku: "DRY-MLK-028", category: "Dairy > Milk Products", stock: 28, maxStock: 60, price: 4.99, expiry: "2024-06-01", location: "Refrigerator 1" },
    { id: 29, name: "Mozzarella Cheese", sku: "DRY-MOZ-029", category: "Dairy > Cheese", stock: 22, maxStock: 50, price: 7.99, expiry: "2024-06-20", location: "Refrigerator 2" },

    // Bakery
    { id: 6, name: "Sourdough Bread", sku: "BKY-SRD-006", category: "Bakery > Bread", stock: 0, maxStock: 40, price: 5.99, expiry: "2024-05-26", location: "Bakery Shelf" },
    { id: 30, name: "Baguette", sku: "BKY-BAG-030", category: "Bakery > Bread", stock: 12, maxStock: 40, price: 3.99, expiry: "2024-05-27", location: "Bakery Shelf" },
    { id: 31, name: "Croissants", sku: "BKY-CRO-031", category: "Bakery > Pastries", stock: 8, maxStock: 30, price: 6.99, expiry: "2024-05-27", location: "Bakery Shelf" },

    // Oils & Condiments
    { id: 3, name: "Extra Virgin Olive Oil", sku: "OIL-EVO-003", category: "Oils & Condiments > Cooking Oils", stock: 8, maxStock: 40, price: 18.99, expiry: "2025-12-31", location: "Dry Storage" },
    { id: 32, name: "Soy Sauce", sku: "OIL-SOY-032", category: "Oils & Condiments > Sauces", stock: 25, maxStock: 50, price: 4.99, expiry: "2025-08-15", location: "Dry Storage" },
  ]);

  const locations = ["Cold Storage A", "Cold Storage B", "Refrigerator 1", "Refrigerator 2", "Dry Storage", "Produce Section", "Bakery Shelf", "Freezer"];

  const mainCategories = Object.keys(categoryHierarchy);

  const toggleMainCategory = (category: string) => {
    const newExpanded = new Set(expandedMainCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
      // Also collapse all subcategories under this main category
      const newSubExpanded = new Set(expandedSubCategories);
      categoryHierarchy[category]?.forEach(sub => {
        newSubExpanded.delete(`${category} > ${sub}`);
      });
      setExpandedSubCategories(newSubExpanded);
    } else {
      newExpanded.add(category);
    }
    setExpandedMainCategories(newExpanded);
  };

  const toggleSubCategory = (mainCategory: string, subCategory: string) => {
    const key = `${mainCategory} > ${subCategory}`;
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSubCategories(newExpanded);
  };

  const getProductsInCategory = (mainCategory: string, subCategory: string) => {
    return products.filter(p => {
      const categoryKey = `${mainCategory} > ${subCategory}`;
      const matchesCategory = p.category === categoryKey;
      const matchesSearch = searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const getProductCountInSubCategory = (mainCategory: string, subCategory: string) => {
    return getProductsInCategory(mainCategory, subCategory).length;
  };

  const getProductCountInMainCategory = (mainCategory: string) => {
    return products.filter(p => p.category.startsWith(mainCategory + " > ")).length;
  };

  const handleEdit = (product: Product) => {
    const [main, sub] = product.category.split(" > ");
    setEditMainCategory(main);
    setEditSubCategory(sub);
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const handleEditMainCategoryChange = (newMainCategory: string) => {
    setEditMainCategory(newMainCategory);
    setEditSubCategory("");
  };

  const handleSaveEdit = () => {
    if (editingProduct && editMainCategory && editSubCategory) {
      const updatedProduct = {
        ...editingProduct,
        category: `${editMainCategory} > ${editSubCategory}`
      };
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setShowEditModal(false);
      setEditingProduct(null);
      setEditMainCategory("");
      setEditSubCategory("");
    }
  };

  const handleTransfer = (product: Product) => {
    const [main, sub] = product.category.split(" > ");
    setEditMainCategory(main);
    setEditSubCategory(sub);
    setTransferProduct({ ...product });
    setShowTransferModal(true);
  };

  const handleSaveTransfer = () => {
    if (transferProduct && editMainCategory && editSubCategory) {
      const updatedProduct = {
        ...transferProduct,
        category: `${editMainCategory} > ${editSubCategory}`
      };
      setProducts(products.map(p => p.id === transferProduct.id ? updatedProduct : p));
      setShowTransferModal(false);
      setTransferProduct(null);
      setEditMainCategory("");
      setEditSubCategory("");
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getStockStatus = (stock: number, maxStock: number) => {
    if (stock === 0) {
      return {
        color: "bg-black text-white border-black",
        label: "Out of Stock",
        textColor: "text-black"
      };
    }

    const percentage = (stock / maxStock) * 100;

    if (percentage <= 10) {
      return {
        color: "bg-red-100 text-red-700 border-red-200",
        label: "Critical Low",
        textColor: "text-red-600"
      };
    } else if (percentage <= 30) {
      return {
        color: "bg-orange-100 text-orange-700 border-orange-200",
        label: "Low Stock",
        textColor: "text-orange-600"
      };
    } else if (percentage <= 50) {
      return {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        label: "Medium Stock",
        textColor: "text-yellow-600"
      };
    } else {
      return {
        color: "bg-green-100 text-green-700 border-green-200",
        label: "In Stock",
        textColor: "text-green-600"
      };
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-2xl p-2 shadow-sm border border-border mb-8">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-sm bg-input-background border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-1.5 mt-2 pt-2 border-t border-border">
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{products.length}</p>
            <p className="text-muted-foreground text-sm">Total</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-black">{products.filter(p => p.stock === 0).length}</p>
            <p className="text-muted-foreground text-sm">Out</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-red-600">{products.filter(p => {
              const pct = (p.stock / p.maxStock) * 100;
              return p.stock > 0 && pct <= 10;
            }).length}</p>
            <p className="text-muted-foreground text-sm">Critical</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-orange-600">{products.filter(p => {
              const pct = (p.stock / p.maxStock) * 100;
              return pct > 10 && pct <= 30;
            }).length}</p>
            <p className="text-muted-foreground text-sm">Low</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-yellow-600">{products.filter(p => {
              const pct = (p.stock / p.maxStock) * 100;
              return pct > 30 && pct <= 50;
            }).length}</p>
            <p className="text-muted-foreground text-sm">Medium</p>
          </div>
        </div>
      </div>

      {/* Folder Tree View */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden p-2">
        <div className="space-y-4">
          {mainCategories.map((mainCategory) => {
            const isMainExpanded = expandedMainCategories.has(mainCategory);
            const mainCategoryCount = getProductCountInMainCategory(mainCategory);

            return (
              <div key={mainCategory} className="border border-border rounded-2xl overflow-hidden">
                {/* Main Category Folder */}
                <div
                  className="flex items-center gap-1.5 p-1.5 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => toggleMainCategory(mainCategory)}
                >
                  {isMainExpanded ? (
                    <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  {isMainExpanded ? (
                    <FolderOpen className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <Folder className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-foreground flex-1 text-sm">{mainCategory}</span>
                  <span className="text-sm text-muted-foreground bg-background px-1.5 py-2 rounded-full">
                    {mainCategoryCount}
                  </span>
                </div>

                {/* Subcategories */}
                {isMainExpanded && (
                  <div className="bg-background">
                    {categoryHierarchy[mainCategory].map((subCategory) => {
                      const subKey = `${mainCategory} > ${subCategory}`;
                      const isSubExpanded = expandedSubCategories.has(subKey);
                      const subCategoryProducts = getProductsInCategory(mainCategory, subCategory);
                      const subCount = subCategoryProducts.length;

                      if (searchQuery && subCount === 0) return null;

                      return (
                        <div key={subKey} className="border-l border-primary/20 ml-4">
                          {/* Subcategory Folder */}
                          <div
                            className="flex items-center gap-1.5 p-1 hover:bg-muted/30 cursor-pointer transition-colors"
                            onClick={() => toggleSubCategory(mainCategory, subCategory)}
                          >
                            {isSubExpanded ? (
                              <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                            {isSubExpanded ? (
                              <FolderOpen className="w-5 h-5 text-primary flex-shrink-0" />
                            ) : (
                              <Folder className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            )}
                            <span className="font-medium text-foreground flex-1 text-sm">{subCategory}</span>
                            <span className="text-[8px] text-muted-foreground bg-muted px-1 py-2 rounded-full">
                              {subCount}
                            </span>
                          </div>

                          {/* Products in Subcategory */}
                          {isSubExpanded && (
                            <div className="ml-3 space-y-4 py-1">
                              {subCategoryProducts.map((product) => (
                                <div
                                  key={product.id}
                                  className="flex items-center gap-1.5 p-1.5 bg-card border border-border rounded hover:shadow-md transition-all"
                                >
                                  <Package className="w-5 h-5 text-primary flex-shrink-0" />

                                  <div className="flex-1 grid grid-cols-6 gap-1.5 items-center">
                                    <div className="col-span-2">
                                      <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                                      <p className="text-[8px] text-muted-foreground truncate">{product.sku}</p>
                                    </div>

                                    <div>
                                      <p className="text-[8px] text-muted-foreground truncate">{product.location}</p>
                                    </div>

                                    <div>
                                      <p className={`text-sm font-bold ${getStockStatus(product.stock, product.maxStock).textColor}`}>
                                        {product.stock}/{product.maxStock}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium text-foreground">₱{product.price}</p>
                                    </div>

                                    <div>
                                      <p className="text-[8px] text-foreground truncate">{product.expiry}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-0.5 flex-shrink-0">
                                    <span className={`px-1 py-2 rounded text-[8px] font-medium border ${getStockStatus(product.stock, product.maxStock).color}`}>
                                      {getStockStatus(product.stock, product.maxStock).label}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-0.5 flex-shrink-0">
                                    <button
                                      onClick={() => handleTransfer(product)}
                                      className="p-0.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                                      title="Transfer"
                                    >
                                      <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => handleEdit(product)}
                                      className="p-0.5 hover:bg-green-50 text-green-600 rounded transition-colors"
                                      title="Edit"
                                    >
                                      <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(product.id)}
                                      className="p-0.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {subCategoryProducts.length === 0 && (
                                <div className="p-6 text-center text-muted-foreground text-sm">
                                  No items found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {mainCategories.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No categories available
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-card rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-sm font-bold text-foreground">Edit Food Item</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-6 hover:bg-muted rounded-2xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm mb-2 text-foreground">Food Item Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground">SKU</label>
                <input
                  type="text"
                  value={editingProduct.sku}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground">Main Category</label>
                  <select
                    value={editMainCategory}
                    onChange={(e) => handleEditMainCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="">Select Category</option>
                    {mainCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-foreground">Sub Category</label>
                  <select
                    value={editSubCategory}
                    onChange={(e) => setEditSubCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    disabled={!editMainCategory}
                  >
                    <option value="">Select Subcategory</option>
                    {editMainCategory && categoryHierarchy[editMainCategory]?.map((subCat) => (
                      <option key={subCat} value={subCat}>{subCat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground">Current Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-foreground">Max Stock</label>
                  <input
                    type="number"
                    value={editingProduct.maxStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, maxStock: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-foreground">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground">Expiry Date</label>
                  <input
                    type="date"
                    value={editingProduct.expiry}
                    onChange={(e) => setEditingProduct({ ...editingProduct, expiry: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-foreground">Location</label>
                  <select
                    value={editingProduct.location}
                    onChange={(e) => setEditingProduct({ ...editingProduct, location: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && transferProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Transfer Item</h2>
              <button
                onClick={() => setShowTransferModal(false)}
                className="p-6 hover:bg-muted rounded-2xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-6">Transferring</p>
                <p className="font-semibold text-foreground">{transferProduct.name}</p>
                <p className="text-sm text-muted-foreground mt-2">Current Location: {transferProduct.location}</p>
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground">New Location</label>
                <select
                  value={transferProduct.location}
                  onChange={(e) => setTransferProduct({ ...transferProduct, location: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground">Main Category</label>
                  <select
                    value={editMainCategory}
                    onChange={(e) => handleEditMainCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    {mainCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-foreground">Sub Category</label>
                  <select
                    value={editSubCategory}
                    onChange={(e) => setEditSubCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    disabled={!editMainCategory}
                  >
                    <option value="">Select Subcategory</option>
                    {editMainCategory && categoryHierarchy[editMainCategory]?.map((subCat) => (
                      <option key={subCat} value={subCat}>{subCat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTransfer}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Transfer Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
