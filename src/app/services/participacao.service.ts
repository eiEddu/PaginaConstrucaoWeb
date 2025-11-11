import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Participacao } from '../models/participacao.model';

@Injectable({ providedIn: 'root' })
export class ParticipacaoService {
  constructor(private db: DbService) {}

  add(p: Participacao) { return this.db.participacoes.add(p); }
  delete(id: number) { return this.db.participacoes.delete(id); }

  async getByUsuario(usuarioId: number): Promise<Participacao[]> {
    return this.db.participacoes.where('usuarioId').equals(usuarioId).toArray();
  }

  async getByAtividade(atividadeId: number): Promise<Participacao[]> {
    return this.db.participacoes.where('atividadeId').equals(atividadeId).toArray();
  }
}
