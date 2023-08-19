import React, { useEffect, useState } from 'react'
import { SetLoading } from '../../../redux/loadersSlice'
import { useDispatch } from 'react-redux'
import { Table, message } from 'antd'
import { GetAllHospitalsofAnOrganization } from '../../../apicalls/users'
import { getDateFormat } from '../../../utils/helpers'

export default function Hospitals() {
    const [data, setData] = useState([])
    const dispatch = useDispatch()


    const getData = async () => {
        try {
            dispatch(SetLoading(true))
            const response = await GetAllHospitalsofAnOrganization()
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
            title: "Hospital Name",
            dataIndex: "hospitalName"
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
            title: "Owner",
            dataIndex: "owner"
        },
        {
            title: "Address",
            dataIndex: "address"
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
