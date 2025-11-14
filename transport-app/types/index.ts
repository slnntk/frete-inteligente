// Tipos TypeScript para as entidades do backend

export enum UsuarioTipo {
  EMPRESA = "EMPRESA",
  AUTONOMO = "AUTONOMO",
  CLIENTE = "CLIENTE"
}

export enum ViagemStatus {
  ABERTA = "ABERTA",
  FECHADA = "FECHADA",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDA = "CONCLUIDA"
}

export enum PagamentoStatus {
  PENDENTE = "PENDENTE",
  PAGO = "PAGO",
  CANCELADO = "CANCELADO"
}

export enum InscricaoStatus {
  PENDENTE = "PENDENTE",
  CONFIRMADA = "CONFIRMADA",
  CANCELADA = "CANCELADA"
}

export interface Usuario {
  id?: number;
  tipo: UsuarioTipo;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senhaHash?: string;
  endereco?: string;
  latitude?: number;
  longitude?: number;
}

export interface Postagem {
  id?: number;
  autor: Usuario | { id: number };
  titulo: string;
  regiao: string;
  descricao: string;
  preco: number;
}

export interface Veiculo {
  id?: number;
  proprietario: Usuario | { id: number };
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  capacidade: number;
}

export interface Viagem {
  id?: number;
  postagem: Postagem | { id: number };
  veiculo?: Veiculo | { id: number } | null;
  horarioPartida: string;
  destino?: string;
  destinos?: string[];
  cepPartida?: string;
  enderecoPartida?: string;
  latitudePartida?: number;
  longitudePartida?: number;
  latitudeMotorista?: number;
  longitudeMotorista?: number;
  capacidade: number;
  status: ViagemStatus;
}

export interface Checkin {
  id?: number;
  viagem: Viagem | { id: number };
  cliente: Usuario | { id: number };
  realizadoEm?: string;
  latitude?: number;
  longitude?: number;
}

export interface Coleta {
  id?: number;
  viagem: Viagem | { id: number };
  cliente: Usuario | { id: number };
  coletadoEm?: string;
  latitude?: number;
  longitude?: number;
}

export interface Inscricao {
  id?: number;
  viagem: Viagem | { id: number };
  cliente: Usuario | { id: number };
  status: InscricaoStatus;
  inscritoEm?: string;
}

export interface Pagamento {
  id?: number;
  cliente: Usuario | { id: number };
  viagem: Viagem | { id: number };
  valor: number;
  status: PagamentoStatus;
  pagamentoEm?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  usuario: Usuario;
  token?: string;
}

export interface CreateUsuarioRequest {
  tipo: UsuarioTipo;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senhaHash: string;
}

export interface CreatePostagemRequest {
  autorId: number;
  titulo: string;
  regiao: string;
  descricao: string;
  preco: number;
}

export interface CreateViagemRequest {
  postagemId: number;
  veiculoId?: number;
  horarioPartida: string;
  destino: string;
  cepPartida?: string;
  enderecoPartida?: string;
  latitudePartida?: number;
  longitudePartida?: number;
  capacidade: number;
  status: ViagemStatus;
}

