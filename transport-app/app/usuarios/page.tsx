'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DynamicUserForm } from '@/components/dynamic-user-form';
import { autonomoService, type AutonomoDTO } from '@/services/autonomo.service';
import { empresaService, type EmpresaDTO } from '@/services/empresa.service';
import { clienteService, type ClienteDTO } from '@/services/cliente.service';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Users, Building2, Car, GraduationCap } from 'lucide-react';

type UserType = 'TODOS' | 'CLIENTE' | 'AUTONOMO' | 'EMPRESA';
type Usuario = (ClienteDTO | AutonomoDTO | EmpresaDTO) & { tipo?: UserType };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [filterType, setFilterType] = useState<UserType>('TODOS');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; tipo: UserType } | null>(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    if (filterType === 'TODOS') {
      setFilteredUsuarios(usuarios);
    } else {
      setFilteredUsuarios(usuarios.filter(u => u.tipo === filterType));
    }
  }, [filterType, usuarios]);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const [clientes, autonomos, empresas] = await Promise.all([
        clienteService.listarTodos(),
        autonomoService.listarTodos(),
        empresaService.listarTodos(),
      ]);

      const todosUsuarios: Usuario[] = [
        ...clientes.map(c => ({ ...c, tipo: 'CLIENTE' as UserType })),
        ...autonomos.map(a => ({ ...a, tipo: 'AUTONOMO' as UserType })),
        ...empresas.map(e => ({ ...e, tipo: 'EMPRESA' as UserType })),
      ];

      setUsuarios(todosUsuarios);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const { id, tipo } = userToDelete;

      if (tipo === 'CLIENTE') {
        await clienteService.deletar(id);
      } else if (tipo === 'AUTONOMO') {
        await autonomoService.deletar(id);
      } else if (tipo === 'EMPRESA') {
        await empresaService.deletar(id);
      }

      toast.success('Usuário excluído com sucesso!');
      loadUsuarios();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir usuário');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setEditingUser(null);
    loadUsuarios();
  };

  const getTipoColor = (tipo?: UserType) => {
    switch (tipo) {
      case 'CLIENTE': return 'bg-blue-500';
      case 'AUTONOMO': return 'bg-green-500';
      case 'EMPRESA': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoIcon = (tipo?: UserType) => {
    switch (tipo) {
      case 'CLIENTE': return <GraduationCap className="w-4 h-4" />;
      case 'AUTONOMO': return <Car className="w-4 h-4" />;
      case 'EMPRESA': return <Building2 className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStats = () => {
    return {
      total: usuarios.length,
      clientes: usuarios.filter(u => u.tipo === 'CLIENTE').length,
      autonomos: usuarios.filter(u => u.tipo === 'AUTONOMO').length,
      empresas: usuarios.filter(u => u.tipo === 'EMPRESA').length,
    };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie clientes, motoristas autônomos e empresas
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Clientes
            </CardDescription>
            <CardTitle className="text-3xl text-blue-500">{stats.clientes}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Autônomos
            </CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.autonomos}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Empresas
            </CardDescription>
            <CardTitle className="text-3xl text-purple-500">{stats.empresas}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Label className="text-sm font-medium">Tipo de Usuário:</Label>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as UserType)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos</SelectItem>
                <SelectItem value="CLIENTE">Clientes</SelectItem>
                <SelectItem value="AUTONOMO">Autônomos</SelectItem>
                <SelectItem value="EMPRESA">Empresas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>
            Listagem de Usuários ({filteredUsuarios.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={`${usuario.tipo}-${usuario.id}`}>
                      <TableCell className="font-medium">{usuario.id}</TableCell>
                      <TableCell>
                        <Badge className={getTipoColor(usuario.tipo)}>
                          <span className="flex items-center gap-1">
                            {getTipoIcon(usuario.tipo)}
                            {usuario.tipo}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.telefone || '-'}</TableCell>
                      <TableCell>
                        {'cpf' in usuario && usuario.cpf ? usuario.cpf : ''}
                        {'cnpj' in usuario && usuario.cnpj ? usuario.cnpj : ''}
                        {!('cpf' in usuario) && !('cnpj' in usuario) ? '-' : ''}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(usuario)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUserToDelete({ id: usuario.id!, tipo: usuario.tipo! });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Criação/Edição */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) setEditingUser(null);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
          </DialogHeader>
          <DynamicUserForm
            onSuccess={handleSuccess}
            initialData={editingUser}
            mode={editingUser ? 'edit' : 'create'}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}

