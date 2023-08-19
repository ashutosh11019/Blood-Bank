import { Button, Modal, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import InventoryForm from './InventoryForm'
import { useDispatch } from 'react-redux'
import { SetLoading } from '../../../redux/loadersSlice'
import { GetInventory } from '../../../apicalls/inventory'
import { getDateFormat } from '../../../utils/helpers'

export default function Inventory() {
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
                if (record.inventoryType === 'in') {
                    return record.donor.name
                } else {
                    return record.hospital.hospitalName
                }
            }
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            render: (text) => getDateFormat(text)
        }
    ]

    const getData = async () => {
        try {
            dispatch(SetLoading(true))
            const response = await GetInventory()
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
            <div className='flex justify-end'>
                <Button type='primary' onClick={() => setOpen(true)}>Add Inventory</Button>
            </div>
            <Table columns={columns} dataSource={data} className='mt-3' />
            {open && <InventoryForm open={true} setOpen={setOpen} reloadData={getData} />}
        </div>
    )
}
