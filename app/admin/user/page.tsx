"use client";
import AddUserModal from "@/components/AddUserModal";
import Loading from "@/components/Loading";
import SearchInput from "@/components/SearchInput";
import UpdateCustomerModal from "@/components/UpdateCustomerModal";
import UserTable from "@/components/UserTable";
import { userService } from "@/services/user-service";
import { User } from "@/types/user";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserAdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterUsers, setFilterUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFetchUser = async () => {
    try {
      const resposne = await userService.getAll();
      if (resposne.success) {
        setUsers(resposne.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterByRole = (role: string) => {
    if (!role) {
      setFilterUsers([]);
      return;
    }
    const filtered = users.filter((user) => user.roles.includes(role));
    setFilterUsers(filtered);
  };

  const handleSearchByName = (name: string) => {
    const filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(name.toLowerCase()),
    );
    setFilterUsers(filtered);
  };

  const handleDeleteByUserId = async (id: number) => {
    try {
      const response = await userService.delete(id);
      if (response.success) {
        toast.success("User deleted successfully.");
        handleFetchUser();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user.");
    }
  };

  const onCreateUserSuccess = () => {
    setIsModalOpen(false);
    handleFetchUser();
  };

  useEffect(() => {
    const fetchInitialUsers = async () => {
      setIsLoading(true);
      try {
        const resposne = await userService.getAll();
        if (resposne.success) {
          setUsers(resposne.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialUsers();
  }, []);

  const roles = [...new Set(users.flatMap((user) => user.roles))];

  return (
    <section className="min-h-full">
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-orange-600">Access</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              Users
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage customer, seller, and admin accounts.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={18} />
            Create user
          </button>
        </div>

        {/* top search and filtering */}
        <div className="flex flex-col gap-3 rounded-md bg-white p-4 md:flex-row md:items-center">
          <SearchInput onInputChange={handleSearchByName} />

          <select
            onChange={(e) => handleFilterByRole(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 md:w-56"
          >
            <option value="">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.replace("ROLE_", "")}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <UserTable
            users={filterUsers.length > 0 ? filterUsers : users}
            handleDelete={handleDeleteByUserId}
            handleUpdate={setEditUser}
          />
        )}
      </div>

      {/* modal */}
      {isModalOpen && (
        <AddUserModal
          handleCloseAction={() => setIsModalOpen(false)}
          onCreateSuccessAction={onCreateUserSuccess}
        />
      )}

      {editUser && (
        <UpdateCustomerModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdated={handleFetchUser}
        />
      )}
    </section>
  );
};

export default UserAdminPage;
