import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ShieldAlert, Trash2, Users } from "lucide-react";

import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { avatarUrl, initials, apiError, formatDate } from "@/lib/format";

import Container from "@/components/common/Container";
import AdminNav from "@/components/layout/AdminNav";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function AdminUsers() {
  const { users, loadUsers, changeRole, deleteUser } = useUser();
  const { user: me } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await loadUsers({ page: 1, limit: 50 });
      } catch (err) {
        console.error(apiError(err, "Could not load users"));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRole = async (id, role) => {
    try {
      await changeRole(id, role);
      console.log("Role updated");
    } catch (err) {
      console.error(apiError(err, "Could not change role"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      console.log("User deleted");
    } catch (err) {
      console.error(apiError(err, "Could not delete user"));
    }
  };

  return (
    <Container className="py-10">
      <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Admin</h1>
      <p className="mb-6 text-muted-foreground">Manage members and their roles.</p>
      <AdminNav />

      {loading ? (
        <Loader full label="Loading users..." />
      ) : users.length ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const isAdmin = u.role === "admin";
                  const isSelf = u._id === me?._id;
                  return (
                    <TableRow key={u._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarImage src={avatarUrl(u)} alt={u.fullname} />
                            <AvatarFallback>{initials(u.fullname)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{u.fullname}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(u.createdAt)}
                      </TableCell>
                      <TableCell>
                        {u.isVerified ? (
                          <Badge variant="success"><BadgeCheck className="size-3" /> Verified</Badge>
                        ) : (
                          <Badge variant="outline"><ShieldAlert className="size-3" /> Unverified</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.role}
                          onValueChange={(v) => handleRole(u._id, v)}
                          disabled={isAdmin}
                        >
                          <SelectTrigger size="sm" className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Buyer</SelectItem>
                            <SelectItem value="seller">Seller</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <ConfirmDialog
                          title="Delete user?"
                          description={`This will remove ${u.fullname} from the platform.`}
                          confirmText="Delete"
                          onConfirm={() => handleDelete(u._id)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive"
                              disabled={isSelf || isAdmin}
                              aria-label="Delete user"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      ) : (
        <EmptyState icon={Users} title="No users found" />
      )}
    </Container>
  );
}

export default AdminUsers;
