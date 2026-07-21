"use client";
import AddUserModal from "@/components/AddUserModal";
import Loading from "@/components/Loading";
import StatsCard from "@/components/StatsCard";
import UpdateCustomerModal from "@/components/UpdateCustomerModal";
import UserTable from "@/components/UserTable";
import { useAppContext } from "@/context/AppContext";
import { userService } from "@/services/user-service";
import { User } from "@/types/user";
import { ChevronRight, Home, Plus, UserKey, Users, UserStarIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserAdminPage = () => {
  const { sessionReady } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [filterUsers, setFilterUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchUser = async () => {
    try {
      const res = await userService.getAll();
      if (res.success) setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchByName = (name: string) => {
    const q = name.toLowerCase();
    setFilterUsers(
      name.trim()
        ? users.filter((u) => u.fullName.toLowerCase().includes(q))
        : [],
    );
  };

  const handleFilterByRole = (role: string) => {
    setRoleFilter(role);
    setFilterUsers(role ? users.filter((u) => u.roles.includes(role)) : []);
  };

  const handleDeleteByUserId = async (id: number) => {
    try {
      const response = await userService.delete(id);
      if (response.success) {
        toast.success("User deleted successfully.");
        handleFetchUser();
      }
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  useEffect(() => {
    if (!sessionReady) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await userService.getAll();
        if (res.success) setUsers(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [sessionReady]);

  const roles = [...new Set(users.flatMap((u) => u.roles))];
  const displayed = filterUsers.length > 0 || roleFilter ? filterUsers : users;

  const customers = users.filter((u) =>
    u.roles.includes("ROLE_CUSTOMER"),
  ).length;
  const admins = users.filter((u) => u.roles.includes("ROLE_ADMIN")).length;

  const statCards = [
    { label: "Total Users", value: users.length, color: "text-slate-900" },
    { label: "Customers", value: customers, color: "text-emerald-600" },
    { label: "Admins", value: admins, color: "text-indigo-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1 hover:text-slate-800 transition-colors"
        >
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Users List</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Users List</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage customer, seller, and admin accounts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-12 lg:grid-cols-3">
        <StatsCard icon={<Users className="text-indigo-500" size={30} />} accent="bg-indigo-50" label="Total Users" value={users.length} trend={+2} />
        <StatsCard icon={<UserStarIcon className="text-indigo-500" size={30} />} accent="bg-indigo-50" label="Customers" value={customers} trend={+2} />
        <StatsCard icon={<UserKey className="text-indigo-500" size={30} />} accent="bg-indigo-50" label="Admins" value={admins} trend={+2} />
      </div>

      {/* Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <UserTable
          users={displayed}
          handleDelete={handleDeleteByUserId}
          handleUpdate={setEditUser}
          option={
            <Option
              roles={roles}
              handleSearchByName={handleSearchByName}
              handleFilterByRole={handleFilterByRole}
            />
          }
        />
      )}

      {isModalOpen && (
        <AddUserModal
          handleCloseAction={() => setIsModalOpen(false)}
          onCreateSuccessAction={() => {
            setIsModalOpen(false);
            handleFetchUser();
          }}
        />
      )}

      {editUser && (
        <UpdateCustomerModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdated={handleFetchUser}
        />
      )}
    </div>
  );
};

export default UserAdminPage;

type OptionType = {
  roles: string[];
  handleSearchByName: (name: string) => void;
  handleFilterByRole: (role: string) => void;
}

export const Option: React.FC<OptionType> = ({ roles, handleSearchByName, handleFilterByRole }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <input
            onChange={e => handleSearchByName(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md"
            type="text"
            placeholder="Search"
          />
        </div>

        <div>
          <select
            onChange={(e) => handleFilterByRole(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md">
            <option value="all">All Product</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}