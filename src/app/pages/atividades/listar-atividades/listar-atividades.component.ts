import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AtividadeService } from '../../../services/atividade.service';
import { UsuarioService } from '../../../services/usuario.service';

import { Atividade } from '../../../models/atividade.model';
import { Usuario } from '../../../models/usuario.model';
import { StatusAtividade } from '../../../models/status-atividade.enum';
import { CategoriaAtividade } from '../../../models/categoria.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-atividades',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listar-atividades.component.html',
  styleUrls: ['./listar-atividades.component.css']
})
export class ListarAtividadesComponent implements OnInit {

  private atividadeService = inject(AtividadeService);
  private usuarioService = inject(UsuarioService);

  atividades: Atividade[] = [];
  filtradas: Atividade[] = [];
  usuarios: Usuario[] = [];
  usuariosMap = new Map<number, string>();

  statusOptions = ['(Todos)', ...Object.values(StatusAtividade)];
  categoriaOptions = ['(Todas)', ...Object.values(CategoriaAtividade)];
  usuarioOptions: { id: number; nomeCompleto: string }[] = [{ id: 0, nomeCompleto: '(Todos)' }];

  // filtros selecionados
  filtroStatus = '(Todos)';
  filtroCategoria = '(Todas)';
  filtroUsuarioId = 0;

  carregando = true;

  async ngOnInit() {
    // Carrega usuários e monta opções SOMENTE com quem tem id numérico
    this.usuarios = await this.usuarioService.getAllUsuarios();

    const usuariosComId = this.usuarios
      .filter(u => typeof u.id === 'number')
      .map(u => ({ id: u.id as number, nomeCompleto: u.nomeCompleto }));

    this.usuarioOptions = [{ id: 0, nomeCompleto: '(Todos)' }, ...usuariosComId];

    // Monta o mapa id -> nome para exibir responsáveis
    this.usuariosMap.clear();
    usuariosComId.forEach(u => this.usuariosMap.set(u.id, u.nomeCompleto));

    // Carrega atividades
    this.atividades = await this.atividadeService.getAllAtividades();
    this.filtradas = [...this.atividades];
    this.carregando = false;
  }

  aplicarFiltros() {
    this.filtradas = this.atividades.filter(a => {
      const byStatus = this.filtroStatus === '(Todos)' ? true : a.status === this.filtroStatus;
      const byCategoria = this.filtroCategoria === '(Todas)' ? true : a.categoria === this.filtroCategoria;
      const byUsuario = this.filtroUsuarioId === 0 ? true : a.usuariosIds.includes(this.filtroUsuarioId);
      return byStatus && byCategoria && byUsuario;
    });
  }

  badgeClass(status: StatusAtividade): string {
    switch (status) {
      case StatusAtividade.PENDENTE:      return 'badge bg-warning text-dark';
      case StatusAtividade.EM_ANDAMENTO:  return 'badge bg-primary';
      case StatusAtividade.CONCLUIDA:     return 'badge bg-success';
      case StatusAtividade.CANCELADA:     return 'badge bg-secondary';
      default:                            return 'badge bg-light text-dark';
    }
  }

  nomesResponsaveis(ids: number[]): string {
    return ids.map(id => this.usuariosMap.get(id) ?? `#${id}`).join(', ');
  }

  editar(a: Atividade) {
    if (!a.id) return;
    // Edição via template com RouterLink; mantido aqui se quiser navegação programática
    // this.router.navigate(['/atividades/editar', a.id]);
  }

  async excluir(a: Atividade) {
    if (!a.id) return;
    if (!confirm(`Excluir a atividade "${a.descricao}"?`)) return;

    await this.atividadeService.deleteAtividade(a.id);
    this.atividades = await this.atividadeService.getAllAtividades();
    this.aplicarFiltros();
  }
}
