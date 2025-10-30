export interface Participacao {
  id?: number;
  usuarioId: number;    // id do sócio
  atividadeId: number;  // id da atividade
  data: string;         // 'YYYY-MM-DD'
  hora: string;         // 'HH:mm'
}
