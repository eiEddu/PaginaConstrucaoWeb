import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Usuario } from '../models/usuario.model';
import { Atividade } from '../models/atividade.model';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  // tabelas
  usuarios!: Table<Usuario, number>;
  atividades!: Table<Atividade, number>;

  constructor() {
    super('GestorAtividadesDB');

    // version() define o esquema das "tabelas" no IndexedDB
    this.version(1).stores({
      // '++id' = chave primária auto-incremental
      usuarios: '++id, nomeCompleto, email',
      atividades: '++id, descricao, dataInicio, dataFim, categoria, status, usuariosIds'
    });

    // mapeia as tabelas para o this.usuarios / this.atividades
    this.usuarios = this.table('usuarios');
    this.atividades = this.table('atividades');
  }
}