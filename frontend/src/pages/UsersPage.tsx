import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/shadcn/table";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { userStore } from "@/entities/task/model/userStore";
import { Button } from "@/shared/ui/shadcn/button";
import { Trash2, LoaderCircle } from "lucide-react";

type User = {
  id: string;
  name: string;
  surName: string;
  telephone: string;
  employment: string;
  birthDate: string;
  email: string;
  status: string;
};

export default function EnhancedTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/v1/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error while fetching users:", err))
      .finally(() => setLoading(false));
  }, [userStore.user]);

  const handleRowClick = (id: string) => {
    navigate(`/user/edit/${id}`);
  };

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/v1/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error while deleting user:", err);
      alert("Error while deleting user");
    }
  };

  return (
    <>
      <div className="border rounded-xl overflow-hidden shadow-none">
        {loading ? (
          <div className="p-20 w-full flex justify-center">
            <LoaderCircle className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="cursor-pointer">Name</TableHead>
                <TableHead>Lastname</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date of birth</TableHead>
                <TableHead className="w-[40px] text-center"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => handleRowClick(user.id)}
                  className="hover:bg-muted"
                >
                  <TableCell>{user.name || "-"}</TableCell>
                  <TableCell>{user.surName || "-"}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.telephone || "-"}</TableCell>
                  <TableCell>{user.employment || "-"}</TableCell>
                  <TableCell>
                    {dayjs(user.birthDate).format("DD.MM.YYYY")}
                  </TableCell>
                  <TableCell className="w-[40px] text-center">
                    <Button
                      variant="ghost"
                      className="p-0"
                      onClick={(e) => {
                        handleRemove(e, user.id);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
