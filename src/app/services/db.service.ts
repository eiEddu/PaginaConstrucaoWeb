import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Usuario } from '../models/usuario.model';
import { Atividade } from '../models/atividade.model';
import { Participacao } from '../models/participacao.model';

@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  usuarios!: Table<Usuario, number>;
  atividades!: Table<Atividade, number>;
  participacoes!: Table<Participacao, number>;

  constructor() {
    super('GestorAtividadesDB');

    this.version(1).stores({
      usuarios: '++id, nomeCompleto, email',
      atividades: '++id, descricao, dataInicio, dataFim, categoria, status',
      participacoes: '++id, usuarioId, atividadeId, data, hora'
    });

    this.usuarios = this.table('usuarios');
    this.atividades = this.table('atividades');
    this.participacoes = this.table('participacoes');
  }
}
