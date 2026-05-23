"use client";
import AddUserModal from '@/components/AddUserModal';
import UserTable from '@/components/UserTable'
import { userService } from '@/services/user-service';
import { User } from '@/types/user'
import { User as Users, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const UserAdminPage = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [filterUsers, setFilterUsers] = useState<User[]>([]);
    const [isModalOpen , setIsModalOpen] = useState<boolean>(false);

    const handleFetchUser = async () => {
        try {
            const resposne = await userService.getAll();
            if (resposne.success) {
                setUsers(resposne.data);
            }
        } catch (e: any) {
            console.log(e.message);
        }
    }

    const handleFilterByRole = (role: string) => {
        const filtered = users.filter((user) => user.roles.includes(role));
        setFilterUsers(filtered);
    };

    const handleSearchByName = (name: string) => {
        const filtered = users.filter((user) => user.fullName.toLowerCase().includes(name.toLowerCase()));
        setFilterUsers(filtered);
    };

    const handleDeleteByUserId = async (id: number) => {

    }

    const handleCallbackFromModal = () => {
        
    }

    useEffect(() => {
        handleFetchUser();
    }, []);

    return (
        <section className="relative h-full overflow-x-hidden p-12">

            <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                    <h1 className="flex items-center text-2xl text-gray-800 font-medium leading-12">
                        <button className="mr-2">
                            <Users />
                        </button>
                        User
                    </h1>
                    <p className="text-base text-gray-500/90">User management</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(!isModalOpen)}
                    className="flex items-center px-6 py-2 bg-orange-500 rounded-md text-white"
                >
                    <span className="mr-2">
                        <Plus/>
                    </span>
                    Create
                </button>
            </div>

            <div className="border border-slate-300 p-6 rounded-md bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <input
                            onChange={(e) => handleSearchByName(e.target.value)}
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-1.5 rounded-md outline-1 -outline-offset-2 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500"
                        />
                    </div>
                </div>

                <UserTable users={filterUsers.length > 0 ? filterUsers : users} handleDelete={handleDeleteByUserId} />

                {isModalOpen && <AddUserModal handleClose={() => setIsModalOpen(false)} />}
            </div>
        </section>
    )
}

export default UserAdminPage