import { GetInventoryWithFilter } from '../apicalls/inventory'
import { Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getDateFormat } from '../utils/helpers'
import { SetLoading } from '../redux/loadersSlice'

export default function InventoryTable({ filters, userType, limit }) {
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()

    const columns = [
        {
            title: "Inventory Type",
            dataIndex: "inventoryType",
            render: (text) => text.toUpperCase()
        },
        {
            title: "Blood Group",
            dataIndex: "bloodGroup",
            render: (text) => text.toUpperCase()
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            render: (text) => text + " ML"
        },
        {
            title: "Reference",
            dataIndex: "reference",
            render: (text, record) => {
                if (userType === "organization") {
                    return record.inventoryType === "in" ? record.donor.name : record.hospital.hospitalName
                } else {
                    return record.organization.organizationName
                }
            }
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            render: (text) => getDateFormat(text)
        }
    ]

    if (userType !== "organization") {
        columns.splice(0, 1)
        columns[2].title = "OrganizationName"
        columns[3].title = userType === "hospital" ? "Taken Date" : "Donated Date"
    }

    const getData = async () => {
        try {
            dispatch(SetLoading(true))
            const response = await GetInventoryWithFilter(filters, limit)
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

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <Table columns={columns} dataSource={data} className='mt-3' />
        </div>
    )
}
