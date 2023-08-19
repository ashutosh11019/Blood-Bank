import { Button, Form, Input, Radio, message } from 'antd'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoginUser } from '../../apicalls/users'
import { useDispatch } from 'react-redux'
import { SetLoading } from '../../redux/loadersSlice'
import { getAntdInputValidation } from '../../utils/helpers'

export default function Login() {
    const [type, setType] = React.useState('donor')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onFinish = async (values) => {
        try {
            dispatch(SetLoading(true))
            const response = await LoginUser(
                {
                    ...values,
                    userType: type
                }
            )
            dispatch(SetLoading(false))
            if (response.success) {
                message.success(response.message)
                localStorage.setItem("token", response.data)
                navigate("/")
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            dispatch(SetLoading(false))
            message.error(error.message)
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/")
        }
    })

    return (
        <div className='flex h-screen items-center justify-center bg-primary'>
            <Form
                layout='vertical'
                className='bg-white rounded shadow grid grid-cols-1 p-5 gap-5 w-1/3'
                onFinish={onFinish}
            >
                <h1 className='uppercase text-4xl'>
                    <span className='text-primary'>
                        Login - {type.toUpperCase()}
                    </span>
                    <hr className='bg-primary' />
                </h1>

                <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
                    <Radio value="donor">Donor</Radio>
                    <Radio value="hospital">Hospital</Radio>
                    <Radio value="organization">Organization</Radio>
                </Radio.Group>

                <Form.Item label="Email id" name="email" rules={[getAntdInputValidation]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[getAntdInputValidation]}>
                    <Input type='password' />
                </Form.Item>

                <Button type="primary" className='bg-primary' htmlType='submit'>
                    Login
                </Button>

                <Link to="/register" className='text-center text-gray-800 underline'>
                    New user ? Registration
                </Link>
            </Form>
        </div>
    )
}
