import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private db: DbService) {}

  addUsuario(usuario: Usuario) {
    return this.db.usuarios.add(usuario);
  }

  getAllUsuarios(): Promise<Usuario[]> {
    return this.db.usuarios.toArray();
  }

  getUsuarioById(id: number) {
    return this.db.usuarios.get(id);
  }

  updateUsuario(usuario: Usuario) {
    return this.db.usuarios.put(usuario);
  }

  deleteUsuario(id: number) {
    return this.db.usuarios.delete(id);
  }
}