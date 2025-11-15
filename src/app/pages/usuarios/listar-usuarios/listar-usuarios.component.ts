import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../../../services/usuario.service';
import { AtividadeService } from '../../../services/atividade.service';
import { ParticipacaoService } from '../../../services/participacao.service';

import { Usuario } from '../../../models/usuario.model';
import { Atividade } from '../../../models/atividade.model';
import { Participacao } from '../../../models/participacao.model';

declare const bootstrap: any; // usar bootstrap modal da CDN

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private atividadeService = inject(AtividadeService);
  private participacaoService = inject(ParticipacaoService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  usuarios: Usuario[] = [];
  carregando = true;

  // estado para modais
  usuarioSelecionado?: Usuario;

  // Modal: Ver Atividades
  participacoes: (Participacao & { atividade?: Atividade })[] = [];

  // Modal: Cadastrar Atividade para sócio
  atividades: Atividade[] = [];
  formVinculo!: FormGroup;

  async ngOnInit() {
    this.usuarios = await this.usuarioService.getAllUsuarios();
    this.atividades = await this.atividadeService.getAllAtividades();

    // valores iniciais como string vazia (nada de null)
    this.formVinculo = this.fb.group({
      atividadeId: ['', Validators.required],
      data: ['', Validators.required],
      hora: ['', Validators.required],
    });

    this.carregando = false;
  }

  editar(u: Usuario) {
    if (!u.id) return;
    this.router.navigate(['/usuarios/editar', u.id]);
  }

  async excluir(u: Usuario) {
    if (!u.id) return;
    if (!confirm(`Excluir o sócio "${u.nomeCompleto}"?`)) return;
    await this.usuarioService.deleteUsuario(u.id);
    this.usuarios = await this.usuarioService.getAllUsuarios();
  }

  // ----- Modal: VER ATIVIDADES -----
  async abrirVerAtividades(u: Usuario, modalRef: HTMLElement) {
    if (!u.id) return;
    this.usuarioSelecionado = u;

    const parts = await this.participacaoService.getByUsuario(u.id);
    const acts = await this.atividadeService.getAllAtividades();
    const actsMap = new Map<number, Atividade>();
    acts.forEach(a => a.id && actsMap.set(a.id, a));

    this.participacoes = parts.map(p => ({ ...p, atividade: p.atividadeId ? actsMap.get(p.atividadeId)! : undefined }));

    new bootstrap.Modal(modalRef).show();
  }

  async excluirParticipacao(p: Participacao) {
    if (!p.id) return;
    if (!confirm('Remover este vínculo?')) return;

    await this.participacaoService.delete(p.id);
    if (this.usuarioSelecionado?.id) {
      const parts = await this.participacaoService.getByUsuario(this.usuarioSelecionado.id);
      const acts = await this.atividadeService.getAllAtividades();
      const actsMap = new Map<number, Atividade>();
      acts.forEach(a => a.id && actsMap.set(a.id, a));
      this.participacoes = parts.map(pp => ({ ...pp, atividade: pp.atividadeId ? actsMap.get(pp.atividadeId)! : undefined }));
    }
  }

  // ----- Modal: CADASTRAR ATIVIDADE (vínculo) -----
  abrirCadastrarAtividade(u: Usuario, modalRef: HTMLElement) {
    if (!u.id) return;
    this.usuarioSelecionado = u;

    // reset explícito pros mesmos valores do form
    this.formVinculo.reset({
      atividadeId: '',
      data: '',
      hora: ''
    });

    new bootstrap.Modal(modalRef).show();
  }

  async salvarVinculo(modalRef: HTMLElement) {
    
    if (!this.usuarioSelecionado?.id) return;

    // se ainda estiver inválido, nem tenta salvar
    if (this.formVinculo.invalid) {
      alert('Preencha atividade, data e hora.');
      return;
    }

    const v: Participacao = {
      usuarioId: this.usuarioSelecionado.id,
      atividadeId: Number(this.formVinculo.value.atividadeId),
      data: this.formVinculo.value.data,
      hora: this.formVinculo.value.hora
    };

    await this.participacaoService.add(v);
    // fecha modal
    bootstrap.Modal.getInstance(modalRef)?.hide();
  }
}
