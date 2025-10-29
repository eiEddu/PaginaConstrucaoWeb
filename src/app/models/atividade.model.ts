import { StatusAtividade } from './status-atividade.enum';
import { CategoriaAtividade } from './categoria.enum';

export interface Atividade {
  id?: number;               // gerado pelo IndexedDB
  descricao: string;         // texto da tarefa
  dataInicio: string;        // formato 'YYYY-MM-DD'
  dataFim?: string;          // opcional
  categoria: CategoriaAtividade;
  status: StatusAtividade;
  usuariosIds: number[];     // lista de responsáveis (ids dos usuários)
}