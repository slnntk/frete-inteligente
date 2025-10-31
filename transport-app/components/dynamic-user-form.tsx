'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { autonomoService, type AutonomoDTO } from '@/services/autonomo.service';
import { empresaService, type EmpresaDTO } from '@/services/empresa.service';
import { clienteService, type ClienteDTO } from '@/services/cliente.service';
import { toast } from 'sonner';

type UserType = 'CLIENTE' | 'AUTONOMO' | 'EMPRESA';

interface DynamicUserFormProps {
  onSuccess?: () => void;
  initialData?: any;
  mode?: 'create' | 'edit';
}

export function DynamicUserForm({ onSuccess, initialData, mode = 'create' }: DynamicUserFormProps) {
  const [userType, setUserType] = useState<UserType>(initialData?.tipo || 'CLIENTE');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      if (userType === 'CLIENTE') {
        const clienteData: ClienteDTO = {
          nome: formData.get('nome') as string,
          email: formData.get('email') as string,
          cpf: formData.get('cpf') as string,
          telefone: formData.get('telefone') as string,
          senha: formData.get('senha') as string,
          matricula: formData.get('matricula') as string,
          instituicao: formData.get('instituicao') as string,
          curso: formData.get('curso') as string,
        };

        if (mode === 'create') {
          await clienteService.criar(clienteData);
          toast.success('Cliente cadastrado com sucesso!');
        } else if (initialData?.id) {
          await clienteService.atualizar(initialData.id, clienteData);
          toast.success('Cliente atualizado com sucesso!');
        }
      } else if (userType === 'AUTONOMO') {
        const autonomoData: AutonomoDTO = {
          nome: formData.get('nome') as string,
          email: formData.get('email') as string,
          cpf: formData.get('cpf') as string,
          telefone: formData.get('telefone') as string,
          senha: formData.get('senha') as string,
          cnh: formData.get('cnh') as string,
          categoriaCnh: formData.get('categoriaCnh') as string,
          ear: formData.get('ear') === 'on',
        };

        if (mode === 'create') {
          await autonomoService.criar(autonomoData);
          toast.success('Autônomo cadastrado com sucesso!');
        } else if (initialData?.id) {
          await autonomoService.atualizar(initialData.id, autonomoData);
          toast.success('Autônomo atualizado com sucesso!');
        }
      } else if (userType === 'EMPRESA') {
        const empresaData: EmpresaDTO = {
          nome: formData.get('nome') as string,
          email: formData.get('email') as string,
          telefone: formData.get('telefone') as string,
          senha: formData.get('senha') as string,
          cnpj: formData.get('cnpj') as string,
          razaoSocial: formData.get('razaoSocial') as string,
        };

        if (mode === 'create') {
          await empresaService.criar(empresaData);
          toast.success('Empresa cadastrada com sucesso!');
        } else if (initialData?.id) {
          await empresaService.atualizar(initialData.id, empresaData);
          toast.success('Empresa atualizada com sucesso!');
        }
      }

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Cadastrar' : 'Editar'} Usuário</CardTitle>
        <CardDescription>
          Preencha os campos de acordo com o tipo de usuário
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção de Tipo (apenas no modo criação) */}
          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="userType">Tipo de Usuário</Label>
              <Select value={userType} onValueChange={(value) => setUserType(value as UserType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENTE">Cliente / Estudante</SelectItem>
                  <SelectItem value="AUTONOMO">Motorista Autônomo</SelectItem>
                  <SelectItem value="EMPRESA">Empresa de Transporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Campos Comuns */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome {userType === 'EMPRESA' && 'Fantasia'}</Label>
            <Input
              id="nome"
              name="nome"
              placeholder={userType === 'EMPRESA' ? 'Nome fantasia da empresa' : 'Seu nome completo'}
              defaultValue={initialData?.nome}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              defaultValue={initialData?.email}
              required
            />
          </div>

          {/* Campos Específicos por Tipo */}
          {userType === 'CLIENTE' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  defaultValue={initialData?.cpf}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(85) 98765-4321"
                  defaultValue={initialData?.telefone}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  name="matricula"
                  placeholder="Número de matrícula"
                  defaultValue={initialData?.matricula}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instituicao">Instituição</Label>
                <Input
                  id="instituicao"
                  name="instituicao"
                  placeholder="Nome da instituição de ensino"
                  defaultValue={initialData?.instituicao}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="curso">Curso</Label>
                <Input
                  id="curso"
                  name="curso"
                  placeholder="Nome do curso"
                  defaultValue={initialData?.curso}
                />
              </div>
            </>
          )}

          {userType === 'AUTONOMO' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  defaultValue={initialData?.cpf}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(85) 98765-4321"
                  defaultValue={initialData?.telefone}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnh">CNH</Label>
                <Input
                  id="cnh"
                  name="cnh"
                  placeholder="Número da CNH"
                  defaultValue={initialData?.cnh}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoriaCnh">Categoria CNH</Label>
                <Select name="categoriaCnh" defaultValue={initialData?.categoriaCnh || 'B'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="ear" name="ear" defaultChecked={initialData?.ear} />
                <Label htmlFor="ear" className="text-sm font-normal cursor-pointer">
                  Possui EAR (Exerce Atividade Remunerada)
                </Label>
              </div>
            </>
          )}

          {userType === 'EMPRESA' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  defaultValue={initialData?.cnpj}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  name="razaoSocial"
                  placeholder="Razão social da empresa"
                  defaultValue={initialData?.razaoSocial}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(85) 3000-0000"
                  defaultValue={initialData?.telefone}
                  required
                />
              </div>
            </>
          )}

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="senha">
              {mode === 'create' ? 'Senha' : 'Nova Senha (deixe em branco para manter)'}
            </Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              placeholder="••••••••"
              required={mode === 'create'}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : mode === 'create' ? 'Cadastrar' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

