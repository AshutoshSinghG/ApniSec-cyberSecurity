'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch('/api/users/profile');
            if (!response.ok) {
                router.push('/login');
                return;
            }
            const data = await response.json();
            setUser(data.user);
            setFormData({
                name: data.user.name,
                email: data.user.email,
            });
        } catch (err) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            setSuccess('Profile updated successfully!');
            setUser(data.user);
            setEditing(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-primary text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <nav className="bg-cyber-gray border-b border-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <span className="text-2xl font-bold text-white">
                            apni <span className="text-primary">sec</span>
                        </span>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-gray-300 hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-black bg-primary rounded-md hover:bg-primary-dark transition-colors font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>

                {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-primary/10 border border-primary/50 text-primary px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                <div className="bg-cyber-gray border border-primary/20 rounded-lg p-8">
                    {!editing ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <p className="text-xl text-white">{user?.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <p className="text-xl text-white">{user?.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Member Since</label>
                                <p className="text-xl text-white">
                                    {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <button
                                onClick={() => setEditing(true)}
                                className="px-6 py-3 text-black font-semibold bg-primary rounded-md hover:bg-primary-dark transition-all duration-300"
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    minLength={2}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-6 py-3 text-black font-semibold bg-primary rounded-md hover:bg-primary-dark transition-all duration-300"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        setFormData({
                                            name: user?.name || '',
                                            email: user?.email || '',
                                        });
                                        setError('');
                                    }}
                                    className="px-6 py-3 text-white bg-cyber-gray border border-primary/20 rounded-md hover:border-primary/50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
