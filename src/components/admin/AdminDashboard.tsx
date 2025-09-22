import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  UserPlus, 
  Edit3, 
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { User, SystemStats, GradingScale } from '../../types';

// Mock data for demonstration
const mockUsers: User[] = [
  { id: '1', email: 'student1@rwanda.rw', name: 'John Uwimana', role: 'student', createdAt: new Date('2024-01-15'), lastLogin: new Date(), isActive: true },
  { id: '2', email: 'student2@rwanda.rw', name: 'Alice Mukamana', role: 'student', createdAt: new Date('2024-01-20'), lastLogin: new Date('2024-12-15'), isActive: true },
  { id: '3', email: 'lecturer1@rwanda.rw', name: 'Dr. Marie Mukamana', role: 'lecturer', createdAt: new Date('2024-01-10'), lastLogin: new Date(), isActive: true },
  { id: '4', email: 'lecturer2@rwanda.rw', name: 'Prof. Paul Kagame', role: 'lecturer', createdAt: new Date('2024-01-05'), lastLogin: new Date('2024-12-14'), isActive: true },
  { id: '5', email: 'student3@rwanda.rw', name: 'Grace Uwimana', role: 'student', createdAt: new Date('2024-02-01'), lastLogin: new Date('2024-12-10'), isActive: false },
];

const mockStats: SystemStats = {
  totalUsers: 156,
  totalStudents: 120,
  totalLecturers: 35,
  totalPapersGraded: 2847,
  totalQuestionsAnalyzed: 15420,
  averageGrade: 78.5,
  activeUsersToday: 42
};

const defaultGradingScale: GradingScale = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 0
};

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'users' | 'analytics' | 'settings'>('overview');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'lecturer'>('all');
  const [gradingScale, setGradingScale] = useState<GradingScale>(defaultGradingScale);
  const [showInactive, setShowInactive] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesActive = showInactive || user.isActive;
    return matchesSearch && matchesRole && matchesActive;
  });

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleEditUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setShowEditModal(false);
      setEditingUser(null);
    }
  };

  const realStats = mockStats;

  const exportAllData = () => {
    // Export functionality
  };

  const resetGradingScale = () => {
    setGradingScale(defaultGradingScale);
  };

  const saveGradingScale = () => {
    // Save functionality
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.totalUsers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Papers Graded</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.totalPapersGraded.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.averageGrade}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+2.3% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Today</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.activeUsersToday}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+15% from yesterday</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent System Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <BookOpen className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dr. Marie Mukamana graded 15 papers</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">5 new students registered</p>
                  <p className="text-sm text-gray-500">4 hours ago</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">System backup completed successfully</p>
                  <p className="text-sm text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <>
      <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New User
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'student' | 'lecturer')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="lecturer">Lecturers</option>
            </select>
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                showInactive ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {showInactive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showInactive ? 'Hide Inactive' : 'Show Inactive'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'lecturer' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'student' | 'lecturer' | 'admin'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editActive"
                  checked={editingUser.isActive}
                  onChange={(e) => setEditingUser({...editingUser, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="editActive" className="text-sm text-gray-700">Active User</label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">System Analytics</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">User Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students</span>
                <span className="font-medium">{realStats.totalStudents} ({realStats.totalUsers > 0 ? Math.round((realStats.totalStudents / realStats.totalUsers) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${realStats.totalUsers > 0 ? (realStats.totalStudents / realStats.totalUsers) * 100 : 0}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lecturers</span>
                <span className="font-medium">{realStats.totalLecturers} ({realStats.totalUsers > 0 ? Math.round((realStats.totalLecturers / realStats.totalUsers) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${realStats.totalUsers > 0 ? (realStats.totalLecturers / realStats.totalUsers) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Grading Statistics</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Papers Graded</span>
                <span className="font-medium">{realStats.totalPapersGraded}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Questions Analyzed</span>
                <span className="font-medium">{realStats.totalQuestionsAnalyzed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Grade</span>
                <span className="font-medium">{realStats.averageGrade}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users Today</span>
                <span className="font-medium">{realStats.activeUsersToday}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Export Reports</h3>
          <button 
            onClick={exportAllData}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">User Report</span>
            </div>
            <p className="text-sm text-gray-600">Export all user data and statistics</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center mb-2">
              <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Grading Report</span>
            </div>
            <p className="text-sm text-gray-600">Export grading statistics and trends</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium">Activity Report</span>
            </div>
            <p className="text-sm text-gray-600">Export system activity logs</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Grading Scale Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade A (Minimum %)</label>
              <input
                type="number"
                value={gradingScale.A}
                onChange={(e) => setGradingScale({...gradingScale, A: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade B (Minimum %)</label>
              <input
                type="number"
                value={gradingScale.B}
                onChange={(e) => setGradingScale({...gradingScale, B: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade C (Minimum %)</label>
              <input
                type="number"
                value={gradingScale.C}
                onChange={(e) => setGradingScale({...gradingScale, C: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade D (Minimum %)</label>
              <input
                type="number"
                value={gradingScale.D}
                onChange={(e) => setGradingScale({...gradingScale, D: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Current Scale Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>A:</span>
                  <span>{gradingScale.A}% - 100%</span>
                </div>
                <div className="flex justify-between">
                  <span>B:</span>
                  <span>{gradingScale.B}% - {gradingScale.A - 1}%</span>
                </div>
                <div className="flex justify-between">
                  <span>C:</span>
                  <span>{gradingScale.C}% - {gradingScale.B - 1}%</span>
                </div>
                <div className="flex justify-between">
                  <span>D:</span>
                  <span>{gradingScale.D}% - {gradingScale.C - 1}%</span>
                </div>
                <div className="flex justify-between">
                  <span>F:</span>
                  <span>0% - {gradingScale.D - 1}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={resetGradingScale}
            className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
          >
            Reset to Default
          </button>
          <button 
            onClick={saveGradingScale}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Mount Kigali Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Mount Kigali System Administration</h2>
              <p className="text-purple-100 mb-4">
                Manage users, monitor system performance, and configure Mount Kigali platform settings.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{mockStats.totalUsers} Total Users</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>{mockStats.totalPapersGraded.toLocaleString()} Papers Graded</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setCurrentView('overview')}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setCurrentView('users')}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'users'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'analytics'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'settings'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Main Content */}
        {currentView === 'overview' && renderOverview()}
        {currentView === 'users' && renderUsers()}
        {currentView === 'analytics' && renderAnalytics()}
        {currentView === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;