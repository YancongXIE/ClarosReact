import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { kAPI_URL } from '../../api/utils/constants';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [success, setSuccess] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState('');
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [newUserCredentials, setNewUserCredentials] = useState({
    email: '',
    password: ''
  });
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 检查用户角色
  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${kAPI_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      console.log('User profile data:', data);
      setUserRole(data.user.role);
      
      // 如果不是 manager，重定向到首页
      if (data.user.role !== 'manager') {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to check user role:', error);
      navigate('/');
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching users with token:', token.substring(0, 10) + '...');

      const response = await fetch(`${kAPI_URL}/users/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        if (response.status === 403) {
          throw new Error('You do not have permission to access this feature. Please contact your administrator.');
        }
        throw new Error(errorData.message || 'Failed to fetch users');
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    setSelectedUser(users.find(user => user.id === userId));
    setIsDeleteModalOpen(true);
  };

  // Confirm delete user
  const confirmDeleteUser = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${kAPI_URL}/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error.message);
    }
  };

  // 添加重置表单的函数
  const resetAddUserForm = () => {
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'admin'
    });
  };

  // 修改打开模态框的处理函数
  const handleOpenAddUserModal = () => {
    resetAddUserForm();
    setIsAddUserOpen(true);
  };

  // 修改关闭模态框的处理函数
  const handleCloseAddUserModal = () => {
    setIsAddUserOpen(false);
    resetAddUserForm();
  };

  // 修改修改密码的处理函数
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setPasswordError('');
      
      // 验证密码
      if (newPassword !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }

      if (newPassword.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${kAPI_URL}/users/${selectedUserForPassword.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      // 关闭模态框并重置状态
      setIsChangePasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      setSelectedUserForPassword(null);
      setSuggestedPassword('');
      
      // 显示成功消息
      toast.success(
        `Password successfully changed for ${selectedUserForPassword.firstName} ${selectedUserForPassword.lastName}`,
        {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#4CAF50',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500'
          },
        }
      );
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password: ' + (error.message || 'Unknown error'), {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500'
        },
      });
    }
  };

  // 修改生成密码建议函数
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setSuggestedPassword(password);
    if (isChangePasswordModalOpen) {
      setNewPassword(password);
      setConfirmPassword(password);
    } else {
      setNewUser({...newUser, password});
    }
  };

  // 复制密码到剪贴板
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: '#fff',
          padding: '12px',
          borderRadius: '6px',
        },
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      // 如果 navigator.clipboard 不可用，尝试使用传统方法
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Copied to clipboard', {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#4CAF50',
            color: '#fff',
            padding: '12px',
            borderRadius: '6px',
          },
        });
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        toast.error('Failed to copy to clipboard', {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#f44336',
            color: '#fff',
            padding: '12px',
            borderRadius: '6px',
          },
        });
      }
    }
  };

  // 修改添加用户的处理函数
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setEmailError('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // 确保所有必需字段都已填写
      if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
        throw new Error('Please fill in all required fields');
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.email)) {
        setEmailError('Please enter a valid email address');
        return;
      }

      // 构造要发送的用户数据
      const userData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role || 'admin'
      };

      console.log('Sending user data:', userData);

      const response = await fetch(`${kAPI_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        
        if (response.status === 400 && errorData.message === 'Email already registered') {
          setEmailError('This email is already registered. Please use a different email address.');
          return;
        }
        
        throw new Error(errorData.message || 'Failed to add user');
      }
      
      const data = await response.json();
      console.log('User added successfully:', data);
      
      // 显示成功信息和用户凭据
      toast.success('User added successfully', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });

      // 显示用户凭据对话框
      setNewUserCredentials({
        email: newUser.email,
        password: newUser.password
      });
      setShowCredentialsModal(true);
      
      // 重置表单并关闭添加用户模态框
      resetAddUserForm();
      setIsAddUserOpen(false);
      
      // 重新获取用户列表
      await fetchUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error(error.message || 'Failed to add user');
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 初始化组件
  useEffect(() => {
    checkUserRole();
  }, []);

  // 当用户角色更新时获取用户列表
  useEffect(() => {
    if (userRole === 'manager') {
      fetchUsers();
    }
  }, [userRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (userRole !== 'manager') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="rounded-full bg-red-100 p-4 w-16 h-16 mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-red-600">You do not have permission to access this feature.</p>
            <p className="mt-2 text-gray-600">Please contact your administrator for access.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={handleOpenAddUserModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>

        {/* Search box */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* User list */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <li key={user.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'manager' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUserForPassword(user);
                          setIsChangePasswordModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Change Password</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Add User Modal */}
        <Transition appear show={isAddUserOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={handleCloseAddUserModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      Add New User
                    </Dialog.Title>
                    <form onSubmit={handleAddUser}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            type="text"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            type="text"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => {
                              setNewUser({...newUser, email: e.target.value});
                              setEmailError('');
                            }}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              emailError 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                            required
                          />
                          {emailError && (
                            <p className="mt-1 text-sm text-red-600">{emailError}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={newUser.password}
                              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                {showPassword ? (
                                  <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={generatePassword}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Generate secure password
                            </button>
                            {suggestedPassword && (
                              <span className="text-sm text-gray-500">
                                Suggested password: {suggestedPassword}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Role</label>
                          <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCloseAddUserModal}
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Add User
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Delete Confirmation Modal */}
        <Transition appear show={isDeleteModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      Delete User
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}? This action cannot be undone.
                      </p>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmDeleteUser}
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      >
                        Delete
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* 添加用户凭据显示模态框 */}
        <Transition appear show={showCredentialsModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setShowCredentialsModal(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      New User Credentials
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Please save these credentials. They will not be shown again.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <input
                              type="text"
                              value={newUserCredentials.email}
                              readOnly
                              className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                            />
                            <button
                              onClick={() => copyToClipboard(newUserCredentials.email)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <ClipboardIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <input
                              type="text"
                              value={newUserCredentials.password}
                              readOnly
                              className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                            />
                            <button
                              onClick={() => copyToClipboard(newUserCredentials.password)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <ClipboardIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setShowCredentialsModal(false)}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* 修改密码模态框 */}
        <Transition appear show={isChangePasswordModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsChangePasswordModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      Change Password for {selectedUserForPassword?.firstName} {selectedUserForPassword?.lastName}
                    </Dialog.Title>
                    <form onSubmit={handleChangePassword}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Password</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                {showPassword ? (
                                  <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={generatePassword}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Generate secure password
                            </button>
                            {suggestedPassword && (
                              <span className="text-sm text-gray-500">
                                Suggested password: {suggestedPassword}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                {showPassword ? (
                                  <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        {passwordError && (
                          <p className="text-sm text-red-600">{passwordError}</p>
                        )}
                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsChangePasswordModalOpen(false)}
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Change Password
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default UserManagement; 