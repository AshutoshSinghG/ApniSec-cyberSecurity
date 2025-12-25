'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    name: string;
    email: string;
}

interface Issue {
    _id: string;
    type: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
    const [formData, setFormData] = useState({
        type: 'cloud-security',
        title: '',
        description: '',
        priority: 'medium',
        status: 'open',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        checkAuth();
        fetchIssues();
    }, []);

    useEffect(() => {
        let filtered = issues;

        // Filter by type
        if (filter !== 'all') {
            filtered = filtered.filter(issue => issue.type === filter);
        }

        // Filter by priority
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(issue => issue.priority === priorityFilter);
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(issue => issue.status === statusFilter);
        }

        // Search by title or description
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(issue =>
                issue.title.toLowerCase().includes(query) ||
                issue.description.toLowerCase().includes(query)
            );
        }

        setFilteredIssues(filtered);
    }, [filter, priorityFilter, statusFilter, searchQuery, issues]);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (!response.ok) {
                router.push('/login');
                return;
            }
            const data = await response.json();
            setUser(data.user);
        } catch (err) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchIssues = async () => {
        try {
            const response = await fetch('/api/issues');
            if (response.ok) {
                const data = await response.json();
                setIssues(data.issues);
            }
        } catch (err) {
            console.error('Failed to fetch issues:', err);
        }
    };

    const handleCreateIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/issues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create issue');
            }

            setSuccess('Issue created successfully!');
            setFormData({
                type: 'cloud-security',
                title: '',
                description: '',
                priority: 'medium',
                status: 'open',
            });
            setShowCreateForm(false);
            fetchIssues();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEditIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingIssue) return;

        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/issues/${editingIssue._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update issue');
            }

            setSuccess('Issue updated successfully!');
            setShowEditForm(false);
            setEditingIssue(null);
            fetchIssues();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const openEditForm = (issue: Issue) => {
        setEditingIssue(issue);
        setFormData({
            type: issue.type,
            title: issue.title,
            description: issue.description,
            priority: issue.priority,
            status: issue.status,
        });
        setShowEditForm(true);
        setShowCreateForm(false);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleDeleteIssue = async (issueId: string) => {
        if (!confirm('Are you sure you want to delete this issue?')) {
            return;
        }

        try {
            const response = await fetch(`/api/issues/${issueId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSuccess('Issue deleted successfully');
                fetchIssues();
            }
        } catch (err) {
            setError('Failed to delete issue');
        }
    };

    const resetFilters = () => {
        setFilter('all');
        setPriorityFilter('all');
        setStatusFilter('all');
        setSearchQuery('');
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
                            <Link href="/profile" className="text-gray-300 hover:text-primary transition-colors">
                                Profile
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome back, <span className="text-primary">{user?.name}</span>!
                    </h1>
                    <p className="text-gray-400">Manage your cybersecurity issues</p>
                </div>

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

                <div className="mb-6">
                    <button
                        onClick={() => {
                            setShowCreateForm(!showCreateForm);
                            setShowEditForm(false);
                        }}
                        className="px-6 py-3 text-black font-semibold bg-primary rounded-md hover:bg-primary-dark transition-all duration-300"
                    >
                        {showCreateForm ? 'Cancel' : 'Create New Issue'}
                    </button>
                </div>

                {/* Create Issue Form */}
                {showCreateForm && (
                    <div className="mb-8 bg-cyber-gray border border-primary/20 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Create New Issue</h2>
                        <form onSubmit={handleCreateIssue} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Issue Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="cloud-security">Cloud Security</option>
                                        <option value="red-team">Red Team Assessment</option>
                                        <option value="vapt">VAPT</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    minLength={5}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                    placeholder="Issue title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    required
                                    minLength={10}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                    placeholder="Describe the issue..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-3 text-black font-semibold bg-primary rounded-md hover:bg-primary-dark transition-all duration-300"
                            >
                                Create Issue
                            </button>
                        </form>
                    </div>
                )}

                {/* Edit Issue Form */}
                {showEditForm && editingIssue && (
                    <div className="mb-8 bg-cyber-gray border border-primary/20 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Edit Issue</h2>
                        <form onSubmit={handleEditIssue} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Issue Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="cloud-security">Cloud Security</option>
                                        <option value="red-team">Red Team Assessment</option>
                                        <option value="vapt">VAPT</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    minLength={5}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                    placeholder="Issue title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    required
                                    minLength={10}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-black border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                    placeholder="Describe the issue..."
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-6 py-3 text-black font-semibold bg-primary rounded-md hover:bg-primary-dark transition-all duration-300"
                                >
                                    Update Issue
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditForm(false);
                                        setEditingIssue(null);
                                    }}
                                    className="px-6 py-3 text-white bg-cyber-gray border border-primary/20 rounded-md hover:border-primary/50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search and Filters - Single Line with Dropdowns */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="🔍 Search issues..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-3 bg-cyber-gray border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        />

                        {/* Type Filter */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-3 bg-cyber-gray border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Types</option>
                            <option value="cloud-security">Cloud Security</option>
                            <option value="red-team">Red Team</option>
                            <option value="vapt">VAPT</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-3 bg-cyber-gray border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-cyber-gray border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>

                        {/* Clear Filters */}
                        <button
                            onClick={resetFilters}
                            className="px-4 py-3 bg-cyber-gray border border-primary/30 rounded-lg text-gray-400 hover:text-primary hover:border-primary transition-colors"
                            title="Clear all filters"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Issues ({filteredIssues.length})
                    </h2>
                    {filteredIssues.length === 0 ? (
                        <div className="bg-cyber-gray border border-primary/20 rounded-lg p-8 text-center">
                            <p className="text-gray-400">
                                No issues found. {searchQuery || filter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Create your first issue!'}
                            </p>
                        </div>
                    ) : (
                        filteredIssues.map((issue) => (
                            <div
                                key={issue._id}
                                className="bg-cyber-gray border border-primary/20 rounded-lg p-6 hover:border-primary transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white">{issue.title}</h3>
                                    <div className="flex gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${issue.priority === 'critical'
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                    : issue.priority === 'high'
                                                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                        : issue.priority === 'medium'
                                                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                            : 'bg-primary/20 text-primary border border-primary/30'
                                                }`}
                                        >
                                            {issue.priority}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                            {issue.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-3">{issue.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-md text-xs bg-primary/20 text-primary border border-primary/30">
                                            {issue.type}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(issue.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditForm(issue)}
                                            className="px-4 py-1 text-sm text-primary hover:text-primary-light transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteIssue(issue._id)}
                                            className="px-4 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
