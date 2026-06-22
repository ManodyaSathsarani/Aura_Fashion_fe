import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, TrendingUp, Users, DollarSign,
  Plus, Edit, Trash2, Loader2, Camera, X, LayoutDashboard, AlertCircle,
  ShoppingBag, ClipboardList, Sparkles
} from 'lucide-react';
import type { Product } from '../types/types';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const ProductFormInline: React.FC<{
  product?: any;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}> = ({ product, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category: product?.category || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(product?.image || '');

  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Health & Beauty', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price.toString());
    data.append('stock', formData.stock.toString());
    data.append('category', formData.category);
    if (imageFile) data.append('image', imageFile);
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center p-5 border-2 border-dashed border-[#D4FF3F]/40 bg-white/[0.03] relative">
        {preview ? (
          <div className="relative w-full h-32">
            <img src={preview} className="w-full h-full object-contain" alt="Preview" />
            <button
              type="button"
              onClick={() => { setPreview(''); setImageFile(null); }}
              className="absolute top-0 right-0 bg-[#D4FF3F] text-black p-1.5"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <Camera className="text-white/30 mb-2" size={26} />
            <span className="text-xs font-mono uppercase tracking-wide text-white/40">Upload product image</span>
          </label>
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
          }}
        />
      </div>

      <input
        type="text"
        placeholder="Product name"
        className="w-full p-3 bg-black border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-[#D4FF3F] transition-colors"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <select
        className="w-full p-3 bg-black border border-white/15 text-white outline-none focus:border-[#D4FF3F] transition-colors"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="">Select category</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Price"
          className="w-full p-3 bg-black border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-[#D4FF3F] transition-colors"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          className="w-full p-3 bg-black border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-[#D4FF3F] transition-colors"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
        />
      </div>
      <textarea
        placeholder="Description"
        className="w-full p-3 bg-black border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-[#D4FF3F] transition-colors"
        rows={3}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1 bg-transparent border border-white/20 text-white hover:bg-white/5">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#D4FF3F] hover:bg-[#c4ef2f] border-none text-black font-bold"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (product ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, totalRevenue: 0, pendingOrders: 0 });

  useEffect(() => {
    // Role Verification: Admin ho Seller nethnam eliyata danna
    if (user) {
      const hasAccess = user.roles.includes('admin') || user.roles.includes('seller');
      if (!hasAccess) {
        toast.error("Unauthorized! Only Sellers and Admins can access Dashboard.");
        navigate('/');
        return;
      }
      fetchDashboardData();
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAll();
      const myProducts = allProducts.filter(p =>
        typeof p.seller === 'string' ? p.seller === user?.id : (p.seller as any)._id === user?.id
      );
      setProducts(myProducts);

      try {
        const ordersData = await orderService.getOrders();
        setStats({
          totalProducts: myProducts.length,
          totalSales: ordersData.length,
          totalRevenue: ordersData.reduce((sum, order) => sum + (order.total || 0), 0),
          pendingOrders: ordersData.filter(o => o.status === 'pending').length,
        });
      } catch (err) {
        setStats(prev => ({ ...prev, totalProducts: myProducts.length }));
      }
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (formData: FormData) => {
    try {
      await productService.create(formData);
      toast.success('Product created!');
      setShowAddModal(false);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create');
    }
  };

  const handleUpdateProduct = async (formData: FormData) => {
    if (!editingProduct) return;
    try {
      await productService.update(editingProduct._id, formData);
      toast.success('Updated!');
      setShowEditModal(false);
      fetchDashboardData();
    } catch (error) { toast.error('Update failed'); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      setProducts((currentProducts) => currentProducts.filter((product) => product._id !== id));
      setStats((currentStats) => ({
        ...currentStats,
        totalProducts: Math.max(0, currentStats.totalProducts - 1),
      }));
      toast.success('Deleted');
    } catch (error) { toast.error('Delete failed'); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="animate-spin text-[#D4FF3F]" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* ───────── Sidebar ───────── */}
      <aside className="w-72 shrink-0 hidden lg:flex flex-col bg-[#0A0A0A] border-r border-white/10 sticky top-0 h-screen">
        <div className="px-6 py-7 flex items-center gap-2.5 border-b border-white/10">
          <div className="w-8 h-8 bg-[#D4FF3F] flex items-center justify-center">
            <Sparkles size={16} className="text-black" />
          </div>
          <span
            className="font-bold text-lg tracking-tight text-white"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Aura Fashion
          </span>
        </div>

        <nav className="px-4 py-6 space-y-1">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
          <SidebarLink icon={ShoppingBag} label="Products" />
          <SidebarLink icon={ClipboardList} label="Orders" />
        </nav>

        <div className="px-4 mt-2 mb-3">
          <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-white/30">// Overview</p>
        </div>

        <div className="px-4 space-y-3 flex-1">
          <SidebarStat icon={DollarSign} label="Revenue" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} hero />
          <SidebarStat icon={Package} label="My products" value={stats.totalProducts} />
          <SidebarStat icon={TrendingUp} label="Total sales" value={stats.totalSales} />
          <SidebarStat icon={Users} label="Pending orders" value={stats.pendingOrders} />
        </div>

        <div className="px-6 py-5 border-t border-white/10">
          <p className="text-xs font-mono text-white/40">Signed in as</p>
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <span className="inline-block mt-1.5 text-[10px] font-mono uppercase tracking-wider text-[#D4FF3F]">
            {user?.roles.includes('admin') ? 'Admin' : 'Seller'}
          </span>
        </div>
      </aside>

      {/* ───────── Main content ───────── */}
      <main className="flex-1 p-6 lg:p-10 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#D4FF3F] mb-2">
              {user?.roles.includes('admin') ? '// Admin access' : '// Seller access'}
            </p>
            <h1
              className="text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              {user?.roles.includes('admin') ? 'Admin Dashboard' : 'Seller Dashboard'}
            </h1>
            <p className="text-white/40 mt-1 text-sm font-mono">
              Managing inventory for <span className="text-white/70">{user?.name}</span>
            </p>
          </div>

          {/* Offset hard-shadow button — matches login page signature */}
          <div className="relative">
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-white/10" />
            <Button
              onClick={() => setShowAddModal(true)}
              icon={Plus}
              className="relative bg-[#D4FF3F] hover:bg-[#c4ef2f] border-none text-black font-bold"
            >
              Add new product
            </Button>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Product inventory
            </h3>
            <span className="text-xs font-mono text-[#D4FF3F] border border-[#D4FF3F]/30 px-3 py-1 uppercase tracking-wider">
              {products.length} products
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 font-mono text-white/40 text-xs uppercase tracking-wide">Product details</th>
                  <th className="px-6 py-4 font-mono text-white/40 text-xs uppercase tracking-wide">Category</th>
                  <th className="px-6 py-4 font-mono text-white/40 text-xs uppercase tracking-wide">Price</th>
                  <th className="px-6 py-4 font-mono text-white/40 text-xs uppercase tracking-wide">Stock</th>
                  <th className="px-6 py-4 text-right font-mono text-white/40 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img
                        src={p.image || "https://via.placeholder.com/50"}
                        className="h-12 w-12 object-cover bg-white/5 border border-white/10"
                        alt={p.name}
                      />
                      <div>
                        <p className="font-bold text-white text-sm">{p.name}</p>
                        <p className="text-[10px] text-white/30 uppercase font-mono tracking-tighter">ID: {p._id.slice(-6)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 border border-[#D4FF3F]/30 text-[#D4FF3F] text-[10px] font-mono uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white text-sm font-mono">Rs. {p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-[#D4FF3F]' : 'bg-red-500'}`} />
                        <span className="font-medium text-white/80 font-mono">{p.stock} units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => { setEditingProduct(p); setShowEditModal(true); }}
                        className="p-2.5 text-white/60 hover:text-[#D4FF3F] hover:bg-white/5 transition-colors"
                        aria-label="Edit product"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-2.5 text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors"
                        aria-label="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="p-20 text-center">
                <AlertCircle className="mx-auto mb-3 text-white/20" size={40} />
                <p className="text-white/30 font-mono text-sm">No products added yet.</p>
              </div>
            )}
          </div>
        </div>

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add new product">
          <ProductFormInline onSubmit={handleCreateProduct} onCancel={() => setShowAddModal(false)} />
        </Modal>

        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit product">
          {editingProduct && <ProductFormInline product={editingProduct} onSubmit={handleUpdateProduct} onCancel={() => setShowEditModal(false)} />}
        </Modal>
      </main>
    </div>
  );
};

const SidebarLink = ({ icon: Icon, label, active }: { icon: any; label: string; active?: boolean }) => (
  <button
    type="button"
    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors ${
      active
        ? 'bg-[#D4FF3F]/10 text-[#D4FF3F] border-l-2 border-[#D4FF3F]'
        : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const SidebarStat = ({
  icon: Icon,
  label,
  value,
  hero,
}: {
  icon: any;
  label: string;
  value: string | number;
  hero?: boolean;
}) => (
  <div className={`p-4 border ${hero ? 'bg-[#D4FF3F] border-[#D4FF3F]' : 'bg-white/[0.03] border-white/10'}`}>
    <div className="flex items-center justify-between mb-2">
      <span className={`text-[10px] font-mono uppercase tracking-wider ${hero ? 'text-black/60' : 'text-white/40'}`}>
        {label}
      </span>
      <Icon size={14} className={hero ? 'text-black/70' : 'text-white/30'} />
    </div>
    <p className={`text-lg font-bold tracking-tight ${hero ? 'text-black' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      {value}
    </p>
  </div>
);

export default Dashboard;