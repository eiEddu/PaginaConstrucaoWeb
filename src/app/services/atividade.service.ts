import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Atividade } from '../models/atividade.model';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {
  constructor(private db: DbService) {}

  addAtividade(atividade: Atividade) {
    return this.db.atividades.add(atividade);
  }

  getAllAtividades(): Promise<Atividade[]> {
    return this.db.atividades.toArray();
  }

  getAtividadeById(id: number) {
    return this.db.atividades.get(id);
  }

  updateAtividade(atividade: Atividade) {
    return this.db.atividades.put(atividade);
  }

  deleteAtividade(id: number) {
    return this.db.atividades.delete(id);
  }

  // filtros que vão virar "relatórios"
  getAtividadesByCategoria(categoria: string): Promise<Atividade[]> {
    return this.db.atividades.where('categoria').equals(categoria).toArray();
  }

  async getAtividadesByUsuario(usuarioId: number): Promise<Atividade[]> {
    const todas = await this.db.atividades.toArray();
    // aqui filtramos manualmente porque usuariosIds é um array
    return todas.filter(a => a.usuariosIds.includes(usuarioId));
  }
}