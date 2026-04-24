import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinaryConfig';

const Admin_dashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [stories, setStories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]); // Upgraded: now an array

    // Form states
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        image: ['']
    });

    const [storyForm, setStoryForm] = useState({
        title: '',
        content: '',
        image: '',
        productId: '' // Link to a product
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const productsSnapshot = await getDocs(collection(db, 'products'));
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsList);

            const storiesSnapshot = await getDocs(collection(db, 'stories'));
            const storiesList = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStories(storiesList);

            const ordersSnapshot = await getDocs(collection(db, 'orders'));
            const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(ordersList);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (collectionName, id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteDoc(doc(db, collectionName, id));
                fetchData();
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }
    };

    const handleEdit = (type, item) => {
        setEditingItem(item);
        if (type === 'products') {
            setProductForm({
                name: item.name || '',
                price: item.price || '',
                stock: item.stock || '',
                description: item.description || '',
                image: Array.isArray(item.image) ? item.image : [item.image || '']
            });
            setActiveTab('products');
        } else {
            setStoryForm({
                title: item.title || '',
                content: item.content || '',
                image: item.image || '',
                productId: item.id || ''
            });
            setActiveTab('stories');
        }
        setSelectedFiles([]);
        setIsModalOpen(true);
    };

    const handleCreateNew = (type) => {
        setEditingItem(null);
        if (type === 'products') {
            setProductForm({
                name: '',
                price: '',
                stock: '',
                description: '',
                image: ['']
            });
        } else {
            setStoryForm({
                title: '',
                content: '',
                image: '',
                productId: ''
            });
        }
        setSelectedFiles([]);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const collectionName = activeTab;
        setUploading(true);

        try {
            let finalImageUrls = activeTab === 'products' ? [...productForm.image] : [storyForm.image];

            // Filter out empty URLs (initial placeholders)
            finalImageUrls = finalImageUrls.filter(url => url && url.trim() !== '');

            // Handle file upload if files are selected
            if (selectedFiles.length > 0) {
                try {
                    const uploadPromises = selectedFiles.map(file => uploadToCloudinary(file));
                    const newUrls = await Promise.all(uploadPromises);
                    
                    if (activeTab === 'products') {
                        finalImageUrls = [...finalImageUrls, ...newUrls].slice(0, 4); // Limit to 4
                    } else {
                        finalImageUrls = [newUrls[0]]; // Stories only have one image
                    }
                } catch (uploadError) {
                    alert("Image upload failed: " + uploadError.message);
                    setUploading(false);
                    return;
                }
            }

            if (activeTab === 'products') {
                const formData = {
                    ...productForm,
                    price: Number(productForm.price),
                    stock: Number(productForm.stock),
                    image: finalImageUrls
                };
                if (editingItem) {
                    await updateDoc(doc(db, 'products', editingItem.id), formData);
                } else {
                    await addDoc(collection(db, 'products'), formData);
                }
            } else {
                // Story logic
                if (!storyForm.productId) {
                    alert("Please select a product for this story.");
                    setUploading(false);
                    return;
                }
                const storyData = {
                    title: storyForm.title,
                    content: storyForm.content,
                    image: finalImageUrls[0] || ''
                };

                // Use the Product ID as the Story Document ID
                await setDoc(doc(db, 'stories', storyForm.productId), storyData);
            }
            setIsModalOpen(false);
            setSelectedFiles([]);
            fetchData();
        } catch (error) {
            console.error("Error saving document:", error);
            alert("Failed to save. Check console for details.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div data-aos="fade-right">
                        <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tight">
                            OB<span className="text-yellow-600">Admin</span>
                        </h1>
                        <p className="mt-2 text-gray-500 font-medium tracking-wide items-center flex">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            Management Portal • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3" data-aos="fade-left">
                        <Link
                            to="/"
                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center transition-all shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View Site
                        </Link>
                        <button
                            onClick={() => handleCreateNew(activeTab)}
                            className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-yellow-600 transition-all shadow-lg flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Add {activeTab === 'products' ? 'Product' : 'Story'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10" data-aos="fade-up">
                    {[
                        { label: 'Total Products', value: products.length, icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'blue' },
                        { label: 'Art Stories', value: stories.length, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'bg-yellow-50 text-yellow-600' },
                        { label: 'Drafts', value: 0, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'bg-purple-50 text-purple-600' },
                        { label: 'Out of Stock', value: products.filter(p => !p.stock).length, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'bg-red-50 text-red-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${stat.color}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                                </div>
                            </div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex border-b border-gray-100 bg-gray-50/50">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex-1 py-5 text-sm font-bold transition-all ${activeTab === 'products' ? 'text-gray-900 bg-white border-b-2 border-yellow-500' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            PRODUCTS
                        </button>
                        <button
                            onClick={() => setActiveTab('stories')}
                            className={`flex-1 py-5 text-sm font-bold transition-all ${activeTab === 'stories' ? 'text-gray-900 bg-white border-b-2 border-yellow-500' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            STORIES & ART
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`flex-1 py-5 text-sm font-bold transition-all ${activeTab === 'shipping' ? 'text-gray-900 bg-white border-b-2 border-yellow-500' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            SHIPPING
                        </button>
                        <button className="flex-1 py-5 text-sm font-bold text-gray-300 cursor-not-allowed">
                            ANALYTICS <span className="text-[10px] ml-1 opacity-50">(SOON)</span>
                        </button>
                    </div>

                    <div className="p-2 sm:p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-400 font-medium animate-pulse">Syncing with Firestore...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {activeTab === 'shipping' && (
                                    <div className="grid grid-cols-1 gap-6">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="p-8 rounded-[2rem] bg-gray-50 border border-transparent hover:border-gray-200 transition-all space-y-6"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Customer Details</p>
                                                        <h3 className="text-xl font-bold text-gray-900">{order.formData?.fullName}</h3>
                                                        <p className="text-sm text-gray-500">{order.formData?.email} • {order.formData?.phone}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Order Status</p>
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Paid</span>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Shipping Address</p>
                                                        <p className="text-gray-700 leading-relaxed font-medium">
                                                            {order.formData?.address}<br />
                                                            {order.formData?.city}, {order.formData?.state}<br />
                                                            {order.formData?.zipcode}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Items Purchased</p>
                                                        <div className="space-y-3">
                                                            {order.items?.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                                                    <span className="text-sm font-bold text-gray-900 truncate mr-4">{item.name}</span>
                                                                    <span className="text-xs font-black text-[#8B5E3C]">x{item.quantity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {orders.length === 0 && (
                                            <div className="text-center py-24 opacity-50">
                                                <p className="text-xl font-medium italic font-serif">No shipments pending.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(activeTab === 'products' || activeTab === 'stories') && (activeTab === 'products' ? products : stories).map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg transition-all flex flex-col sm:flex-row items-center gap-6"
                                    >
                                        <img
                                            src={activeTab === 'products'
                                                ? (Array.isArray(item.image) ? item.image[0] : item.image || '/placeholder.jpg')
                                                : (item.image || '/placeholder.jpg')
                                            }
                                            alt=""
                                            className="w-20 h-20 rounded-xl object-cover shadow-sm bg-white"
                                        />

                                        <div className="flex-1 text-center sm:text-left min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                                {activeTab === 'products' ? item.name : item.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 font-medium mt-1">
                                                {activeTab === 'products'
                                                    ? `₦${item.price?.toLocaleString()} • ${item.stock} left`
                                                    : item.content?.substring(0, 120) + '...'
                                                }
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(activeTab, item)}
                                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                title="Edit Item"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(activeTab, item.id)}
                                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Delete Item"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(activeTab === 'products' ? products : stories).length === 0 && (
                                    <div className="text-center py-20 opacity-50">
                                        <p className="text-xl font-medium">No {activeTab} yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                        <div
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            data-aos="zoom-in"
                        >
                            <div className="bg-gray-900 px-8 py-6 text-white flex justify-between items-center shrink-0">
                                <div>
                                    <h2 className="text-xl font-serif font-black">
                                        {editingItem ? 'Edit' : 'Create'} <span className="text-yellow-500 uppercase">{activeTab.slice(0, -1)}</span>
                                    </h2>
                                    <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Details & Meta Information</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                                {activeTab === 'products' ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Product Identity</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Vintage Leather Tote"
                                                    required
                                                    value={productForm.name}
                                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Premium Price (₦)</label>
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    required
                                                    value={productForm.price}
                                                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Inventory Level</label>
                                                <input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    required
                                                    value={productForm.stock}
                                                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Artisan Description</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Tell the story behind this piece..."
                                                value={productForm.description}
                                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 block">Product Visuals (Max 4)</label>
                                            
                                            {/* Preview Grid */}
                                            <div className="grid grid-cols-4 gap-4 mb-6">
                                                {/* Existing/Selected Images */}
                                                {[...productForm.image.filter(url => url && url.trim() !== ''), ...selectedFiles.map(f => URL.createObjectURL(f))].slice(0, 4).map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                if (idx < productForm.image.filter(url => url && url.trim() !== '').length) {
                                                                    // Remove existing URL
                                                                    const newImages = productForm.image.filter((_, i) => i !== idx);
                                                                    setProductForm({ ...productForm, image: newImages });
                                                                } else {
                                                                    // Remove selected file
                                                                    const fileIdx = idx - productForm.image.filter(url => url && url.trim() !== '').length;
                                                                    const newFiles = [...selectedFiles];
                                                                    newFiles.splice(fileIdx, 1);
                                                                    setSelectedFiles(newFiles);
                                                                }
                                                            }}
                                                            className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                ))}
                                                
                                                {/* Add Button Placeholder if < 4 */}
                                                {(productForm.image.filter(url => url && url.trim() !== '').length + selectedFiles.length) < 4 && (
                                                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-50/30 transition-all group">
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const files = Array.from(e.target.files);
                                                                const totalCurrent = productForm.image.filter(url => url && url.trim() !== '').length + selectedFiles.length;
                                                                const remaining = 4 - totalCurrent;
                                                                setSelectedFiles([...selectedFiles, ...files.slice(0, remaining)]);
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <svg className="w-6 h-6 text-gray-300 group-hover:text-yellow-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                        <span className="text-[8px] font-black text-gray-400 mt-1 uppercase">Add</span>
                                                    </label>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">ADD VIA URL</span>
                                                <input
                                                    type="text"
                                                    placeholder="Paste Cloudinary URL..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const url = e.target.value.trim();
                                                            if (url && productForm.image.length < 4) {
                                                                setProductForm({ ...productForm, image: [...productForm.image, url] });
                                                                e.target.value = '';
                                                            }
                                                        }
                                                    }}
                                                    className="flex-1 bg-gray-50 border-0 rounded-2xl px-5 py-3 text-sm text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Linked Product</label>
                                            <select
                                                required
                                                value={storyForm.productId}
                                                onChange={(e) => setStoryForm({ ...storyForm, productId: e.target.value })}
                                                className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium appearance-none"
                                            >
                                                <option value="">Select a product...</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Artist/Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Olabanji Ojo"
                                                required
                                                value={storyForm.title}
                                                onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                                                className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Narrative Content</label>
                                            <textarea
                                                rows="6"
                                                placeholder="The history and inspiration..."
                                                required
                                                value={storyForm.content}
                                                onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                                                className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Upload Exhibition Image</label>
                                            <div className="flex flex-col gap-3">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setSelectedFiles([e.target.files[0]])}
                                                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-gray-300 whitespace-nowrap">OR URL</span>
                                                    <input
                                                        type="text"
                                                        placeholder="https://..."
                                                        value={storyForm.image}
                                                        onChange={(e) => setStoryForm({ ...storyForm, image: e.target.value })}
                                                        className="flex-1 bg-gray-50 border-0 rounded-2xl px-5 py-2 text-sm text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-4 pt-2 pb-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-100 text-gray-400 font-bold hover:bg-gray-50 transition-all"
                                    >
                                        DISCARD
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className={`flex-[2] bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-yellow-600 shadow-xl shadow-yellow-600/20 active:scale-95 transition-all flex items-center justify-center ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                UPLOADING...
                                            </>
                                        ) : (
                                            editingItem ? 'APPLY CHANGES' : 'PUBLISH NOW'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin_dashboard;
