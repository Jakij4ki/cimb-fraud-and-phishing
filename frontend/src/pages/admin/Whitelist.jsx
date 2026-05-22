import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, Link as LinkIcon, Phone, Check, X, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToastStore } from '../../components/ui/Toast';

const Whitelist = () => {
  const [activeTab, setActiveTab] = useState('URL');
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [formData, setFormData] = useState({
    value: '',
    type: 'URL',
    label: '',
    category: 'Bank',
    is_active: true
  });

  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setData([
        { id: 1, value: 'cimbniaga.co.id', type: 'URL', label: 'CIMB Niaga Corporate', category: 'Bank', is_active: true },
        { id: 2, value: 'octoclicks.co.id', type: 'URL', label: 'OCTO Clicks', category: 'Bank', is_active: true },
        { id: 3, value: '14041', type: 'PHONE', label: 'Call Center CIMB', category: 'Bank', is_active: true },
        { id: 4, value: '02129978888', type: 'PHONE', label: 'CIMB Head Office', category: 'Bank', is_active: false },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = data.filter(item => {
    if (activeTab !== item.type) return false;
    if (search && !item.value.toLowerCase().includes(search.toLowerCase()) && !item.label.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterActive === 'active' && !item.is_active) return false;
    if (filterActive === 'inactive' && item.is_active) return false;
    return true;
  });

  const handleToggleActive = (id) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, is_active: !item.is_active } : item));
    addToast({ type: 'success', message: 'Status berhasil diperbarui' });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      ...formData
    };
    setData([...data, newItem]);
    setIsAddModalOpen(false);
    addToast({ type: 'success', message: 'Entri berhasil ditambahkan' });
    setFormData({ value: '', type: activeTab, label: '', category: 'Bank', is_active: true });
  };

  const handleDelete = () => {
    setData(prev => prev.filter(item => item.id !== selectedItem.id));
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    addToast({ type: 'success', message: 'Entri berhasil dihapus' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Kelola Whitelist</h2>
          <p className="text-muted text-sm mt-1">Daftar entitas resmi yang aman dan diabaikan dari deteksi penipuan.</p>
        </div>
        <Button icon={Plus} onClick={() => {
          setFormData({ ...formData, type: activeTab });
          setIsAddModalOpen(true);
        }}>
          Tambah Entri
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border px-4">
          <button 
            className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'URL' ? 'border-secondary text-secondary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            onClick={() => setActiveTab('URL')}
          >
            <LinkIcon size={16} /> Domain & Tautan
          </button>
          <button 
            className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'PHONE' ? 'border-secondary text-secondary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            onClick={() => setActiveTab('PHONE')}
          >
            <Phone size={16} /> Nomor Telepon
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`Cari ${activeTab === 'URL' ? 'domain' : 'nomor'} atau label...`}
              className="w-full pl-10 pr-4 py-2 border-slate-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-slate-500 font-medium">Status:</span>
            <select 
              className="border-slate-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                <th className="p-4 font-medium">Nilai ({activeTab})</th>
                <th className="p-4 font-medium">Label / Keterangan</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-sm text-primary font-medium">{item.value}</td>
                  <td className="p-4 text-sm text-slate-700">{item.label}</td>
                  <td className="p-4 text-sm text-slate-500">{item.category}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleActive(item.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${item.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${item.is_active ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                    <span className="ml-2 text-xs font-medium text-slate-500">{item.is_active ? 'Aktif' : 'Nonaktif'}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}
                      className="p-1.5 text-slate-400 hover:text-danger hover:bg-red-50 rounded transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={`Tambah ${formData.type === 'URL' ? 'Domain' : 'Nomor Telepon'} Whitelist`}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nilai ({formData.type})
            </label>
            <input 
              type="text" 
              required
              placeholder={formData.type === 'URL' ? "contoh.com" : "081234..."}
              className="w-full border-slate-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary font-mono"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Label / Nama Resmi</label>
            <input 
              type="text" 
              required
              className="w-full border-slate-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary"
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
            <select 
              className="w-full border-slate-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Bank">Internal Bank</option>
              <option value="Partner">Partner Resmi</option>
              <option value="Government">Pemerintah</option>
              <option value="Other">Lainnya</option>
            </select>
          </div>
          <div className="pt-2 flex gap-3 justify-end">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Konfirmasi Hapus" size="sm">
        <div className="py-2">
          <div className="flex items-center gap-3 text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertTriangle size={24} className="flex-shrink-0" />
            <p className="text-sm font-medium">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Anda yakin ingin menghapus <strong className="text-slate-800">{selectedItem?.value}</strong> dari whitelist? Jika dihapus, entitas ini dapat terdeteksi sebagai ancaman oleh sistem.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="danger" onClick={handleDelete}>Ya, Hapus</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Whitelist;
