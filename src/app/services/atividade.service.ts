import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Atividade } from '../models/atividade.model';

@Injectable({ providedIn: 'root' })
export class AtividadeService {
  constructor(private db: DbService) {}

  addAtividade(a: Atividade) { return this.db.atividades.add(a); }
  getAllAtividades(): Promise<Atividade[]> { return this.db.atividades.toArray(); }
  getAtividadeById(id: number) { return this.db.atividades.get(id); }
  updateAtividade(a: Atividade) { return this.db.atividades.put(a); }
  deleteAtividade(id: number) { return this.db.atividades.delete(id); }

  getAtividadesByCategoria(categoria: string): Promise<Atividade[]> {
    return this.db.atividades.where('categoria').equals(categoria).toArray();
  }
}
