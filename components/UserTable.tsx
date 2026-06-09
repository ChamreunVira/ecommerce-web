import React from 'react'
import Table, { Column } from './Table';
import { User } from '@/types/user';
import { Edit, Trash } from 'lucide-react';

type UserTableType = {
  users: User[];
  handleDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableType> = ({ users, handleDelete }) => {
  const columns: Column<User & { actions: string } | any>[] = [
    {
      header: "#",
      key: "id",
      className: "w-16",
    },
    {
      header: "Name",
      key: "fullName"
    },
    {
      header: "Email",
      key: "email"
    },
    {
      header: "Roles",
      key: "roles"
    },
    {
      header: "UpdatedAt",
      key: "updatedAt"
    },
    {
      header: "Actions",
      key: "actions",
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-amber-500 rounded-full hover:bg-amber-100">
            <Edit className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-rose-500 p-1.5 rounded-full hover:bg-rose-100">
            <Trash className="w-4.5 h-4.5" />
          </button>
        </div>
      ),
    }
  ];

  return <Table data={users} columns={columns} />;
}

export default UserTable