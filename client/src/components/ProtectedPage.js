import React, { useEffect, useState } from 'react'
import { GetCurrentUser } from '../apicalls/users'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getLoggedInUserName } from '../utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { SetCurrentUser } from '../redux/usersSlice'

export default function ProtectedPage({ children }) {
    // const [currentUser, SetCurrentUser] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.users)

    const getCurrentUser = async () => {
        try {
            const response = await GetCurrentUser()
            if (response.success) {
                message.success(response.message)
                dispatch(SetCurrentUser(response.data))
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            message.error(error.message)
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getCurrentUser()
        } else {
            navigate("/login")
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate('/login')
    }

    return (
        currentUser && (
            <div>
                <div className='flex justify-between items-center bg-primary text-white px-5 py-3 mx-5 rounded-xl'>
                    <div className='cursor-pointer' onClick={() => navigate("/")}>
                        <h1 className='text-2xl'>ASHU BLOODBANK</h1>
                        <span className='text-xs'>{currentUser.userType.toUpperCase()}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <i className="ri-shield-user-line"></i>
                        <div className='flex flex-col'>
                            <span className='mr-5 text-md underline cursor-pointer' onClick={() => navigate('/profile')}>
                                {getLoggedInUserName(currentUser).toUpperCase()}
                            </span>
                        </div>
                        <i className="ri-logout-box-line ml-5 cursor-pointer" onClick={handleLogout}></i>
                    </div>
                </div>
                <div className='px-5 py-5'>{children}</div>
            </div>
        )
    )
}
