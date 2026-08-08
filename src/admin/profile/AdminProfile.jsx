import { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginRequiredCard from '../../components/LoginRequiredCard'
import { useToast } from '../../components/ToastProvider'
import { Pencil } from 'lucide-react'
import { API_URL, getImageUrl, uploadImageToCloudinary } from "../../utils/config"
import SellerStoreInfo from './SellerStoreInfo'
import ViewSellerStore from './ViewSellerStore'

const getStoredUser = () => {
  try {
    const raw = window.localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    return null
  }
}

const normalizeUserPayload = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null
  }

  const candidates = [
    payload.user,
    payload.userData,
    payload.data?.user,
    payload.data?.userData,
    payload.data,
    payload,
  ]

  return candidates.find(
    (candidate) => candidate && typeof candidate === 'object' && !Array.isArray(candidate),
  ) || null
}

const persistStoredUser = (user) => {
  window.localStorage.setItem('user', JSON.stringify(user))
}

const getUserId = (value) => value?.id || value?._id || value?.userId || ''

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('Failed to read profile image.'))
  reader.readAsDataURL(file)
})

const AdminProfile = () => {
  const [profileview, setProfileView] = useState(true)
  const [editprofile, setEditProfile] = useState(false)
  const [user, setUser] = useState(getStoredUser()?.user || getStoredUser()?.userData || getStoredUser() || null)
  const [isSaving, setIsSaving] = useState(false)
  const { addToast } = useToast()

  const token = typeof window !== 'undefined'
    ? window.localStorage.getItem('token') || window.localStorage.getItem('accessToken') || window.localStorage.getItem('authToken') || window.localStorage.getItem('jwt')
    : ''

  if (!token) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <LoginRequiredCard
            title="Profile requires login"
            message="Please login to view your profile."
          />
        </div>
      </section>
    )
  }

 

  const updateProfileOnServer = async (payload) => {
    if (!API_URL) return { user: payload, mode: 'local' }

    const userId = getUserId(user)
    if (!userId) return { user: payload, mode: 'local' }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-auth-token': token,
        'x-access-token': token,
      },
      body: JSON.stringify(payload),
    })

    if (response.status === 401 || response.status === 403 || response.status === 404) {
      return { user: payload, mode: 'local' }
    }

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Failed to update profile (${response.status}): ${text}`)
    }

    const text = await response.text()
    if (!text) return { user: payload, mode: 'server' }

    try {
      return {
        user: normalizeUserPayload(JSON.parse(text)) || payload,
        mode: 'server',
      }
    } catch {
      return { user: payload, mode: 'server' }
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      profileimg: user.profileimg,
    }

    setIsSaving(true)

    try {
      const { user: serverUser, mode } = await updateProfileOnServer(payload)
      const updatedUser = {
        ...user,
        ...payload,
        ...serverUser,
        updatedAt: serverUser?.updatedAt || new Date().toISOString(),
      }

      setUser(updatedUser)
      persistStoredUser(updatedUser)
      setEditProfile(false)
      setProfileView(true)
      addToast(mode === 'server' ? 'Profile updated successfully.' : 'Profile saved on this device.', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to update profile.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const uploadProfileImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      setUser({ ...user, profileimg: uploadedUrl });
    } catch (err) {
      addToast('Failed to upload image.', 'error');
    }

  }

  const profileImageSrc = getImageUrl(user?.profileimg) || 'https://via.placeholder.com/150'

  return (
    <>
    <section className="py-6">
      <div className="container mx-auto px-4">

        {profileview && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className=" grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">Profile</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">My account <Link to="#" onClick={() => { setEditProfile(true); setProfileView(false); }}><Pencil className="inline-block w-4 h-4 ml-2" /></Link></h1>

              </div>
              <div className=' w-full relative'>

                <img
                  src={profileImageSrc}
                  alt="Profile"
                  className="w-25 h-25 rounded-full object-cover border-4 border-gray-200 shadow pull-right" />


              </div>

            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Name</p>
                <p className="mt-1 font-semibold text-slate-900">{user?.name || 'Not available'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 font-semibold text-slate-900 break-all">{user?.email || 'Not available'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Mobile</p>
                <p className="mt-1 font-semibold text-slate-900 break-all">{user?.phone || 'Not available'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Gender</p>
                <p className="mt-1 font-semibold text-slate-900 break-all">{user?.gender || 'Not available'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Date of Birth</p>
                <p className="mt-1 font-semibold text-slate-900 break-all">{user?.dob || 'Not available'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-1 font-semibold text-slate-900">{user?.role || 'buyer'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">User ID</p>
                <p className="mt-1 font-semibold text-slate-900 break-all">{user?.id || user?._id || user?.userId || 'Not available'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Last Updated</p>
                <p className="mt-1 font-semibold text-slate-900 break-all">{user?.updatedAt || 'Not available'}</p>
              </div>
            </div>
          </div>
        )}
        {editprofile && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className=" ">
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">Profile</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Edit Profile</h1>
                  </div>
                 <div className="flex justify-center sm:justify-start">
                    <img
                      src={profileImageSrc}
                      alt="Profile preview"
                      className="h-24 w-24 rounded-full border-4 border-gray-200 object-cover shadow"
                    />
              </div>
              </div>
              <form onSubmit={onSubmit}>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>

                  <div>
                    <label className="block">
                      <span className="text-gray-700">Name</span>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-red-500"
                        value={user?.name || ''}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Email</span>
                      <input
                        type="email" readOnly
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-red-500"
                        value={user?.email || ''}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Mobile Number</span>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-red-500"
                        value={user?.phone || ''}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block">
                      <span className="text-gray-700">Date of Birth</span>
                      <input
                        type="date"
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-red-500"
                        value={user?.dob || ''}
                        onChange={(e) => setUser({ ...user, dob: e.target.value })}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Gender</span>
                      <select
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-red-500"
                        value={user?.gender || ''}
                        onChange={(e) => setUser({ ...user, gender: e.target.value })}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Profile Picture</span>
                      
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" onChange={uploadProfileImage}
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </label>
                  </div>
                  <div>
                    <button type='submit' disabled={isSaving} className=' bg-green-600 w-full font-bold text-white px-6 py-3 rounded-lg disabled:cursor-not-allowed disabled:bg-green-400'>{isSaving ? 'Saving...' : 'Update Profile'}</button>
                  </div>
                  <div>
                    <button type='button' onClick={() => { setEditProfile(false); setProfileView(true) }} className=' w-full bg-gray-600 font-bold text-white px-6 py-3 rounded-lg'>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
      {/* <SellerStoreInfo /> */}
      <ViewSellerStore />
    </>
  )
}

export default AdminProfile