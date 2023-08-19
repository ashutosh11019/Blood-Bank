import React, { useEffect, useState } from 'react'
import { SetLoading } from '../../../redux/loadersSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Table, message } from 'antd'
import { GetAllOrganizationfADonor, GetAllOrganizationfAHospital } from '../../../apicalls/users'
import { getDateFormat } from '../../../utils/helpers'
import InventoryTable from '../../../components/InventoryTable'

export default function Organizations({ userType }) {
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const {currentUser} = useSelector((state) => state.users)
    const [selectedOrganization, setSelectedOrganization] = useState(null)
    const [data, setData] = useState([])
    const dispatch = useDispatch()


    const getData = async () => {
        try {
            dispatch(SetLoading(true))
            let response = null
            if (userType === "hospital") {
                response = await GetAllOrganizationfAHospital()
            } else {
                response = await GetAllOrganizationfADonor()
            }
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
            dataIndex: "organizationName"
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
            title: "Address",
            dataIndex: "address"
        },
        {
            title: "Owner",
            dataIndex: "owner"
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => (
                <span className="underline text-md cursor-pointer" onClick={() => {
                    setSelectedOrganization(record)
                    setShowHistoryModal(record)
                }} >
                    History
                </span>
            )
        }
    ]

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <Table columns={columns} dataSource={data} />

            {showHistoryModal && (<Modal 
                title={
                    `${
                        userType === "donor" ? "Donation History" : "Consumption History"
                    } In ${selectedOrganization.organizationName}`
                }
                centered
                open={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                width={1000}
                onCancel={() => setShowHistoryModal(false)}
            >
                <InventoryTable filters={{organization: selectedOrganization._id, [userType]: currentUser._id}} />
            </Modal> )}
        </div>
    )
}
