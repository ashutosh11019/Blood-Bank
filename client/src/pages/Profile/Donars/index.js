import React, { useEffect, useState } from 'react'
import { SetLoading } from '../../../redux/loadersSlice'
import { useDispatch } from 'react-redux'
import { Table, message } from 'antd'
import { GetAllDonarsofAnOrganization } from '../../../apicalls/users'
import { getDateFormat } from '../../../utils/helpers'

export default function Donars() {
    const [data, setData] = useState([])
    const dispatch = useDispatch()


    const getData = async () => {
        try {
            dispatch(SetLoading(true))
            const response = await GetAllDonarsofAnOrganization()
            dispatch(SetLoading(false))
            if (response.success) {
                setData(response.data)
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            message.error(error.message)
            dispatch(SetLoading(false))
        }
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Email id",
            dataIndex: "email"
        },
        {
            title: "Phone",
            dataIndex: "phone"
        },
        {
            title: "Created At",
            dataIndex: "CreatedAt",
            render: (text) => getDateFormat(text)
        }
    ]

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}
