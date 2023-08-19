import { Button, Form, Input, Radio, message } from 'antd'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OrgHospitalForm from './OrgHospitalForm'
import { RegisterUser } from '../../apicalls/users'
import { getAntdInputValidation } from '../../utils/helpers'
import { useDispatch } from 'react-redux'
import { SetLoading } from '../../redux/loadersSlice'

export default function Register() {
    const [type, setType] = React.useState('donor')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onFinish = async (values) => {
        try {
            dispatch(SetLoading(true))
            const response = await RegisterUser({ ...values, userType: type })
            dispatch(SetLoading(false))
            if (response.success) {
                message.success(response.message)
                navigate("/login")
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
                className='bg-white rounded shadow grid grid-cols-2 p-5 gap-5 w-1/2'
                onFinish={onFinish}
            >
                <h1 className='uppercase text-4xl col-span-2'>
                    <span className='text-primary'>
                        Registration - {type.toUpperCase()}
                    </span>
                    <hr className='bg-primary' />
                </h1>

                <Radio.Group onChange={(e) => setType(e.target.value)} value={type} className='col-span-2'>
                    <Radio value="donor">Donor</Radio>
                    <Radio value="hospital">Hospital</Radio>
                    <Radio value="organization">Organization</Radio>
                </Radio.Group>

                {type === 'donor' && (
                    <>
                        {" "}
                        <Form.Item label="Name" name="name" rules={[getAntdInputValidation]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email id" name="email" rules={[getAntdInputValidation]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Phone No." name="phone" rules={[getAntdInputValidation]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Password" name="password" rules={[getAntdInputValidation]}>
                            <Input type='password' />
                        </Form.Item>
                    </>
                )}

                {type !== 'donor' && <OrgHospitalForm type={type} />}

                <Button type="primary" className='bg-primary col-span-2' htmlType='submit'>
                    Register
                </Button>

                <Link to="/login" className='text-center text-gray-800 underline col-span-2'>
                    Already have an account ? Login
                </Link>
            </Form>
        </div>
    )
}
