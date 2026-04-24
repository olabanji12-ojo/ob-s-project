import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

const Contact_form = () => {
    const [status, setStatus] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        requirements: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate sending for now
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', requirements: '' });
        }, 1500);
    };

    return (
        <section className="py-24 bg-[#FDFCFB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20" data-aos="fade-up">
                    <h2 className="text-4xl sm:text-5xl font-serif font-black text-gray-900 mb-6">
                        Start Your <span className="italic text-[#8B5E3C]">Narrative</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Have a specific requirement or want to discuss a custom piece? Our artisans are ready to bring your story to life.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Info */}
                    <div className="space-y-12" data-aos="fade-right">
                        <div className="bg-[#f7f3f0] p-10 rounded-[3rem] space-y-10">
                            <h3 className="text-2xl font-serif font-bold text-gray-900">Get In Touch</h3>
                            
                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                        <MapPin className="w-5 h-5 text-[#8B5E3C]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Our Studio</p>
                                        <p className="text-gray-900 font-medium">Lagos, Nigeria</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                        <Mail className="w-5 h-5 text-[#8B5E3C]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Us</p>
                                        <p className="text-gray-900 font-medium whitespace-nowrap">knotsstories@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-10">
                            <p className="text-sm text-gray-400 leading-relaxed italic">
                                "Every stitch we make is a promise of quality and a chapter in a story we share with you."
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50" data-aos="fade-left">
                        <form 
                            action="https://formspree.io/f/emmanuelojo291@gmail.com" 
                            method="POST" 
                            className="space-y-6"
                        >
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-[#8B5E3C]/10 transition-all font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-[#8B5E3C]/10 transition-all font-medium"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-[#8B5E3C]/10 transition-all font-medium"
                                    placeholder="Custom Order Inquiry"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Your Requirements</label>
                                <textarea
                                    name="message"
                                    rows="5"
                                    required
                                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-[#8B5E3C]/10 transition-all font-medium"
                                    placeholder="Describe what you are looking for..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-[#8B5E3C] shadow-xl shadow-gray-900/10 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Send className="w-5 h-5" />
                                SEND MESSAGE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact_form;
