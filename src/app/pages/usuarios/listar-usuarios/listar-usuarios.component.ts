import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  usuarios: Usuario[] = [];
  carregando = true;

  async ngOnInit() {
    this.usuarios = await this.usuarioService.getAllUsuarios();
    this.carregando = false;
  }

  editar(usuario: Usuario) {
    if (!usuario.id) return;
    this.router.navigate(['/usuarios/editar', usuario.id]);
  }

  async excluir(usuario: Usuario) {
    if (!usuario.id) return;

    const confirmar = confirm(`Tem certeza que deseja excluir ${usuario.nomeCompleto}?`);
    if (!confirmar) return;

    await this.usuarioService.deleteUsuario(usuario.id);
    this.usuarios = await this.usuarioService.getAllUsuarios();
  }
}